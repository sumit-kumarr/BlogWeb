import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import { CiBookmark } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaBookmark } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostMenuAction = ({post}) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if post is saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;
      
      try {
        const token = await getToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/saved/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const savedPostIds = response.data.savedPosts.map(savedPost => savedPost._id);
        setIsSaved(savedPostIds.includes(post._id));
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfSaved();
  }, [user, post._id, getToken]);

  const handleSavePost = async () => {
    if (!user) {
      toast.error('Please login to save posts');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const endpoint = isSaved ? '/posts/unsave' : '/posts/save';
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        postId: post._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Post unsaved successfully' : 'Post saved successfully');
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      toast.error(error.response?.data || 'Error saving post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user) {
      toast.error('Please login to delete posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = await getToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Post deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data || 'Error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='mt-4 flex flex-col gap-5'>
      <h1 className='font-semibold'>Actions</h1>
      
      {/* Save/Unsave Post */}
      <div className='flex items-center gap-3'>
        <button 
          onClick={handleSavePost}
          disabled={isLoading}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isSaved ? (
            <FaBookmark className='text-blue-600 text-3xl' />
          ) : (
            <CiBookmark className='text-black text-3xl' />
          )}
          <span className={isSaved ? 'text-blue-600' : 'text-black'}>
            {isLoading ? 'Loading...' : (isSaved ? 'Saved' : 'Save post')}
          </span>
        </button>
      </div>

      {/* Delete Post - Only show for post author */}
      {user && post.user?.username === user.username && (
        <div className='flex items-center gap-3'>
          <button 
            onClick={handleDeletePost}
            disabled={isDeleting}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <MdDelete className='text-red-500 text-3xl' />
            <span className='text-red-600'>
              {isDeleting ? 'Deleting...' : 'Delete the Post'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PostMenuAction;
