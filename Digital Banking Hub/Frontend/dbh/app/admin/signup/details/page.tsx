import Image from "next/image";
import Link from "next/link";

export default function GetDetails() {
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <span className="text-3xl font-bold">Profile Details</span>
        <form action="#" method="post" className="mt-5">
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="FullName" className="grow" placeholder="Enter your full name" />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="NID" className="grow" placeholder="Enter your NID number" />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="Phone" className="grow" placeholder="Enter your phone number" />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="Address" className="grow" placeholder="Enter your address" />
          </label>

          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="date" name="DateOfBirth" className="grow" placeholder="Enter your date of Birth" />
          </label>

          <div className="mb-4">
            <div className="flex justify-between">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-3">Male</span>
                  <input type="radio" name="Gender" value="male" className="radio checked:bg-blue-500" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-3">Female</span>
                  <input type="radio" name="Gender" value="female" className="radio checked:bg-blue-500" />
                </label>
              </div>
            </div>
            <div className="mt-2 mb-4">
              <span className="cusPlaceHolder">Upload your profile picture</span>
            </div>
            <input type="file" className="file-input file-input-bordered file-input-info w-full max-w-xs file-input-md" />

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
