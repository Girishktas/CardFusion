import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CardFusion - Privacy-preserving Card Fusion System",
  description: "A dapp that allows players to fuse cards with encrypted attributes using FHEVM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <div className="fixed inset-0 w-full h-full bg-gray-100 z-[-20]"></div>
        <main className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}

