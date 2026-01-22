import Image from "next/image";

// Existing block logos
import telegram from "@/assets/blocks/Telegram.svg";
import mail from "@/assets/blocks/Mail.svg";
import wallet from "@/assets/blocks/Wallet.svg";
import slack from "@/assets/blocks/Slack.svg";
import start from "@/assets/blocks/Start.svg";
import ifElse from "@/assets/blocks/IfElse.svg";
import switchIcon from "@/assets/blocks/Switch.svg";
import uniswap from "@/assets/blocks/Uniswap.svg";
import relay from "@/assets/blocks/Relay.svg";
import oneinch from "@/assets/blocks/OneInch.svg";
import aave from "@/assets/blocks/Aave.svg";
import compound from "@/assets/blocks/Compound.svg";

// Coming Soon - Oracle
import chainlink from "@/assets/blocks/Chainlink.svg";
import pyth from "@/assets/blocks/Pyth.svg";

// Coming Soon - Yield
import yearn from "@/assets/blocks/Yearn.svg";
import beefy from "@/assets/blocks/Beefy.svg";

// Coming Soon - Bridges
import stargate from "@/assets/blocks/Stargate.svg";
import across from "@/assets/blocks/Across.svg";

// Coming Soon - Perpetuals
import gmx from "@/assets/blocks/GMX.svg";
import hyperliquid from "@/assets/blocks/Hyperliquid.svg";
import ostium from "@/assets/blocks/Ostium.svg";

// Coming Soon - Liquidity
import camelot from "@/assets/blocks/Camelot.svg";
import gamma from "@/assets/blocks/Gamma.svg";

// Coming Soon - Staking
import lido from "@/assets/blocks/Lido.svg";
import pendle from "@/assets/blocks/Pendle.svg";

// Coming Soon - Stablecoins
import frax from "@/assets/blocks/Frax.svg";
import radiant from "@/assets/blocks/Radiant.svg";

// Coming Soon - Gaming
import treasure from "@/assets/blocks/Treasure.svg";
import opensea from "@/assets/blocks/OpenSea.svg";

// Coming Soon - Governance
import snapshot from "@/assets/blocks/Snapshot.svg";
import tally from "@/assets/blocks/Tally.svg";

// Coming Soon - Analytics
import defillama from "@/assets/blocks/DefiLlama.svg";
import zapper from "@/assets/blocks/Zapper.svg";

// Coming Soon - Insurance
import nexusmutual from "@/assets/blocks/NexusMutual.svg";
import insurace from "@/assets/blocks/InsurAce.svg";

// AI Model logos
import qwen from "@/assets/blocks/Qwen.svg";
import glm from "@/assets/blocks/GLM.svg";
import deepseek from "@/assets/blocks/Deepseek.svg";
import chatgpt from "@/assets/blocks/ChatGPT.svg";

interface LogoProps {
  className?: string;
}

// Logo components mapping to SVG files from assets/blocks
// All logos are displayed at consistent compact size

// ====== EXISTING LOGOS ======

export const TelegramLogo = ({ className }: LogoProps) => (
  <Image
    src={telegram}
    alt="Telegram"
    className={className}
    width={32}
    height={32}
  />
);

export const MailLogo = ({ className }: LogoProps) => (
  <Image src={mail} alt="Mail" className={className} width={32} height={32} />
);

export const WalletLogo = ({ className }: LogoProps) => (
  <Image
    src={wallet}
    alt="Wallet"
    className={className}
    width={32}
    height={32}
  />
);

export const SlackLogo = ({ className }: LogoProps) => (
  <Image
    src={slack}
    alt="Slack"
    className={className}
    width={32}
    height={32}
  />
);

export const UniswapLogo = ({ className }: LogoProps) => (
  <Image
    src={uniswap}
    alt="Uniswap"
    className={className}
    width={32}
    height={32}
  />
);

export const RelayLogo = ({ className }: LogoProps) => (
  <Image
    src={relay}
    alt="Relay"
    className={className}
    width={32}
    height={32}
  />
);

export const OneInchLogo = ({ className }: LogoProps) => (
  <Image
    src={oneinch}
    alt="1inch"
    className={className}
    width={32}
    height={32}
  />
);

export const StartLogo = ({ className }: LogoProps) => (
  <Image src={start} alt="Start" className={className} width={32} height={32} />
);

export const IfElseLogo = ({ className }: LogoProps) => (
  <Image
    src={ifElse}
    alt="If/Else"
    className={className}
    width={32}
    height={32}
  />
);

export const SwitchLogo = ({ className }: LogoProps) => (
  <Image
    src={switchIcon}
    alt="Switch"
    className={className}
    width={32}
    height={32}
  />
);

export const AaveLogo = ({ className }: LogoProps) => (
  <Image
    src={aave}
    alt="Aave"
    className={className}
    width={32}
    height={32}
  />
);

export const CompoundLogo = ({ className }: LogoProps) => (
  <Image
    src={compound}
    alt="Compound"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - ORACLE ======

export const ChainlinkLogo = ({ className }: LogoProps) => (
  <Image
    src={chainlink}
    alt="Chainlink"
    className={className}
    width={32}
    height={32}
  />
);

export const PythLogo = ({ className }: LogoProps) => (
  <Image
    src={pyth}
    alt="Pyth Network"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - YIELD ======

export const YearnLogo = ({ className }: LogoProps) => (
  <Image
    src={yearn}
    alt="Yearn Finance"
    className={className}
    width={32}
    height={32}
  />
);

export const BeefyLogo = ({ className }: LogoProps) => (
  <Image
    src={beefy}
    alt="Beefy Finance"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - BRIDGES ======

export const StargateLogo = ({ className }: LogoProps) => (
  <Image
    src={stargate}
    alt="Stargate"
    className={className}
    width={32}
    height={32}
  />
);

export const AcrossLogo = ({ className }: LogoProps) => (
  <Image
    src={across}
    alt="Across Protocol"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - PERPETUALS ======

export const GMXLogo = ({ className }: LogoProps) => (
  <Image
    src={gmx}
    alt="GMX"
    className={className}
    width={32}
    height={32}
  />
);

export const HyperliquidLogo = ({ className }: LogoProps) => (
  <Image
    src={hyperliquid}
    alt="Hyperliquid"
    className={className}
    width={32}
    height={32}
  />
);

export const OstiumLogo = ({ className }: LogoProps) => (
  <Image
    src={ostium}
    alt="Ostium"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - LIQUIDITY ======

export const CamelotLogo = ({ className }: LogoProps) => (
  <Image
    src={camelot}
    alt="Camelot"
    className={className}
    width={32}
    height={32}
  />
);

export const GammaLogo = ({ className }: LogoProps) => (
  <Image
    src={gamma}
    alt="Gamma Strategies"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - STAKING ======

export const LidoLogo = ({ className }: LogoProps) => (
  <Image
    src={lido}
    alt="Lido"
    className={className}
    width={32}
    height={32}
  />
);

export const PendleLogo = ({ className }: LogoProps) => (
  <Image
    src={pendle}
    alt="Pendle"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - STABLECOINS ======

export const FraxLogo = ({ className }: LogoProps) => (
  <Image
    src={frax}
    alt="Frax Finance"
    className={className}
    width={32}
    height={32}
  />
);

export const RadiantLogo = ({ className }: LogoProps) => (
  <Image
    src={radiant}
    alt="Radiant Capital"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - GAMING ======

export const TreasureLogo = ({ className }: LogoProps) => (
  <Image
    src={treasure}
    alt="Treasure DAO"
    className={className}
    width={32}
    height={32}
  />
);

export const OpenSeaLogo = ({ className }: LogoProps) => (
  <Image
    src={opensea}
    alt="OpenSea"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - GOVERNANCE ======

export const SnapshotLogo = ({ className }: LogoProps) => (
  <Image
    src={snapshot}
    alt="Snapshot"
    className={className}
    width={32}
    height={32}
  />
);

export const TallyLogo = ({ className }: LogoProps) => (
  <Image
    src={tally}
    alt="Tally"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - ANALYTICS ======

export const DefiLlamaLogo = ({ className }: LogoProps) => (
  <Image
    src={defillama}
    alt="DefiLlama"
    className={className}
    width={32}
    height={32}
  />
);

export const ZapperLogo = ({ className }: LogoProps) => (
  <Image
    src={zapper}
    alt="Zapper"
    className={className}
    width={32}
    height={32}
  />
);

// ====== COMING SOON - INSURANCE ======

export const NexusMutualLogo = ({ className }: LogoProps) => (
  <Image
    src={nexusmutual}
    alt="Nexus Mutual"
    className={className}
    width={32}
    height={32}
  />
);

export const InsurAceLogo = ({ className }: LogoProps) => (
  <Image
    src={insurace}
    alt="InsurAce"
    className={className}
    width={32}
    height={32}
  />
);

export const ChatGPTLogo = ({ className }: LogoProps) => (
  <Image
    src={chatgpt}
    alt="ChatGPT"
    className={className}
    width={32}
    height={32}
  />
);

export const QwenLogo = ({ className }: LogoProps) => (
  <Image
    src={qwen}
    alt="Qwen"
    className={className}
    width={32}
    height={32}
  />
);

export const GLMLogo = ({ className }: LogoProps) => (
  <Image
    src={glm}
    alt="GLM"
    className={className}
    width={32}
    height={32}
  />
);

export const DeepSeekLogo = ({ className }: LogoProps) => (
  <Image
    src={deepseek}
    alt="DeepSeek"
    className={className}
    width={32}
    height={32}
  />
);