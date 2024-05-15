import type { Metadata } from "next";
import Link from 'next/link'
import "../../globals.css";
import AdminPrivateHeader from "@/app/components/admin/header_private_admin";

export const metadata: Metadata = {
  title: "DBH - Admin - Profile",
  description: "Digital Banking Hub - Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <AdminPrivateHeader />
      {children}
    </>
  );
}
