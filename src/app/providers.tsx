"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SafeWalletProvider } from "@/contexts/SafeWalletContext";
import { useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import {
  arbitrumSepolia,
  arbitrum,
} from "viem/chains";
import { LenisProvider } from "@/components/providers/LenisProvider";

// Supported chains configuration
const supportedChains = [arbitrumSepolia, arbitrum];

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside the component to prevent re-initialization
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  // Get Privy App ID from environment variable
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  return (
    <LenisProvider>
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ["email"],
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
          appearance: {
            theme: "dark",
            accentColor: "#F8FF7C",
          },
          defaultChain: arbitrum,
          supportedChains: supportedChains,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <SafeWalletProvider>{children}</SafeWalletProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </LenisProvider>
  );
}

