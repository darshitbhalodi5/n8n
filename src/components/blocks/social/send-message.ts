import type { BlockDefinition } from "../types";

/**
 * Send Message Block
 * Generic message sender block
 */
export const sendMessageBlock: BlockDefinition = {
  id: "send-message",
  label: "Send Message",
  iconName: "SendMessageLogo",
  description: "Generic message sender",
  category: "social",
  nodeType: "send-message",
  defaultData: {
    label: "Send Message",
    description: "Send a message",
    status: "idle" as const,
  },
};

export default sendMessageBlock;

