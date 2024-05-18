"use client"

import Link from "next/link";
import "../globals.css";
import axios from 'axios';
import { Key } from 'react';
import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import Session from "../components/session";
import Footer from "../components/footer";

export default function Transaction() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    if(!token){
        router.push('/signin');
    
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token && userID) {
                    const response = await axios.get(`http://localhost:3001/user/info-and-transactions/${userID}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log(response.data);
                    setTransactions(response.data.transactions); // Update state with transactions
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/signin'); // Redirect to login page on error
            }
        };

        fetchData();
    }, [token, userID]); // Run once on component mount and whenever token or userID changes

    return (
        <>
            < Session />

            <div className="flex-1">
                <a href="/dashboard" className="btn btn-ghost text-xl">Home</a>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead className="text-center">
                        <tr>
                            <th className="bold-header">Transaction ID</th>
                            <th className="bold-header">Account Number</th>
                            <th className="bold-header">Amount</th>
                            <th className="bold-header">Receiver Account</th>
                            <th className="bold-header">Receiver Name</th>
                            <th className="bold-header">Account Type</th>
                            <th className="bold-header">Bank Code</th>
                            <th className="bold-header">Routing Number</th>
                            <th className="bold-header">Transfer Type</th>
                           
                            <th className="bold-header">Transaction Time</th>
                        </tr>


                    </thead>
                    <tbody className="text-center">
                        {/* rows */}
                        {transactions.map((transaction: any, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td>{transaction.transactionId}</td>
                                <td>{transaction.acountNumber}</td> {/* Corrected typo: 'acountNumber' to 'accountNumber' */}
                                <td>{transaction.amount}</td>
                                <td>{transaction.receiverAccount}</td>
                                <td>{transaction.holderName}</td>
                                <td>{transaction.accountType}</td>
                                <td>{transaction.bankCode}</td>
                                <td>{transaction.routingNumber}</td>
                                <td>{transaction.transferType}</td>
                              
                                <td>{formatDate(transaction.applicationTime)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />

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