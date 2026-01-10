"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  type: NotificationType;
  message: string;
  /** Optional title for the notification */
  title?: string;
}

interface NotificationBannerProps {
  /** The notification to display, or null to hide */
  notification: Notification | null;
  /** Called when the notification should be dismissed */
  onDismiss?: () => void;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Additional class name */
  className?: string;
  /** Auto-dismiss duration in ms (0 to disable) */
  autoDismissMs?: number;
}

const icons: Record<NotificationType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<
  NotificationType,
  { bg: string; text: string; icon: string }
> = {
  success: {
    bg: "bg-success/10 border-success/20",
    text: "text-success",
    icon: "text-success",
  },
  error: {
    bg: "bg-destructive/10 border-destructive/20",
    text: "text-destructive",
    icon: "text-destructive",
  },
  warning: {
    bg: "bg-warning/10 border-warning/20",
    text: "text-warning",
    icon: "text-warning",
  },
  info: {
    bg: "bg-primary/10 border-primary/20",
    text: "text-primary",
    icon: "text-primary",
  },
};

/**
 * NotificationBanner - Reusable notification display component
 *
 * Features:
 * - Multiple notification types (success, error, warning, info)
 * - Optional auto-dismiss
 * - Dismissible with button
 * - Accessible with role="status" or role="alert"
 * - Smooth animations
 */
export const NotificationBanner = React.memo(function NotificationBanner({
  notification,
  onDismiss,
  dismissible = false,
  className,
  autoDismissMs = 0,
}: NotificationBannerProps) {
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss effect
  useEffect(() => {
    if (notification && autoDismissMs > 0 && onDismiss) {
      dismissTimeoutRef.current = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);

      return () => {
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
        }
      };
    }
  }, [notification, autoDismissMs, onDismiss]);

  if (!notification) {
    return null;
  }

  const style = styles[notification.type];
  const Icon = icons[notification.type];
  const isError = notification.type === "error";

  return (
    <div
      className={cn(
        "flex items-start gap-2 p-3 rounded-lg border",
        "animate-in fade-in-0 slide-in-from-top-1 duration-200",
        style.bg,
        className
      )}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <Icon
        className={cn("w-4 h-4 mt-0.5 shrink-0", style.icon)}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className={cn("text-sm font-medium", style.text)}>
            {notification.title}
          </p>
        )}
        <p
          className={cn(
            "text-sm",
            notification.title ? "text-foreground" : style.text
          )}
        >
          {notification.message}
        </p>
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "p-1 rounded-md hover:bg-foreground/10 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
});

// ============ useNotification Hook ============

interface UseNotificationReturn {
  /** Current notification */
  notification: Notification | null;
  /** Show a notification */
  show: (type: NotificationType, message: string, title?: string) => void;
  /** Show success notification */
  success: (message: string, title?: string) => void;
  /** Show error notification */
  error: (message: string, title?: string) => void;
  /** Show warning notification */
  warning: (message: string, title?: string) => void;
  /** Show info notification */
  info: (message: string, title?: string) => void;
  /** Clear the notification */
  clear: () => void;
}

interface UseNotificationOptions {
  /** Default auto-dismiss duration in ms (0 to disable) */
  defaultDuration?: number;
  /** Duration overrides by type */
  durationByType?: Partial<Record<NotificationType, number>>;
}

const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

/**
 * useNotification - Hook for managing notification state
 */
export function useNotification(
  options: UseNotificationOptions = {}
): UseNotificationReturn {
  const { defaultDuration, durationByType = {} } = options;
  const [notification, setNotification] = React.useState<Notification | null>(
    null
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification(null);
  }, []);

  const show = React.useCallback(
    (type: NotificationType, message: string, title?: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setNotification({ type, message, title });

      // Set up auto-dismiss
      const duration =
        durationByType[type] ?? defaultDuration ?? DEFAULT_DURATIONS[type];
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          setNotification(null);
        }, duration);
      }
    },
    [defaultDuration, durationByType]
  );

  const success = React.useCallback(
    (message: string, title?: string) => show("success", message, title),
    [show]
  );

  const error = React.useCallback(
    (message: string, title?: string) => show("error", message, title),
    [show]
  );

  const warning = React.useCallback(
    (message: string, title?: string) => show("warning", message, title),
    [show]
  );

  const info = React.useCallback(
    (message: string, title?: string) => show("info", message, title),
    [show]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    notification,
    show,
    success,
    error,
    warning,
    info,
    clear,
  };
}
