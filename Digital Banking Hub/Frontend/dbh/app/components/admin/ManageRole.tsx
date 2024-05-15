'use client';

import { AttendanceData } from "@/app/admin/DTOs/attendanceData.dto";
import { Role } from "@/app/admin/DTOs/role.dto";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function ManageRole() {
  const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const router = useRouter();
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [editingRole, setEditingRole] = useState<{ id: string; name: string | null }>({ id: "", name: null });

  const fetchRolesData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('./../admin/login');
      return;
    }
    try {
      const response = await axios.get(SERVER_ADDRESS + "/admin/role/getall", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0;
      const data = response.data.data;
      if (response.status === 200 && !isEmptyObject(data)) {
        setRolesData(data);
      }
    } catch (error) {
      console.error('Error fetching Roles data:', error);
      router.push('./../admin/login');
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, [router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(SERVER_ADDRESS + "/admin/role/create",
        { Name: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201 && response.data.status === 1) {
        fetchRolesData();
        setNewRole(""); // Clear the input field
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Role creation failed!");
      }
    } catch (error) {
      alert("Role creation failed!");
      console.error(error);
    }
  };
  const handleRoleUpdate = async (roleId: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("./../admin/login");
      return;
    }
    try {
      const response = await axios.patch(SERVER_ADDRESS + `/admin/role/update/${roleId}`, { Name: editingRole.name }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        fetchRolesData();
        setEditingRole({ id: "", name: null }); // Reset editing state
      } else {
        alert("Role update failed!");
      }
    } catch (error) {
      alert("Role update failed!");
      console.error(error);
      router.push("./../admin/login");
    }
  };

  // Fetch data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchRolesData, 10000); // 10 seconds in milliseconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleRoleDelete = async (roleId: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('./../admin/login');
      return;
    }
    try {
      const response = await axios.delete(SERVER_ADDRESS + `/admin/role/delete/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.status);
      if (response.status === 200 && response.data.status === 1) {
        fetchRolesData();
      } else {
        alert("Role deletion failed!");
      }
    } catch (error) {
      alert("Role deletion failed!");
      console.error(error);
      router.push('./../admin/login');
    }
  };

  return (
    <>
      <div className="bg-gray-900 font-bold text-2xl p-3 text-center mt-12">
        <span>Roles</span>
      </div>
      <div className="dSubTitle pt-5 pb-5 pl-5">
        <form onSubmit={handleSubmit} method="post">
          <input type="text" name="Name" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          <input type="submit" className="btn btn-neutral ml-5" value="Create New Role" />
        </form>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="table w-full text-2xl">
          <thead>
            <tr className="text-2xl font-bold">
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rolesData.map((role) => (
              <tr key={role.Id}>
                <td>{role.Id}</td>
                <td>
                  {editingRole.id === role.Id ? (
                    <input
                      type="text"
                      value={editingRole.name || ""}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    />
                  ) : (
                    role.Name
                  )}
                </td>
                <td>
                  {editingRole.id === role.Id ? (
                    <button className="btn btn-outline btn-sm btn-success" onClick={() => handleRoleUpdate(role.Id)}>Save</button>
                  ) : (
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingRole({ id: role.Id, name: role.Name })}>Edit</button>
                  )}
                  <button className="ml-5 btn btn-outline btn-sm btn-error" onClick={() => handleRoleDelete(role.Id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
