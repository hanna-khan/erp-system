import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { AppProvider } from "@/hooks/use-app";
import { ToastProvider } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zendrock ERP — Textile Manufacturing Platform",
    template: "%s · Zendrock ERP",
  },
  description:
    "Enterprise textile ERP for spinning, weaving, dyeing, garments, inventory, quality, finance and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <AppProvider>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
