import Image from "next/image";
import Link from "next/link";

export default function GetOTP() {
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <span className="text-3xl font-bold">OTP Verification</span>
        <form action="#" method="post" className="mt-5">
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <input type="text" name="otp" className="grow" placeholder="Enter otp" />
          </label>

          <div className="flex flex-col items-center mt-10">
            <input type="submit" className="btn btn-success text-xl text-white font-bold" value="Submit" />
          </div>
          <div className="flex flex-col items-center mt-10">
            <Link href="../signup">Go Back</Link>
          </div>
        </form>
      </div>
    </>
  );
}
