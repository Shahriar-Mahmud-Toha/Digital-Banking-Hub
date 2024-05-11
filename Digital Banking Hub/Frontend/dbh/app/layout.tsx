import type { Metadata } from "next";
import Head from 'next/head'; // Import Head component
import Link from 'next/link'
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Final Lab Task 1",
  description: "Generated by nextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="Your description here" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Digital Banking Hub</title>
      </Head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
