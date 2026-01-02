"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SafeWalletProvider } from "@/contexts/SafeWalletContext";
import { config } from "@/lib/wagmiConfig";
import { useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import {
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  arbitrum,
} from "wagmi/chains";

// Supported chains configuration
const supportedChains = [baseSepolia, optimismSepolia, arbitrumSepolia, arbitrum];

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
        defaultChain: baseSepolia,
        supportedChains: supportedChains,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <SafeWalletProvider>{children}</SafeWalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

