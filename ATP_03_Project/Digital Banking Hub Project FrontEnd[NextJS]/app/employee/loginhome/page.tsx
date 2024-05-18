"use client"
import React, { useEffect, useState } from 'react';
import Session from "@/app/components/employeecomponents/session";
import Menu from "../../components/employeecomponents/menu";
import Navbar from "../../components/employeecomponents/navbar";
import ExchanceRate from '@/app/components/employeecomponents/exchangerate';

export default function LoginHome() {
  const [showComponents, setShowComponents] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role ?? ''); // Use empty string as default if role is null

    const delay = setTimeout(() => {
      setShowComponents(true);
    }, 100); // Set delay for 100 milliseconds

    return () => clearTimeout(delay); // Cleanup function to clear the timeout
  }, []);

  return (
    <>
      <Session />
      {showComponents ? (
        <>
          <Navbar />
          <br />
          <div style={{ display: 'flex' }}> {/* Use flex container */}
            <div>
              <Menu />
            </div>
            <div style={{ width: '80%',display: 'flex', justifyContent: 'flex-end' }}> {/* Flexbox column layout */}
              {userRole === "Accountent" && ( // Render ExchanceRate component only for client role
                <ExchanceRate  /> // Render ExchanceRate at the end
              )}
              
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      )}
    </>
  );
}
