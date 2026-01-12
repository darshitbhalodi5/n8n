/**
 * UI Primitives - Generic, reusable UI components
 *
 * All components follow:
 * - Token-based styling (CSS variables)
 * - Accessible design patterns
 * - Consistent variant system via CVA
 * - No business logic
 */

export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
export type { CardProps } from "./Card";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./Dialog";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Label } from "./Label";
export type { LabelProps } from "./Label";

export { Skeleton } from "./Skeleton";

export { Textarea } from "./Textarea";
export type { TextareaProps } from "./Textarea";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./Tooltip";

export { Typography } from "./Typography";
export type { TypographyProps } from "./Typography";

export { Popover, PopoverTrigger, PopoverContent } from "./Popover";

export { FormField, FormInput, FormTextarea, FormSelect } from "./FormField";
export type {
  FormFieldProps,
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
  FormSelectOption,
} from "./FormField";

export { NotificationBanner, useNotification } from "./NotificationBanner";
export type { Notification, NotificationType } from "./NotificationBanner";

export {
  AuthenticationRequired,
  SlackAuthCard,
  TelegramAuthCard,
  EmailAuthCard,
} from "./AuthenticationRequired";
