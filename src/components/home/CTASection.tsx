import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { Container, Stack, Section } from "@/components/layout";
import { Typography } from "@/components/ui";

export function CTASection() {
  return (
    <Section
      padding="xl"
      className="bg-linear-to-b from-background to-secondary/30"
    >
      <Container maxWidth="lg">
        <Stack
          direction="column"
          spacing="lg"
          align="center"
          className="text-center"
        >
          <Typography variant="h2">Ready to Automate Everything?</Typography>
          <Typography
            variant="lead"
            className="text-muted-foreground max-w-2xl"
          >
            Start building powerful workflows that connect Web2 and Web3. No
            coding required.
          </Typography>
          <Stack direction="row" spacing="md" className="pt-4">
            <Link href="/automation-builder">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                Try Workflow Builder <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href="https://triggerx.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Learn About TriggerX
              </Button>
            </a>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}

