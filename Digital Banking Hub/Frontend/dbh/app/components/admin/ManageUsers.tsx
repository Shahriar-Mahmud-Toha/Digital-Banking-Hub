'use client';

import { UsersDetails } from "@/app/admin/DTOs/UsersDetails.dto";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { format } from 'date-fns';

export default function ManageUsers() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();
  const [usersData, setUsersData] = useState<UsersDetails[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  const fetchUsersData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('./../admin/login');
      return;
    }
    try {
      const response = await axios.get(SERVER_ADDRESS + "/admin/getDetails/allUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0;
      const data = response.data.data;
      if (response.status === 200 && !isEmptyObject(data)) {
        setUsersData(data);
        fetchProfilePictures(data, token);
      }
    } catch (error) {
      console.error('Error fetching Users data:', error);
      router.push('./../admin/login');
    }
  };

  const fetchProfilePictures = async (users: UsersDetails[], token: string) => {
    const imageUrlsTemp: { [key: string]: string } = {};
    await Promise.all(
      users.map(async (user) => {
        if (user.FileName) {
          try {
            const response = await axios.get(SERVER_ADDRESS + `/admin/profile/get/profilePicture/${user.FileName}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(response.data);
            imageUrlsTemp[user.userId] = imageUrl;
          } catch (error) {
            console.error('Error fetching profile picture:', error);
          }
        }
      })
    );
    setImageUrls(imageUrlsTemp);
  };

  useEffect(() => {
    fetchUsersData();
  }, [router]);

  // Fetch data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchUsersData, 10000); // 10 seconds in milliseconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="bg-gray-900 font-bold text-2xl p-3 text-center mt-12">
        <span>Users</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="table w-full text-2xl">
          <thead>
            <tr className="text-2xl font-bold">
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.FullName}</td>
                <td>{user.Email}</td>
                <td>{user.Gender}</td>
                <td>{format(new Date(user.DOB), 'MM/dd/yyyy')}</td>
                <td>{user.Phone}</td>
                <td>{user.Address}</td>
                <td>
                  {imageUrls[user.userId] ? (
                    <img
                      src={imageUrls[user.userId]}
                      alt="Profile Picture"
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    'Loading...'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
