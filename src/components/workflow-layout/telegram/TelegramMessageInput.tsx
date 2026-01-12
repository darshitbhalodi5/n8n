"use client";

import React from "react";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import type { TelegramConnection } from "@/types/telegram";

interface TelegramMessageInputProps {
  /** Selected connection for display */
  selectedConnection: TelegramConnection;
  /** Current message value */
  message: string;
  /** Loading state for sending */
  isSending: boolean;
  /** Step number for display */
  stepNumber?: number;
  /** Called when message changes */
  onMessageChange: (message: string) => void;
  /** Called to send preview message */
  onSendPreview: () => void;
  /** Called to open message viewer */
  onViewMessages: () => void;
}

/**
 * TelegramMessageInput - Message template configuration for Telegram
 *
 * Features:
 * - Message input with character display
 * - Preview send functionality
 * - View incoming messages button
 */
export const TelegramMessageInput = React.memo(function TelegramMessageInput({
  selectedConnection,
  message,
  isSending,
  stepNumber = 3,
  onMessageChange,
  onSendPreview,
  onViewMessages,
}: TelegramMessageInputProps) {
  const canSend = message.trim().length > 0 && !isSending;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Typography
          variant="bodySmall"
          className="font-semibold text-foreground"
        >
          {stepNumber}. Message Template
        </Typography>
        <Button
          size="sm"
          variant="outline"
          onClick={onViewMessages}
          className="gap-1"
        >
          <MessageSquare className="w-3 h-3" aria-hidden="true" />
          View Messages
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Sending to:{" "}
        <span className="font-medium text-foreground">
          {selectedConnection.chatTitle}
        </span>
      </div>

      <div className="space-y-2">
        <label htmlFor="telegram-message" className="sr-only">
          Telegram message template
        </label>
        <textarea
          id="telegram-message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Hello from FlowForge! 🚀"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          aria-describedby="telegram-message-hint"
        />
        <Typography
          id="telegram-message-hint"
          variant="caption"
          className="text-muted-foreground"
        >
          {message.length} characters
        </Typography>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onSendPreview}
        disabled={!canSend}
        className="w-full gap-2"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Preview
          </>
        )}
      </Button>
    </Card>
  );
});
