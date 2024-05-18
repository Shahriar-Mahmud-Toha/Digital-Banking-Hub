'use client'
import Link from "next/link";
import "../../globals.css";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

interface User {
    name: string;
    gender: string;
    address: string;
    filename: string;
    dob: Date;
    phone: string;
    nid: number;
    email:string;
    role:string;
    status:boolean;
}
interface Props {
    userId: string;
}
export default function EmployeeDetalis({ userId }: Props) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('token');
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();
    // const [gender, setGender] = useState("Gender");
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get(`http://localhost:3000/employee/getEmployeeAccount/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const modifiedUser: User = {
                        name: response.data.name,
                        email: response.data.email.email,
                        address: response.data.address,
                        filename: response.data.filename,
                        gender:response.data.gender,
                        dob: response.data.dob,
                        phone:response.data.phone,
                        nid: response.data.nid,
                        role: response.data.email.role,
                        status: response.data.email.isActive
                    };

                    setUser(modifiedUser);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchData();
    }, [token,router]);
    const onSubmit = async (data: any) => {
        try {

            console.log(data)
            const formData = new FormData();

            // Append form data to FormData object
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            // Append file to FormData object
            formData.append('myfile', data.myfile[0]); // Assuming only one file is selected

            const response = await axios.post('http://localhost:3000/employee/createAccount', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set Content-Type to multipart/form-data
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Account Created successful!');
            router.push('/employee/createaccount');

        } catch (error) {
            console.error('Error during account create:', error);
            toast.error('Account creation failed. Please try again.');
        }

    }

    const validateFileType = (files: FileList | null) => {
        if (!files || files.length === 0) {
            console.log("No file selected");
            return "No file selected";
        }
    
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
        const invalidFiles: string[] = [];
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!allowedTypes.includes(file.type)) {
                console.log("Invalid file type:", file.type);
                invalidFiles.push(file.name);
            }
        }
    
        if (invalidFiles.length > 0) {
            console.log("Invalid files:", invalidFiles.join(", "));
            return "Please upload files in JPG, PNG, JPEG, or WEBP format";
        }
    
        console.log("All files are valid");
        return true; // Return true when all files are of allowed types
    };

    if (!user) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
        <div className="min-h-flex">
            <div className="hero-content flex">
                <img
                    src={`http://localhost:3000/employee/openFile/${user.filename}`}
                    alt=""
                    style={{ width: '300px', height: 'auto' }} 
                />
                <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap justify-center">
                            <div>
                                <h1 className="btn btn-ghost text-xl">Employee Information</h1>
                            </div>
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="Name" className="input input-bordered" defaultValue={user.name} {...register("name", {
                                    required: { value: true, message: "This field is required" },
                                    maxLength: { value: 150, message: "Max length is 150" }
                                })} />
                            {errors.name && typeof errors.name.message === 'string' && (
                                <div className='red'>{errors.name.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <select className="select select-accent w-full " defaultValue={user.gender} {...register("gender", {
                                    pattern: { value:/^(male|female)$/i, message: 'Please select your gender.' }
                                })}>
                                <option value="Gender">Select your gender.</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && typeof errors.gender.message === 'string' && (
                                <div className='red'>{errors.gender.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="date" placeholder="Date Of Birth" className="input input-bordered"
                                defaultValue={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''} {...register("dob", { required: { value: true, message: "This field is required" } })} />
                            {errors.dob && typeof errors.dob.message === 'string' && (
                                <div className='red'>{errors.dob.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="NID Number" className="input input-bordered" defaultValue={user.nid} {...register("nid", {
                                    required: { value: true, message: "This field is required" },
                                    maxLength: { value: 8, message: "Max length is 8" }
                                })} />
                            {errors.nid && typeof errors.nid.message === 'string' && (
                                <div className='red'>{errors.nid.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="Phone Number" className="input input-bordered" defaultValue={user.phone} {...register("phone", {
                                    required: { value: true, message: "This field is required" },
                                    maxLength: { value: 11, message: "Max length is 11" },
                                    pattern: { value: /^01\d*$/, message: 'Phone number must start with "01"' }
                                })} />
                            {errors.phone && typeof errors.phone.message === 'string' && (
                                <div className='red'>{errors.phone.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="Address" className="input input-bordered" defaultValue={user.address} {...register("address", { required: { value: true, message: "This field is required" } })} />
                            {errors.address && typeof errors.address.message === 'string' && (
                                <div className='red'>{errors.address.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                                <input type="text" placeholder="Email" className="input input-bordered" defaultValue={user.email}{...register("email",
                                    {
                                        required: { value: true, message: "This field is required" },
                                        maxLength: { value: 100, message: "Max length is 100" },
                                        pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/
                                        , message: 'Please provide a valid email.' }
                                    })} />
                                {errors.email && typeof errors.email.message === 'string' && (
                                    <div className='red'>{errors.email.message}</div>
                                )}
                            </div>
                            <div className="form-control">
                            <input type="text" placeholder="Role" className="input input-bordered" defaultValue={user.role} {...register("role", { required: { value: true, message: "This field is required" } })} />
                            {errors.role && typeof errors.role.message === 'string' && (
                                <div className='red'>{errors.role.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="text" placeholder="Status" className="input input-bordered" defaultValue={user.status?'Active':'Inactive'} {...register("isActive", { required: { value: true, message: "This field is required" } })} />
                            {errors.isActive && typeof errors.isActive.message === 'string' && (
                                <div className='red'>{errors.isActive.message}</div>
                            )}
                        </div>
                        <div className="form-control">
                            <input type="file" placeholder="Employee Picture" className="file-input file-input-bordered w-full" {...register("myfile")} />
                            {errors.myfile && typeof errors.myfile.message === 'string' && (
                                <div className='red'>{errors.myfile.message}</div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <div className="form-control">
                                <button className="btn btn-primary " style={{ width: 'calc(175% - 5px)' }}><Link href="../loginhome">Cancel</Link></button>
                            </div>
                            <div className="form-control">
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}><span>Update Data</span></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
}