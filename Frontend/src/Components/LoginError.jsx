import React from 'react'
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';

const LoginError = () => {
    return (
        <div className='flex p-3 mt-7'>
            <div>
                <Link to = "/" ><h1 className='bg-blue-500 text-white p-3 rounded-2xl'><IoArrowBackSharp className='cursor-pointer '/></h1></Link>
            </div>
            <div className='p-3 mt-15 justify-center items-center md:flex lg:flex lg:flex-row flex flex-col gap-10 '>
                <img src="login.svg" alt="login" className='lg:w-full lg:95 w-70 h-70 md:w-full md:h-90' />

            <div className='flex flex-col gap-8 '>
                <h1 className='text-3xl font-bold'>oops! Login to Write The Post...</h1>
                <div>
                        <Link to= "/login">
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-lg font-bold w-96 cursor-pointer'>Login
                        </button>
                        </Link>
                </div>
            </div>

            </div>
        </div>
    )
}

export default LoginError