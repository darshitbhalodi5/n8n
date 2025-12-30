import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Boxes,
  Workflow,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Container, Stack, Grid, Section } from "@/components/layout";
import { Typography } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Section padding="xl">
        <Container maxWidth="xl">
          <Stack
            direction="column"
            spacing="xl"
            align="center"
            className="text-center"
          >
            <div className="space-y-4">
              <Typography
                variant="h1"
                className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                Unified Automation
              </Typography>
              <Typography variant="h1" className="text-foreground">
                Web2 + Web3
              </Typography>
            </div>

            <Typography variant="lead" className="max-w-2xl">
              Connect everything. Automate anything. From APIs to blockchains,
              one powerful platform for all your automation needs.
            </Typography>

            <Stack direction="row" spacing="md" className="pt-4">
              <Link href="/demo">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Open Workflow Builder <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </Stack>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-8">
              <Workflow className="w-4 h-4 text-accent" />
              <span>Visual workflow builder • No code required • Secure</span>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Problem Statement */}
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

      {/* Solution */}
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

      {/* Use Cases */}
      <Section padding="lg" className="bg-secondary/30">
        <Container maxWidth="xl">
          <Stack direction="column" spacing="lg" align="center">
            <Typography variant="h2" className="text-center">
              Real-World Use Cases
            </Typography>
            <Grid columns={3} gap="lg" className="w-full">
              <UseCaseCard
                title="DeFi Trading Bot"
                description="Monitor prices via APIs, execute trades on-chain, send notifications"
                tags={["Web2", "Web3"]}
              />
              <UseCaseCard
                title="DAO Operations"
                description="Aggregate off-chain votes, trigger on-chain governance actions"
                tags={["Web2", "Web3"]}
              />
              <UseCaseCard
                title="NFT Marketplace"
                description="Process payments, mint NFTs, update inventory databases"
                tags={["Web2", "Web3"]}
              />
              <UseCaseCard
                title="Cross-Chain Bridge"
                description="Monitor multiple chains, coordinate transfers, verify confirmations"
                tags={["Web3"]}
              />
              <UseCaseCard
                title="Analytics Dashboard"
                description="Collect on-chain data, process metrics, update dashboards via API"
                tags={["Web2", "Web3"]}
              />
              <UseCaseCard
                title="Alert System"
                description="Watch smart contracts, trigger email/SMS alerts, log events"
                tags={["Web2", "Web3"]}
              />
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* Security */}
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

      {/* CTA */}
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
              <Link href="/demo">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <Container maxWidth="xl">
          <div className="py-12">
            <Stack
              direction="row"
              justify="between"
              align="center"
              className="flex-wrap gap-8"
            >
              <Stack direction="column" spacing="sm">
                <Typography variant="h4" className="text-foreground">
                  Unified Automation Platform
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="text-muted-foreground"
                >
                  Bridging Web2 and Web3 automation
                </Typography>
              </Stack>
              <Stack direction="column" spacing="sm" align="end">
                <a
                  href="https://triggerx.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <Typography variant="bodySmall">
                    Powered by TriggerX
                  </Typography>
                </a>
                <a
                  href="https://n8n.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Typography variant="bodySmall">Built with n8n</Typography>
                </a>
              </Stack>
            </Stack>
          </div>
          <div className="border-t border-border py-6">
            <Typography
              variant="caption"
              className="text-center text-muted-foreground block"
            >
              © 2025 All rights reserved. Web2 automation by n8n • Web3
              automation by TriggerX
            </Typography>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
      <Typography variant="bodySmall" className="text-foreground">
        {text}
      </Typography>
    </div>
  );
}

function UseCaseCard({
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

function SecurityStat({ number, label }: { number: string; label: string }) {
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
