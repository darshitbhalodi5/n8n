"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { FormInput } from "@/components/ui/FormInput";

interface EmailFormProps {
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  loading: boolean;
  onEmailToChange: (value: string) => void;
  onEmailSubjectChange: (value: string) => void;
  onEmailBodyChange: (value: string) => void;
  onSendTest: () => Promise<void>;
}

export function EmailForm({
  emailTo,
  emailSubject,
  emailBody,
  loading,
  onEmailToChange,
  onEmailSubjectChange,
  onEmailBodyChange,
  onSendTest,
}: EmailFormProps) {
  return (
    <div className="space-y-4">
      {/* Recipient Email */}
      <FormInput
        label="Recipient Email"
        type="email"
        value={emailTo}
        onChange={(e) => onEmailToChange(e.target.value)}
        placeholder="recipient@example.com"
        disabled={loading}
        required
      />

      {/* Subject */}
      <FormInput
        label="Subject"
        type="text"
        value={emailSubject}
        onChange={(e) => onEmailSubjectChange(e.target.value)}
        placeholder="Email subject"
        disabled={loading}
        required
      />

      {/* Body */}
      <div className="space-y-2">
        <FormInput
          label="Message Body"
          as="textarea"
          textareaProps={{
            value: emailBody,
            onChange: (e) => onEmailBodyChange(e.target.value),
            placeholder: "Enter your email message here...",
            disabled: loading,
            rows: 6,
            className: "resize-none",
          }}
          required
        />
        <Typography variant="caption" className="text-muted-foreground">
          {emailBody.length} / 10000 characters
        </Typography>
      </div>

      {/* Send Test Button */}
      <Button
        onClick={onSendTest}
        disabled={loading || !emailTo || !emailSubject || !emailBody}
        className="w-full"
      >
        {loading ? (
          <>Sending Test...</>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </>
        )}
      </Button>
    </div>
  );
}
