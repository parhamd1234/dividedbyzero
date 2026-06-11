import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Divided by Zero — Unlocking the Field Mechanics",
  description:
    "Something is being built at the edges of what's possible. Unlocking the field mechanics — coming soon.",
  metadataBase: new URL("https://dividedbyzero.ca"),
  openGraph: {
    title: "Divided by Zero",
    description: "Unlocking the field mechanics. Coming soon.",
    url: "https://dividedbyzero.ca",
    siteName: "Divided by Zero",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
