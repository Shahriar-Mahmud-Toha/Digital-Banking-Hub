

"use client"

import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Session from "../components/session";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import { useRouter } from "next/navigation";
import { ok } from "assert";

export default function Withdraw() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const UUU = localStorage.getItem('userID');
    const AcNo = localStorage.getItem('Ac');
    type FormFields = {
        accountNumber: number | string;
        amount: number;
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


            const response = await axios.patch('http://localhost:3001/user/withdraw', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));


            toast.success('Withdraw Amount of ' + data.amount + 'has been successfull');
            toast.success('Success ');

            //router.push('/dashboard');


            console.log("response", response);
            console.log("response sta", response.status);
            if (response.statusText == 'OK') {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                router.push('/dashboard');


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
        <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit(onSubmit)}>


            < Session />
            <Toaster />



            <h1>  <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Accout Number:</label></h1>


            <h3> <input type="text" type="text" className="grow" value={AcNo} placeholder="" disabled /></h3>


            <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Amount:</label>
                <input
                    {...register("amount", {
                        required: "Amount is required",
                        min: {
                            value: 0,
                            message: "Amount must be greater than or equal to 0"
                        }
                    })}
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

            <div className="mb-4">
                <label htmlFor="accountType" className="block text-gray-700 font-bold mb-2">Account Type:</label>
                <input {...register("accountType",
                    {
                        required: " Enter Account Type",
                        validate: (value) => {
                            const validAccountype = ["Current", "Saving"];
                            if (!validAccountype.includes(value)) {
                                return "Account must be Current or Saving";
                            }
                            return true;
                        },
                    })} type="text" id="accountTpe" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Current Or Saving" />
                {errors.accountType && (
                    <div className="text-red-500">{errors.accountType.message}</div>
                )}
            </div>




            <div className="mb-4">
                <label htmlFor="bankCode" className="block text-gray-700 font-bold mb-2">bankCode:</label>
                <input {...register("bankCode")} type="number" id="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter bankCode" />
            </div>

            <div className="mb-4">
                <label htmlFor="routingNumber" className="block text-gray-700 font-bold mb-2">routingNumber:</label>
                <input {...register("routingNumber")} type="number" id="routingNumber" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter routingNumber" />
            </div>




            <div className="mb-4">
                <label htmlFor="transferType" className="block text-gray-700 font-bold mb-2">transferType:</label>
                <input {...register("transferType")} type="text" id="transferType" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" placeholder="Enter transfer Type ex EFT" />
            </div>

         




            <button disabled={isSubmitting} type="submit" className="btn btn-active btn-accent py-2 px-4  hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">{isSubmitting ? "Loading....." : "Submit"}</button>


            <div className="flex-1">
                <a href="/dashboard" className="btn btn-ghost text-xl">Home</a>
            </div>
        </form>

    );
}
