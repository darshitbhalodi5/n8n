import { Zap } from "lucide-react";
import { Container, Stack } from "@/components/layout";
import { Typography } from "@/components/ui";

export function Footer() {
  return (
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
                FlowForge
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
  );
}

