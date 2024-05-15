'use client'

import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function DailyTransactionData() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();
  const [NPSB, setNPSB] = useState<number>(0);
  const [RTGS, setRTGS] = useState<number>(0);
  const [BEFTN, setBEFTN] = useState<number>(0);
  const [totalTransaction, setTotalTransaction] = useState<number>(0);

  const fetchTransactionData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const response = await axios.get(SERVER_ADDRESS + "/admin/showReport", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0;
        const data = response.data.Data;
        if (response.status === 200 && !isEmptyObject(data)) {
          setNPSB(data.NPSB);
          setRTGS(data.RTGS);
          setBEFTN(data.BEFTN);
          setTotalTransaction(data.NPSB + data.RTGS + data.BEFTN);
        }
      } else {
        router.push('./../admin/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('./../admin/login');
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [router]);

  // Fetch data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchTransactionData, 10000); // 10 seconds in milliseconds
    
    // Cleanup function to clear the interval when component unmounts or when usersJsonData changes
    return () => clearInterval(intervalId);
  }, [totalTransaction]); 

  return (
    <>
      <div className="bg-gray-900 font-bold text-2xl p-3 text-center mt-12">
        <span>Daily Transaction Status</span>
      </div>
      <div className="flex justify-around mt-5">
        <div className="dCard">
          <div className="flex flex-col items-center">
            <span className="font-bold mb-2">NPSB</span>
            <div className="text-center shadow-md w-40 card bg-base-200">
              <div className="card-body">{NPSB}</div>
            </div>
          </div>
        </div>
        <div className="dCard">
          <div className="flex flex-col items-center">
            <span className="font-bold mb-2">RTGS</span>
            <div className="text-center shadow-md w-40 card bg-base-200">
              <div className="card-body">{RTGS}</div>
            </div>
          </div>
        </div>
        <div className="dCard">
          <div className="flex flex-col items-center">
            <span className="font-bold mb-2">BEFTN</span>
            <div className="text-center shadow-md w-40 card bg-base-200">
              <div className="card-body">{BEFTN}</div>
            </div>
          </div>
        </div>
        <div className="dCard">
          <div className="flex flex-col items-center">
            <span className="font-bold mb-2">Total</span>
            <div className="text-center shadow-md w-40 card bg-base-200">
              <div className="card-body">{totalTransaction}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
