import Link from "next/link";
import "../../globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from 'react-hot-toast';

interface User {
    name: string;
    gender: string;
    address: string;
    filename: string;
    dob: Date;
    phone: string;
    nid: number;
    userId:string;
}

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await axios.get(`http://localhost:3000/employee/getusers/${email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const userData: User = response.data.users;
                    setUser(userData);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchData();
    }, [token, email, router]);

    const onSubmit = async (data: any) => {
        try {
            console.log(data.userId)
            console.log(data)
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            
            formData.append('myfile', data.myfile[0]); // Append file to FormData object

            const response = await axios.put(`http://localhost:3000/employee/updateUserProfile/${email}`, formData , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Profile successfully updated');
            router.push('/employee/profile');
        } catch (error) {
            console.error('Error during profile update:', error);
            toast.error('Update failed. Please try again.');
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Show loading indicator while user data is being fetched
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
                                    <h1 className="btn btn-ghost text-xl">Profile Information</h1>
                                </div>
                            </div>
                            <div className="form-control">
                                <input type="text" placeholder="UserID" className="input input-bordered" defaultValue={user.userId} disabled {...register("userId", {
                                        required: { value: true, message: "This field is required" },
                                        
                                    })} />
                                {errors.name && typeof errors.name.message === 'string' && (
                                    <div className='red'>{errors.name.message}</div>
                                )}
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
                                <input type="file" placeholder="Employee Picture" className="file-input file-input-bordered w-full" {...register("myfile")} />
                                {errors.myfile && typeof errors.myfile.message === 'string' && (
                                    <div className='red'>{errors.myfile.message}</div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <div className="form-control">
                                    <button className="btn btn-primary " style={{ width: 'calc(175% - 5px)' }}><Link href="./loginhome">Cancel</Link></button>
                                </div>
                                <div className="form-control">
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}><span>Update Profile</span></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
