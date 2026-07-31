import type { Metadata, Viewport } from "next";
import { Sora, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Display headlines — Sora (geometric, confident, professional)
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Italic accent words — Fraunces (elegant high-contrast serif)
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Body / paragraphs — Inter (the professional body standard)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Labels, mono, HUD numbers — JetBrains Mono
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COZ COMPASS — Your GCC in India, Without the Setup",
  description:
    "COZ COMPASS gives global SMBs & SMEs a full Global Capability Center in India — built on a curated network of verified Indian providers and run by one accountable partner. Zero capital. Live in days, not months. 360° Soft Solutions across IT, Sales, Finance, HR, Supply Chain & R&D.",
  keywords: [
    "GCC",
    "Global Capability Center",
    "GCC as a service",
    "India",
    "SMB",
    "SME",
    "outsourcing",
    "soft solutions",
    "COZ COMPASS",
  ],
  openGraph: {
    title: "COZ COMPASS — Your GCC in India, Without the Setup",
    description:
      "A full Global Capability Center for global SMBs & SMEs — curated, verified, accountable. Zero capital. Live in days, not months.",
    type: "website",
  },
  // Bastion domain-ownership verification — proves control of this domain so Bastion may run
  // authorised active security testing against it. Renders <meta name="bastion-site-verification" …>.
  other: {
    "bastion-site-verification": "bstn_c80b2a5c04bbda01c9082e245f8016debba82eb7",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0C0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
