"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui";
import { LogIn, Menu, X, Rocket } from "lucide-react";
import { UserMenu } from "../user-menu";
import { Container } from "./Container";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/ui";

export function Navbar() {
  const { ready, authenticated, login } = usePrivy();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Show navbar only when in hero section (first viewport)
      setIsVisible(scrollY < viewportHeight);
      setScrolled(scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-card/90 backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: scrolled
            ? "linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%)"
            : "transparent",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: scrolled
            ? ["0% 50%", "100% 50%", "0% 50%"]
            : "0% 50%",
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated border line with glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full w-full bg-linear-to-r from-transparent via-primary/50 to-transparent blur-sm" />
        <div className="h-full w-full bg-linear-to-r from-transparent via-accent/50 to-transparent absolute top-0" />
      </motion.div>

      <Container maxWidth="xl">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Left Side */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0"
          >
            <Link href="/" className="group relative">
              <motion.div className="relative" whileHover={{ x: 2 }}>
                <Typography
                  variant="h4"
                  className="text-white font-bold text-xl md:text-2xl relative"
                >
                  FlowForge
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Typography>
                {/* Glow effect on hover */}
                <motion.div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right Side - Navigation & Button */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Start Creating Button - Unique Shape */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden sm:block"
            >
              <Link href="/demo" className="block">
                <motion.button
                  className="group relative px-6 py-3 font-semibold text-sm overflow-hidden rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Rounded Button Background */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #f97316 0%, #fb923c 50%, #f97316 100%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Animated border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        filter: "blur(8px)",
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="absolute inset-0 bg-orange-500 opacity-50 rounded-full" />
                    </motion.div>
                  </motion.div>

                  {/* Geometric pattern overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Animated particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-orange-500 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: "50%",
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  {/* Content */}
                  <motion.div
                    className="relative z-10 flex items-center gap-2 text-white"
                    whileHover={{ x: 2 }}
                  >
                    <Rocket className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative font-semibold">
                      Start Creating
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </motion.div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    style={{
                      filter: "blur(12px)",
                    }}
                  >
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
            {/* Login/Auth Button */}
            {ready && (
              <>
                {authenticated ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <UserMenu size="md" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.button
                      onClick={login}
                      className="group relative px-6 py-3 font-semibold text-sm overflow-hidden rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Rounded Button Background */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                      >
                        {/* Animated gradient background */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "linear-gradient(90deg, #f97316 0%, #fb923c 50%, #f97316 100%)",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        {/* Animated border glow */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            filter: "blur(8px)",
                          }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="absolute inset-0 bg-orange-500 opacity-50 rounded-full" />
                        </motion.div>
                      </motion.div>

                      {/* Geometric pattern overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)",
                        }}
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Animated particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-orange-500 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: "50%",
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5, 0.5],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                          }}
                        />
                      ))}

                      {/* Content */}
                      <motion.div
                        className="relative z-10 flex items-center gap-2 text-white"
                        whileHover={{ x: 2 }}
                      >
                        <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative font-semibold">
                          <span className="hidden sm:inline">Login / Sign Up</span>
                          <span className="sm:hidden">Login</span>
                          <motion.span
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </span>
                      </motion.div>

                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                        style={{
                          filter: "blur(12px)",
                        }}
                      >
                        <div className="absolute inset-0 bg-orange-500/30 rounded-full" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden border-t border-border/50 mt-2"
            >
              <div className="py-4 space-y-2">
                {/* Start Creating Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    href="/demo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 mx-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-300 group"
                  >
                    <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Start Creating</span>
                  </Link>
                </motion.div>
                {ready && !authenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="px-4 pt-2"
                  >
                    <Button
                      onClick={() => {
                        login();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full gap-2 shadow-lg shadow-primary/20"
                    >
                      <LogIn className="w-4 h-4" />
                      Login / Sign Up
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.nav>
  );
}
