import Link from "next/link";
import "../../globals.css";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ChangePasswordProps {
    onPasswordChange: () => void; // Define the type for onPasswordChange prop
}

export default function ChangePassword({ onPasswordChange }: ChangePasswordProps) {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        setError
    } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const { newPassword, confirmPassword } = getValues(); // Get new and confirm password fields

            if (newPassword !== confirmPassword) {
                toast.error('New password and confirm password do not match');
            }

            const response = await axios.patch('http://localhost:3000/employee/changePassword/' + email, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setError("Myerror", {
                message: response.data
            });
            onPasswordChange();
            // Manually reset the form fields
            const form = document.getElementById("changePasswordForm") as HTMLFormElement;
            form.reset();

            toast.success('Password successfully changed');
            router.push('/employee/loginhome');

        } catch (error) {
            console.error('Error during change Password:', error);
            toast.error('Password change failed. Please try again.');
        }
    };

    return (
        <>
            <div className="min-h-flex">
                <div className="hero-content">
                   <Toaster/>
                    <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                        <form className="card-body" id="changePasswordForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-wrap justify-center">
                                <div>
                                    <h1 className="btn btn-ghost text-xl">Change Password</h1>
                                </div>
                            </div>
                            <div className="login_header">
                            </div>
                            <div className="form-control">
                                <input type="password" placeholder="Current Password" className="input input-bordered" {...register("currentPassword", {
                                    required: { value: true, message: "This field is required" },
                                })} />
                                {errors.currentPassword && typeof errors.currentPassword.message === 'string' && (
                                    <div className='red'>{errors.currentPassword.message}</div>
                                )}
                            </div>
                            <div className="form-control">
                                <input type="password" placeholder="New Password" className="input input-bordered" {...register("newPassword", {
                                    required: { value: true, message: "This field is required" },
                                    minLength: { value: 8, message: "Min length is 8" },
                                    pattern: {
                                        value: /[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/,
                                        message: 'Password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter'
                                    }
                                })} />
                                {errors.newPassword && typeof errors.newPassword.message === 'string' && (
                                    <div className='red'>{errors.newPassword.message}</div>
                                )}
                            </div>
                            <div className="form-control">
                                <input type="password" placeholder="Confirm Password" className="input input-bordered" {...register("confirmPassword", {
                                    required: { value: true, message: "This field is required" },
                                })} />
                                {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                                    <div className='red'>{errors.confirmPassword.message}</div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <div className="form-control">
                                    <button className="btn btn-primary " style={{ width: 'calc(200% - 5px)' }}>
                                        <Link href="./loginhome">Cancel</Link>
                                    </button>
                                </div>
                                <div className="form-control">
                                    <button type="submit" value="Submit"  className="btn btn-primary">Change Password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
