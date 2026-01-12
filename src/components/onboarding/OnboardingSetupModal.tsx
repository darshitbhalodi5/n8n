"use client";

import React, { useEffect } from "react";
import {
    useOnboarding,
    OnboardingStepStatus,
    ChainProgress,
    ChainConfig,
} from "@/contexts/OnboardingContext";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Shield,
    PenLine,
} from "lucide-react";
import { Button } from "@/components/ui";

interface StepIndicatorProps {
    label: string;
    status: OnboardingStepStatus;
    isSigningStep?: boolean;
    isSigning?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    label,
    status,
    isSigningStep,
    isSigning,
}) => {
    const getIcon = () => {
        switch (status) {
            case "idle":
                return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;
            case "pending":
                return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
            case "success":
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "error":
                return <XCircle className="w-5 h-5 text-destructive" />;
        }
    };

    return (
        <div className="flex items-center gap-2.5 py-1.5">
            <div className="flex-shrink-0">{getIcon()}</div>
            <span
                className={`text-sm ${status === "success"
                    ? "text-green-500"
                    : status === "error"
                        ? "text-destructive"
                        : status === "pending"
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }`}
            >
                {label}
                {isSigningStep && isSigning && status === "pending" && (
                    <span className="ml-1.5 text-primary font-medium">(Please sign in wallet)</span>
                )}
            </span>
        </div>
    );
};

interface ChainProgressCardProps {
    chain: ChainConfig;
    progress: ChainProgress;
    isSigning: boolean;
    onRetry: () => void;
}

const ChainProgressCard: React.FC<ChainProgressCardProps> = ({
    chain,
    progress,
    isSigning,
    onRetry,
}) => {
    const hasError =
        progress.walletCreate === "error" ||
        progress.moduleSign === "error" ||
        progress.moduleEnable === "error";

    const isComplete =
        progress.walletCreate === "success" &&
        progress.moduleSign === "success" &&
        progress.moduleEnable === "success";

    return (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isComplete ? "bg-green-500" : hasError ? "bg-destructive" : "bg-primary"
                            }`}
                    />
                    <h3 className="font-medium text-sm text-foreground">{chain.name}</h3>
                </div>
                {hasError && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRetry}
                        className="h-7 px-2 gap-1 text-xs"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                    </Button>
                )}
            </div>

            <div className="space-y-0.5 pl-1">
                <StepIndicator
                    label="Creating Smart Wallet"
                    status={progress.walletCreate}
                />
                <StepIndicator
                    label="Signing Module Authorization"
                    status={progress.moduleSign}
                    isSigningStep={true}
                    isSigning={isSigning}
                />
                <StepIndicator
                    label="Enabling Automation"
                    status={progress.moduleEnable}
                />
            </div>

            {progress.error && (
                <p className="mt-2 text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
                    {progress.error}
                </p>
            )}
        </div>
    );
};

export const OnboardingSetupModal: React.FC = () => {
    const {
        needsOnboarding,
        isOnboarding,
        isCheckingUser,
        chainsToSetup,
        progress,
        currentSigningChain,
        startOnboarding,
        retryChain,
    } = useOnboarding();

    // Auto-start onboarding when modal appears
    useEffect(() => {
        if (needsOnboarding && !isOnboarding && !isCheckingUser) {
            startOnboarding();
        }
    }, [needsOnboarding, isOnboarding, isCheckingUser, startOnboarding]);

    // Calculate completion status (must be before any early returns for hooks rules)
    const allComplete = chainsToSetup.every((chain) => {
        const chainProgress = progress[chain.key];
        return (
            chainProgress?.walletCreate === "success" &&
            chainProgress?.moduleSign === "success" &&
            chainProgress?.moduleEnable === "success"
        );
    });

    // Close modal after completion animation (must be before early return)
    useEffect(() => {
        if (allComplete) {
            const timer = setTimeout(() => {
                // The context will set needsOnboarding to false
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [allComplete]);

    // Don't show if not needed or still checking
    if (isCheckingUser || !needsOnboarding) {
        return null;
    }


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4 text-center border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                        One-Time Setup
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                        Setting up your Smart Wallets for seamless automated transactions
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                    {chainsToSetup.map((chain) => (
                        <ChainProgressCard
                            key={chain.key}
                            chain={chain}
                            progress={progress[chain.key] || { walletCreate: "idle", moduleSign: "idle", moduleEnable: "idle" }}
                            isSigning={currentSigningChain === chain.key}
                            onRetry={() => retryChain(chain.key)}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/30">
                    {allComplete ? (
                        <div className="text-center py-2">
                            <p className="text-sm font-medium text-green-500 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Setup Complete!
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Your Smart Wallets are ready
                            </p>
                        </div>
                    ) : currentSigningChain ? (
                        <div className="text-center py-2">
                            <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                                <PenLine className="w-4 h-4" />
                                Please sign in your wallet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                This authorizes automated transactions
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-center text-muted-foreground py-1">
                            This is a one-time setup for each network
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingSetupModal;
