import type { Metadata } from "next";
import Link from 'next/link'
import AdminHeader from "../../components/admin/header_admin";
import "../../globals.css";

export const metadata: Metadata = {
  title: "DBH - Admin - Login",
  description: "Digital Banking Hub - Admin Login page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
