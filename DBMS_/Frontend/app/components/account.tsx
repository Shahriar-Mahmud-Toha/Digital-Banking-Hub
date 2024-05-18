"use client"

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Session from './session';
import { useRouter } from 'next/navigation';
import Logout from './logout';
import Link from 'next/link';

interface User {
  accountNumber: string;
  name:string;
 
}
export default function Ac() {

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const UserID = localStorage.getItem('userID');

  console.log("ACOOUNT ID"+UserID);
  const router = useRouter();
  if(!token){

    router.push('/signin');

  }
 
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/user/getAc/' + UserID, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response.data);
      
          // Assuming there's only one account per user
          const accountNumber = response.data[0]?.Accounts[0]?.accountNumber;
      
          if (accountNumber) {
            const modifiedUser: User = {
              accountNumber: accountNumber,
              name :  response.data[0]?.Accounts[0]?.name,
            };
            setUserData(modifiedUser);
          } else {
            console.error('Account number not found in the response.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      

    fetchData();
  }, []);

  if (!userData) {
    return <div></div>;
  }
  
  console.log("UUU"+userData);
  const Ac= localStorage.setItem('Ac',userData.accountNumber);


  return (
    <>
      <Session />

    </>
  );
}
