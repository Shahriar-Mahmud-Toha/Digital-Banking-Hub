

// "use client"

// import axios from 'axios';
// import { Toaster } from 'react-hot-toast';
// import { useState, useEffect } from 'react';
// import Session from '../components/session';
// import { useRouter } from 'next/navigation';
// import Logout from '../components/logout';
// import Link from 'next/link';

// interface User {
//   accountNumber: string;
//   name:string;

 
// }
// export default function Account() {

//   const email = localStorage.getItem('email');
//   const token = localStorage.getItem('token');
//   const UserID = localStorage.getItem('userID');
//   console.log("ACOOUNT ID"+UserID);
//   const router = useRouter();
//   if(!token){

//     router.push('/signin');



//   }


 
//   const [userData, setUserData] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//           const response = await axios.get('http://localhost:3001/user/getAc/' + UserID, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           console.log("Response:", response.data);
      
//           // Assuming there's only one account per user
//           const accountNumber = response.data[0]?.Accounts[0]?.accountNumber;
      
//           if (accountNumber) {
//             const modifiedUser: User = {
//               accountNumber: accountNumber,
//               name :  response.data[0]?.Accounts[0]?.name,
//             };
//             setUserData(modifiedUser);
//           } else {
//             console.error('Account number not found in the response.');
//           }
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
      

//     fetchData();
//   }, []);

//   if (!userData) {
//     return <div></div>;
//   }
//   console.log("UUU"+userData);

//   return (
//     <>
//       <Session />

// <div className="flex justify-between items-center navbar bg-base-100 p-4">
  
//   <div className="flex-1">
//     <a className="btn btn-ghost text-xl" >Home</a>
//   </div>

//   <div className="flex-1">
//     <a href="/service" className="btn btn-ghost text-xl">Service</a>
//   </div>

//   <div className="flex-1">
//     <a className="btn btn-ghost text-xl">Home</a>
//   </div>

//   <div className="flex-none gap-2 relative">
//     <div className="dropdown dropdown-end">
//       <button tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           {/* <img className="w-full h-full object-cover" src={`http://localhost:3001/user/profile-picture/${userData.userId}`} alt="User Profile" /> */}
//         </div>
//       </button>
//       <ul tabIndex={0} className="absolute right-0 mt-3 z-10 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//         <li><a className="flex items-center justify-between py-2 px-4 hover:bg-gray-100">Profile</a></li>
//         <li><a className="flex items-center justify-between py-2 px-4 hover:bg-gray-100">Settings</a></li>
//         <li>
//           <button className="bg-gray-10 hover:bg-gray-50 text-base font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//                <Logout/>

//           </button>
//         </li>
//       </ul>
//     </div>
//   </div>
// </div>




// <div className="flex justify-center items-center h-full p-8">
//   <div className="bg-white p-8 rounded-lg shadow-lg">
//     <div className="flex justify-center">
//       <div className="w-24 h-24 rounded-full overflow-hidden">
//         {/* <img className="w-full h-full object-cover" src={`http://localhost:3001/user/profile-picture/${userData.userId}`} alt="User Profile" /> */}
//       </div>
//     </div>
//     <div className="mt-4">
//       <h2 className="text-2xl font-bold">ID: {userData.accountNumber}</h2>
//       <p className="mt-2"><span className="font-semibold">Name:</span> {}</p>
//       <p><span className="font-semibold">Username:</span> {userData.name}</p>
//       <p><span className="font-semibold">Address:</span> {}</p>
//       <p><span className="font-semibold">Balance:</span> {}</p>
//       <p><span className="font-semibold">Phone:</span> {}</p>
//     </div>
//   </div>
// </div>






  


//     </>
//   );
// }




"use client"

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Session from '../components/session';
import { useRouter } from 'next/navigation';
import Logout from '../components/logout';
import Link from 'next/link';
import UserCard from '../components/accountCard';
import AccountCard from '../components/accountCard';
import Dashboard from '../dashboard/page';

interface User {
  accountNumber: string;
  name:string;
  gender:string;
  dob:Date;
  nid:number;
  phone:string;
  address:string;
  accountType:string;
  balance:number;
  filename:string;
 // accountStatus:boolean;

 
}
export default function Account() {

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
              gender:response.data[0]?.Accounts[0]?.gender,
              dob:response.data[0]?.Accounts[0]?.dob,
              nid:response.data[0]?.Accounts[0]?.nid,
              phone:response.data[0]?.Accounts[0]?.phone,
              address:response.data[0]?.Accounts[0]?.address,
              accountType:response.data[0]?.Accounts[0]?.accountType,
              balance:response.data[0]?.Accounts[0]?.balance,
              filename:response.data[0]?.Accounts[0]?.filename
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

  return (
    <>
      <Session />
      
      <AccountCard data={userData}/>
  <div className="flex-1">
    <a href='/dashboard' className="btn btn-ghost text-xl">Home</a>
  </div>
    </>
  );
}
