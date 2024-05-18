"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Logout from './logout';
import Dashboard from '../dashboard/page';

interface User {
  name: string;
  email: string;
  address: string;
  filename: string;
  userId: string;
}

export default function Session () {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("get Token"+token);
      const email = localStorage.getItem('email');
      const userID = localStorage.getItem('userId');
        if (token) {
          const response = await axios.get('http://localhost:3001/user/getusers/'+email, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
         
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/signin');
      } 
    };

    fetchUserData();
  }, [router]);

  if (!user) {
    return <div></div>;
  }
 
  

  console.log();

  return (
    <></>

//     <div className="navbar bg-base-100">
//     <div className="flex-1">
//       <a className="btn btn-ghost text-xl">{}</a>
//     </div>
    
//     <div className="flex-none gap-2">
     
//       <div className="dropdown dropdown-end">
//         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//           <div className="w-10 rounded-full">
//           <div className="avatar">
//   <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
    
//     <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
//   </div>
// </div>

//           </div>
//         </div>
//         <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//           <li>
//             <a className="justify-between">
//               Profile
             
//             </a>
//           </li>
//           <li><a>Settings</a></li>
//           <li>
//           <button
//       className="bg-gray-300 hover:bg-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
     
//     >
//      <Logout/>
//     </button>

//           </li>
//         </ul>
//       </div>
//     </div>
//   </div>
  );
};



