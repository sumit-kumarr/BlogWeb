import React from "react";
import Image1 from "./Image1";
import { Link } from "react-router-dom";
import {format} from "timeago.js"

const Postitem = ({ post }) => {
  // Add null check for post
  if (!post) {
    return <div className="text-red-500">Post not found</div>;
  }

  // Debug logging for user data
  if (!post.user?.username) {
    console.log('Postitem: User data issue', {
      postId: post._id,
      title: post.title,
      user: post.user,
      hasUser: !!post.user,
      username: post.user?.username
    });
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 md:items-center mb-12">
      {/* image       */}
    {post.img && <div className="md:hidden xl:block">
    <Image1 src={post.img} className="rounded-2xl object-cover" />
    <img
        src={post.img}
        alt={post.title || "Post image"}
        className="rounded-2xl hover:scale-60 max-w-96 transition-all duration-300"
    />
      </div>}

      {/* details */}
      <div className="flex flex-col mt-9 gap-3">
        <Link
          to={`/${post.slug}`}
          className="text-sm md:text-xl lg:text-2xl font-semibold "
        >
        {post.title || 'Untitled Post'}
        </Link>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="text-blue-400">Written By</span>
          <div className="flex items-center gap-2">
            {/* User avatar */}
            {post.user?.img ? (
              <img 
                src={post.user.img} 
                alt={post.user.username || 'User'} 
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {post.user?.username ? post.user.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            {/* Username */}
            {post.user?.username && post.user.username !== 'no-email' ? (
              <Link 
                to={`/user/${post.user.username}`}
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                {post.user.username}
              </Link>
            ) : (
              <span className="text-gray-500">
                {post.user ? 'User' : 'Unknown User'}
              </span>
            )}
          </div>
          <span className="text-red-600">On</span>
          <Link className="text-gray-400">{post.category || 'General'}</Link>
          <span className="text-gray-700">{post.createdAt ? format(post.createdAt) : 'Unknown date'}</span>
        </div>
        <p>
          {post.desc || 'No description available'}
        </p>
        <Link to={`/${post.slug}`} className="hover:underline text-blue-800 text-sm">
          Read More...
        </Link>
      </div>
    </div>
  );
};

export default Postitem;
