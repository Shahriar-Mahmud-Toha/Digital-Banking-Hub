"use client"
import Link from "next/link";
import "../../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for navigation
import { useEffect, useState } from 'react'; // Import useState for managing state


export default async function Transaction() {
    // Ensure the URL includes the 'http://' or 'https://' protocol
    const router = useRouter();
    const [jsondata, setJsonData] = useState<any[]>([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        // Fetch data
        const fetchData = async () => {
          // Ensure the URL includes the 'http://' or 'https://' protocol
          try {
            if (token) {
                const response = await axios.get('http://localhost:3000/employee/getUserTransactionHistory', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
    
              const jsonDataFromApi = response.data;
              console.log(jsonDataFromApi);
              setJsonData(jsonDataFromApi); // Update jsondata state with fetched data
            } else {
              router.push('/login');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
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
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {/* row 1 */}
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

