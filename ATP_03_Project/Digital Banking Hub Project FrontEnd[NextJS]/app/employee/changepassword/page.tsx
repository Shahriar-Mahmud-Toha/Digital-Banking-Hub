"use client"
import ChangePassword from "@/app/components/employeecomponents/changepassword";
import Menu from "@/app/components/employeecomponents/menu";
import Navbar from "@/app/components/employeecomponents/navbar";
import Session from "@/app/components/employeecomponents/session";
import { useEffect, useState } from "react";

export default function Password() {
    const [showComponents, setShowComponents] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowComponents(true);
        }, 500); // Set delay for 2 seconds

        return () => clearTimeout(delay); // Cleanup function to clear the timeout
    }, []);

    const handlePasswordChange = () => {
        // Trigger rerender of Password component
        setShowComponents(false);
        setTimeout(() => setShowComponents(true), 0); // setTimeout to ensure component rerender
    };

    return (
        <>
            <Session />
            {showComponents ? (<>
                <Navbar />
                <br />
                <div style={{ display: 'flex' }}>
                    {/* Use flex container */}
                    <Menu />
                    <div style={{ width: '350%', justifyContent: 'flex-center' }}>
                    <ChangePassword onPasswordChange={handlePasswordChange} />
                    </div>
                </div>
            </>) : (<div className="flex items-center justify-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>)}
        </>
    );
}