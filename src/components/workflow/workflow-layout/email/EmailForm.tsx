"use client";

import { useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TemplateFieldSelector } from "../shared/TemplateFieldSelector";

interface EmailFormProps {
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  loading: boolean;
  currentNodeId: string;
  onEmailToChange: (value: string) => void;
  onEmailSubjectChange: (value: string) => void;
  onEmailBodyChange: (value: string) => void;
  onSendTest: () => Promise<void>;
}

/**
 * Email Form Component
 * Form for configuring email parameters (recipient, subject, body)
 */
export function EmailForm({
  emailTo,
  emailSubject,
  emailBody,
  loading,
  currentNodeId,
  onEmailToChange,
  onEmailSubjectChange,
  onEmailBodyChange,
  onSendTest,
}: EmailFormProps) {
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insertIntoField = (
    field: "subject" | "body",
    placeholder: string
  ) => {
    const ref = field === "subject" ? subjectRef : bodyRef;
    const currentValue = field === "subject" ? emailSubject : emailBody;
    const onChange = field === "subject" ? onEmailSubjectChange : onEmailBodyChange;

    if (ref.current) {
      const input = ref.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = 
        currentValue.substring(0, start) + 
        placeholder + 
        currentValue.substring(end);
      onChange(newValue);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    } else {
      onChange(currentValue + placeholder);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template Field Selector */}
      <TemplateFieldSelector
        currentNodeId={currentNodeId}
        onInsertField={(placeholder) => {
          // Default to body if no specific field is focused
          insertIntoField("body", placeholder);
        }}
      />

      {/* Recipient Email */}
      <div className="space-y-2">
        <label className="block">
          <Typography variant="caption" className="text-muted-foreground mb-1">
            Recipient Email <span className="text-destructive">*</span>
          </Typography>
          <Input
            type="email"
            value={emailTo}
            onChange={(e) => onEmailToChange(e.target.value)}
            placeholder="recipient@example.com"
            disabled={loading}
            className="w-full"
          />
        </label>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="block">
          <Typography variant="caption" className="text-muted-foreground mb-1">
            Subject <span className="text-destructive">*</span>
          </Typography>
          <Input
            ref={subjectRef}
            type="text"
            value={emailSubject}
            onChange={(e) => onEmailSubjectChange(e.target.value)}
            placeholder="Email subject. Use field selector above to insert dynamic values."
            disabled={loading}
            className="w-full"
          />
        </label>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label className="block">
          <Typography variant="caption" className="text-muted-foreground mb-1">
            Message Body <span className="text-destructive">*</span>
          </Typography>
          <Textarea
            ref={bodyRef}
            value={emailBody}
            onChange={(e) => onEmailBodyChange(e.target.value)}
            placeholder="Enter your email message here... Use field selector above to insert dynamic values."
            disabled={loading}
            rows={6}
            className="w-full resize-none"
          />
          <Typography variant="caption" className="text-muted-foreground mt-1">
            {emailBody.length} / 10000 characters
          </Typography>
        </label>
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
