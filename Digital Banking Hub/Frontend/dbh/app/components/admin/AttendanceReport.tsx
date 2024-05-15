'use client';

import { AttendanceData } from "@/app/admin/DTOs/attendanceData.dto";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function AttendanceReport() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const response = await axios.get(SERVER_ADDRESS + "/admin/attendance/getReport", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0;
        const data = response.data.data;
        if (response.status === 200 && !isEmptyObject(data)) {
          setAttendanceData(data);
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
    fetchAttendanceData();
  }, [router]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.post(SERVER_ADDRESS + "/admin/attendance/import", formDataObj, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201 && response.data.status === 1) {
          fetchAttendanceData();
          e.target.value = "";
        } else {
          alert("Attendance Report insertion Failed !");
        }
      } catch (error) {
        alert("Attendance Report Insertion failed !");
        console.error(error);
      }
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  // };

  // Fetch data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchAttendanceData, 10000); // 10 seconds in milliseconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="bg-gray-900 font-bold text-2xl p-3 text-center mt-12">
        <span>Attendance Report</span>
      </div>
      <div className="dSubTitle">
        <div className="ml-5">
          <span className="cusPlaceHolder">Upload Attendance Report (.xlsx file)</span>
        </div>
        <form method="post">
          <input
            type="file"
            name="file"
            className="file-input file-input-ghost w-full max-w-xs"
            onChange={handleChange}
          />
        </form>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Year</th>
              <th>Email</th>
              <th>Jan</th>
              <th>Feb</th>
              <th>Mar</th>
              <th>Apr</th>
              <th>May</th>
              <th>Jun</th>
              <th>Jul</th>
              <th>Aug</th>
              <th>Sep</th>
              <th>Oct</th>
              <th>Nov</th>
              <th>Dec</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry) => (
              <tr key={entry.Id.toString()}>
                <td>{entry.Id.toString()}</td>
                <td>{entry.Year.toString()}</td>
                <td>{entry.Email}</td>
                <td>{entry.Jan.toString()}</td>
                <td>{entry.Feb.toString()}</td>
                <td>{entry.Mar.toString()}</td>
                <td>{entry.Apr.toString()}</td>
                <td>{entry.May.toString()}</td>
                <td>{entry.Jun.toString()}</td>
                <td>{entry.Jul.toString()}</td>
                <td>{entry.Aug.toString()}</td>
                <td>{entry.Sep.toString()}</td>
                <td>{entry.Oct.toString()}</td>
                <td>{entry.Nov.toString()}</td>
                <td>{entry.Dec.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
