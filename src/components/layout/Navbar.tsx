"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { Button, UserMenu } from "@/components/ui";
import { LogIn, } from "lucide-react";

export function Navbar() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              <span className="font-bold">FlowForge</span> by TriggerX ©
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Workflow Builder
            </Link>
          </div>

          {/* Login/Auth */}
          <div className="flex items-center gap-3">
            {ready && (
              <>
                {authenticated ? (
                  <UserMenu size="md" />
                ) : (
                  <Button size="sm" onClick={login} className="gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login / Sign Up</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

