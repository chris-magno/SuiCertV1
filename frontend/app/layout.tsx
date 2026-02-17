import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuiCert - The Internet of Verified Skills",
  description: "Soulbound credential system on Sui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
