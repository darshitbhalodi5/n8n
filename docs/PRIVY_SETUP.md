# Privy Integration Setup Guide

This guide explains how to configure Privy for email-based login and embedded wallets with gas sponsorship.

## Overview

Privy has been integrated into the application with:
- **Email Login**: Email-based authentication (no premium required)
- **Embedded Wallets**: ERC-4337 compatible smart wallets
- **Gas Sponsorship**: Automatic gas fee sponsorship for TriggerX registry transactions
- **Network Support**: Configured to use Arbitrum Sepolia and Arbitrum mainnet

## Step 1: Get Your Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Sign up or log in
3. Create a new app or select an existing one
4. Copy your **App ID** from the dashboard

## Step 2: Configure Environment Variables

Add privy app id as an environment variable.

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here                           
```

## Step 3: Configure Privy Dashboard

### 3.1 Enable Authentication Methods

1. Navigate to **Authentication** section in Privy Dashboard
2. Enable the following login method:
   - ✅ **Email** (Email/Password)
   
**Note**: Google/OAuth login requires a premium plan, so only email login is configured in this integration.

### 3.2 Configure Embedded Wallets

1. Navigate to **Wallets** section
2. Enable **Embedded Wallets**
3. Configure wallet settings:
   - **Create on login**: Select "Users without wallets" (or your preference)
   - **Require user password**: Set to `false` for better UX
   - **Wallet type**: ERC-4337 compatible (default)

### 3.3 Configure Supported Networks

1. Navigate to **Networks** section
2. Ensure the following networks are enabled:
   - **Arbitrum Sepolia** (Chain ID: 421614)
   - **Arbitrum** (Chain ID: 42161)

### 3.4 Set Default Chain

1. In **Networks** section, set **Arbitrum Mainnet** as the default chain (or your preferred default)
2. This ensures users connect to the correct network by default

## Step 4: Configure Gas Sponsorship Policy

### 4.1 Enable Gas Sponsorship

1. Navigate to **Gas Sponsorship** tab in Privy Dashboard
2. Enable gas sponsorship for your app
3. Select your preferred network(s) from the supported chains (Arbitrum Sepolia or Arbitrum)

### 4.2 Create Sponsorship Policy

Create a policy that sponsors transactions to the TriggerX registry:

1. Click **Create Policy** or **New Policy**
2. Configure the policy:
   - **Policy Name**: `TriggerX Registry Deposits`
   - **Network**: Arbitrum Sepolia (or your preferred network from supported chains)
   - **Conditions**:
     - **Recipient Address**: `TRIGGERX_REGISTRY_ADDRESS` (replace with actual address)
     - **Max Gas Price**: Set appropriate limit (e.g., 20 gwei)
     - **Max Transaction Value**: Set limit if needed
   - **Status**: Active

3. Save the policy and note the **Policy ID**

### 4.3 Policy Configuration Example

```json
{
  "name": "TriggerX Registry Deposits",
  "network": "arbitrum-sepolia",
  "chainId": 421614,
  "conditions": {
    "to": "0x...TRIGGERX_REGISTRY_ADDRESS",
    "maxGasPrice": "20000000000",
    "maxValue": "1000000000000000000"
  },
  "active": true
}
```

**Note**: Adjust the `network` and `chainId` based on which chain you're deploying to (Arbitrum Sepolia or Arbitrum).

**Important**: Replace `TRIGGERX_REGISTRY_ADDRESS` with your actual TriggerX registry contract address.

## Step 5: Verify Integration

### 5.1 Test Login

1. Start your development server: `yarn dev`
2. Navigate to `/automation-builder` page
3. Click **"Login with Privy"** button
4. Test Email login method
5. Verify wallet address is displayed after login

### 5.2 Test Wallet Access

After logging in, verify:
- ✅ Wallet address is displayed in the header
- ✅ Wallet is connected to the default chain (Arbitrum Mainnet)
- ✅ Embedded wallet is created automatically

### 5.3 Test Sponsored Transaction

Use the `usePrivyWallet` hook to send a test transaction:

```tsx
import { usePrivyWallet } from "@/hooks/usePrivyWallet";

function MyComponent() {
  const { sendSponsoredTransaction, calculateGasFees } = usePrivyWallet();

  const handleCreateJob = async () => {
    const fees = calculateGasFees("medium");
    const result = await sendSponsoredTransaction(
      "TRIGGERX_REGISTRY_ADDRESS", // Replace with actual address
      fees
    );

    if (result.success) {
      console.log("Transaction hash:", result.txHash);
    } else {
      console.error("Transaction failed:", result.error);
    }
  };

  return <button onClick={handleCreateJob}>Create TriggerX Job</button>;
}
```

## Step 6: Production Deployment

### 6.1 Update Environment Variables

For production, update your environment variables:
- Use production Privy App ID
- Ensure `.env.local` is not committed to git (add to `.gitignore`)

### 6.2 Update Network Configuration

If deploying to mainnet:
- Update chain IDs to mainnet versions (e.g., Base, Optimism, Arbitrum mainnets)
- Update RPC URLs to mainnet endpoints
- Update block explorer URLs
- Update native currency symbols if needed

### 6.3 Update Sponsorship Policy

- Create a new policy for production network
- Update TriggerX registry address to production contract
- Adjust gas limits for mainnet

## Code Structure

### Files Modified

1. **`src/app/providers.tsx`**
   - Added `PrivyProvider` wrapper
   - Configured to use Arbitrum Sepolia and Arbitrum mainnet
   - Enabled embedded wallets and social logins

2. **`src/app/automation-builder/page.tsx`**
   - Added Privy login/logout button
   - Display wallet address when authenticated
   - Integrated `usePrivy` hook

### Files Created

1. **`src/hooks/usePrivyWallet.ts`**
   - Utility hook for wallet interactions
   - `sendSponsoredTransaction()` - Send sponsored transactions
   - `calculateGasFees()` - Calculate gas fees for jobs

## Usage Examples

### Basic Login/Logout

```tsx
import { usePrivy } from "@privy-io/react-auth";

function MyComponent() {
  const { authenticated, login, logout, wallet } = usePrivy();

  if (!authenticated) {
    return <button onClick={login}>Login</button>;
  }

  return (
    <div>
      <p>Wallet: {wallet?.address}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Send Sponsored Transaction

```tsx
import { usePrivyWallet } from "@/hooks/usePrivyWallet";

function TriggerXJobCreator() {
  const { sendSponsoredTransaction, calculateGasFees, authenticated } =
    usePrivyWallet();

  const handleSubmit = async () => {
    if (!authenticated) {
      alert("Please login first");
      return;
    }

    // Calculate fees based on job complexity
    const fees = calculateGasFees("medium");

    // Send sponsored transaction to TriggerX registry
    const result = await sendSponsoredTransaction(
      "0x...TRIGGERX_REGISTRY_ADDRESS",
      fees
    );

    if (result.success) {
      console.log("Job created! TX:", result.txHash);
    }
  };

  return <button onClick={handleSubmit}>Create Job</button>;
}
```

## Troubleshooting

### Wallet Not Appearing

- Check that `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
- Verify Privy Dashboard configuration
- Check browser console for errors

### Transactions Not Sponsored

- Verify gas sponsorship policy is active in Privy Dashboard
- Check policy conditions match transaction parameters
- Ensure policy is configured for the correct network (Arbitrum Sepolia or Arbitrum)
- Verify TriggerX registry address matches policy recipient

### Network Not Available

- Ensure the network is enabled in Privy Dashboard
- Verify the chain ID matches your configuration
- Contact Privy support if a network is missing from their supported list

## Support

- **Privy Documentation**: https://docs.privy.io
- **Privy Dashboard**: https://dashboard.privy.io

## Notes

- Wagmi and RainbowKit have been removed from the project
- The application now uses Privy embedded wallets exclusively for Web3 interactions
- Chain ID and wallet address are obtained directly from Privy's embedded wallet provider
- Gas sponsorship is handled automatically by Privy based on your policy configuration
- All Web3 hooks have been refactored to use `usePrivyEmbeddedWallet` instead of wagmi hooks

