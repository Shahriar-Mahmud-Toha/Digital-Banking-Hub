import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

export default function ViewEmployee() {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/employee/getEmployeeAccount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jsonDataFromApi = response.data;
        setJsonData(jsonDataFromApi);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleClick = async (userId: any) => {
    try {
      await axios.delete(`http://localhost:3000/employee/deleteEmployee/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the state locally after successful deletion
      setJsonData((prevData) => prevData.filter((item) => item.users.userId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user. Please try again.');
    }
  };
  const handledetailsSubmit = async (userId: string) => {
    try {
      await router.push(`/employee/employeedetails/${userId}`);
    } catch (error) {
      console.error('Error navigating to employee details:', error);
      // Handle error, such as displaying an error message to the user
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
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
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {jsonData.map((item: any, index: number) => (
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
                <td>{item.role}</td>
                <td>
                  <button className="btn btn-ghost btn-xs"onClick={() => handledetailsSubmit(item.users.userId)}>Details</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => handleClick(item.users.userId)}>Delete</button>
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
  const dateNominee = new Date(dateString);
  const formattedDateNominee = dateNominee.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDateNominee;
}
