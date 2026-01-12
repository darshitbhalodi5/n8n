import { Stack } from "@/components/layout";
import { Typography } from "@/components/ui";

export function SecurityStat({ number, label }: { number: string; label: string }) {
  return (
    <Stack direction="column" spacing="xs" align="center">
      <Typography variant="h3" className="text-primary">
        {number}
      </Typography>
      <Typography variant="caption" className="text-muted-foreground">
        {label}
      </Typography>
    </Stack>
  );
}

