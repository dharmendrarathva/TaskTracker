import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ErrorProvider } from "@/providers/ErrorProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Tracker – Study Planner SaaS",
  description: "Build consistency & track daily progress.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ErrorProvider>
          <ToastProvider>

            <Providers session={session}>
              <Header />

              <main className="min-h-screen pt-18">
                {children}
              </main>

              <Footer />
            </Providers>
          </ToastProvider>

        </ErrorProvider>
      </body>
    </html>
  );
}