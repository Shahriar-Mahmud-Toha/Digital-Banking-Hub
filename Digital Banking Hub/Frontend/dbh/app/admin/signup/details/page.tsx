'use client'
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { AdminSignupDetails } from "../../DTOs/AdminSignupDetails.dto";

const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
export default function GetDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminSignupDetails>({
    FullName: '',
    Email: '',
    Gender: '',
    DateOfBirth: null,
    NID: '',
    Phone: '',
    Address: '',
    picture: null
  });
  useEffect(() => {
    const admin_email_temp = localStorage.getItem("admin_email_temp") ?? "";
    setFormData((prevData) => ({
      ...prevData,
      Email: admin_email_temp,
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'DateOfBirth') {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : null,
      });
    } else if (e.target.type === 'file') {
      const file = e.target.files?.[0];
      if (file) {
        setFormData({
          ...formData,
          [name]: file,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('FullName', formData.FullName);
    formDataObj.append('Email', formData.Email);
    formDataObj.append('Gender', formData.Gender);
    formDataObj.append('DateOfBirth', formData.DateOfBirth?.toISOString() ?? '');
    formDataObj.append('NID', formData.NID);
    formDataObj.append('Phone', formData.Phone);
    formDataObj.append('Address', formData.Address);
    if (formData.picture) {
      formDataObj.append('picture', formData.picture);
    }
    try {

      const response = await axios.post(SERVER_ADDRESS + "/admin/provideDetails", formDataObj);

      if (response.status === 201 && response.data.status == "1") {
        router.push('./../login');
      }
      else {
        alert("Details insertion Failed !");
      }
    } catch (error) {
      alert("Details Insertion failed !");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <span className="text-3xl font-bold">Profile Details</span>
        <form onSubmit={handleSubmit} method="post" className="mt-5">
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="FullName" className="grow" placeholder="Enter your full name" onChange={handleChange} />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="NID" className="grow" placeholder="Enter your NID number" onChange={handleChange} />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="Phone" className="grow" placeholder="Enter your phone number" onChange={handleChange} />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="Address" className="grow" placeholder="Enter your address" onChange={handleChange} />
          </label>

          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="date" name="DateOfBirth" className="grow" placeholder="Enter your date of Birth" onChange={handleChange} />
          </label>

          <div className="mb-4">
            <div className="flex justify-between">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-3">Male</span>
                  <input type="radio" name="Gender" value="male" className="radio checked:bg-blue-500" onChange={handleChange} />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-3">Female</span>
                  <input type="radio" name="Gender" value="female" className="radio checked:bg-blue-500" onChange={handleChange} />
                </label>
              </div>
            </div>
            <div className="mt-2 mb-4">
              <span className="cusPlaceHolder">Upload your profile picture</span>
            </div>
            <input type="file" name="picture" className="file-input file-input-bordered file-input-info w-full max-w-xs file-input-md" onChange={handleChange} />

          </div>
          <div className="flex flex-col items-center mt-10">
            <input type="submit" className="btn btn-success text-xl text-white font-bold" value="Submit" />
          </div>
          <div className="flex flex-col items-center mt-10">
            <Link href="./">Don't' have an account? Sign Up</Link>
          </div>
        </form>
      </div>
    </>
  );
}