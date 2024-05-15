'use client'

import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function AdminPrivateHeader() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();

  const handleLogout = async () => {

    const responseForLogout = await axios.delete(SERVER_ADDRESS + "/admin/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (responseForLogout.status === 200 && responseForLogout.data.status == "1") {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      router.push('./../admin/login');
    }
    else {
      alert("Logout Failed !")
    }
  };
  const handleRoleClick = () => {
    router.push('./role');
  };
  const handleUsersClick = () => {
    router.push('./users');
  };
  return (
    <>
      <div className="flex justify-between mb-8 mr-5">
        <div className="flex items-center mt-5 ml-5">
          <div>
            <Link href="./dashboard" className="flex">
              <div>
                <img className="w-10 h-10 relative top-3 mr-5" src="/icons/online-banking.png" alt="logo" />
              </div>
              <h1 className="mt-5 text-xl font-bold ">Digital Banking Hub</h1>
            </Link>
          </div>
        </div>
        <div className="flex items-center mt-5 ml-5">
          <button className="btn btn-sm btn-outline relative top-3 ml-5" onClick={handleRoleClick}>Role</button>
          <button className="btn btn-sm btn-outline relative top-3 ml-5" onClick={handleUsersClick}>Users</button>
          <div>
            <Link href="./profile"><img className="w-10 h-10 relative top-3 mr-5 ml-5" src="/icons/profile.png" alt="profile-pic" /></Link>
          </div>
          <div className="relative top-3">
            <button onClick={handleLogout} className="group flex items-center justify-start w-9 h-9 bg-emerald-700 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
              <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                  <path
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z">
                  </path>
                </svg>
              </div>
              <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                LogOut
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
