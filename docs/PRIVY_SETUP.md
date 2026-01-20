# Privy Integration Setup Guide

This guide explains how to configure Privy for email-based login and embedded wallets with gas sponsorship.

## Overview

Privy has been integrated into the application with:
- **Email Login**: Email-based authentication (no premium required)
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

1. Navigate to **User Management** - **Authentication** section in Privy Dashboard
2. Enable the following login method:
   - **Email** (Email/Password)
   
**Note**: Only email login is configured in this integration.

### 3.2 Configure Domains

1. Navigate to **Configuration** - **App Settings** - **Domains** section in Privy Dashboard
2. Add all the necessary domains for development & production
   
**Note**: Only email login is configured in this integration.

### 3.3 Configure Branding

1. Navigate to **Configuration** - **UI Components** - **Branding** section in Privy Dashboard
2. Add your App Name, CTA colors and logo URL

## Support

- **Privy Documentation**: https://docs.privy.io
- **Privy Dashboard**: https://dashboard.privy.io

