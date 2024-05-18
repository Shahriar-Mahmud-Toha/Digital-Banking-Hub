"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
    email: string;
    role:string;
}

export default function Session() {
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

                    // const modifiedUser: User = {
                    //     name: response.data.users.name,
                    //     email: response.data.email,
                    //     address: response.data.users.address,
                    //     filename: response.data.users.filename,
                    // };

                    // setUser(modifiedUser);
                    setUser(response.data);
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

    // localStorage.setItem('role', user.role);
    
    console.log(user.email);
    
    return (
        <>

        </>
    );
};