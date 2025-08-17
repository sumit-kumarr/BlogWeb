import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'timeago.js';
import Image1 from './Image1';
import { useUser } from '@clerk/clerk-react';

const fetchUserProfile = async (username) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${username}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useUser();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => fetchUserProfile(username),
  });

  if (isLoading) return <div className="mt-8 text-center">Loading profile...</div>;
  if (error) return <div className="mt-8 text-center text-red-500">Error loading profile</div>;
  if (!user) return <div className="mt-8 text-center">User not found</div>;

  return (
    <div className="mt-8 p-4">
      {/* User Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user.img ? (
            <img 
              src={user.img} 
              alt={user.username} 
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center border-4 border-blue-100">
              <span className="text-white text-3xl font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.username}
          </h1>
          <p className="text-gray-600 mb-2">
            Member since {user.createdAt ? format(user.createdAt) : 'Unknown date'}
          </p>
          <p className="text-gray-600">
            {user.postCount || 0} posts published
          </p>
          
          {/* Saved Posts Link - Only show for current authenticated user */}
          {currentUser && currentUser.username === username && (
            <div className="mt-4">
              <Link 
                to="/saved" 
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                📚 View Saved Posts
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts by {user.username}</h2>
        
        {user.posts && user.posts.length > 0 ? (
          <div className="grid gap-6">
            {user.posts.map((post) => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Post Image */}
                  {post.img && (
                    <div className="flex-shrink-0">
                      <img 
                        src={post.img} 
                        alt={post.title} 
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Post Content */}
                  <div className="flex-1">
                    <Link 
                      to={`/${post.slug}`}
                      className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2 block"
                    >
                      {post.title}
                    </Link>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.desc || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {post.category || 'General'}
                      </span>
                      <span>{post.createdAt ? format(post.createdAt) : 'Unknown date'}</span>
                      {post.visit > 0 && (
                        <span>{post.visit} views</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">No posts published yet.</p>
            <p className="text-sm mt-2">This user hasn't written any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
