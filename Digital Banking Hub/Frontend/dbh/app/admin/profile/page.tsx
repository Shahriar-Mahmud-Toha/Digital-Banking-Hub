import AdminProfileData from "@/app/components/admin/AdminProfileData";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <>
      <AdminProfileData />
    </>
  );
}
