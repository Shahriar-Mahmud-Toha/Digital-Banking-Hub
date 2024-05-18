"use client"
import Link from "next/link";
import "../../globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  name: string;
  filename: string;
}
export default function NavBar() {
  const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                if (token) {
                    const response = await axios.get('http://localhost:3000/employee/getusers/' + email, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const modifiedUser: User = {
                        name: response.data.users.name,
                        filename: response.data.users.filename,
                    };

                    setUser(modifiedUser);
                    //setUser(response.data);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router]);


    if (!user) {
        return <div></div>;
    }

    const handleLogout = () => {

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      router.push('/login');
    };
  return (
    <>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <img className="h-12 w-auto" src="https://img.icons8.com/color/452/chase-bank.png" alt="Bank Logo" />
          <Link href={"./loginhome"} className="btn btn-ghost text-xl">IFSP Bank</Link>
        </div>
        <div className="navbar">
          <p className="btn btn-ghost text-xl">Welcome,{user.name}</p>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={`http://localhost:3000/employee/openFile/${user.filename}`} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href="./profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}