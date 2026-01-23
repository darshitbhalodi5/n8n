"use client";

import { useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
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
        ref={subjectRef as any}
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
          ref={bodyRef as any}
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
