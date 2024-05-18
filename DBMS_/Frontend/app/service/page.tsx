"use client"

// import axios from "axios";
// import { SubmitHandler, useForm } from "react-hook-form";


//  export default function Service() {


// type FormFields ={

//     accountNumber : number;
//     name : string ;
//     status : string ;
//     myFiles : string;
// };


//     const {register ,handleSubmit ,
//         setError,
//         formState :{errors ,isSubmitting}} = useForm<FormFields>();


//     const onSubmit: SubmitHandler<FormFields> = async (data)=>{

//          try{
//         await new Promise((resolve)=> setTimeout(resolve,1000));

//         console.log(data);
//         const response = await axios.post('http://localhost:3001/user/makeServiceRequest', data);

//         console.log("response" +response);


//         }
//          catch(error){

//         //     setError("accountNumber",{
//         //         message: "This AC INVALID"}
//         //         )

//          }
//     };
//     return (
//         <form className="tutorial gap-2"  onSubmit={handleSubmit(onSubmit)}>
//             <input {...register("accountNumber",{
//                 required:"true",
//                 pattern :   /^\d{8}(?:\d{8})?$/,
//                 minLength:{
//                     value:8,
//                     message:"reasd",

//                 },

            

//            } )} 
//            type="text" placeholder="AC NO"/>  {errors.accountNumber && (
//             <div className="text-red-500"> {errors.accountNumber.message}</div>
//             )}
//              <br />


//             <input {...register("name",{
//                     required:true,
//                 }
//             )} type="text" placeholder="Name"/> <br />
//             <input {...register("status")} type="text" placeholder="Status"/>
//             <input {...register("myFiles")} type="file" placeholder="Files" />
//             <button disabled={isSubmitting} type="submit" >
//                 {
//                     isSubmitting ? "Loading....." : "Submit"
//                 }
//             </button>

//          </form>
//     );


//  }


// // "use client"

// // import axios from "axios";
// // import { SubmitHandler, useForm } from "react-hook-form";


// //  export default function Service() {


// // type FormFields ={

// //     accountNumber : number;
// //     name : string ;
// //     status : string ;
// //     myFiles: File;
// // };


// //     const {register ,handleSubmit ,
// //         setError,
// //         formState :{errors ,isSubmitting}} = useForm<FormFields>();


// //     const onSubmit: SubmitHandler<FormFields> = async (data)=>{

// //          try{
// //         await new Promise((resolve)=> setTimeout(resolve,1000));

// //         console.log(data);
// //         const response = await axios.post('http://localhost:3001/user/makeServiceRequest', data);

// //         console.log("response" +response);


// //         }
// //          catch(error){

// //             setError("accountNumber",{
// //                 message: "This AC INVALID"}
// //                 )

// //          }
// //     };
// //     return (
// //         <form className="tutorial gap-2"  onSubmit={handleSubmit(onSubmit)}>
// //             <input {...register("accountNumber",{
// //                 required:"true",
// //                 pattern :   /^\d{8}(?:\d{8})?$/,
// //                 minLength:{
// //                     value:8,
// //                     message:"reasd",

// //                 },

            

// //            } )} 
// //            type="text" placeholder="AC NO"/>  {errors.accountNumber && (
// //             <div className="text-red-500"> {errors.accountNumber.message}</div>
// //             )}
// //              <br />


// //             <input {...register("name",{
// //                     required:true,
// //                 }
// //             )} type="text" placeholder="Name"/> <br />
// //             <input {...register("status")} type="text" placeholder="Status"/>
// //             <input {...register("myFiles")} type="file" placeholder="Files" />
// //             <button disabled={isSubmitting} type="submit" >
// //                 {
// //                     isSubmitting ? "Loading....." : "Submit"
// //                 }
// //             </button>

// //          </form>
// //     );


// //  }




"use client"

import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Session from "../components/session";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import Footer from "../components/footer";

export default function Service() {
  type FormFields = {
    accountNumber: number;
    name: string;
    status: string;
    myFiles: FileList; // Corrected to represent file input
  };
  const AcNo = localStorage.getItem('Ac');
  // localStorage.setItem('userID', formData.);


  console.log("DashBoard Session "+AcNo);


  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(data);
      const formData = new FormData();
      formData.append("accountNumber", String(data.accountNumber));
      formData.append("name", data.name);
      formData.append("status", data.status);
      formData.append("myFiles", data.myFiles[0]); // Assuming you only upload one file

      const response = await axios.post('http://localhost:3001/user/makeServiceRequest', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
     
      
      toast.success('Service request  Sent ');

      router.push('/dashboard');


      
      console.log("response", response);
    } catch (error) {
      console.error("Error:", error);
      // Handle errors here
    }
  };

  return (

    <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit(onSubmit)}>
         < Session/>
         <Toaster />

    <div className="mb-4">
    <label className="input input-bordered flex items-center gap-2">    
      <input {...register("accountNumber", {
        required: true,
        pattern: /^\d{8}(?:\d{8})?$/,
        minLength: {
          value: 8,
          message: "Account number must be 8 digits long",
        },
      })} type="text" id="accountNumber" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" value={AcNo} placeholder=""/>
      {errors.accountNumber && (
        <div className="text-red-500">{errors.accountNumber.message}</div>
      )}
    </label>
    </div>

    <h1></h1>
  
    <div className="mb-4">
      <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Service Type:</label>
      <input {...register("name", {
            required: " Enter service Type CREDIT/DEBIT /CHECK BOOK",
            validate: (value) => {
              const validAccountype = ["Current", "Saving","Check Book"];
              if (!validAccountype.includes(value)) {
                return "MUST BE CURRENT ,SAVINGS, CHECK BOOK";
              }
              return true;
            },
          })} type="text" id="accountTpe" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Current Or Saving" />
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}
      </div>
  
    <div className="mb-4">
      <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status:</label>
      <input {...register("status", {
            required: " Normal Or urgent ",
            validate: (value) => {
              const status = ["Normal", "Urgent"];
              if (!status.includes(value)) {
                return " must be Normal or Urgent";
              }
              return true;
            },
          })} type="text" id="status" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Normal Or Urgent" />
        {errors.status && (
          <div className="text-red-500">{errors.status.message}</div>
        )}
      </div>
  
    <div className="mb-4">
      <label htmlFor="myFiles" className="block text-gray-700 font-bold mb-2">Files:</label>
      <input {...register("myFiles", { required: true })} type="file" id="myFiles" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" />
      {errors.myFiles && (
        <div className="text-red-500">File is required</div>
      )}
    </div>
  
    <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">{isSubmitting ? "Loading....." : "Submit"}</button>

    
  <div className="flex-1">
    <a href="/dashboard" className="btn btn-ghost text-xl">Home</a>
  </div>

  <Footer/>

  </form>







  
  );
}
