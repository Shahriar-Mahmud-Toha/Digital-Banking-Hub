import Link from "next/link";
import "../../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Services() {
    const router = useRouter();
    const [jsondata, setJsonData] = useState<any[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get('http://localhost:3000/employee/getAllServiceRequiest', {
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
                console.error('Error fetching service data:', error);
                router.push('/login');
            }
        };

        fetchData();
    }, []);

    const handleConfirm = async (serviceId: any) => {
        try {
            await axios.patch(`http://localhost:3000/employee/processServiceRequiestById/${serviceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update the status locally after successful confirmation
            setJsonData(prevData => prevData.map(item =>
                item.serviceId === serviceId ? { ...item, status: true } : item
            ));
            toast.success('Service request '+ serviceId +' confirmed successfully.');
        } catch (error) {
            console.error('Error processing service request:', error);
            toast.error('Failed to confirm service request '+ serviceId);
        }
    };

    const handleVerify = async (serviceId: any) => {
        try {
            await axios.get(`http://localhost:3000/employee/sendVerificationReportToManager/${serviceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Service request '+ serviceId +' verified successfully.');
        } catch (error) {
            console.error('Error verifying service request:', error);
            toast.error('Failed to verify service request '+ serviceId);
        }
    };

    return (
        <>
            <Toaster />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="text-center">
                        <tr>
                            <th>Service ID</th>
                            <th>Account Number</th>
                            <th>Service Type</th>
                            <th>Service Status</th>
                            <th>Application Date</th>
                            <th>Document</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {jsondata.map((item: any, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td>{item.serviceId}</td>
                                <td>{item.account.accountNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.status ? "Processed" : "Processing"}</td>
                                <td>{formatDate(item.applicationTime)}</td>
                                <td>
                                    <button className="btn btn-ghost btn-xs">{item.filename}</button>
                                </td>
                                <td>
                                    {!item.status && (
                                        <>
                                            <button className="btn btn-ghost btn-xs" onClick={() => handleConfirm(item.serviceId)}>Confirm</button>
                                            <button className="btn btn-ghost btn-xs" onClick={() => handleVerify(item.serviceId)}>Verify</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function formatDate(dateString: any) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Set to true if you prefer 12-hour format
    });
    return formattedDate;
}
