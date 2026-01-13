"use client";

import { Zap, ExternalLink, Workflow, Shield, Rocket, Book, HelpCircle, Mail, Github, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Container, Stack } from "@/components/layout";
import { Typography } from "@/components/ui";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const MotionLink = motion(Link);

const FooterLink = ({ 
  href, 
  children, 
  external = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  external?: boolean;
}) => {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const className = "group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300";

  if (external) {
    return (
      <motion.a
        href={href}
        {...linkProps}
        className={className}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.95 }}
      >
        <Typography variant="bodySmall" className="group-hover:underline flex items-center gap-1">
          {children}
        </Typography>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.a>
    );
  }

  return (
    <MotionLink
      href={href}
      className={className}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Typography variant="bodySmall" className="group-hover:underline flex items-center gap-1">
        {children}
      </Typography>
    </MotionLink>
  );
};

const FooterSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <motion.div variants={fadeInUp} className="min-w-[180px]">
    <Stack direction="column" spacing="md">
      <Typography variant="bodySmall" className="text-foreground font-semibold mb-1">
        {title}
      </Typography>
      <Stack direction="column" spacing="sm">
        {children}
      </Stack>
    </Stack>
  </motion.div>
);

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "0px" });

  return (
    <footer 
      ref={ref}
      className="relative border-t border-border bg-black overflow-hidden z-20"
    >
      {/* Animated background dot grid */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "radial-gradient(#6f6f6f 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent z-0" />

      <Container maxWidth="xl" className="relative z-10">
        <div className="py-20">
          {/* Main Footer Content */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 opacity-100"
            variants={staggerContainer}
            initial="visible"
            animate="visible"
          >
            {/* Brand Section */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <Stack direction="column" spacing="md">
                <Typography variant="h4" className="text-foreground bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                  FlowForge
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="text-muted-foreground max-w-sm leading-relaxed"
                >
                  The creative place for Web2 & Web3 automation. Connect everything. 
                  Automate anything. From APIs to blockchains, one powerful platform 
                  for all your automation needs.
                </Typography>
                <motion.a
                  href="https://triggerx.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-all duration-300 mt-2"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <Typography variant="bodySmall" className="group-hover:underline">
                    Powered by TriggerX Network
                  </Typography>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              </Stack>
            </motion.div>

            {/* Product */}
            <FooterSection title="Product">
              <FooterLink href="/automation-builder">
                <Workflow className="w-4 h-4 inline mr-1" />
                Workflow Builder
              </FooterLink>
              <FooterLink href="/automation-builder">
                <Rocket className="w-4 h-4 inline mr-1" />
                Try Demo
              </FooterLink>
              <FooterLink href="#features">
                <ArrowRight className="w-4 h-4 inline mr-1" />
                Features
              </FooterLink>
              <FooterLink href="#security">
                <Shield className="w-4 h-4 inline mr-1" />
                Security
              </FooterLink>
            </FooterSection>

            {/* Resources */}
            <FooterSection title="Resources">
              <FooterLink href="https://docs.triggerx.network" external>
                <Book className="w-4 h-4 inline mr-1" />
                Documentation
              </FooterLink>
              <FooterLink href="#">
                <HelpCircle className="w-4 h-4 inline mr-1" />
                Help Center
              </FooterLink>
              <FooterLink href="https://triggerx.network" external>
                <Zap className="w-4 h-4 inline mr-1" />
                About TriggerX
              </FooterLink>
              <FooterLink href="#">
                <Mail className="w-4 h-4 inline mr-1" />
                Contact Us
              </FooterLink>
            </FooterSection>

            {/* Company */}
            <FooterSection title="Company">
              <FooterLink href="#about">About</FooterLink>
              <FooterLink href="#blog">Blog</FooterLink>
              <FooterLink href="#careers">Careers</FooterLink>
              <FooterLink href="#partners">Partners</FooterLink>
            </FooterSection>
          </motion.div>

          {/* Social Links & Newsletter */}
          <motion.div 
            className="border-t border-border pt-8 pb-8"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "visible"}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Follow us:
                </Typography>
                <div className="flex items-center gap-4">
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <Typography variant="bodySmall">
                  Stay updated with our newsletter
                </Typography>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-border py-8"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "visible"}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Typography
                variant="caption"
                className="text-center md:text-left text-muted-foreground"
              >
                © 2025 FlowForge. All rights reserved.
              </Typography>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <FooterLink href="#privacy">Privacy Policy</FooterLink>
                <FooterLink href="#terms">Terms of Service</FooterLink>
                <FooterLink href="#cookies">Cookie Policy</FooterLink>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}

