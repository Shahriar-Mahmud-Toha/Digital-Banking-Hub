import AdminProfileData from "@/app/components/admin/AdminProfileData";
import AttendanceReport from "@/app/components/admin/AttendanceReport";
import DailyTransactionData from "@/app/components/admin/DailyTransactionData";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  return (
    <>
      <DailyTransactionData />
      <AttendanceReport />
    </>
  );
}
