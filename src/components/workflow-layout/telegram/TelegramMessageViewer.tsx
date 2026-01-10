"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Loader2, RefreshCw, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

interface TelegramMessage {
  updateId: number;
  messageId?: number;
  text?: string;
  from?: {
    id: number;
    firstName: string;
    username?: string;
  };
  date: number;
}

interface TelegramMessageViewerProps {
  /** Whether the viewer is open */
  isOpen: boolean;
  /** Messages to display */
  messages: TelegramMessage[];
  /** Loading state */
  isLoading: boolean;
  /** Called to close the viewer */
  onClose: () => void;
  /** Called to refresh messages */
  onRefresh: () => void;
}

/**
 * TelegramMessageViewer - Modal for viewing incoming Telegram messages
 *
 * Features:
 * - Modal dialog with proper accessibility
 * - Message list with sender info and timestamps
 * - Refresh functionality
 * - Empty state
 * - Focus management
 */
export const TelegramMessageViewer = React.memo(function TelegramMessageViewer({
  isOpen,
  messages,
  isLoading,
  onClose,
  onRefresh,
}: TelegramMessageViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Format timestamp to localized time
  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Focus management when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="w-5 h-5 text-primary"
              aria-hidden="true"
            />
            <DialogTitle className="text-base">Incoming Messages</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1 h-auto"
              aria-label="Refresh messages"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button
              ref={closeButtonRef}
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="p-1 h-auto"
              aria-label="Close message viewer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          role="log"
          aria-label="Message history"
          aria-live="polite"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare
                className="w-8 h-8 mx-auto mb-2 opacity-50"
                aria-hidden="true"
              />
              <Typography variant="caption">
                No messages received yet.
              </Typography>
              <Typography variant="caption" className="block mt-1">
                Messages appear here when sent to the connected chat.
              </Typography>
            </div>
          ) : (
            messages.map((msg) => (
              <article
                key={msg.updateId}
                className="p-3 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <Typography
                    variant="caption"
                    className="font-medium text-primary"
                  >
                    {msg.from?.firstName || "Unknown"}
                    {msg.from?.username && (
                      <span className="text-muted-foreground ml-1">
                        @{msg.from.username}
                      </span>
                    )}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    <time dateTime={new Date(msg.date * 1000).toISOString()}>
                      {formatTime(msg.date)}
                    </time>
                  </Typography>
                </div>
                <Typography variant="bodySmall" className="text-foreground">
                  {msg.text || "[No text]"}
                </Typography>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/20">
          <Typography
            variant="caption"
            className="text-muted-foreground text-center block"
          >
            {messages.length} message{messages.length !== 1 ? "s" : ""} • From
            webhook
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
});
