import { createConfig, http } from "wagmi";
import {
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  arbitrum,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Configure wagmi with basic connectors (Privy handles wallet connection)
export const config = createConfig({
  chains: [baseSepolia, optimismSepolia, arbitrumSepolia, arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

