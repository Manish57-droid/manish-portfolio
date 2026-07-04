import { JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Manish Kushwaha — Full Stack Developer",
  description:
    "Portfolio of Manish Kushwaha, Full Stack Developer and AWS Certified Cloud Practitioner based in Ranchi, Jharkhand.",
  openGraph: {
    title: "Manish Kushwaha — Full Stack Developer",
    description:
      "Full Stack Developer & AWS Certified Cloud Practitioner based in Ranchi, Jharkhand.",
    url: "https://manish-portfolio-smoky.vercel.app",
    siteName: "Manish Kushwaha Portfolio",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Manish Kushwaha — Full Stack Developer",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manish Kushwaha — Full Stack Developer",
    description: "Full Stack Developer & AWS Certified Cloud Practitioner",
    images: ["/og"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${inter.variable}`}>
      <head>
        {/* ✅ PASTE YOUR ADSENSE SCRIPT HERE — from the AdSense page */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2821572625506761"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}