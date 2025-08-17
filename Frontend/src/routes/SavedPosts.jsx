import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import Loader from "../Components/Loader";

const fetchSavedPosts = async (token) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/saved/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.savedPosts;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
};

const SavedPosts = () => {
  const { getToken } = useAuth();

  const { isPending, error, data: savedPosts } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
      return fetchSavedPosts(token);
    },
    enabled: !!getToken,
  });

  if (isPending) return <div className="flex mt-70 items-center justify-center"><Loader /></div> 
  if (error) return <div className="text-center text-red-500 mt-8">Error loading saved posts: {error.message}</div>; 


  return (
    <div className="flex flex-col gap-8 mt-8 mb-7">
      <div className="text-center">
        <h1  className="text-3xl font-bold text-gray-800 mb-4">Saved Posts</h1>
        <p className="text-gray-600">Your collection of saved articles</p>
      </div>

      {savedPosts && savedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-blue-700">
              {post.img && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={`${post.img}?tr=w-400,h-300,fo-auto`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>By</span>
                  <Link 
                    to={`/user/${post.user?.username}`}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {post.user?.username || 'Unknown User'}
                  </Link>
                  <span>•</span>
                  <span>{post.createdAt ? format(post.createdAt) : 'Unknown date'}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  <Link 
                    to={`/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.desc || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {post.category || 'General'}
                  </span>
                  
                  <Link 
                    to={`/${post.slug}`}
                    className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved posts yet</h3>
          <p className="text-gray-500 mb-6">Start exploring posts and save the ones you like!</p>
          <Link 
            to="/posts"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Explore Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
