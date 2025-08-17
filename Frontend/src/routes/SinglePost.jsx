import React from "react";
import Image1 from "../Components/Image1";
import { Link, useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import PostMenuAction from "../Components/PostMenuAction";
import Search from "../Components/Search";
import Comments from "../Components/Comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";
import { useUser } from '@clerk/clerk-react';

const fetchPost = async(slug) =>{
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    if (!res.data) {
      throw new Error('Post not found');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

const SinglePost = () => {
  const { slug } = useParams();
  const { user } = useUser();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "something went wrong" + error.message;
  if (!data) return "Post not Found";
  if (!data.user) return "Post author not found";


  return (
    <div className="flex flex-col gap-8 mt-8 mb-7">
      {/* details */}
      <div className="flex gap-7">
        <div className="lg:w-3/5 flex flex-col gap-8 ">
          <h1 className="text-xl md:text-3xl xl:text-4xl font-semibold">
            {data.title || 'Untitled Post'}
          </h1>

          <div className="flex gap-4 items-center text-gray-400 text-sm">
            <span>Written by</span>
            <div className="flex items-center gap-2">
              {/* User avatar */}
              {data.user?.img ? (
                <img 
                  src={data.user.img} 
                  alt={data.user.username || 'User'} 
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {data.user?.username ? data.user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
                             {/* Username */}
               {data.user?.username && data.user.username !== 'no-email' ? (
                 <Link 
                   to={`/user/${data.user.username}`}
                   className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
                 >
                   {data.user.username}
                 </Link>
               ) : (
                 <span className="text-gray-500">Unknown User</span>
               )}
            </div>
            <span className="text-red-400">On</span>
            <Link className="text-blue-500">{data.category || 'General'}</Link>
            <span className="text-gray-500">{data.createdAt ? format(data.createdAt) : 'Unknown date'}</span>
          </div>
          <p className="text-gray-400 font-medium">
           {data.desc || 'No description available'}
          </p>
        </div>
        {data.img && <div className="hidden lg:block w-2/5">
          <Image1
            src={`${data.img}?tr=w-800,h-600,fo-auto`} 
            alt={data.title} 
            className="rounded-3xl w-full h-auto object-cover"
            loading="lazy"
          />
          
        </div>}
      </div>

      <h1>Content</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia non accusantium inventore quae deleniti maiores repellat reprehenderit pariatur ducimus eveniet? Libero aut accusamus aliquid rerum totam voluptatum ipsam fugit quisquam ad! Dolorum eos neque consectetur doloribus ex voluptatibus adipisci nulla.</p>
        </div>
       
        {/* menu */}
        <div className="px-4 h-max sticky top-8 space-y-4">
          <h1 className="font-semibold text-xl">Author</h1>
          <div className="flex flex-col gap-4 ">
            <div className="flex gap-2 items-center">
              {data.user?.img ? (
                <img src={data.user.img} alt={data.user.username || 'User'} className="w-12 h-12 rounded-full object-cover"/>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {data.user?.username ? data.user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
                             {data.user?.username && data.user.username !== 'no-email' ? (
                 <Link 
                   to={`/user/${data.user.username}`}
                   className="text-xl text-blue-600 font-bold hover:text-blue-700 transition-colors"
                 >
                   {data.user.username}
                 </Link>
               ) : (
                 <span className="text-xl text-gray-500 font-bold">Unknown User</span>
               )}
            </div>
            <p>Lorem ipsum dolor sit amet.</p>

            <div className="flex gap-2">
              <FaFacebook className="text-blue-500 cursor-pointer" />
              <FaInstagram className="text-red-400 cursor-pointer" />
            </div>
          </div>
          <PostMenuAction post = {data}/>
          
          {/* Saved Posts Link - Only show for authenticated users */}
          {user && (
            <>
              <h1 className="text-black font-semibold">Quick Actions</h1>
              <div className="flex flex-col gap-2 text-sm">
                <Link 
                  to="/saved" 
                  className="hover:text-blue-700 underline text-blue-600 font-medium"
                >
                  📚 Saved Posts
                </Link>
              </div>
            </>
          )}
          
          <h1 className="text-black font-semibold">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="" className="hover:text-blue-700 underline">
              All
            </Link>
            <Link to="" className="hover:text-blue-700 underline">
              Development
            </Link>
            <Link to="" className="hover:text-blue-700 underline">
              Databases
            </Link>
            <Link to="" className="hover:text-blue-700 underline">
              Search Engines
            </Link>
            <Link to="" className="hover:text-blue-700 underline">
              Marketing
            </Link>
          </div>
          {/* (search) */}
          <h1 className=" mt-7 mb-4 text-xl font-semibold">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id}/>
    </div>
  );
};

export default SinglePost;
