import type { Metadata } from "next";
import Head from 'next/head'; // Import Head component
import Link from 'next/link'
import "./globals.css"
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Digital Banking Hub",
  description: "Welcome Page",
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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
