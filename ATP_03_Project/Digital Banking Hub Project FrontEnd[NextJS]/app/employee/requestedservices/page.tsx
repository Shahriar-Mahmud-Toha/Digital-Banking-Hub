"use client"
import Menu from "@/app/components/employeecomponents/menu";
import Navbar from "@/app/components/employeecomponents/navbar";
import Services from "@/app/components/employeecomponents/services";
import Session from "@/app/components/employeecomponents/session";
import { useEffect, useState } from "react";

export default function TransactionPage() {
    const [showComponents, setShowComponents] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowComponents(true);
        }, 1000); // Set delay for 0.1 seconds

        return () => clearTimeout(delay); // Cleanup function to clear the timeout
    }, []);
    return (
        <>
            <Session />
            {showComponents ? (<>
                <Navbar />
                <br />
                <div style={{ display: 'flex' }}> {/* Use flex container */}
                    <div>
                        <Menu />
                    </div>
                    <div style={{ width: '80%' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Align items to the right */}
                            <label className="input input-bordered flex items-center gap-2" style={{ width: '30%' }}>
                                <input type="text" className="grow" placeholder="Search" />
                                <kbd className="kbd kbd-sm">⌘</kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </label>
                        </div>
                        <Services />
                    </div>
                </div>
            </>) : (<div className="flex items-center justify-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>)}

        </>
    );
}