"use client"

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Session from '../components/session';
import { useRouter } from 'next/navigation';
import Logout from '../components/logout';
import Link from 'next/link';
import Account from '../account/page';
import Ac from '../components/account';
import SideBar from '../components/sideBar';
import UpdateProfile from '../updateProfile/page';

interface User {
  name: string;
  email: string;
  address: string;
  filename: string;
  userId: string;
  phone: string;
}
export default function Dashboard(props:any) {

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const UUU = localStorage.getItem('userID');
  const AcNo = localStorage.getItem('Ac');
         // localStorage.setItem('userID', formData.);


         console.log("DashBoard Session "+AcNo);

  const router = useRouter();
  if(!token){
    router.push('/signin');

  }


 
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/getusers/'+email, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("DATA DASHBOARD"+response.data.users)
        const userID = localStorage.setItem('userID',response.data.users.userId );

        const modifiedUser: User = {
          name: response.data.users.name,
          filename: response.data.users.filename,
          email: response.data.email,
          address: response.data.users.address,
          userId: response.data.users.userId,
          phone: response.data.users.phone

          
        };

        console.log("MODI"+modifiedUser.userId);

        
        setUserData(modifiedUser);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  

  if (!userData) {
    return <div></div>;
  }

  return (
    
    <>
    <html data-theme="autumn"></html>
    {/* <html data-theme="lemonade"></html> */}
    {/* <html data-theme="aqua"></html> */}

      <Session />
      <Ac/>
     
<div className="flex justify-between items-center navbar bg-base-100 p-4">
  
  <div className="flex-1">
  <SideBar/>

  </div>
  <div className="flex-1">

    <a className="btn btn-ghost text-xl" >Home</a>
  </div>

  <div className="flex-1">
    <a href="/service" className="btn btn-ghost text-xl">Service</a>
  </div>
  <div className="flex-1">
    <a href="/updateProfile" className="btn btn-ghost text-xl">Update Profile</a>
  </div>



  <div className="flex-none gap-2 relative">
    <div className="dropdown dropdown-end">
    <button tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={`http://localhost:3001/user/profile-picture/${userData.userId}`} alt="User Profile" />
        </div>
      </button>
      <ul tabIndex={0} className="absolute right-0 mt-3 z-10 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li><a href='/account' className="flex items-center justify-between py-2 px-4 hover:bg-gray-100">Account Info</a></li>
        <li><a href='' className="flex items-center justify-between py-2 px-4 hover:bg-gray-100">Settings</a></li>
        <li>
          <button className="bg-gray-10 hover:bg-gray-50 text-base font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
               <Logout/>

          </button>
        </li>
      </ul>

    </div>
  </div>

</div>


<div className='text-black'>

<div className="flex justify-center items-center h-full p-8">
  <div className="bg-white p-24 rounded-lg shadow-lg">
    <div className="flex justify-center">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        <img className="w-full h-full object-cover" src={`http://localhost:3001/user/profile-picture/${userData.userId}`} alt="User Profile" />
      </div>
    </div>
    <div className="mt-4">
    <h2 className="text-3xl font-bold">ID: {userData.userId}</h2>
     
      <p className="mt-2"><span className="font-semibold text-xl">Name:</span> {userData.name}</p>
      <p className="mt-2"><span className="font-semibold text-xl">email:</span> {userData.email}</p>
      <p className="mt-2"><span className="font-semibold text-xl">Address:</span> {userData.address}</p>
      <p className="mt-2"><span className="font-semibold text-xl">Phone:</span> {userData.phone}</p>
    </div>
  </div>
</div>

</div>




  


    </>

  );
}
