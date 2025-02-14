import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_PageView } from "@/components/gtm";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://educasm.com"),
  title: "Educasm - Tap into Curiosity",
  description:
    "Explore any topic you are curious about with the conversational AI-powered explanations tailored to your understanding.",
  openGraph: {
    title: "Educasm - Tap into Curiosity",
    description:
      "Explore any topic you are curious about with the conversational AI-powered explanations tailored to your understanding.",
    url: "https://educasm.com/",
    type: "website",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Educasm - Tap into Curiosity",
    description:
      "Explore any topic you are curious about with the conversational AI-powered explanations tailored to your understanding.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/logo-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white`}
      >
        <GoogleTagManager gtmId="GTM-KGSTMP74" />
        <GTM_PageView />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
