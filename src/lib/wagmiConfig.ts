import { createConfig, http } from "wagmi";
import {
  arbitrumSepolia,
  arbitrum,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Configure wagmi with basic connectors (Privy handles wallet connection)
export const config = createConfig({
  chains: [arbitrumSepolia, arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

