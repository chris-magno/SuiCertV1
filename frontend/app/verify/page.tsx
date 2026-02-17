"use client";

import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Header } from "@/components/Header";
import { VerifyCertificate } from "@/components/VerifyCertificate";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <BackgroundEffects />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <VerifyCertificate />
        </main>
      </div>
    </div>
  );
}
