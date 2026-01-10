"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

export interface FormFieldProps {
  /** Field label */
  label: string;
  /** Optional field description/helper text */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional class for wrapper */
  className?: string;
  /** Child input element */
  children: React.ReactNode;
}

/**
 * FormField - Wrapper component for form inputs with consistent labeling
 * Provides proper accessibility with htmlFor associations
 */
export function FormField({
  label,
  description,
  required = false,
  error,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();

  // Type for form element props
  type FormElementProps = {
    id?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  };

  // Clone children to inject id if not present
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<FormElementProps>(child)) {
      const existingId = child.props.id;
      return React.cloneElement(child, {
        id: existingId || generatedId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error
          ? `${generatedId}-error`
          : description
          ? `${generatedId}-desc`
          : undefined,
      } as FormElementProps);
    }
    return child;
  });

  // Get the input ID from the first child, or use generated ID
  const firstChild = React.Children.toArray(children)[0];
  const inputId =
    React.isValidElement<FormElementProps>(firstChild) && firstChild.props.id
      ? firstChild.props.id
      : generatedId;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={inputId} className="block">
        <Typography variant="caption" className="text-muted-foreground mb-1">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Typography>
      </label>
      {enhancedChildren}
      {error && (
        <Typography
          id={`${generatedId}-error`}
          variant="caption"
          className="text-destructive"
          role="alert"
        >
          {error}
        </Typography>
      )}
      {description && !error && (
        <Typography
          id={`${generatedId}-desc`}
          variant="caption"
          className="text-muted-foreground"
        >
          {description}
        </Typography>
      )}
    </div>
  );
}

// ============ FormInput ============

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label: string;
  /** Optional field description/helper text */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
}

/**
 * FormInput - Input with integrated label and error handling
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      description,
      required,
      error,
      wrapperClassName,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        description={description}
        required={required}
        error={error}
        className={wrapperClassName}
      >
        <Input
          ref={ref}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
      </FormField>
    );
  }
);
FormInput.displayName = "FormInput";

// ============ FormTextarea ============

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field label */
  label: string;
  /** Optional field description/helper text */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Show character count */
  showCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
}

/**
 * FormTextarea - Textarea with integrated label, error handling, and optional character count
 */
export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      label,
      description,
      required,
      error,
      wrapperClassName,
      className,
      showCount,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const displayDescription =
      showCount && maxLength
        ? `${charCount} / ${maxLength} characters${
            description ? ` • ${description}` : ""
          }`
        : description;

    return (
      <FormField
        label={label}
        description={displayDescription}
        required={required}
        error={error}
        className={wrapperClassName}
      >
        <Textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
      </FormField>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// ============ FormSelect ============

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Field label */
  label: string;
  /** Options for the select */
  options: FormSelectOption[];
  /** Placeholder option text */
  placeholder?: string;
  /** Optional field description/helper text */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
}

/**
 * FormSelect - Select with integrated label and error handling
 */
export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      placeholder,
      description,
      required,
      error,
      wrapperClassName,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        description={description}
        required={required}
        error={error}
        className={wrapperClassName}
      >
        <select
          ref={ref}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive",
            className
          )}
          aria-label={label}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);
FormSelect.displayName = "FormSelect";
