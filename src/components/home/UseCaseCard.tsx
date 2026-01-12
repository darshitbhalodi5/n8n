import { Stack } from "@/components/layout";
import { Typography } from "@/components/ui";

export function UseCaseCard({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-primary/30 transition-colors">
      <Typography variant="h4">{title}</Typography>
      <Typography variant="bodySmall" className="text-muted-foreground">
        {description}
      </Typography>
      <Stack direction="row" spacing="xs">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent"
          >
            {tag}
          </span>
        ))}
      </Stack>
    </div>
  );
}

