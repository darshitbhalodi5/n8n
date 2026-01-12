import { Lock } from "lucide-react";
import { Container, Stack, Section } from "@/components/layout";
import { Typography } from "@/components/ui";
import { SecurityStat } from "./SecurityStat";

export function SecuritySection() {
  return (
    <Section padding="xl">
      <Container maxWidth="lg">
        <div className="bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12">
          <Stack
            direction="column"
            spacing="lg"
            align="center"
            className="text-center"
          >
            <Lock className="w-16 h-16 text-primary" />
            <Typography variant="h2">Enterprise-Grade Security</Typography>
            <Typography
              variant="body"
              className="max-w-2xl text-muted-foreground"
            >
              Web3 automation secured by TriggerX&apos;s EigenLayer AVS
              integration, providing Ethereum-level security with
              decentralized validation and fault-tolerant design.
            </Typography>
            <Stack direction="row" spacing="xl" className="pt-4">
              <SecurityStat number="Decentralized" label="Keeper Network" />
              <SecurityStat number="BLS" label="Signature Aggregation" />
              <SecurityStat number="Multi-Chain" label="Support" />
            </Stack>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}

