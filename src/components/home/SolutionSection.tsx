import { Workflow, Boxes } from "lucide-react";
import { Container, Stack, Grid, Section } from "@/components/layout";
import { Typography } from "@/components/ui";
import { FeatureItem } from "./FeatureItem";

export function SolutionSection() {
  return (
    <Section padding="xl" id="features">
      <Container maxWidth="xl">
        <Stack direction="column" spacing="xl" align="center">
          <div className="text-center space-y-4">
            <Typography variant="h2">
              One Platform, Endless Possibilities
            </Typography>
            <Typography
              variant="lead"
              className="text-muted-foreground max-w-2xl"
            >
              Combine the power of n8n for Web2 automation with TriggerX for
              decentralized blockchain workflows
            </Typography>
          </div>

          <Grid columns={2} gap="xl" className="w-full pt-8">
            {/* Web2 - n8n */}
            <div className="bg-card border border-border rounded-xl p-8 space-y-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Workflow className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Typography variant="h3" className="mb-2">
                    Web2 Automation
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    className="text-muted-foreground"
                  >
                    Powered by n8n workflow engine
                  </Typography>
                </div>
              </div>
              <Stack direction="column" spacing="sm">
                <FeatureItem text="Connect to 400+ apps and services" />
                <FeatureItem text="REST APIs, webhooks, databases" />
                <FeatureItem text="Email automation and notifications" />
                <FeatureItem text="Data transformation and processing" />
                <FeatureItem text="Scheduled tasks and cron jobs" />
              </Stack>
            </div>

            {/* Web3 - TriggerX */}
            <div className="bg-card border border-border rounded-xl p-8 space-y-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Boxes className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <Typography variant="h3" className="mb-2">
                    Web3 Automation
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    className="text-muted-foreground"
                  >
                    Powered by TriggerX blockchain layer
                  </Typography>
                </div>
              </div>
              <Stack direction="column" spacing="sm">
                <FeatureItem text="Multi-chain smart contract execution" />
                <FeatureItem text="DeFi protocol automation" />
                <FeatureItem text="Governance and DAO actions" />
                <FeatureItem text="Token operations and NFTs" />
                <FeatureItem text="Secured by EigenLayer AVS" />
              </Stack>
            </div>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

