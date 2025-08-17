import React from "react";
import { IoMenuSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { useEffect } from "react";
import Image1 from "./Image1";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { getToken } = useAuth();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.mobile-menu')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);


  const handleAboutClick = () => {
    document.title = "About - BlogPlatform";
    window.scrollTo(0, 0);
  }

  const handleSave = () =>{
    document.title = "Saved Post";
     window.scrollTo(0, 0);
  }

  const handleLogin = () =>{
    document.title = "Login Page";
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    getToken()
      .then((token) => {
        console.log("Token:", token);
      } )
      .catch((error) => { 
        console.error("Error fetching token:", error);
      });

  },[getToken]);

  return (
    <div className="w-full h-15 md:h-20 flex mt-3 items-center justify-between px-4 md:px-8 lg:px-16 lx:px-32 bg-white shadow-md rounded-2xl ">
      {/* logo */}
      <Link to = "/" className="flex items-center gap-4">
        <div className="w-15 h-15 lg:w-15 lg:h-15 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
          <span className="text-sm md:text-base lg:text-lg">📝</span>
        </div>
        <span className="text-xl md:text-xs lg:text-2xl font-bold text-gray-800 hidden sm:block">BlogWeb</span>
      </Link>
      {/* mobile menu */}
      <div className="md:hidden mobile-menu">
        <div
          className="cursor-pointer text-gray-700 hover:text-blue-500 font-bold"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoCloseSharp /> : <IoMenuSharp />}
        </div>
        {/* mobile menu */}
        <div
          className={`w-full h-screen flex flex-col items-center absolute top-16 left-0 bg-slate-200 shadow-lg transition-all ease-in-out z-50 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col items-center gap-6 pt-8">
            <Link to="/" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/write" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
              Write
            </Link>
            <SignedIn>
              <Link to="/saved" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
                Saved Posts
              </Link>
            </SignedIn>
            <Link to="" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
              Trending
            </Link>
            <Link to="" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
              Most Popular
            </Link>
            <Link to="/about" className="text-lg font-bold hover:text-blue-500" onClick={() => setOpen(false)}>
              About
            </Link>
            <SignedOut>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold " onClick={handleLogin}>
                  Login
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* desktop menu */}
      <div className="hidden max-w-full md:flex gap-4 items-center">
        <ul className="flex items-center gap-8 text-gray-700">
          <Link to = "/" className="cursor-pointer hover:text-blue-500 font-bold">Home</Link>
          <Link to = "/write" className="cursor-pointer hover:text-blue-500 font-bold">Write</Link>
          <SignedIn>
            <Link to = "/saved" className="cursor-pointer hover:text-blue-500 font-bold" onClick={handleSave}>Saved Posts</Link>
          </SignedIn>
          <Link to = "" className="cursor-pointer hover:text-blue-500 font-bold">
            Trending
          </Link>
          <Link to = "" className="cursor-pointer hover:text-blue-500 font-bold">
            Most Popular
          </Link>
          <Link to = "/about" className="cursor-pointer hover:text-blue-500 font-bold" onClick={handleAboutClick}>
            About
          </Link>
        </ul>

        <SignedOut>
            <Link to = "/login">
        <button id="bottone1">
          <strong>Login
            </strong>
        </button>
            </Link>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>

      </div>
    </div>
  );
};

export default Navbar;
