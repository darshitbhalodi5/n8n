"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";
import { useCreateSafeWallet } from "@/web3/hooks/useCreateSafeWallet";
import { API_CONFIG } from "@/config/api";
import { ChainDefinition, getSelectableChains } from "@/web3/chains";

export type OnboardingStepStatus = "idle" | "pending" | "success" | "error";

// Progress for a single chain
export interface ChainProgress {
    walletCreate: OnboardingStepStatus;
    moduleSign: OnboardingStepStatus;
    moduleEnable: OnboardingStepStatus;
    error?: string;
    safeAddress?: string;
}

export type ChainConfig = ChainDefinition;

export interface UserData {
    id: string;
    address: string;
    email: string;
    onboarded_at: string;
    safe_wallet_address_testnet?: string;
    safe_wallet_address_mainnet?: string;
}

export interface OnboardingContextType {
    // State
    needsOnboarding: boolean;
    isOnboarding: boolean;
    isCheckingUser: boolean;
    chainsToSetup: ChainConfig[];
    progress: Record<string, ChainProgress>;
    userData: UserData | null;
    currentSigningChain: string | null;

    // Actions
    startOnboarding: () => Promise<void>;
    retryChain: (chainKey: string) => Promise<void>;
    skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
    undefined
);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
};

// Chains available for onboarding based on environment
const getChainsToSetup = (): ChainConfig[] => getSelectableChains();

// Initialize progress for chains
const initializeProgress = (chains: ChainConfig[]): Record<string, ChainProgress> => {
    const progress: Record<string, ChainProgress> = {};
    for (const chain of chains) {
        progress[chain.key] = {
            walletCreate: "idle",
            moduleSign: "idle",
            moduleEnable: "idle",
        };
    }
    return progress;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { authenticated, ready } = usePrivy();
    const { walletAddress } = usePrivyEmbeddedWallet();
    const { getPrivyAccessToken } = usePrivyWallet();
    const { signEnableModule, submitEnableModule } = useCreateSafeWallet();

    // Chains to setup based on environment
    const chainsToSetup = useMemo(() => getChainsToSetup(), []);

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [progress, setProgress] = useState<Record<string, ChainProgress>>(() =>
        initializeProgress(chainsToSetup)
    );
    const [currentSigningChain, setCurrentSigningChain] = useState<string | null>(null);

    // Track if we've already shown onboarding
    const hasShownOnboardingRef = useRef(false);

    // Local storage key for tracking onboarding shown state (persists forever)
    const ONBOARDING_SHOWN_KEY = "onboarding_popup_shown";

    // Fetch user data by wallet address
    const fetchUserData = useCallback(async (): Promise<UserData | null> => {
        if (!walletAddress) return null;

        try {
            const accessToken = await getPrivyAccessToken();
            if (!accessToken) return null;

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/users/address/${walletAddress}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            return null;
        }
    }, [walletAddress, getPrivyAccessToken]);

    // Create Safe wallet on a specific chain
    const createSafeOnChain = useCallback(
        async (chainId: number): Promise<{ success: boolean; safeAddress?: string; error?: string }> => {
            try {
                const accessToken = await getPrivyAccessToken();
                if (!accessToken) {
                    return { success: false, error: "Not authenticated" };
                }

                const response = await fetch(`${API_CONFIG.BASE_URL}/relay/create-safe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ chainId }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    return { success: false, error: data.error || "Failed to create Safe" };
                }

                return { success: true, safeAddress: data.data.safeAddress };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : "Network error",
                };
            }
        },
        [getPrivyAccessToken]
    );

    // Process a single chain: create wallet + sign + enable module
    const processChain = useCallback(
        async (chain: ChainConfig): Promise<boolean> => {
            const { key } = chain;

            // Step 1: Create wallet
            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], walletCreate: "pending", error: undefined },
            }));

            const createResult = await createSafeOnChain(chain.id);

            if (!createResult.success) {
                setProgress((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], walletCreate: "error", error: createResult.error },
                }));
                return false;
            }

            const safeAddress = createResult.safeAddress!;
            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], walletCreate: "success", safeAddress },
            }));

            // Step 2: Sign enable module transaction
            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], moduleSign: "pending" },
            }));
            setCurrentSigningChain(key);

            const signResult = await signEnableModule(safeAddress);

            if (!signResult.success) {
                setProgress((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], moduleSign: "error", error: signResult.error },
                }));
                setCurrentSigningChain(null);
                return false;
            }

            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], moduleSign: "success" },
            }));
            setCurrentSigningChain(null);

            // Check if module was already enabled (signResult.data.safeTxHash will be empty)
            if (signResult.data && !signResult.data.safeTxHash) {
                // Module already enabled
                setProgress((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], moduleEnable: "success" },
                }));
                return true;
            }

            // Step 3: Submit enable module transaction
            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], moduleEnable: "pending" },
            }));

            const submitResult = await submitEnableModule();

            if (!submitResult.success) {
                setProgress((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], moduleEnable: "error", error: submitResult.error },
                }));
                return false;
            }

            setProgress((prev) => ({
                ...prev,
                [key]: { ...prev[key], moduleEnable: "success" },
            }));

            return true;
        },
        [createSafeOnChain, signEnableModule, submitEnableModule]
    );

    // Check if user needs onboarding after authentication
    useEffect(() => {
        if (!ready || !authenticated || !walletAddress) {
            setNeedsOnboarding(false);
            setUserData(null);
            return;
        }

        // Check if we've already shown the onboarding popup ever (persists in localStorage)
        const hasShownEver = localStorage.getItem(ONBOARDING_SHOWN_KEY) === "true";

        // If already shown ever, don't show again
        if (hasShownEver) {
            hasShownOnboardingRef.current = true;
            // Still fetch user data to update context, but don't show popup
            fetchUserData().then((user) => {
                setUserData(user);
            });
            return;
        }

        const checkUser = async () => {
            setIsCheckingUser(true);
            try {
                const user = await fetchUserData();
                setUserData(user);

                // Check which chains need setup
                const chainsNeedingSetup = chainsToSetup.filter((chain) => {
                    if (chain.key === "testnet") {
                        return !user?.safe_wallet_address_testnet;
                    }
                    if (chain.key === "mainnet") {
                        return !user?.safe_wallet_address_mainnet;
                    }
                    return true;
                });

                if (chainsNeedingSetup.length > 0) {
                    // Only show the popup if we haven't shown it in this session
                    if (!hasShownOnboardingRef.current) {
                        setNeedsOnboarding(true);
                        hasShownOnboardingRef.current = true;
                        localStorage.setItem(ONBOARDING_SHOWN_KEY, "true");
                    }
                    // Pre-fill progress for existing wallets
                    setProgress((prev) => {
                        const updated = { ...prev };
                        for (const chain of chainsToSetup) {
                            const hasWallet =
                                chain.key === "testnet"
                                    ? !!user?.safe_wallet_address_testnet
                                    : !!user?.safe_wallet_address_mainnet;
                            if (hasWallet) {
                                updated[chain.key] = {
                                    walletCreate: "success",
                                    moduleSign: "success",
                                    moduleEnable: "success",
                                };
                            }
                        }
                        return updated;
                    });
                } else {
                    setNeedsOnboarding(false);
                }
            } catch (error) {
                console.error("Error checking user:", error);
                // Only show error popup if we haven't shown anything yet
                if (!hasShownOnboardingRef.current) {
                    setNeedsOnboarding(true);
                    hasShownOnboardingRef.current = true;
                    localStorage.setItem(ONBOARDING_SHOWN_KEY, "true");
                }
            } finally {
                setIsCheckingUser(false);
            }
        };

        checkUser();
    }, [ready, authenticated, walletAddress, fetchUserData, chainsToSetup, ONBOARDING_SHOWN_KEY]);

    // Start the onboarding process
    const startOnboarding = useCallback(async () => {
        setIsOnboarding(true);

        let allSuccessful = true;

        // Process each chain that needs setup
        for (const chain of chainsToSetup) {
            const chainProgress = progress[chain.key];

            // Skip if already complete
            if (chainProgress.moduleEnable === "success") {
                continue;
            }

            const success = await processChain(chain);
            if (!success) {
                allSuccessful = false;
                // Don't break - continue with other chains
            }
        }

        // Refresh user data
        const updatedUser = await fetchUserData();
        if (updatedUser) {
            setUserData(updatedUser);
        }

        // Check if all chains are complete
        if (allSuccessful) {
            setNeedsOnboarding(false);
            setIsOnboarding(false);
        }
    }, [chainsToSetup, progress, processChain, fetchUserData]);

    // Retry a specific chain
    const retryChain = useCallback(
        async (chainKey: string) => {
            const chain = chainsToSetup.find((c) => c.key === chainKey);
            if (!chain) return;

            const success = await processChain(chain);

            if (success) {
                // Check if all chains are now complete
                const allComplete = chainsToSetup.every((c) => {
                    if (c.key === chainKey) return true;
                    return progress[c.key]?.moduleEnable === "success";
                });

                if (allComplete) {
                    setNeedsOnboarding(false);
                    setIsOnboarding(false);
                }
            }
        },
        [chainsToSetup, processChain, progress]
    );

    const skipOnboarding = useCallback(() => {
        setNeedsOnboarding(false);
        setIsOnboarding(false);
        // Mark as shown so it never reappears
        hasShownOnboardingRef.current = true;
        localStorage.setItem(ONBOARDING_SHOWN_KEY, "true");
    }, [ONBOARDING_SHOWN_KEY]);

    const contextValue = useMemo<OnboardingContextType>(
        () => ({
            needsOnboarding,
            isOnboarding,
            isCheckingUser,
            chainsToSetup,
            progress,
            userData,
            currentSigningChain,
            startOnboarding,
            retryChain,
            skipOnboarding,
        }),
        [
            needsOnboarding,
            isOnboarding,
            isCheckingUser,
            chainsToSetup,
            progress,
            userData,
            currentSigningChain,
            startOnboarding,
            retryChain,
            skipOnboarding,
        ]
    );

    return (
        <OnboardingContext.Provider value={contextValue}>
            {children}
        </OnboardingContext.Provider>
    );
};
