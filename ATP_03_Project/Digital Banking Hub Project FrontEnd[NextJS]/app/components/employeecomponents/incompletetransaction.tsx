import Link from "next/link";
import "../../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function IncompleteTransaction() {
    const [jsondata, setJsonData] = useState<any[]>([]);
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get('http://localhost:3000/employee/getIncompleteTransfer', {
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

    const handleClick = async (transactionId: any) => {
        try {
            await axios.patch(`http://localhost:3000/employee/confirmTransfer/${transactionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update the state locally after successful confirmation
            setJsonData(jsondata.filter((item: any) => item.transactionId !== transactionId));
            toast.success('Transfer confirmed successfully ' +transactionId );
        } catch (error) {
            console.error('Error confirming transfer:', error);
            toast.error('Failed to confirm transfer ' +transactionId);
        }
    };

    return (
        <>
            <Toaster />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="text-center">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Account Number</th>
                            <th>Amount</th>
                            <th>Receiver Account</th>
                            <th>Receiver Name</th>
                            <th>Account Type</th>
                            <th>Bank Code</th>
                            <th>Routing Number</th>
                            <th>Transfer Type</th>
                            <th>Status</th>
                            <th>Transaction Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {jsondata.map((item: any, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td>{item.transactionId}</td>
                                <td>{item.acountNumber}</td>
                                <td>{item.amount}</td>
                                <td>{item.receiverAccount}</td>
                                <td>{item.holderName}</td>
                                <td>{item.accountType}</td>
                                <td>{item.bankCode}</td>
                                <td>{item.routingNumber}</td>
                                <td>{item.transferType}</td>
                                <td>{item.transactionStatus ? "Complete" : "Incomplete"}</td>
                                <td>{formatDate(item.applicationTime)}</td>
                                <td>
                                    {!item.transactionStatus && (
                                        <button className="btn btn-ghost btn-xs" onClick={() => handleClick(item.transactionId)}>Confirm</button>
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
