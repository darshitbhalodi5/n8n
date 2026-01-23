"use client";

import { Typography } from "@/components/ui/Typography";
import { useEmailNode } from "@/hooks/useEmailNode";
import { EmailForm } from "./EmailForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthenticationStatus } from "@/components/workflow/AuthenticationStatus";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { SimpleCard } from "@/components/ui/SimpleCard";
import { CheckCircle2, XCircle, Info } from "lucide-react";

interface EmailNodeConfigurationProps {
  nodeData: Record<string, unknown>;
  handleDataChange: (updates: Record<string, unknown>) => void;
}

function EmailNodeConfigurationInner({
  nodeData,
  handleDataChange,
}: EmailNodeConfigurationProps) {
  const { wallets } = useWallets();
  const { authenticated: privyAuthenticated } = usePrivy();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  const isConnected = privyAuthenticated && embeddedWallet !== undefined;

  const email = useEmailNode({
    nodeData,
    onDataChange: handleDataChange,
  });

  // Show auth status component if not authenticated
  if (!isConnected) {
    return <AuthenticationStatus />;
  }

  return (
    <SimpleCard className="space-y-4 p-5">
      <div className="space-y-1 mb-4">
        <Typography
          variant="h5"
          className="font-semibold text-foreground"
        >
          Email Configuration
        </Typography>
        <Typography
          variant="bodySmall"
          className="text-muted-foreground"
        >
          Configure email notifications for your workflow automation
        </Typography>
      </div>

      {/* Email Form */}
      <EmailForm
        emailTo={email.emailTo}
        emailSubject={email.emailSubject}
        emailBody={email.emailBody}
        loading={email.loading.testing}
        currentNodeId={(nodeData.id as string) || ""}
        onEmailToChange={email.actions.updateEmailTo}
        onEmailSubjectChange={email.actions.updateEmailSubject}
        onEmailBodyChange={email.actions.updateEmailBody}
        onSendTest={email.actions.sendTestEmail}
      />

      {/* Notification Banner */}
      {email.notification && (
        <div
          className="p-3 flex items-center gap-3 w-full justify-center"
        >
          {email.notification.type === "success" && (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {email.notification.type === "error" && (
            <XCircle className="w-4 h-4" />
          )}
          {email.notification.type === "info" && (
            <Info className="w-4 h-4" />
          )}
          <Typography
            variant="caption"
            className={`text-xs ${
              email.notification.type === "success"
                ? "text-success"
                : email.notification.type === "error"
                ? "text-destructive"
                : "text-primary"
            }`}
          >
            {email.notification.message}
          </Typography>
        </div>
      )}
    </SimpleCard>
  );
}

export function EmailNodeConfiguration(props: EmailNodeConfigurationProps) {
  return (
    <ErrorBoundary>
      <EmailNodeConfigurationInner {...props} />
    </ErrorBoundary>
  );
}
