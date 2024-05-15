'use client'

import { AdminProfile } from "@/app/admin/DTOs/AdminProfile.dto";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useEffect, useState } from "react";

export default function AdminProfileData() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          const response = await axios.get(SERVER_ADDRESS + "/admin/profile/get/data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data: AdminProfile = response.data;
          setUser(data);
          // Fetch image after user data is fetched
          const imageResponse = await axios.get(SERVER_ADDRESS + "/admin/profile/get/profilePicture", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob', // Set responseType to blob to handle binary data
          });
          // Create blob URL from the received image blob
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setImageSrc(imageUrl);
        } else {
          router.push('./../admin/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('./../admin/login');
      }
    };

    fetchUserData();
  }, [router]);


  if (user) {
    return (
      <>
        <div className="flex flex-col items-center">
          <div className="mb-10">
            {imageSrc && <img src={imageSrc} className="profilePic" alt="Profile Picture" />}
          </div>
          <table className="text-2xl">
            <tr>
              <td>ID</td>
              <td>:</td>
              <td className="font-bold">{user.userId}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>:</td>
              <td className="font-bold">{user.FullName}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>:</td>
              <td className="font-bold">{user.Email}</td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>:</td>
              <td className="font-bold">{format(new Date(user.DateOfBirth), 'MM/dd/yyyy')}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>:</td>
              <td className="font-bold">{user.Gender}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>:</td>
              <td className="font-bold">{user.Address}</td>
            </tr>
          </table>
        </div>
      </>
    );
  }
  else {
    return (<></>);
  }
}
