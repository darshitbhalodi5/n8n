"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SafeWalletProvider } from "@/contexts/SafeWalletContext";
import { config } from "@/lib/wagmiConfig";
import { useState } from "react";

const customTheme = darkTheme({
  accentColor: "#F8FF7C",
  accentColorForeground: "black",
  borderRadius: "large",
  overlayBlur: "small",
});

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

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider theme={customTheme}>
          <SafeWalletProvider>{children}</SafeWalletProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

