import Image from "next/image";
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

interface LogoProps {
  className?: string;
}

// Logo components mapping to SVG files from assets/blocks
// All logos are displayed at consistent compact size

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

// export const SwapLogo = ({ className }: LogoProps) => (
//   <Image
//     src={swap}
//     alt="Swap"
//     className={className}
//     width={32}
//     height={32}
//   />
// );

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