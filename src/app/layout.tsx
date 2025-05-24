import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import ProgressBar from "@/components/custom/ProgressBar/ProgressBar";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cubia",
  description: "Cubia - Modern Business Management Platform",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <Suspense fallback={null}>
          <ProgressBar />
          {/* <NProgressHandler /> */}
        </Suspense>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
