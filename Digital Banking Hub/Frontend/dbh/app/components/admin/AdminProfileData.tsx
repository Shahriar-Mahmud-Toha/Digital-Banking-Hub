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

  const handleLogout = async () => {

    const responseForLogout = await axios.delete(SERVER_ADDRESS + "/admin/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (responseForLogout.status === 200 && responseForLogout.data.status=="1") {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      router.push('./../admin/login');
    }
    else {
      alert("Logout Failed !")
    }
  };

  if (user) {
    return (
      <>
        <button className="bg-gray-300 hover:bg-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleLogout}>
          Logout
        </button>
        <div>
          {user.FullName}
        </div>
        <div>
          {user.Email}
        </div>
        <div>
          {format(new Date(user.DateOfBirth), 'MM/dd/yyyy')}
        </div>
        <div>
          {user.Gender}
        </div>
        <div>
          {user.userId}
        </div>
        <div>
          {imageSrc && <img src={imageSrc} alt="Profile Picture" />}
        </div>
      </>
    );
  }
  else {
    return (<></>);
  }
}
