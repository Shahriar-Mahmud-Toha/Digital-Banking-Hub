import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <span className="text-3xl font-bold">Sign Up</span>
        <form action="#" method="post" className="mt-5">
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input type="text" name="Email" className="grow" placeholder="Enter your email" />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
            <input type="password" name="Password" className="grow" placeholder="Enter your password" />
          </label>
          <label className="input input-bordered input-info w-full max-w-xs flex items-center gap-3 mb-4 adminTextInput">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
            <input type="text" name="ActivationKey" className="grow" placeholder="Enter activation key" />
          </label>

          <div className="flex flex-col items-center mt-10">
            <input type="submit" className="btn btn-success text-xl text-white font-bold" value="Sign Up" />
          </div>
          <div className="flex flex-col items-center mt-10">
            <Link href="./login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </>
  );
}
