import Link from "next/link";
import "../../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for navigation
import { useEffect, useState } from 'react'; // Import useState for managing state

const handleClick = async (userId: any, token: string, router: any, setJsonData: any, jsonData: any) => {
    try {
      console.log(userId)
        await axios.patch(`http://localhost:3000/employee/deActivateUserAccount/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Update the state locally after successful 
        setJsonData((prevData: any[]) => prevData.map((item: any) => 
          item.userId === userId ? { ...item, email: { ...item.email, isActive: false } } : item
      ));
    } catch (error) {
        console.error('Error deactivating User Account :', error);
        // Handle error here, such as displaying an error message to the user
    }
};

export default async function UserData() {
    // Ensure the URL includes the 'http://' or 'https://' protocol
    const router = useRouter();
    const [jsondata, setJsonData] = useState<any[]>([]);
    const token = localStorage.getItem('token') ?? ''; // Use an empty string as the default value if token is null
    
    useEffect(() => {
        // Fetch data
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get('http://localhost:3000/employee/getUserAccount', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const jsonDataFromApi = response.data;
                    console.log(jsonDataFromApi);
                    setJsonData(jsonDataFromApi); // Update jsondata state with fetched data
                } else {
                    // Redirect to login page if token is not available
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Redirect to login page in case of error
                router.push('/login');
            }
        };

        fetchData();
    }, []); // Run once on component mount

    // Return some JSX or null if nothing to render
    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
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
                        {/* row 1 */}
                        {jsondata.map((item: any, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={`http://localhost:3000/employee/openFile/${item.filename}`} alt="Avatar" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.name}</td>
                                <td>{formatDate(item.dob)}</td>
                                <td>{item.nid}</td>
                                <td>{item.phone}</td>
                                <td>{item.email.email}</td>
                                <td>{item.email.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <button className="btn btn-ghost btn-xs">Details</button>
                                    <button className="btn btn-ghost btn-xs" onClick={() => handleClick(item.userId, token, router, setJsonData, jsondata)}>Deactivate</button>
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
