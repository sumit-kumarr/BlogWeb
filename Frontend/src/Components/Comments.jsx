import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import SingleComment from "./Singlecomment";
import React from "react";

const fetchComments = async (postId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/comments/${postId}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    
    if (error.response?.status === 404) {
      throw new Error("Post not found");
    } else if (error.response?.status === 500) {
      throw new Error(`Server error: ${error.response?.data?.message || "Failed to fetch comments"}`);
    } else if (error.code === "ERR_NETWORK") {
      throw new Error("Network error: Backend server is not running");
    } else {
      throw new Error(error.response?.data?.message || "Failed to fetch comments");
    }
  }
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      console.error("Comment submission error:", error);
      
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error: Backend server is not running. Please start the backend server on port 3000");
      } else if (error.response?.status === 401) {
        toast.error("Authentication error: Please login again");
      } else if (error.response?.status === 404) {
        const message = error.response?.data?.message || "Post or user not found";
        toast.error(message);
      } else if (error.response?.status === 500) {
        const message = error.response?.data?.message || "Server error occurred";
        toast.error(`Server error: ${message}`);
        console.error("Backend error details:", error.response?.data);
      } else if (error.response?.status === 403) {
        toast.error("Permission denied: " + (error.response?.data?.message || "You don't have permission to perform this action"));
      } else {
        const message = error.response?.data?.message || "Failed to add comment";
        toast.error(message);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    const formData = new FormData(e.target);
    console.log(formData)

    const data = {
      desc: formData.get("desc"),
    };

    if (!data.desc.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    mutation.mutate(data);
    e.target.reset(); // Clear the form after submission
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between gap-8 w-full"
        >
          <textarea
            name="desc"
            placeholder="Write a comment..."
            className="w-full p-4 rounded-xl"
          />
          <button 
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50"
          >
            {mutation.isPending ? "Sending..." : "Send"}
          </button>
        </form>
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded-xl">
          <p className="text-gray-600">Please login to add a comment</p>
        </div>
      )}
      {isPending ? (
        <div className="text-center p-4">
          <p className="text-gray-600">Loading comments...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <p className="text-red-600">
            {error.code === "ERR_NETWORK" 
              ? "Network error: Please check if the backend server is running on port 3000"
              : `Error loading comments: ${error.message}`
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the backend server is running and environment variables are set
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {mutation.isPending && (
            <SingleComment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user.imageUrl,
                  username: user.username,
                },
              }}
              postId={postId}
            />
          )}

          {data.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            data.map((comment) => (
              <SingleComment key={comment._id} comment={comment} postId={postId} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Comments;