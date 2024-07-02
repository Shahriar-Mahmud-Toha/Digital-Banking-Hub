

"use client"

import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Session from "../../components/usercomponents/session";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import { useRouter } from "next/navigation";
import { ok } from "assert";
import React from "react";
import NavigationBar from "@/app/components/usercomponents/navigationBar";

export default function Withdraw() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const UUU = localStorage.getItem('userID');
    const AcNo = localStorage.getItem('Ac');
    type FormFields = {
        accountNumber: number | string;
        amount: number | string;
        receiverAccount: number;
        holderName: string;
        accountType: string;
        bankCode: number;
        routingNumber: number;
        transferType: string;

        Status: string;
        // Corrected to represent file input
    };

    const router = useRouter(); // Initialize useRouter
    if(!token){
        router.push('/signin');
        return;
    
      }


    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form Data:", data);

            data.Status = "True";




            data.accountNumber = String(AcNo);


            const response = await axios.patch('http://localhost:3001/user/withdraw', data,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            await new Promise((resolve) => setTimeout(resolve, 1000));


            toast.success('Withdraw Amount of ' + data.amount + 'has been successfull');
            toast.success('Success ');

            //router.push('/dashboard');


            console.log("response", response);
            console.log("response sta", response.status);
            if (response.statusText == 'OK') {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                router.push('/user/dashboard');


            }
        } catch (error) {
            toast.error('Insuficient FOUND ');


            console.error("Error:", error);

            setError("receiverAccount", {
                message: "Take"
            });
            // Handle errors here
        }
    };


    return (
        <>

            < Session />
            <Toaster />
            <NavigationBar />
        <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit(onSubmit)}>



            <h1>  <label htmlFor="accountNumber" className="block text-gray-700 font-bold mb-2">Accout Number:</label></h1>


<p><input type="text" className="block text-gray-700 font-bold mb-2" defaultValue={AcNo ? AcNo : ""} placeholder="" disabled /></p>
            <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Amount:</label>
                <input
                    {...register("amount")}
                    type="number"
                    id="amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    placeholder="Enter Receiver amount"
                />
                {errors.amount && (
                    <div className="text-red-500">{errors.amount.message}</div>
                )}
            </div>





            <div className="mb-4">
                <label htmlFor="receiverAccount" className="block text-gray-700 font-bold mb-2">Receiver Account:</label>
                <input
                    {...register("receiverAccount", {
                        required: "Receiver account Is mandatory ",
                        maxLength: {
                            value: 8,
                            message: "Account Number must have 8 DIGITS"
                        },
                        pattern: /^\d{8}(?:\d{8})?$/,

                    }
                    )} type="number" id="receiverAccount" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter Receiver Account" />
                {errors.receiverAccount && (
                    <div className="text-red-500">{errors.receiverAccount.message}</div>
                )}
            </div>


            <div className="mb-4">
                <label htmlFor="holderName" className="block text-gray-700 font-bold mb-2">Account Holder Name:</label>
                <input {...register("holderName",
                    {
                        required: "Account holder name Name can't empty",
                        validate: (value) => {
                            if (!/^[a-zA-Z\s]*$/.test(value)) {
                                return "Name cannot include symbols or numbers";
                            }
                            return true;
                        },
                    })} type="text" id="holderName" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter Account Holder Name" />
                {errors.holderName && (
                    <div className="text-red-500">{errors.holderName.message}</div>
                )}
            </div>


            <div className="form-control">
  <label htmlFor="accountType" className="block text-gray-700 font-bold mb-2">Account Type:</label>
  <select
    className="select select-accent w-full"
    {...register("accountType", {
      required: "Enter Account Type",
      validate: (value) => {
        const validAccountType = ["current", "Savings"];
        if (!validAccountType.includes(value)) {
          return "Account must be Current or Savings";
        }
        return true;
      },
    })}
  >
    <option value="">Select Receiver Account Type</option> {/* This line is updated to make the option selected by default */}
    <option value="current">Current Account</option>
    <option value="Savings">Savings Account</option>
  </select>
  {errors.accountType && typeof errors.accountType.message === 'string' && (
    <div className='text-red-500'>{errors.accountType.message}</div> // Updated class for consistency
  )}
</div>





            <div className="mb-4">
                <label htmlFor="bankCode" className="block text-gray-700 font-bold mb-2">Banking Code:</label>
                <input {...register("bankCode")} type="number" id="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter bankCode" />
            </div>

            <div className="mb-4">
                <label htmlFor="routingNumber" className="block text-gray-700 font-bold mb-2">Routing Number:</label>
                <input {...register("routingNumber")} type="number" id="routingNumber" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter routingNumber" />
            </div>



            <div className="form-control">
  <label htmlFor="transferType" className="block text-gray-700 font-bold mb-2">Transfer Type:</label>
  <select
    className="select select-accent w-full"
    {...register("transferType", {
      required: "Enter Transfer Method",
      validate: (value) => {
        const validAccountType = ["EFT","Payment","SWIFT", "RTGS","BACH"];
        if (!validAccountType.includes(value)) {
          return "Account must be Current or Savings";
        }
        return true;
      },
    })}
  >
    <option value="">Select your Account Type</option> {/* This line is updated to make the option selected by default */}
    <option value="EFT">Electronic Fund Transfer (EFT):</option>
    <option value="Payment">Bill Payment</option>
    <option value="SWIFT">International Wire Transfers (SWIFT):</option>
    <option value="RTGS">Real-Time Gross Settlement(RTGS):</option>
    <option value="BACH">Bangladesh Automated Clearing House(BACH):</option>
  </select>
  {errors.accountType && typeof errors.accountType.message === 'string' && (
    <div className='text-red-500'>{errors.accountType.message}</div> // Updated class for consistency
  )}
</div>


<div className="mt-4 w-full">
    <button disabled={isSubmitting} type="submit" className="btn btn-active btn-accent w-full py-2 px-4 hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
        {isSubmitting ? "Loading....." : "Submit"}
    </button>
</div>

         
        </form>
        </>

    );
}
