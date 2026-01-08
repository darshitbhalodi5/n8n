"use client";

import { Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useEmailNode } from "@/hooks/useEmailNode";
import { EmailForm } from "./EmailForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface EmailNodeConfigurationProps {
  nodeData: Record<string, unknown>;
  handleDataChange: (updates: Record<string, unknown>) => void;
  authenticated: boolean;
  login: () => void;
}

/**
 * Email Node Configuration Component
 *
 * Flow:
 * 1. User configures recipient email, subject, and body
 * 2. User can send test email to verify configuration
 * 3. When workflow executes, email will be sent with configured parameters
 *
 * Features:
 * - Simple form with three fields (to, subject, body)
 * - Test email functionality
 * - Real-time validation
 * - Notification feedback
 */
function EmailNodeConfigurationInner({
  nodeData,
  handleDataChange,
  authenticated,
  login,
}: EmailNodeConfigurationProps) {
  const email = useEmailNode({
    nodeData,
    onDataChange: handleDataChange,
    authenticated,
  });

  // Show auth card if not authenticated
  if (!authenticated) {
    return (
      <Card className="p-6 space-y-4 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Typography variant="bodySmall" className="font-semibold">
              Authentication Required
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Please log in to configure email
            </Typography>
          </div>
        </div>
        <Button onClick={login} className="w-full">
          Log In
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Email Configuration Card */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <Typography
              variant="bodySmall"
              className="font-semibold text-foreground"
            >
              Email Configuration
            </Typography>
          </div>
        </div>

        {/* Email Form */}
        <EmailForm
          emailTo={email.emailTo}
          emailSubject={email.emailSubject}
          emailBody={email.emailBody}
          loading={email.loading.testing}
          onEmailToChange={email.actions.updateEmailTo}
          onEmailSubjectChange={email.actions.updateEmailSubject}
          onEmailBodyChange={email.actions.updateEmailBody}
          onSendTest={email.actions.sendTestEmail}
        />

        {/* Notification Banner */}
        {email.notification && (
          <div className="p-3 rounded-lg border border-border bg-secondary/20">
            <Typography variant="caption" className="text-foreground">
              {email.notification.message}
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
}

/**
 * Wrapped with ErrorBoundary for isolated error handling
 */
export function EmailNodeConfiguration(props: EmailNodeConfigurationProps) {
  return (
    <ErrorBoundary>
      <EmailNodeConfigurationInner {...props} />
    </ErrorBoundary>
  );
}
