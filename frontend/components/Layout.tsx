/**
 * Layout Component - Refactored
 * Clean UI hierarchy with proper semantic structure
 */

"use client";

import { Container } from "@/components/ui";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 grid-background opacity-50 pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-float opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '-1.5s' }} />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Container size="2xl">
          {children}
        </Container>
      </div>
    </div>
  );
}
