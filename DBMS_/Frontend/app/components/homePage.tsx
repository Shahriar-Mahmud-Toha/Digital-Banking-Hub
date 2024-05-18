
"use client"

import Link from "next/link";
import Signin from "../signin/page";
import Footer from "./footer";
import { useEffect, useState } from "react";

export default function HomePage(){

  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide: number) => (prevSlide % 4) + 1); // Cycle through slides 1 to 4
    }, 1500); // Change slide every 1 second

    return () => clearInterval(interval); 
  }, []);

  

return(<>



{/* <html data-theme="cupcake"></html> */}
       
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
    
    </div>
    <a className="btn btn-ghost text-xl">IFSP BANK PLC</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li> <Link href="/">Home</Link></li>
      <li> <Link href="/contact/">Contact</Link></li>
      <li><Link href="/about/">About</Link></li>
      <li></li>
      <li>
     
      </li>
    </ul>
    <div className="navbar-end">
    <Link href="/signin/">
      <button className="btn btn-primary">
        <li>Sign IN</li>
      </button>
    </Link>
  </div>


  </div>
    
  <div className="navbar-end">
    <Link href="/signup/">
      <button className="btn btn-primary">
        <li>Sign Up</li>
      </button>
    </Link>
  </div>
</div>


<div className="carousel w-full">
        <div
          id="slide1"
          className={`carousel-item relative w-full ${
            currentSlide === 1 ? "block" : "hidden"
          }`}
        >
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWJmBxw7zBEKsfwF2SXHBphG6IbNMoqD3e7g&s" className="w-full" />
        </div>
{/*   
<div className="carousel w-full">
  <div id="slide1" className="carousel-item relative w-full">
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide4" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div>  */}

<div
          id="slide2"
          className={`carousel-item relative w-full ${
            currentSlide === 2 ? "block" : "hidden"
          }`}
        >
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStK5p-W-2TS8bQg0NfO-LGwqYCRpprVMZOwg&s"  className="w-full"/>
        </div>




  {/* <div id="slide2" className="carousel-item relative w-full">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStK5p-W-2TS8bQg0NfO-LGwqYCRpprVMZOwg&s" className="full" height={1000}/>
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div>  */}

<div
          id="slide3"
          className={`carousel-item relative w-full ${
            currentSlide === 3 ? "block" : "hidden"
          }`}
        >
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRITsmTQGQwzk8z2FekSLAaZQy-RtzbnsVMhg&s" className="w-full" />
        </div>


  {/* <div id="slide3" className="carousel-item relative w-full">
    <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle">❮</a> 
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div>  */}

<div
          id="slide4"
          className={`carousel-item relative w-full ${
            currentSlide === 4 ? "block" : "hidden"
          }`}
        >
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLxxY7WAMpVLm_te2kWGOx-Zl2Bcj2MGEVxg&s" className="w-full" />
        </div>
      </div>

  {/* <div id="slide4" className="carousel-item relative w-full">
    <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div> */}


{/* </div> */}

<Footer />


</>);
}
