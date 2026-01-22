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
import { usePrivyEmbeddedWallet } from "@/hooks/usePrivyEmbeddedWallet";
import { useSafeWallets } from "@/web3/hooks/useSafeWallets";
import { useCreateSafeWallet } from "@/web3/hooks/useCreateSafeWallet";
import { useSafeModuleStatus } from "@/web3/hooks/useSafeModuleStatus";
import { verifyModuleEnabled } from "@/web3/onboarding";
import { useOnboarding } from "@/contexts/OnboardingContext";

// Placeholder types - will be properly typed when we port the hooks
export interface SafeWalletSelection {
  selectedSafe: string | null;
  safeWallets: string[];
  isLoading: boolean;
  error: string | null;
  selectSafe: (safe: string | null) => void;
  refreshSafeList: () => Promise<void>;
  moduleEnabled: boolean | null;
  checkingModule: boolean;
  refreshModuleStatus: () => Promise<void>;
}

export interface SafeWalletCreation {
  showCreateFlow: boolean;
  createStep: "idle" | "pending" | "success" | "error";
  signStep: "idle" | "pending" | "success" | "error";
  enableStep: "idle" | "pending" | "success" | "error";
  createError?: string;
  signError?: string;
  enableError?: string;
  currentSafeAddress: string | null;
  isCreating: boolean;
  isSigningEnableModule: boolean;
  isExecutingEnableModule: boolean;
  handleCreateNewSafe: () => Promise<void>;
  handleRetryCreate: () => Promise<void>;
  handleRetrySign: () => Promise<void>;
  handleRetryEnable: () => Promise<void>;
  closeCreateFlow: () => void;
}

export interface SafeWalletImportFlow {
  showImportDialog: boolean;
  hasImportOngoingProcess: boolean;
  openImportDialog: () => void;
  closeImportDialog: () => void;
  handleImportedSafe: (safeAddress: string) => Promise<void>;
  setHasImportOngoingProcess: (hasOngoing: boolean) => void;
}

export interface SafeWalletModuleControl {
  showModuleActionDialog: boolean;
  moduleSignStep: "idle" | "pending" | "success" | "error";
  moduleExecuteStep: "idle" | "pending" | "success" | "error";
  moduleSignError?: string;
  moduleExecuteError?: string;
  hasOngoingModuleProcess: boolean;
  handleShowEnableDialog: () => void;
  handleEnableModule: () => Promise<void>;
  handleRetryModuleSign: () => Promise<void>;
  handleRetryModuleExecute: () => Promise<void>;
  handleManualModuleRefresh: () => Promise<void>;
  closeModuleActionDialog: () => void;
}

export interface SafeWalletContextType {
  selection: SafeWalletSelection;
  creation: SafeWalletCreation;
  importFlow: SafeWalletImportFlow;
  moduleControl: SafeWalletModuleControl;
}

const SafeWalletContext = createContext<SafeWalletContextType | undefined>(
  undefined
);

export const useSafeWalletContext = () => {
  const context = useContext(SafeWalletContext);
  if (!context) {
    throw new Error(
      "useSafeWalletContext must be used within SafeWalletProvider"
    );
  }
  return context;
};

export const SafeWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { walletAddress, chainId, ethereumProvider, embeddedWallet } = usePrivyEmbeddedWallet();

  // Get onboarding state to detect when onboarding completes
  const { needsOnboarding: onboardingNeeded } = useOnboarding();

  // Core hooks
  const { safeWallets, isLoading, error, refetch } = useSafeWallets();
  const {
    createSafeWallet,
    signEnableModule,
    submitEnableModule,
    isCreating,
    isSigningEnableModule,
    isExecutingEnableModule,
  } = useCreateSafeWallet();

  // Selection State
  const [selectedSafe, setSelectedSafe] = useState<string | null>(null);
  const [moduleEnabled, refreshModuleStatus, checkingModule] =
    useSafeModuleStatus(selectedSafe || undefined);

  // Creation State
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [createStep, setCreateStep] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [signStep, setSignStep] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [enableStep, setEnableStep] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [createError, setCreateError] = useState<string | undefined>(undefined);
  const [signError, setSignError] = useState<string | undefined>(undefined);
  const [enableError, setEnableError] = useState<string | undefined>(undefined);
  const [currentSafeAddress, setCurrentSafeAddress] = useState<string | null>(
    null
  );

  // Import State
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [hasImportOngoingProcess, setHasImportOngoingProcess] = useState(false);

  // Module Control State
  const [showModuleActionDialog, setShowModuleActionDialog] = useState(false);
  const [moduleSignStep, setModuleSignStep] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [moduleExecuteStep, setModuleExecuteStep] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [moduleSignError, setModuleSignError] = useState<string | undefined>(
    undefined
  );
  const [moduleExecuteError, setModuleExecuteError] = useState<
    string | undefined
  >(undefined);
  const [hasOngoingModuleProcess, setHasOngoingModuleProcess] = useState(false);

  // Clear selection when chain switches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedSafe(null);
  }, [chainId]);

  // Track previous onboarding state to detect completion
  const prevOnboardingNeededRef = useRef<boolean | undefined>(undefined);

  // Refresh safe wallets after onboarding completes
  useEffect(() => {
    // Detect when onboarding transitions from needed to not needed (completion)
    const wasOnboarding = prevOnboardingNeededRef.current;
    const isOnboarding = onboardingNeeded;

    // If onboarding just completed (was true, now false), refresh safe wallets
    if (wasOnboarding === true && isOnboarding === false) {
      // Wait a bit for blockchain state to propagate, then refetch
      const timer = setTimeout(async () => {
        await refetch();
      }, 2000);

      return () => clearTimeout(timer);
    }

    prevOnboardingNeededRef.current = isOnboarding;
  }, [onboardingNeeded, refetch]);

  // Auto-select first safe wallet if none is selected and wallets are available
  useEffect(() => {
    if (!selectedSafe && safeWallets.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setSelectedSafe(safeWallets[0]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSafe, safeWallets, isLoading]);

  // Refresh module status after selection
  const selectSafe = useCallback(
    async (safe: string | null) => {
      setSelectedSafe(safe);
      if (safe) {
        setTimeout(async () => {
          await refreshModuleStatus();
        }, 100);
      }
    },
    [refreshModuleStatus]
  );

  const handleEnableStep = useCallback(
    async (safeAddress: string) => {
      setEnableStep("pending");
      setEnableError(undefined);

      const submitResult = await submitEnableModule();

      if (!submitResult.success) {
        setEnableStep("error");
        setEnableError(submitResult.error || "Failed to submit transaction");
      } else {
        setEnableStep("success");

        // Verify module is actually enabled on-chain
        if (chainId && ethereumProvider) {
          try {
            const isEnabled = await verifyModuleEnabled(
              safeAddress,
              chainId,
              ethereumProvider,
              5,
              2000
            );

            if (!isEnabled) {
              setEnableError("Module not verified on-chain");
            }
          } catch (verifyError) {
            console.error("Failed to verify module:", verifyError);
            // Don't fail the flow, just log it
          }
        }

        setTimeout(async () => {
          setSelectedSafe(safeAddress);
          await refetch();

          setTimeout(async () => {
            await refreshModuleStatus();
          }, 200);

          setTimeout(() => {
            setShowCreateFlow(false);
          }, 500);
        }, 2000);
      }
    },
    [submitEnableModule, refetch, refreshModuleStatus, chainId, ethereumProvider]
  );

  const handleSignStep = useCallback(
    async (safeAddress: string) => {
      setSignStep("pending");
      setSignError(undefined);

      // Ensure we're on the correct chain before signing
      if (!chainId || !embeddedWallet) {
        setSignStep("error");
        setSignError("Wallet not ready");
        return;
      }

      try {
        // No need to switch chain here as user is already on it (manual Safe creation)
        // But we pass chainId explicitly to signEnableModule for safety
        const signResult = await signEnableModule(safeAddress, chainId);

        if (!signResult.success) {
          setSignStep("error");
          setSignError(signResult.error || "Failed to sign transaction");
          setTimeout(async () => {
            await refetch();
            setSelectedSafe(safeAddress);
          }, 3000);
          return;
        }

        setSignStep("success");
        await handleEnableStep(safeAddress);
      } catch (error) {
        setSignStep("error");
        setSignError(error instanceof Error ? error.message : "Failed to sign");
      }
    },
    [signEnableModule, refetch, handleEnableStep, chainId, embeddedWallet]
  );

  const handleCreateNewSafe = useCallback(async () => {
    if (!walletAddress) return;

    // Defensive guard: prevent creation if user already has a Safe
    if (safeWallets.length > 0) {
      console.warn(
        { walletAddress, existingSafes: safeWallets },
        "Attempted to create Safe when user already has one"
      );
      setShowCreateFlow(true);
      setCreateStep("error");
      setCreateError("You already have a Safe wallet for this address");
      return;
    }

    setShowCreateFlow(true);
    setCreateStep("pending");
    setSignStep("idle");
    setEnableStep("idle");
    setCreateError(undefined);
    setSignError(undefined);
    setEnableError(undefined);
    setCurrentSafeAddress(null);

    const createResult = await createSafeWallet(walletAddress);

    if (!createResult.success || !createResult.safeAddress) {
      setCreateStep("error");
      setCreateError(createResult.error || "Failed to create Safe wallet");
      return;
    }

    const newSafe = createResult.safeAddress;
    setCurrentSafeAddress(newSafe);
    setCreateStep("success");

    await handleSignStep(newSafe);
  }, [walletAddress, safeWallets, createSafeWallet, handleSignStep]);

  const handleRetryCreate = useCallback(async () => {
    if (!walletAddress) return;
    setCreateStep("pending");
    setCreateError(undefined);

    const createResult = await createSafeWallet(walletAddress);
    if (!createResult.success || !createResult.safeAddress) {
      setCreateStep("error");
      setCreateError(createResult.error || "Failed to create Safe wallet");
      return;
    }

    const newSafe = createResult.safeAddress;
    setCurrentSafeAddress(newSafe);
    setCreateStep("success");

    await handleSignStep(newSafe);
  }, [walletAddress, createSafeWallet, handleSignStep]);

  const handleRetrySign = useCallback(async () => {
    if (!currentSafeAddress) return;
    await handleSignStep(currentSafeAddress);
  }, [currentSafeAddress, handleSignStep]);

  const handleRetryEnable = useCallback(async () => {
    if (!currentSafeAddress) return;
    await handleEnableStep(currentSafeAddress);
  }, [currentSafeAddress, handleEnableStep]);

  const closeCreateFlow = useCallback(() => {
    setShowCreateFlow(false);
    if (selectedSafe) {
      setTimeout(async () => {
        await refreshModuleStatus();
      }, 1000);
    }
  }, [selectedSafe, refreshModuleStatus]);

  const openImportDialog = useCallback(() => {
    setShowImportDialog(true);
  }, []);

  const closeImportDialog = useCallback(() => {
    setShowImportDialog(false);
  }, []);

  const handleImportedSafe = useCallback(
    async (safeAddress: string) => {
      setSelectedSafe(safeAddress);
      await refetch();

      setTimeout(async () => {
        await refreshModuleStatus();
      }, 200);
    },
    [refetch, refreshModuleStatus]
  );

  const handleShowEnableDialog = useCallback(() => {
    setShowModuleActionDialog(true);
  }, []);

  const closeModuleActionDialog = useCallback(() => {
    setShowModuleActionDialog(false);
    if (selectedSafe) {
      setTimeout(async () => {
        await refreshModuleStatus();
      }, 1500);
    }
  }, [selectedSafe, refreshModuleStatus]);

  const handleEnableModule = useCallback(async () => {
    if (!selectedSafe || !chainId) return;

    setModuleSignStep("pending");
    setModuleExecuteStep("idle");
    setModuleSignError(undefined);
    setModuleExecuteError(undefined);
    setHasOngoingModuleProcess(true);

    try {
      // Pass chainId explicitly to ensure we sign on the correct chain
      const signResult = await signEnableModule(selectedSafe, chainId);
      if (!signResult.success) {
        setModuleSignStep("error");
        setModuleSignError(signResult.error || "Failed to sign transaction");
        setHasOngoingModuleProcess(false);
        return;
      }

      setModuleSignStep("success");

      if (signResult.data && !signResult.data.safeTxHash) {
        setModuleExecuteStep("success");
        setHasOngoingModuleProcess(false);
        setTimeout(() => {
          closeModuleActionDialog();
        }, 1000);
        return;
      }

      setModuleExecuteStep("pending");
      const submitResult = await submitEnableModule();
      if (!submitResult.success) {
        setModuleExecuteStep("error");
        setModuleExecuteError(submitResult.error || "Failed to enable module");
        setHasOngoingModuleProcess(false);
        return;
      }

      setModuleExecuteStep("success");

      // Verify module is actually enabled on-chain
      if (ethereumProvider) {
        try {
          const isEnabled = await verifyModuleEnabled(
            selectedSafe,
            chainId,
            ethereumProvider,
            5,
            2000
          );

          if (!isEnabled) {
            setModuleExecuteError("Module not verified on-chain");
          }
        } catch (verifyError) {
          console.error("Failed to verify module:", verifyError);
          // Don't fail the flow, just log it
        }
      }

      setHasOngoingModuleProcess(false);
      setTimeout(() => {
        closeModuleActionDialog();
      }, 2000);
    } catch (err) {
      setHasOngoingModuleProcess(false);
      throw err;
    }
  }, [
    selectedSafe,
    chainId,
    ethereumProvider,
    signEnableModule,
    submitEnableModule,
    closeModuleActionDialog,
  ]);

  const handleRetryModuleSign = useCallback(async () => {
    if (!selectedSafe || !chainId) return;

    setModuleSignStep("pending");
    setModuleSignError(undefined);
    setHasOngoingModuleProcess(true);

    try {
      // Pass chainId explicitly
      const signResult = await signEnableModule(selectedSafe, chainId);

      if (!signResult.success) {
        setModuleSignStep("error");
        setModuleSignError(signResult.error || "Failed to sign transaction");
        setHasOngoingModuleProcess(false);
        return;
      }

      setModuleSignStep("success");

      if (signResult.data && !signResult.data.safeTxHash) {
        setModuleExecuteStep("success");
        setHasOngoingModuleProcess(false);
        setTimeout(() => {
          closeModuleActionDialog();
        }, 1000);
        return;
      }

      setModuleExecuteStep("pending");
      const submitResult = await submitEnableModule();

      if (!submitResult.success) {
        setModuleExecuteStep("error");
        setModuleExecuteError(submitResult.error || "Failed to enable module");
        setHasOngoingModuleProcess(false);
        return;
      }

      setModuleExecuteStep("success");

      // Verify module is actually enabled on-chain
      if (ethereumProvider) {
        try {
          const isEnabled = await verifyModuleEnabled(
            selectedSafe,
            chainId,
            ethereumProvider,
            5,
            2000
          );

          if (!isEnabled) {
            setModuleExecuteError("Module not verified on-chain");
          }
        } catch (verifyError) {
          console.error("Failed to verify module:", verifyError);
        }
      }

      setHasOngoingModuleProcess(false);
      setTimeout(() => {
        closeModuleActionDialog();
      }, 2000);
    } catch (err) {
      setHasOngoingModuleProcess(false);
      throw err;
    }
  }, [
    selectedSafe,
    chainId,
    ethereumProvider,
    signEnableModule,
    submitEnableModule,
    closeModuleActionDialog,
  ]);

  const handleRetryModuleExecute = useCallback(async () => {
    if (!selectedSafe) return;

    setModuleExecuteStep("pending");
    setModuleExecuteError(undefined);
    setHasOngoingModuleProcess(true);

    try {
      const submitResult = await submitEnableModule();

      if (!submitResult.success) {
        setModuleExecuteStep("error");
        setModuleExecuteError(submitResult.error || "Failed to enable module");
        setHasOngoingModuleProcess(false);
        return;
      }

      setModuleExecuteStep("success");
      setHasOngoingModuleProcess(false);
      setTimeout(() => {
        closeModuleActionDialog();
      }, 2000);
    } catch (err) {
      setHasOngoingModuleProcess(false);
      throw err;
    }
  }, [selectedSafe, submitEnableModule, closeModuleActionDialog]);

  const handleManualModuleRefresh = useCallback(async () => {
    if (!selectedSafe) return;
    await refreshModuleStatus();
  }, [selectedSafe, refreshModuleStatus]);

  const selection = useMemo<SafeWalletSelection>(
    () => ({
      selectedSafe,
      safeWallets,
      isLoading,
      error,
      selectSafe,
      refreshSafeList: refetch,
      moduleEnabled,
      checkingModule,
      refreshModuleStatus,
    }),
    [
      selectedSafe,
      safeWallets,
      isLoading,
      error,
      selectSafe,
      refetch,
      moduleEnabled,
      checkingModule,
      refreshModuleStatus,
    ]
  );

  const creation = useMemo<SafeWalletCreation>(
    () => ({
      showCreateFlow,
      createStep,
      signStep,
      enableStep,
      createError,
      signError,
      enableError,
      currentSafeAddress,
      isCreating,
      isSigningEnableModule,
      isExecutingEnableModule,
      handleCreateNewSafe,
      handleRetryCreate,
      handleRetrySign,
      handleRetryEnable,
      closeCreateFlow,
    }),
    [
      showCreateFlow,
      createStep,
      signStep,
      enableStep,
      createError,
      signError,
      enableError,
      currentSafeAddress,
      isCreating,
      isSigningEnableModule,
      isExecutingEnableModule,
      handleCreateNewSafe,
      handleRetryCreate,
      handleRetrySign,
      handleRetryEnable,
      closeCreateFlow,
    ]
  );

  const importFlowSlice = useMemo<SafeWalletImportFlow>(
    () => ({
      showImportDialog,
      hasImportOngoingProcess,
      openImportDialog,
      closeImportDialog,
      handleImportedSafe,
      setHasImportOngoingProcess,
    }),
    [
      showImportDialog,
      hasImportOngoingProcess,
      openImportDialog,
      closeImportDialog,
      handleImportedSafe,
    ]
  );

  const moduleControlSlice = useMemo<SafeWalletModuleControl>(
    () => ({
      showModuleActionDialog,
      moduleSignStep,
      moduleExecuteStep,
      moduleSignError,
      moduleExecuteError,
      hasOngoingModuleProcess,
      handleShowEnableDialog,
      handleEnableModule,
      handleRetryModuleSign,
      handleRetryModuleExecute,
      handleManualModuleRefresh,
      closeModuleActionDialog,
    }),
    [
      showModuleActionDialog,
      moduleSignStep,
      moduleExecuteStep,
      moduleSignError,
      moduleExecuteError,
      hasOngoingModuleProcess,
      handleShowEnableDialog,
      handleEnableModule,
      handleRetryModuleSign,
      handleRetryModuleExecute,
      handleManualModuleRefresh,
      closeModuleActionDialog,
    ]
  );

  const contextValue = useMemo<SafeWalletContextType>(
    () => ({
      selection,
      creation,
      importFlow: importFlowSlice,
      moduleControl: moduleControlSlice,
    }),
    [selection, creation, importFlowSlice, moduleControlSlice]
  );

  return (
    <SafeWalletContext.Provider value={contextValue}>
      {children}
    </SafeWalletContext.Provider>
  );
};
