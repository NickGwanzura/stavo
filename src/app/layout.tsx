import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";

const appFont = localFont({
  src: "./fonts/GeistVF.woff",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TSM Mobiles - Inventory & Sales Management",
  description:
    "TSM Mobiles inventory, sales and finance management",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TSM Mobiles",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZW">
      <head>
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className={`${appFont.className} antialiased`}>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
