import { Container, Stack, Grid, Section } from "@/components/layout";
import { Typography } from "@/components/ui";
import { UseCaseCard } from "./UseCaseCard";

export function UseCasesSection() {
  return (
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
  );
}

