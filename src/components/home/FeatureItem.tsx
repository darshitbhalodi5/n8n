import { Typography } from "@/components/ui";

export function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
      <Typography variant="bodySmall" className="text-foreground">
        {text}
      </Typography>
    </div>
  );
}

