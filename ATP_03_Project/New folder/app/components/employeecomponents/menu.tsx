'use client'
import Link from "next/link";
import "../../globals.css";
import { useEffect, useState } from "react";
export default function Menu() {
  const role = localStorage.getItem('role');
  const [showemployeebtn, setshowemployeebtn] = useState(false)
  const [showuserbtn, setshowuserbtn] = useState(false)
  const [showtransactionbtn, setshowtransactionbtn] = useState(false)
  const [showsettingbtn, setshowsettingbtn] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');

  useEffect(() => {
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e: { target: { checked: any; }; }) => {
    const newTheme = e.target.checked ? 'dark' : 'default';
    setTheme(newTheme);
  };
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            {role == "Account Officer" &&
              <>
                <li>
                  <button className="btn btn-transparent" onClick={() => setshowemployeebtn(!showemployeebtn)}>Employee Management</button>
                  {showemployeebtn && (
                    <>
                      <button className="btn btn-gray">
                        <Link href="./createaccount">Create Account</Link>
                      </button>
                      <button className="btn btn-transparent">
                        <Link href="./employeeaccount">View Employee</Link>
                      </button>
                    </>
                  )}
                </li>
              </>}
            {role == "Account Officer" &&
              <>
                <li>
                  <button className="btn btn-transparent" onClick={() => setshowuserbtn(!showuserbtn)}>User Management</button>
                  {showuserbtn && (
                    <>
                      <button className="btn btn-transparent">
                        <Link href="./userdata">View User</Link>
                      </button>
                      {/* <button className="btn btn-transparent">
                        <Link href="./employeeaccount">Active User</Link>
                      </button> */}
                      <button className="btn btn-transparent">
                        <Link href="./inactiveuser">Inactive User</Link>
                      </button>
                    </>
                  )}
                </li>
              </>}
            {(role == "Account Officer" || role == "Accountent") &&
              <>
                <li>
                  <button className="btn btn-transparent" onClick={() => setshowtransactionbtn(!showtransactionbtn)}>Transaction Mangement</button>
                  {showtransactionbtn && (
                    <>
                      <button className="btn btn-transparent">
                        <Link href="./transaction">Transactions</Link>
                      </button>
                      <button className="btn btn-transparent">
                        <Link href="./incompletetransaction">Incomplete Transactions</Link>
                      </button>

                    </>
                  )}
                </li>
              </>}
            {role == "Accountent" &&
              <>
                <li>
                  <button className="btn btn-transparent"><Link href="./requestedservices">Requested Service</Link></button>
                </li>
              </>}
            <li>
              <button className="btn btn-transparent" onClick={() => setshowsettingbtn(!showsettingbtn)}>Setting</button>
              {showsettingbtn && (
                <>
                  <button className="btn btn-transparent">
                    <Link href="./changepassword">Change Password</Link>
                  </button>
                  <button className="btn btn-transparent">
                    Theme
                    <input
                      type="checkbox"
                      checked={theme === 'synthwave'}
                      onChange={handleThemeChange}
                      className="toggle theme-controller"
                    />
                  </button>

                </>
              )}
            </li>
          </ul>

        </div>
      </div>
    </>
  );
}