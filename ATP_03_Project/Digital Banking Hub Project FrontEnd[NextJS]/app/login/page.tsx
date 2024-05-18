'use client'
import Link from "next/link";
import "../globals.css";
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';


export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data: any) => {
        try {

            console.log(data)
            // const formData = new FormData();

            // // Append form data to FormData object
            // Object.keys(data).forEach((key) => {
            //     formData.append(key, data[key]);
            // });

            const response = await axios.post('http://localhost:3000/auth/login', data);
            console.log(response.data);
            const token = response.data;
            console.log(token.access_token);
            console.log(token.role);
            localStorage.setItem('token', token.access_token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', token.role);
            console.log(data.email);

            toast.success('Sign in successful');
            if (token.role == "Account Officer" || token.role == "Accountent") {
                router.push('./employee/loginhome');
            }
            

        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('Sign in failed. Please check your credentials.');
        }

    }
    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                            <Toaster />
                            <div className="flex flex-wrap justify-center">
                                <div>
                                    <figure>
                                        <img className="h-14 w-auto" src="https://img.icons8.com/color/452/chase-bank.png" alt="Bank Logo" />
                                    </figure>
                                </div>
                                <div>
                                    <a href="./" className="btn btn-ghost text-xl">IFSP Bank</a>
                                </div>
                            </div>
                            <br />
                            <div className="login_header">Sign in with your organizational username.</div>
                            <div className="form-control">
                                <input type="email" placeholder="Email" className="input input-bordered" {...register("email",
                                    {
                                        required: { value: true, message: "This field is required" },
                                    })} />
                                {errors.email && typeof errors.email.message === 'string' && (
                                    <div className='red'>{errors.email.message}</div>
                                )}
                            </div>
                            <div className="form-control">
                                <input type="password" placeholder="Password" className="input input-bordered"{...register("password",
                                    {
                                        required: { value: true, message: "This field is required" },
                                    })} />
                                {errors.password && typeof errors.password.message === 'string' && (
                                    <div className='red'>{errors.password.message}</div>
                                )}
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" value="Submit" disabled={isSubmitting} className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >

        </>
    );
}

