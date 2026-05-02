import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Rentiff — Trust between tenants and landlords",
  description:
    "Tenants represent themselves with verified facts, not paperwork. Landlords skip the chasing — every application arrives complete and ready to evaluate.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("dark", sans.variable, fraunces.variable)}
    >
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
