import type { BlockDefinition } from "../types";

/**
 * Slack Block
 * Allows sending messages via Slack
 */
export const slackBlock: BlockDefinition = {
  id: "slack",
  label: "Slack",
  iconName: "SlackLogo",
  description: "Send messages via Slack",
  category: "social",
  nodeType: "slack",
  defaultData: {
    label: "Slack",
    description: "Send Slack message",
    status: "idle" as const,
  },
};

export default slackBlock;

