


// "use client"

// import axios from "axios";
// import { SubmitHandler, useForm } from "react-hook-form";
// import Session from "../components/session";
// import toast, { Toaster } from "react-hot-toast";
// import router from "next/router";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function UpdateProfile(props:any) {
//     const Email = localStorage.getItem('email');
//     const token = localStorage.getItem('token');
//     const UUU = localStorage.getItem('userID');
//     const AcNo = localStorage.getItem('Ac');


//     type FormFields = {
//         name: string;
//         email: string;
//         address: string;
//         userId: string;
//         phone: string;
//         // Corrected to represent file input
//     };

//     const router = useRouter(); // Initialize useRouter


//     const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>();
//     //const [userData, setUserData] = useState<User | null>(null);


//     const onSubmit: SubmitHandler<FormFields> = async (data) => {
//         try {
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             console.log("Form Data:", data);
//             console.log("Form Data:", token);




//             const response = await axios.put('http://localhost:3001/user/updateprofile/'+Email, data, {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               });


//             await new Promise((resolve) => setTimeout(resolve, 1000));





//             toast.success('Success ');

//             //router.push('/dashboard');


//             console.log("response", response);
//             console.log("response sta", response.status);
//             if(response.statusText=='OK'){
//                 await new Promise((resolve) => setTimeout(resolve, 1000));
//                 router.push('/dashboard');

//             }
//         } catch (error) {
//             toast.error('Service request  Sent ');


//             // Handle errors here
//         }
//     };



// return (
//     <> 


// <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit(onSubmit)}>

// <label className="input input-bordered flex items-center gap-2">
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
//   <input {...register("userId", { required: true })}  type="text" className="grow" placeholder="userId" />
// </label>

// <label className="input input-bordered flex items-center gap-2">
//   <input {...register("name", { required: true })}  type="text" className="grow" placeholder="name" />
// </label>

// <label className="input input-bordered flex items-center gap-2">
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
//   <input {...register("phone", { required: true })}  type="text" className="grow" placeholder="Email" />
//   <h1>{}</h1>
// </label>
// <label className="input input-bordered flex items-center gap-2">
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
//   <input {...register("email", { required: true })}  type="email" className="grow" placeholder="Email" />
//   <h1>{}</h1>
// </label>

// <label className="input input-bordered flex items-center gap-2">
//   <input {...register("address", { required: true })}  type="text" className="grow"  />
// </label>

// <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">{isSubmitting ? "Loading....." : "Submit"}</button>

// </form>
//     </>
// )
// }


"use client"

import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Session from "../components/session";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "../profile/page";
import Footer from "../components/footer";

export default function UpdateProfile(props: any) {
  const Email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const UUU = localStorage.getItem('userID');
  const AcNo = localStorage.getItem('Ac');


  interface User {
    name: string;
    email: string;
    address: string;
    filename: string;
    userId: string;
    phone: string;
    balance: number;
  }

  type FormFields = {
    name: string;
    email: string;
    address: string;
    userId: string;
    phone: string;
    // Corrected to represent file input
  };

  const router = useRouter(); // Initialize useRouter


  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>();
  //const [userData, setUserData] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/getusers/' + Email, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("DATA DASHBOARD" + response.data.users)
        const userID = localStorage.setItem('userID', response.data.users.userId);

        const modifiedUser: User = {
          name: response.data.users.name,
          filename: response.data.users.filename,
          email: response.data.email,
          address: response.data.users.address,
          userId: response.data.users.userId,
          phone: response.data.users.phone,
          balance: 0



        };

        console.log("MODI" + modifiedUser.userId);


        setUserData(modifiedUser);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log("HI" + userData);

  if (!userData) {
    return <div>affjhjfh</div>;
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form Data:", data);
      console.log("Form Data:", token);

      if (data.name == "") {
        data.name = userData.name;
      }

      if (data.phone == "") {
        data.phone = userData.phone;
      }

      if (data.email == "") {
        data.email = userData.email;
      }

      if (data.phone == "") {
        data.phone = userData.phone;
      }

      if (data.address == "") {
        data.address = userData.address;
      }





      const response = await axios.put('http://localhost:3001/user/updateprofile/' + Email, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      await new Promise((resolve) => setTimeout(resolve, 1000));





      toast.success('Success ');

      //router.push('/dashboard');


      console.log("response", response);
      console.log("response sta", response.status);
      if (response.statusText == 'OK') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/dashboard');

      }







    } catch (error) {
      toast.error('Service request  Sent ');


      // Handle errors here
    }
  };



  return (
    <>


      <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit(onSubmit)}>

        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
          <input {...register("userId", { required: false })} type="text" className="grow" value={userData.userId} placeholder="" />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input {...register("name",{
          required: false,
          validate: (value) => {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
              return "Name cannot include symbols or numbers";
            }
            return true;
          },
        })} type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder={userData.name} />
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )} 
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
          <input {...register("phone", {
          required: false,
          pattern: {
            value: /^01\d{9}$/,
            message: "Phone number should start with 01 and be 11 digits long",
          },
        })} type="text" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder={userData.phone} />
        {errors.phone && (
          <div className="text-red-500">{errors.phone.message}</div>
        )} 
          <h1>{ }</h1>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
          <input {...register("email",
          {
            required: false,
      
          }
        )} type="text" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder={userData.email} />
        {
          errors.email && <div className="text-red-500"> {errors.email.message} </div>
        }

        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input {...register("address", { required: false })} type="text" className="grow" placeholder={userData.address} />
        </label>

        <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">{isSubmitting ? "Loading....." : "Submit"}</button>

      </form>

      <div className="flex-1">
    <a href="/dashboard" className="btn btn-ghost text-xl">Home</a>
  </div>
  <Footer/>

    </>
  )
}