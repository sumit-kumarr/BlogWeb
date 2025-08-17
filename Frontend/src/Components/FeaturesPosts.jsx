import React from 'react';
import Image1 from './Image1';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'timeago.js';

const fetchFeaturedPosts = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/featured`);
    return res.data;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return { featuredPosts: [] };
  }
};

const FeaturesPosts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: fetchFeaturedPosts,
  });

  if (isLoading) return <div className="mt-8 text-center">Loading featured posts...</div>;
  if (error) return <div className="mt-8 text-center text-red-500">Error loading featured posts</div>;

  const featuredPosts = data?.featuredPosts || [];

  // If no featured posts, show a message
  if (featuredPosts.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No featured posts available at the moment.
      </div>
    );
  }

  // Get the first post for the main display
  const mainPost = featuredPosts[0];
  // Get the remaining posts for the side display
  const sidePosts = featuredPosts.slice(1, 4);

  return (
    <div className='mt-8 flex flex-col lg:flex-row gap-8'>
      {/* Main featured post */}
      {mainPost && (
        <div className='w-full lg:w-1/2 flex flex-col gap-4'>
        {/* image */}
          {mainPost.img && (
            <>
              <Image1 src={mainPost.img} className="rounded-3xl object-cover" />
              <img src={mainPost.img} className='rounded-4xl object-cover w-full' alt={mainPost.title} />
            </>
          )}
        {/* details */}
        <div className='flex items-center gap-4'>
            <h1 className='font-semibold lg:text-lg'>01.</h1>
            <Link className="text-blue-600 font-semibold lg:text-lg">
              {mainPost.category || 'General'}
            </Link>
            <span className='font-bold text-gray-500'>
              {mainPost.createdAt ? format(mainPost.createdAt) : 'Unknown date'}
            </span>
          </div>
          <Link to={`/${mainPost.slug}`} className='text-xl lg:text-3xl font-semibold lg:font-bold'>
            {mainPost.title || 'Untitled Post'}
          </Link>
                      {/* Author info */}
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>By</span>
              {mainPost.user?.username ? (
                <Link 
                  to={`/user/${mainPost.user.username}`}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {mainPost.user.username}
                </Link>
              ) : (
                <span className="text-gray-500">Unknown User</span>
              )}
            </div>
        </div>
      )}

      {/* Side posts */}
        <div className='w-full lg:w-1/2 flex flex-col gap-4'>
        {sidePosts.map((post, index) => (
          <div key={post._id} className='lg:h-1/3 flex justify-between gap-4'>
            {post.img && (
              <>
                <Image1 src={post.img} className="rounded-3xl object-cover w-1/3 aspect-video"/>
                <img src={post.img} className='max-w-fit rounded-4xl object-cover' alt={post.title} />
              </>
            )}
        {/* details and title */}
            <div className='w-2/3'>
        {/* details */}
        <div className='flex items-center gap-4 text-sm lg:text-base mb-4'>
                <h1 className='font-semibold'>0{index + 2}.</h1>
                <Link className='text-blue-400'>{post.category || 'General'}</Link>
                <span className='text-gray-500 text-sm'>
                  {post.createdAt ? format(post.createdAt) : 'Unknown date'}
                </span>
        </div>

        {/* title */}
              <Link to={`/${post.slug}`} className='text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium'>
                {post.title || 'Untitled Post'}
        </Link>

                             {/* Author info */}
               <div className='flex items-center gap-2 text-xs text-gray-600 mt-2'>
                 <span>By</span>
                 {post.user?.username ? (
                   <Link 
                     to={`/user/${post.user.username}`}
                     className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                   >
                     {post.user.username}
        </Link>
                 ) : (
                   <span className="text-gray-500">Unknown User</span>
                 )}
        </div>
        </div>
        </div>
        ))}
        </div>
    </div>
  );
};

export default FeaturesPosts;
