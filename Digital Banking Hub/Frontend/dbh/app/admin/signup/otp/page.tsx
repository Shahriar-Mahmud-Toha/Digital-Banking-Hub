'use client'
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { AdminOTPSubmit } from "../../DTOs/AdminOTPSubmit.dto";

const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
export default function GetOTP() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminOTPSubmit>({
    email: '',
    otp: '',
  });

  useEffect(() => {
    const admin_email_temp = localStorage.getItem("admin_email_temp") ?? "";
    setFormData((prevData) => ({
      ...prevData,
      email: admin_email_temp,
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(SERVER_ADDRESS + "/admin/signup/otpSubmit", formData);
      if (response.status === 201 && response.data.status == "1") {
        router.push('./details');
      }
      else {
        alert("OTP verification Failed !");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <span className="text-3xl font-bold">OTP Verification</span>
        <form onSubmit={handleSubmit} method="post" className="mt-5">
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="otp" className="grow" placeholder="Enter otp" onChange={handleChange} />
          </label>

          <div className="flex flex-col items-center mt-10">
            <input type="submit" className="btn btn-success text-xl text-white font-bold" value="Submit" />
          </div>
          <div className="flex flex-col items-center mt-10">
            <Link href="../signup">Go Back</Link>
          </div>
        </form>
      </div>
    </>
  );
}
