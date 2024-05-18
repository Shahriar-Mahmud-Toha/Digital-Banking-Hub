import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  // Function to handle logout
  const handleLogout = () => {
    // Clear authentication-related data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('Ac');
    localStorage.removeItem('userID');
    // Redirect the user to the sign-in page
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-300 hover:bg-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  );
}
