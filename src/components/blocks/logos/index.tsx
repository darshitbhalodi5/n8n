import Image from "next/image";
import telegram from "@/assets/blocks/Telegram.svg";
import mail from "@/assets/blocks/Mail.svg";
import wallet from "@/assets/blocks/Wallet.svg";
import sendMessage from "@/assets/blocks/SendMessage.svg";

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
  <Image
    src={mail}
    alt="Mail"
    className={className}
    width={32}
    height={32}
  />
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

export const SendMessageLogo = ({ className }: LogoProps) => (
  <Image
    src={sendMessage}
    alt="Send Message"
    className={className}
    width={32}
    height={32}
  />
);
