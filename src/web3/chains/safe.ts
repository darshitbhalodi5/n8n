/**
 * Safe chain configuration utilities.
 */

interface SafeChainInfo {
  readonly shortName: string | null;
  readonly transactionService: string | null;
}

interface SafeChain {
  chainId: string;
  shortName: string;
  transactionService: string;
}

interface SafeChainsResponse {
  next: string | null;
  results: SafeChain[];
}

// Static data for known chains - avoids network fetch for common cases
const KNOWN_SAFE_CHAINS: ReadonlyMap<number, SafeChainInfo> = new Map([
  [421614, { shortName: "arb-sep", transactionService: "https://safe-transaction-arbitrum-sepolia.safe.global" }],
  [42161, { shortName: "arb1", transactionService: "https://safe-transaction-arbitrum.safe.global" }],
]);

// Constant default (single allocation, reused)
const DEFAULT_CHAIN_INFO: SafeChainInfo = Object.freeze({
  shortName: null,
  transactionService: null,
});

const SAFE_CONFIG_BASE_URL = "https://safe-config.safe.global/api/v1/chains/";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Cache state
let safeChainCache: Map<number, SafeChainInfo> | null = null;
let cacheTimestamp = 0;
let fetchInProgress: Promise<Map<number, SafeChainInfo>> | null = null;

/**
 * Fetch chains from Safe API with pagination
 */
async function fetchSafeChains(): Promise<Map<number, SafeChainInfo>> {
  try {
    let nextUrl: string | null = SAFE_CONFIG_BASE_URL;
    const chainMap = new Map<number, SafeChainInfo>();

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Safe chains: ${response.status}`);
      }

      const data: SafeChainsResponse = await response.json();

      for (const chain of data.results) {
        const chainId = parseInt(chain.chainId, 10);
        if (isNaN(chainId)) continue;

        chainMap.set(chainId, {
          shortName: chain.shortName?.trim() || null,
          transactionService: chain.transactionService?.trim() || null,
        });
      }

      nextUrl = data.next;
    }

    return chainMap;
  } catch {
    // Return empty map on error, static fallback will be used
    return new Map();
  }
}

/**
 * Get Safe chain info with caching and static fallback.
 * Uses static data for known chains, fetches from API only when needed.
 */
export async function getSafeChainInfo(chainId: number): Promise<SafeChainInfo> {
  // Fast path: check static data first (no async needed)
  const staticInfo = KNOWN_SAFE_CHAINS.get(chainId);
  if (staticInfo) return staticInfo;

  const now = Date.now();
  const cacheValid = safeChainCache && (now - cacheTimestamp < CACHE_DURATION_MS);

  if (cacheValid) {
    return safeChainCache!.get(chainId) || DEFAULT_CHAIN_INFO;
  }

  // Deduplicate concurrent fetches
  if (!fetchInProgress) {
    fetchInProgress = fetchSafeChains().finally(() => {
      fetchInProgress = null;
    });
  }

  safeChainCache = await fetchInProgress;
  cacheTimestamp = Date.now();

  return safeChainCache.get(chainId) || DEFAULT_CHAIN_INFO;
}

/**
 * Get Safe short name for a chain
 */
export async function getSafeShortName(chainId: number): Promise<string | null> {
  const info = await getSafeChainInfo(chainId);
  return info.shortName;
}

/**
 * Build Safe web app URL
 */
export async function getSafeWebAppUrl(
  chainId: number,
  safeAddress: string
): Promise<string | null> {
  const shortName = await getSafeShortName(chainId);
  if (!shortName) return null;
  return `https://app.safe.global/home?safe=${shortName}:${safeAddress}`;
}

/**
 * Build Safe queue URL
 */
export async function getSafeQueueUrl(
  chainId: number,
  safeAddress: string
): Promise<string | null> {
  const shortName = await getSafeShortName(chainId);
  if (!shortName) return null;
  return `https://app.safe.global/transactions/queue?safe=${shortName}:${safeAddress}`;
}

/**
 * Clear cache (for testing)
 */
export function clearSafeChainCache(): void {
  safeChainCache = null;
  cacheTimestamp = 0;
  fetchInProgress = null;
}
