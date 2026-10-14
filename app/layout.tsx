import type { Metadata } from "next";
import { Rajdhani, Outfit } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BUILD YOUR IPL XI | Spin a Season. Pick a Player.",
  description: "Draft your ultimate IPL fantasy playing XI from historical IPL squads from 2008 to 2025.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050811] text-white selection:bg-yellow-400 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
