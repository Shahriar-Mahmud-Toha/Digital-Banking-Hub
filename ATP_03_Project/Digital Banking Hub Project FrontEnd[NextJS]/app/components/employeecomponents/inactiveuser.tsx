import Link from "next/link";
import "../../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function InactiveUser() {
    const [jsondata, setJsonData] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get('http://localhost:3000/employee/getInactiveUserAccount', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const jsonDataFromApi = response.data;
                    console.log(jsonDataFromApi);
                    setJsonData(jsonDataFromApi);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchData();
    }, []);

    const handleClick = async (userId: any) => {
        try {
            await axios.patch(`http://localhost:3000/employee/activateUserAccount/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the state locally after successful activation
            setJsonData(jsondata.filter((item: any) => item.users.userId !== userId));
            toast.success('Successfully Activate User.'+ userId);
        } catch (error) {
            console.error('Error activating User Account :', error);
            // Handle error here, such as displaying an error message to the user
            toast.error('Failed to Activate User.'+ userId);
        }
    };

    return (
        <>
            <Toaster />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="text-center">
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>NID</th>
                            <th>Phone</th>
                            <th>UserName</th>
                            <th>Account Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {jsondata.map((item: any, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={`http://localhost:3000/employee/openFile/${item.users.filename}`} alt="Avatar" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.users.name}</td>
                                <td>{formatDate(item.users.dob)}</td>
                                <td>{item.users.nid}</td>
                                <td>{item.users.phone}</td>
                                <td>{item.email}</td>
                                <td>{item.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <button className="btn btn-ghost btn-xs">Details</button>
                                    <button className="btn btn-ghost btn-xs" onClick={() => handleClick(item.users.userId)}>Activate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function formatDate(dateString: Date) {
    const dateUser = new Date(dateString);
    const formattedDateUser = dateUser.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
    return formattedDateUser;
}
