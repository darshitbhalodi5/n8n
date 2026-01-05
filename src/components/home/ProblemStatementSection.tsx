import { Globe, Lock, Code2 } from "lucide-react";
import { Container, Stack, Grid, Section } from "@/components/layout";
import { Typography } from "@/components/ui";

export function ProblemStatementSection() {
  return (
    <Section padding="lg" className="bg-secondary/50">
      <Container maxWidth="lg">
        <Stack
          direction="column"
          spacing="lg"
          align="center"
          className="text-center"
        >
          <Typography variant="h2" className="text-warning">
            The Automation Challenge
          </Typography>
          <Grid columns={3} gap="lg" className="w-full">
            <Stack direction="column" spacing="sm" align="center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-warning" />
              </div>
              <Typography variant="h4">Fragmented Tools</Typography>
              <Typography
                variant="bodySmall"
                className="text-muted-foreground"
              >
                Separate platforms for Web2 APIs and Web3 blockchain tasks
              </Typography>
            </Stack>
            <Stack direction="column" spacing="sm" align="center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-warning" />
              </div>
              <Typography variant="h4">Complex Integration</Typography>
              <Typography
                variant="bodySmall"
                className="text-muted-foreground"
              >
                Building and maintaining custom scripts takes valuable time
              </Typography>
            </Stack>
            <Stack direction="column" spacing="sm" align="center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-warning" />
              </div>
              <Typography variant="h4">Security Risks</Typography>
              <Typography
                variant="bodySmall"
                className="text-muted-foreground"
              >
                Centralized solutions create single points of failure
              </Typography>
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

