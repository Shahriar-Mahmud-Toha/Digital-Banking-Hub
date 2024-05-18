// import axios from 'axios';
// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from 'react';

// export default async function Profile() {
//     // Ensure the URL includes the 'http://' or 'https://' protocol
//     //const response = await axios.get('http://localhost:3001/user/getProfileInfo/U-178103');
//     const response = await axios.get('http://localhost:3001/user/getProfileInfo');


//     const jsondata = response.data;
//     console.log(jsondata);
//       // Log any errors that occur during the request
//    // console.error('Failed to fetch data:', error);
  

//   // Return some JSX or null if nothing to render
//   return (
//     <>
//       {jsondata.map((item: {
//         //  filename: string; userId: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; 
// },index: Key | null | undefined)=>{

//         return(<div key={index}>
//               <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  
//                     <img src={`http://localhost:3001/user/profile-picture/${item.userId}`} width={200} alt="User Profile" style={{ marginRight: '20px' }} />
//                     <div>
//                         <p><strong>User ID:</strong> {item.userId}</p>
//                         <p><strong>User Name:</strong> {item.name}</p>
//                         <p><strong>User Gender:</strong> {item.gender}</p>
//                         <p><strong>Date of Birth:</strong> {item.dob}</p>
//                         <p><strong>Phone:</strong> {item.phone}</p>
//                         <p><strong>Address:</strong> {item.address}</p>
//                     </div>
//                 </div>
//             </div>
          
           
//         </div>
        
        
//         )

//       }
    
//     )}
//     </>
//   );
// }

import axios from 'axios';
import { useState, useEffect } from 'react';
import UpdateProfile from '../updateProfile/page';
import Session from '../components/session';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

interface User {
  name: string;
  email: string;
  address: string;
  filename: string;
  userId: string;
  phone: string;
  balance: number;
}

export default async function Profile() {
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3001/user/getusers/' + email, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  const jsondata = response.data;

  return (<>
    <Session />
    <div className=" justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      <Toaster />

      <div className="grid grid-cols-3 gap-2">
        {jsondata.map((items: any, index: any) => {
          return (<div key={index}>

            <UpdateProfile data={items} />
          </div>

          );
        }


        )}
      </div>
    </div>
  </>);

}
