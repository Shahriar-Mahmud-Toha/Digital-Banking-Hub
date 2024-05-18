"use client"
import CreateAccount from "@/app/components/employeecomponents/createaccount";
import Menu from "@/app/components/employeecomponents/menu";
import Navbar from "@/app/components/employeecomponents/navbar";
import Session from "@/app/components/employeecomponents/session";
import { useEffect, useState } from "react";

export default function Account() {
    const [showComponents, setShowComponents] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowComponents(true);
        }, 100); // Set delay for 2 seconds

        return () => clearTimeout(delay); // Cleanup function to clear the timeout
    }, []);

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
                        <CreateAccount />
                    </div>
                </div>
            </>) : (<div className="flex items-center justify-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>)}
        </>
    );
}