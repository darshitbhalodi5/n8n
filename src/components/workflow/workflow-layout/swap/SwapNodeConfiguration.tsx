"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    LogIn,
    Copy,
    Check,
    Search,
    Play,
    ExternalLink,
} from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useSafeWalletContext } from "@/contexts/SafeWalletContext";
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { isTestnet } from "@/web3/chains";
import {
    SwapProvider,
    SupportedChain,
    SwapType,
    TokenInfo,
    SwapInputConfig,
    getTokensForChain,
    allowsCustomTokens,
    CUSTOM_TOKEN_OPTION,
} from "@/types/swap";
import { API_CONFIG, buildApiUrl } from "@/config/api";

interface SwapNodeConfigurationProps {
    nodeData: Record<string, unknown>;
    handleDataChange: (updates: Record<string, unknown>) => void;
    authenticated: boolean;
    login: () => void;
}

interface QuoteState {
    loading: boolean;
    error: string | null;
    data: {
        amountOut: string;
        priceImpact: string;
        gasEstimate: string;
    } | null;
}

interface ExecutionState {
    loading: boolean;
    error: string | null;
    txHash: string | null;
    approvalTxHash: string | null;
    success: boolean;
    step: 'idle' | 'checking-allowance' | 'approving' | 'waiting-approval' | 'building-tx' | 'swapping' | 'done';
}

// Static constants moved outside component to prevent recreation and fix useCallback deps
const UNISWAP_ROUTER_ADDRESSES: Record<SupportedChain, string> = {
    [SupportedChain.ARBITRUM]: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    [SupportedChain.ARBITRUM_SEPOLIA]: '0x101F443B4d1b059569D643917553c771E1b9663E',
};

const ERC20_ABI = {
    allowance: {
        name: 'allowance',
        type: 'function',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    approve: {
        name: 'approve',
        type: 'function',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    balanceOf: {
        name: 'balanceOf',
        type: 'function',
        inputs: [
            { name: 'account', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
} as const;

// Helper function moved outside component for stable reference
function encodeFunctionData(funcName: 'allowance' | 'approve' | 'balanceOf', args: string[]): string {
    const iface = new ethers.Interface([ERC20_ABI[funcName]]);
    return iface.encodeFunctionData(funcName, args);
}

/**
 * SwapNodeConfiguration - Configuration component for swap nodes
 * 
 * Allows users to configure token swaps with:
 * - Network from user menu (read-only, automatically synced)
 * - Provider selection (Uniswap, 1inch, Relay - set by block type)
 * - Token pair selection (source and destination)
 * - Amount input with token decimals handling
 * - Swap type locked to EXACT_INPUT
 * - Slippage tolerance uses backend default (not configurable)
 * - Quote preview before execution
 */
export function SwapNodeConfiguration({
    nodeData,
    handleDataChange,
    authenticated,
    login,
}: SwapNodeConfigurationProps) {
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
    const walletAddress = embeddedWallet?.address || "";

    const { selection } = useSafeWalletContext();
    const selectedSafe = selection.selectedSafe;

    // Get chain from user menu (via Privy embedded wallet)
    const { chainId } = usePrivyEmbeddedWallet();

    // Convert chainId to SupportedChain enum
    const getChainFromChainId = useCallback((chainId: number | null): SupportedChain => {
        if (isTestnet(chainId)) {
            return SupportedChain.ARBITRUM_SEPOLIA;
        }
        // Default to Arbitrum mainnet
        return SupportedChain.ARBITRUM;
    }, []);

    const swapChain = chainId ? getChainFromChainId(chainId) : SupportedChain.ARBITRUM;

    // Local state for advanced options visibility
    const [quoteState, setQuoteState] = useState<QuoteState>({
        loading: false,
        error: null,
        data: null,
    });
    const [executionState, setExecutionState] = useState<ExecutionState>({
        loading: false,
        error: null,
        txHash: null,
        approvalTxHash: null,
        success: false,
        step: 'idle',
    });
    const [copied, setCopied] = useState(false);
    const [copiedSourceToken, setCopiedSourceToken] = useState(false);
    const [copiedDestToken, setCopiedDestToken] = useState(false);

    // Custom token input state (for mainnet only)
    const [showCustomSourceToken, setShowCustomSourceToken] = useState(false);
    const [showCustomDestToken, setShowCustomDestToken] = useState(false);
    const [customTokenAddress, setCustomTokenAddress] = useState("");
    const [customTokenLoading, setCustomTokenLoading] = useState(false);
    const [customTokenError, setCustomTokenError] = useState<string | null>(null);

    // Get available tokens based on current chain
    const availableTokens = useMemo(() => {
        return getTokensForChain(swapChain);
    }, [swapChain]);

    // Check if custom token input is allowed
    const canUseCustomTokens = useMemo(() => {
        return allowsCustomTokens(swapChain);
    }, [swapChain]);

    // Extract current configuration from node data
    const swapProvider = (nodeData.swapProvider as SwapProvider) || SwapProvider.UNISWAP;
    // Note: swapType is always EXACT_INPUT (locked) - using SwapType.EXACT_INPUT directly
    const sourceTokenAddress = (nodeData.sourceTokenAddress as string) || "";
    const sourceTokenSymbol = (nodeData.sourceTokenSymbol as string) || "";
    const sourceTokenDecimals = (nodeData.sourceTokenDecimals as number) || 18;
    const destinationTokenAddress = (nodeData.destinationTokenAddress as string) || "";
    const destinationTokenSymbol = (nodeData.destinationTokenSymbol as string) || "";
    const destinationTokenDecimals = (nodeData.destinationTokenDecimals as number) || 18;
    const swapAmount = (nodeData.swapAmount as string) || "";

    // Get the wallet address to use (Safe or EOA)
    const effectiveWalletAddress = selectedSafe || walletAddress;

    // Track previous wallet address to avoid unnecessary updates
    const prevWalletRef = React.useRef<string | null>(null);

    // Update wallet address and chain in node data only when they actually change
    // Using ref to prevent infinite loop
    React.useEffect(() => {
        const updates: Record<string, unknown> = {};

        if (
            effectiveWalletAddress &&
            effectiveWalletAddress !== prevWalletRef.current &&
            effectiveWalletAddress !== nodeData.walletAddress
        ) {
            prevWalletRef.current = effectiveWalletAddress;
            updates.walletAddress = effectiveWalletAddress;
        }

        // Update chain from user menu - also reset tokens if switching chains
        if (swapChain !== nodeData.swapChain) {
            updates.swapChain = swapChain;
            // Reset token selection when chain changes since addresses differ
            updates.sourceTokenAddress = "";
            updates.sourceTokenSymbol = "";
            updates.destinationTokenAddress = "";
            updates.destinationTokenSymbol = "";
            updates.hasQuote = false;
        }

        // Always ensure swapType is EXACT_INPUT
        if (nodeData.swapType !== SwapType.EXACT_INPUT) {
            updates.swapType = SwapType.EXACT_INPUT;
        }

        if (Object.keys(updates).length > 0) {
            handleDataChange(updates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveWalletAddress, swapChain]);

    // Fetch token info from chain (for custom token input)
    const fetchTokenInfo = useCallback(async (address: string, isSource: boolean) => {
        if (!address || address.length !== 42 || !address.startsWith("0x")) {
            setCustomTokenError("Invalid token address");
            return;
        }

        setCustomTokenLoading(true);
        setCustomTokenError(null);

        try {
            // Call backend to fetch token info from chain
            const response = await fetch(
                `${buildApiUrl(API_CONFIG.ENDPOINTS.SWAP.PROVIDERS)}/${swapChain}/token/${address}`
            );

            if (!response.ok) {
                // If backend endpoint doesn't exist, try to get basic info
                // For now, just set address with default decimals
                const tokenData: TokenInfo = {
                    address: address,
                    symbol: "UNKNOWN",
                    decimals: 18,
                    name: "Custom Token",
                };

                if (isSource) {
                    handleDataChange({
                        sourceTokenAddress: tokenData.address,
                        sourceTokenSymbol: tokenData.symbol,
                        sourceTokenDecimals: tokenData.decimals,
                        hasQuote: false,
                    });
                    setShowCustomSourceToken(false);
                } else {
                    handleDataChange({
                        destinationTokenAddress: tokenData.address,
                        destinationTokenSymbol: tokenData.symbol,
                        destinationTokenDecimals: tokenData.decimals,
                        hasQuote: false,
                    });
                    setShowCustomDestToken(false);
                }
                setCustomTokenAddress("");
                return;
            }

            const data = await response.json();
            const tokenData = data.data as TokenInfo;

            if (isSource) {
                handleDataChange({
                    sourceTokenAddress: tokenData.address,
                    sourceTokenSymbol: tokenData.symbol || "UNKNOWN",
                    sourceTokenDecimals: tokenData.decimals || 18,
                    hasQuote: false,
                });
                setShowCustomSourceToken(false);
            } else {
                handleDataChange({
                    destinationTokenAddress: tokenData.address,
                    destinationTokenSymbol: tokenData.symbol || "UNKNOWN",
                    destinationTokenDecimals: tokenData.decimals || 18,
                    hasQuote: false,
                });
                setShowCustomDestToken(false);
            }
            setCustomTokenAddress("");
        } catch (error) {
            setCustomTokenError(
                error instanceof Error ? error.message : "Failed to fetch token info"
            );
        } finally {
            setCustomTokenLoading(false);
        }
    }, [swapChain, handleDataChange]);

    // Handle token selection from dropdown
    const handleSourceTokenChange = useCallback((tokenAddress: string) => {
        if (tokenAddress === CUSTOM_TOKEN_OPTION) {
            setShowCustomSourceToken(true);
            setCustomTokenAddress("");
            setCustomTokenError(null);
            return;
        }

        const token = availableTokens.find((t: TokenInfo) => t.address === tokenAddress);
        if (token) {
            handleDataChange({
                sourceTokenAddress: token.address,
                sourceTokenSymbol: token.symbol,
                sourceTokenDecimals: token.decimals,
                hasQuote: false,
            });
        } else {
            handleDataChange({
                sourceTokenAddress: tokenAddress,
                sourceTokenSymbol: "",
                sourceTokenDecimals: 18,
                hasQuote: false,
            });
        }
        setShowCustomSourceToken(false);
    }, [handleDataChange, availableTokens]);

    const handleDestinationTokenChange = useCallback((tokenAddress: string) => {
        if (tokenAddress === CUSTOM_TOKEN_OPTION) {
            setShowCustomDestToken(true);
            setCustomTokenAddress("");
            setCustomTokenError(null);
            return;
        }

        const token = availableTokens.find((t: TokenInfo) => t.address === tokenAddress);
        if (token) {
            handleDataChange({
                destinationTokenAddress: token.address,
                destinationTokenSymbol: token.symbol,
                destinationTokenDecimals: token.decimals,
                hasQuote: false,
            });
        } else {
            handleDataChange({
                destinationTokenAddress: tokenAddress,
                destinationTokenSymbol: "",
                destinationTokenDecimals: 18,
                hasQuote: false,
            });
        }
        setShowCustomDestToken(false);
    }, [handleDataChange, availableTokens]);



    // Check if configuration is valid for getting a quote
    const isValidForQuote = useMemo(() => {
        return (
            sourceTokenAddress &&
            destinationTokenAddress &&
            swapAmount &&
            parseFloat(swapAmount) > 0 &&
            effectiveWalletAddress
        );
    }, [sourceTokenAddress, destinationTokenAddress, swapAmount, effectiveWalletAddress]);

    // Get quote from backend
    const handleGetQuote = useCallback(async () => {
        if (!isValidForQuote || !sourceTokenAddress || !destinationTokenAddress) return;

        setQuoteState({ loading: true, error: null, data: null });

        try {
            // Convert amount to wei/smallest unit based on token decimals
            const amountInWei = (parseFloat(swapAmount) * Math.pow(10, sourceTokenDecimals)).toString();

            // Build swap config without slippageTolerance (backend will use default)
            const swapConfig: SwapInputConfig = {
                sourceToken: {
                    address: sourceTokenAddress,
                    symbol: sourceTokenSymbol,
                    decimals: sourceTokenDecimals,
                },
                destinationToken: {
                    address: destinationTokenAddress,
                    symbol: destinationTokenSymbol,
                    decimals: destinationTokenDecimals,
                },
                amount: amountInWei,
                swapType: SwapType.EXACT_INPUT,
                walletAddress: effectiveWalletAddress,
                // Omit slippageTolerance - backend will use default
            };

            const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.SWAP.QUOTE)}/${swapProvider}/${swapChain}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(swapConfig),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: "Request failed" } }));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || "Failed to get quote");
            }

            const quote = data.data;

            // Format amount out for display
            const decimals = destinationTokenDecimals || 18;
            const amountOutFormatted = (
                parseFloat(quote.amountOut) / Math.pow(10, decimals)
            ).toFixed(6);

            setQuoteState({
                loading: false,
                error: null,
                data: {
                    amountOut: amountOutFormatted,
                    priceImpact: quote.priceImpact || "0",
                    gasEstimate: quote.gasEstimate || "0",
                },
            });

            handleDataChange({
                hasQuote: true,
                quoteAmountOut: amountOutFormatted,
                quotePriceImpact: quote.priceImpact || "0",
                quoteGasEstimate: quote.gasEstimate || "0",
            });
        } catch (error) {
            setQuoteState({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to get quote",
                data: null,
            });
        }
    }, [
        isValidForQuote,
        sourceTokenAddress,
        sourceTokenSymbol,
        sourceTokenDecimals,
        destinationTokenAddress,
        destinationTokenSymbol,
        destinationTokenDecimals,
        swapAmount,
        effectiveWalletAddress,
        swapProvider,
        swapChain,
        handleDataChange,
    ]);

    // Execute swap - handles approval flow then swap
    const handleExecuteSwap = useCallback(async () => {
        if (!isValidForQuote || !sourceTokenAddress || !destinationTokenAddress || !embeddedWallet) return;

        setExecutionState({ loading: true, error: null, txHash: null, approvalTxHash: null, success: false, step: 'checking-allowance' });

        try {
            // Get the wallet provider
            const provider = await embeddedWallet.getEthereumProvider();
            const routerAddress = UNISWAP_ROUTER_ADDRESSES[swapChain];

            // Convert amount to wei/smallest unit based on token decimals
            const amountInWei = BigInt(Math.floor(parseFloat(swapAmount) * Math.pow(10, sourceTokenDecimals)));

            // Step 0: Check token balance first
            console.log("Step 0: Checking token balance...");
            const balanceData = encodeFunctionData('balanceOf', [effectiveWalletAddress]);

            const balanceResult = await provider.request({
                method: 'eth_call',
                params: [{
                    to: sourceTokenAddress,
                    data: balanceData,
                }, 'latest'],
            });

            const currentBalance = BigInt(balanceResult as string);
            const formattedBalance = (Number(currentBalance) / Math.pow(10, sourceTokenDecimals)).toFixed(6);
            console.log("Current balance:", currentBalance.toString(), `(${formattedBalance} ${sourceTokenSymbol})`, "Required:", amountInWei.toString());

            if (currentBalance < amountInWei) {
                const requiredFormatted = (Number(amountInWei) / Math.pow(10, sourceTokenDecimals)).toFixed(6);
                throw new Error(
                    `Insufficient ${sourceTokenSymbol} balance. You have ${formattedBalance} but need ${requiredFormatted} ${sourceTokenSymbol}. ` +
                    `Please get testnet tokens from a faucet.`
                );
            }

            // Step 1: Check current allowance
            console.log("Step 1: Checking allowance...");
            const allowanceData = encodeFunctionData('allowance', [effectiveWalletAddress, routerAddress]);

            const allowanceResult = await provider.request({
                method: 'eth_call',
                params: [{
                    to: sourceTokenAddress,
                    data: allowanceData,
                }, 'latest'],
            });

            const currentAllowance = BigInt(allowanceResult as string);
            console.log("Current allowance:", currentAllowance.toString(), "Required:", amountInWei.toString());

            // Step 2: If allowance is insufficient, request approval
            if (currentAllowance < amountInWei) {
                console.log("Step 2: Requesting token approval...");
                setExecutionState(prev => ({ ...prev, step: 'approving' }));

                // Approve max uint256 for convenience (or you could approve exact amount)
                const maxApproval = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                const approveData = encodeFunctionData('approve', [routerAddress, maxApproval]);

                // Send approval transaction
                const approveTxHash = await provider.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: effectiveWalletAddress,
                        to: sourceTokenAddress,
                        data: approveData,
                    }],
                });

                console.log("Approval tx sent:", approveTxHash);
                setExecutionState(prev => ({ ...prev, step: 'waiting-approval', approvalTxHash: approveTxHash as string }));

                // Wait for approval confirmation
                console.log("Waiting for approval confirmation...");
                let approvalConfirmed = false;
                let attempts = 0;
                const maxAttempts = 60; // 60 seconds timeout

                while (!approvalConfirmed && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    try {
                        const receipt = await provider.request({
                            method: 'eth_getTransactionReceipt',
                            params: [approveTxHash],
                        });

                        if (receipt && (receipt as { status?: string }).status === '0x1') {
                            approvalConfirmed = true;
                            console.log("Approval confirmed!");
                        } else if (receipt && (receipt as { status?: string }).status === '0x0') {
                            throw new Error("Approval transaction failed");
                        }
                    } catch {
                        // Transaction not yet mined, continue waiting
                    }

                    attempts++;
                }

                if (!approvalConfirmed) {
                    throw new Error("Approval transaction timeout. Please try again.");
                }
            } else {
                console.log("Sufficient allowance exists, skipping approval step.");
            }

            // Step 3: Build and send swap transaction
            console.log("Step 3: Building swap transaction...");
            setExecutionState(prev => ({ ...prev, step: 'building-tx' }));

            const swapConfig = {
                sourceToken: {
                    address: sourceTokenAddress,
                    symbol: sourceTokenSymbol,
                    decimals: sourceTokenDecimals,
                },
                destinationToken: {
                    address: destinationTokenAddress,
                    symbol: destinationTokenSymbol,
                    decimals: destinationTokenDecimals,
                },
                amount: amountInWei.toString(),
                swapType: SwapType.EXACT_INPUT,
                walletAddress: effectiveWalletAddress,
                simulateFirst: false, // Skip simulation since we've handled approval
            };

            const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.SWAP.BUILD_TRANSACTION)}/${swapProvider}/${swapChain}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(swapConfig),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: "Request failed" } }));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || "Failed to build transaction");
            }

            const { transaction } = data.data;

            // Step 4: Send swap transaction
            console.log("Step 4: Sending swap transaction...");
            setExecutionState(prev => ({ ...prev, step: 'swapping' }));
            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [{
                    from: effectiveWalletAddress,
                    to: transaction.to,
                    data: transaction.data,
                    value: transaction.value ? `0x${BigInt(transaction.value).toString(16)}` : "0x0",
                    gas: transaction.gasLimit ? `0x${BigInt(transaction.gasLimit).toString(16)}` : undefined,
                }],
            });

            console.log("Swap tx sent:", txHash);

            setExecutionState({
                loading: false,
                error: null,
                txHash: txHash as string,
                approvalTxHash: null,
                success: true,
                step: 'done',
            });

            handleDataChange({
                lastTxHash: txHash,
                lastExecutedAt: new Date().toISOString(),
            });

        } catch (error) {
            console.error("Swap execution failed:", error);
            setExecutionState({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to execute swap",
                txHash: null,
                approvalTxHash: null,
                success: false,
                step: 'idle',
            });
        }
    }, [
        isValidForQuote,
        sourceTokenAddress,
        sourceTokenSymbol,
        sourceTokenDecimals,
        destinationTokenAddress,
        destinationTokenSymbol,
        destinationTokenDecimals,
        swapAmount,
        effectiveWalletAddress,
        swapProvider,
        swapChain,
        embeddedWallet,
        handleDataChange,
    ]);

    // Handle copy to clipboard
    const handleCopyAddress = useCallback(async () => {
        if (!effectiveWalletAddress) return;

        try {
            await navigator.clipboard.writeText(effectiveWalletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy address:", error);
        }
    }, [effectiveWalletAddress]);

    // Show login prompt if not authenticated
    if (!authenticated) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <Card className="p-6 w-full max-w-md">
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="p-3 rounded-full bg-primary/10">
                                <LogIn className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Typography variant="h4" className="text-foreground">
                                Login Required
                            </Typography>
                            <Typography variant="bodySmall" className="text-muted-foreground">
                                Please login to configure swap settings
                            </Typography>
                        </div>
                        <Button onClick={login} className="w-full gap-2">
                            <LogIn className="w-4 h-4" />
                            Login to Continue
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Wallet Address with Copy Button */}
            {effectiveWalletAddress && (
                <Card className="p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <Typography variant="caption" className="text-muted-foreground mb-1">
                                {selectedSafe ? "Safe Wallet" : "Wallet Address"}
                            </Typography>
                            <div className="flex items-center gap-2">
                                <Typography
                                    variant="bodySmall"
                                    className="font-mono text-foreground truncate"
                                >
                                    {effectiveWalletAddress}
                                </Typography>
                            </div>
                        </div>
                        <Button
                            onClick={handleCopyAddress}
                            className="shrink-0 gap-1.5"
                            title="Copy address"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-success" />
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Section 1: Token Selection */}
            <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        1. Select Tokens
                    </Typography>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${swapChain === SupportedChain.ARBITRUM_SEPOLIA
                        ? "bg-warning/20 text-warning"
                        : "bg-success/20 text-success"
                        }`}>
                        {swapChain === SupportedChain.ARBITRUM_SEPOLIA ? "Testnet" : "Mainnet"}
                    </span>
                </div>

                {/* Source Token (From) */}
                <div className="space-y-1.5">
                    <Typography variant="caption" className="text-muted-foreground">
                        From
                    </Typography>

                    {showCustomSourceToken ? (
                        /* Custom Token Input */
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTokenAddress}
                                    onChange={(e) => setCustomTokenAddress(e.target.value)}
                                    placeholder="Enter token address (0x...)"
                                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                />
                                <Button
                                    onClick={() => fetchTokenInfo(customTokenAddress, true)}
                                    disabled={customTokenLoading || !customTokenAddress}
                                    className="gap-1"
                                >
                                    {customTokenLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    Fetch
                                </Button>
                            </div>
                            {customTokenError && (
                                <div className="flex items-center gap-2 text-destructive text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    {customTokenError}
                                </div>
                            )}
                            <Button
                                onClick={() => setShowCustomSourceToken(false)}
                                className="text-xs"
                            >
                                ← Back to token list
                            </Button>
                        </div>
                    ) : (
                        /* Token Dropdown with Copy Button */
                        <div className="flex items-center gap-2">
                            <select
                                value={sourceTokenAddress}
                                onChange={(e) => handleSourceTokenChange(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select token...</option>
                                {availableTokens.map((token: TokenInfo) => (
                                    <option key={token.address} value={token.address}>
                                        {token.symbol}
                                    </option>
                                ))}
                                {canUseCustomTokens && (
                                    <option value={CUSTOM_TOKEN_OPTION}>
                                        + Custom...
                                    </option>
                                )}
                            </select>
                            {sourceTokenAddress && sourceTokenAddress !== CUSTOM_TOKEN_OPTION && (
                                <Button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(sourceTokenAddress);
                                        setCopiedSourceToken(true);
                                        setTimeout(() => setCopiedSourceToken(false), 2000);
                                    }}
                                    className="shrink-0 p-2 h-auto"
                                    title="Copy token address"
                                >
                                    {copiedSourceToken ? (
                                        <Check className="w-4 h-4 text-success" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Destination Token (To) */}
                <div className="space-y-1.5">
                    <Typography variant="caption" className="text-muted-foreground">
                        To
                    </Typography>

                    {showCustomDestToken ? (
                        /* Custom Token Input */
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTokenAddress}
                                    onChange={(e) => setCustomTokenAddress(e.target.value)}
                                    placeholder="Enter token address (0x...)"
                                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                />
                                <Button
                                    onClick={() => fetchTokenInfo(customTokenAddress, false)}
                                    disabled={customTokenLoading || !customTokenAddress}
                                    className="gap-1"
                                >
                                    {customTokenLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    Fetch
                                </Button>
                            </div>
                            {customTokenError && (
                                <div className="flex items-center gap-2 text-destructive text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    {customTokenError}
                                </div>
                            )}
                            <Button
                                onClick={() => setShowCustomDestToken(false)}
                                className="text-xs"
                            >
                                ← Back to token list
                            </Button>
                        </div>
                    ) : (
                        /* Token Dropdown with Copy Button */
                        <div className="flex items-center gap-2">
                            <select
                                value={destinationTokenAddress}
                                onChange={(e) => handleDestinationTokenChange(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select token...</option>
                                {availableTokens
                                    .filter((t: TokenInfo) => t.address !== sourceTokenAddress)
                                    .map((token: TokenInfo) => (
                                        <option key={token.address} value={token.address}>
                                            {token.symbol}
                                        </option>
                                    ))}
                                {canUseCustomTokens && (
                                    <option value={CUSTOM_TOKEN_OPTION}>
                                        + Custom...
                                    </option>
                                )}
                            </select>
                            {destinationTokenAddress && destinationTokenAddress !== CUSTOM_TOKEN_OPTION && (
                                <Button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(destinationTokenAddress);
                                        setCopiedDestToken(true);
                                        setTimeout(() => setCopiedDestToken(false), 2000);
                                    }}
                                    className="shrink-0 p-2 h-auto"
                                    title="Copy token address"
                                >
                                    {copiedDestToken ? (
                                        <Check className="w-4 h-4 text-success" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Section 2: Enter Amount */}
            <Card className="p-4 space-y-3">
                <Typography variant="bodySmall" className="font-semibold text-foreground">
                    2. <Typography variant="caption" className="text-muted-foreground">
                        {sourceTokenSymbol
                            ? `Enter ${sourceTokenSymbol} Amount`
                            : "Enter Token Amount"
                        }
                    </Typography>
                </Typography>

                {/* Amount Input */}
                <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background">
                    <input
                        type="text"
                        value={swapAmount}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, "");
                            handleDataChange({ swapAmount: value, hasQuote: false });
                        }}
                        placeholder="0.0"
                        className="flex-1 text-sm bg-transparent text-foreground focus:outline-none"
                    />
                    {sourceTokenSymbol && (
                        <span className="text-sm font-medium text-foreground">
                            {sourceTokenSymbol}
                        </span>
                    )}
                </div>
            </Card>

            {/* Section 4: Quote Preview */}
            <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Swap Preview
                    </Typography>
                    <Button
                        onClick={handleGetQuote}
                        disabled={!isValidForQuote || quoteState.loading}
                        className="gap-1"
                    >
                        {quoteState.loading ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Getting Data...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-3 h-3" />
                                Get Data
                            </>
                        )}
                    </Button>
                </div>

                {quoteState.error && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <Typography variant="caption" className="text-destructive">
                            {quoteState.error}
                        </Typography>
                    </div>
                )}

                {quoteState.data && (
                    <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Est. Receive:</span>
                            <span className="text-sm font-medium text-foreground">
                                {parseFloat(quoteState.data.amountOut).toFixed(3)} {destinationTokenSymbol}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Price Impact:</span>
                            <span className={`text-sm font-medium ${parseFloat(quoteState.data.priceImpact) > 1
                                ? "text-warning"
                                : "text-foreground"
                                }`}>
                                {quoteState.data.priceImpact}%
                            </span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Section 5: Execute Swap (Test) */}
            {quoteState.data && (
                <Card className="p-4 space-y-3">
                    <Typography variant="bodySmall" className="font-semibold text-foreground">
                        Execute Swap (Test)
                    </Typography>

                    <div className="space-y-3">
                        <Button
                            onClick={handleExecuteSwap}
                            disabled={!quoteState.data || executionState.loading || !embeddedWallet}
                            className="w-full gap-2"
                        >
                            {executionState.loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {executionState.step === 'checking-allowance' && 'Checking allowance...'}
                                    {executionState.step === 'approving' && 'Approve token in wallet...'}
                                    {executionState.step === 'waiting-approval' && 'Waiting for approval...'}
                                    {executionState.step === 'building-tx' && 'Building transaction...'}
                                    {executionState.step === 'swapping' && 'Confirm swap in wallet...'}
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Execute Swap on {swapChain === SupportedChain.ARBITRUM_SEPOLIA ? "Sepolia" : "Mainnet"}
                                </>
                            )}
                        </Button>

                        {/* Progress indicator for approval step */}
                        {executionState.loading && executionState.step === 'waiting-approval' && executionState.approvalTxHash && (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <div className="flex-1">
                                    <Typography variant="caption" className="text-foreground">
                                        Waiting for approval confirmation...
                                    </Typography>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Typography variant="caption" className="text-muted-foreground font-mono text-xs truncate flex-1">
                                            {executionState.approvalTxHash}
                                        </Typography>
                                        <a
                                            href={`https://${swapChain === SupportedChain.ARBITRUM_SEPOLIA ? "sepolia." : ""}arbiscan.io/tx/${executionState.approvalTxHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span className="text-xs">View</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!embeddedWallet && (
                            <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                                <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                                <Typography variant="caption" className="text-warning">
                                    No embedded wallet found. Please ensure you are logged in with Privy.
                                </Typography>
                            </div>
                        )}

                        {executionState.error && (
                            <div className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                <Typography variant="caption" className="text-destructive">
                                    {executionState.error}
                                </Typography>
                            </div>
                        )}

                        {executionState.success && executionState.txHash && (
                            <div className="space-y-2 p-3 rounded-lg bg-success/10 border border-success/20">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    <Typography variant="caption" className="text-success font-medium">
                                        Swap executed successfully!
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Typography variant="caption" className="text-muted-foreground font-mono text-xs truncate flex-1">
                                        {executionState.txHash}
                                    </Typography>
                                    <a
                                        href={`https://${swapChain === SupportedChain.ARBITRUM_SEPOLIA ? "sepolia." : ""}arbiscan.io/tx/${executionState.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span className="text-xs">View</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default SwapNodeConfiguration;
