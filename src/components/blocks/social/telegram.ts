import type { BlockDefinition } from "../types";

/**
 * Telegram Block
 * Allows sending messages via Telegram
 */
export const telegramBlock: BlockDefinition = {
  id: "telegram",
  label: "Telegram",
  iconName: "TelegramLogo",
  description: "Send messages via Telegram",
  category: "social",
  nodeType: "telegram",
  defaultData: {
    label: "Telegram",
    description: "Send Telegram message",
    status: "idle" as const,
  },
};

export default telegramBlock;

