import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import MainCategories from '../Components/MainCategories/MainCategories';
import FeaturesPosts from '../Components/FeaturesPosts';
import Post from '../Components/Post';
import Loader from '../Components/Loader';

const Homepage = () => {
  const[loading,setLoading] = useState("true");

  useEffect(() =>{
    setTimeout(() => {
      setLoading(false);
    }, 2000);

  },[])

  if(loading) return <div className='mt-60 flex flex-col justify-center items-center gap-5 '><Loader/>Loading..</div>
  return (
    <div className='p-4 mt-4 flex flex-col gap-4 w-full md:w-full lg:w-full mx-auto'>
      {/* breadcrumb */}
      <div className='flex gap-4 '>
        <Link to = "/">Home</Link>
        <span>*</span>
        <span className='text-blue-500 font-semibold'>Blog And Articles</span>
      </div>

      {/* introduction */}
      <div className=' flex gap-4 items-center justify-between'>
        <div className='gap-4 space-y-2 flex flex-col'>
          <h1 className='text-2xl md:text-5xl lg:text-6xl text-blue-600 font-bold'>Your Daily Dose of Ideas & Inspiration</h1>
          <p className='text-xl font-semibold'>Discover engaging stories, useful tips, and fresh perspectives — all in one place. Stay informed, stay inspired.</p>
        </div>
        {/* animated btn */}
        <Link to = "/write" className='hidden md:block '>
        <div className='rounded-full bg-amber-50 border-2 p-8 hover:bg-white hover:border-blue-500 transition-all duration-300 ease-in-out '>
          write <br />
          Your <br />
          Story
        </div>
        </Link>
      </div>
      {/* categories */}
      <MainCategories/>
      {/* featuresposts */}
      <FeaturesPosts />
      {/* postlist */}
      <div className='mt-4'>
        <h1 className='my-8 text-xl text-gray-500 md:text-2xl font-semibold'>Recent Posts</h1>
        <Post />
      </div>

    </div>
  );
}

export default Homepage;
