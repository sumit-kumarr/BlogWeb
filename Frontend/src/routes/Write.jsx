import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import UploadExample from "../Components/UploadFile";
import { useEffect } from "react";
import Image1 from "../Components/Image1";
import LoginError from "../Components/LoginError";
import Loader from "../Components/Loader";



const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [value, setValue] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [vid, setVid] = useState("");
  const navigate = useNavigate();




  useEffect(() =>{
    if (img && img.url) {
      setValue(prev => prev + `<p><img src="${img.url}" alt="Uploaded image" style="max-width: 100%; height: auto;" /></p>`);
    }
  },[img]);


  useEffect(() =>{
    if (vid && vid.url) {
      setValue(prev => prev + `<p><iframe class="ql-video" src="${vid.url}" frameborder="0" allowfullscreen style="max-width: 100%; height: 300px;"></iframe></p>`);
    }
  },[vid]);


  // Register user when they first load the page
  React.useEffect(() => {
    const registerUser = async () => {
      if (isSignedIn && !isRegistered) {
        try {
          const token = await getToken();
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log('Registration response:', response.data);
          setIsRegistered(true);
        } catch (error) {
          console.error('Registration error:', error);
          // Don't show error toast for registration as it might be expected
          // (user might already be registered)
        }
      }
    };
    registerUser();
  }, [isSignedIn, isRegistered, getToken]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/posts`,
          newPost,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error details:", error.response || error);
        throw error;
      }
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.slug}`); // Redirect to the new post
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      toast.error("Failed to create post. Please try again.");
    }
  });

  if (!isLoaded) {
    return <div className="mt-60 flex justify-center items-center  "><Loader/></div>;
  }
  if (isLoaded && !isSignedIn) {
    return <div><LoginError/></div>
  }
  // if (isSignedIn) {
  //   console.log("User is signed in");
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const desc = formData.get("desc");
    const category = formData.get("category");
    
    if (!title || !desc || !value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = {
      img: cover?.url || "",
      title,
      desc,
      category,
      content: value,
    };

    mutation.mutate(data);
    setValue(""); // Reset the editor after submission
    e.target.reset(); // Reset the form fields
    setCover(null); // Reset the cover image
    setImg(null); // Reset the inline image
    setVid(null); // Reset the inline video
  };

  if (mutation.isLoading) {
    return <div>Creating post...</div>;
  }

  return (
    <div className="flex flex-col mt-5 gap-6 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
      <h1 className="text-xl font-semibold mt-3 ">Create a New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 gap-5 flex-1 mb-7 "
      >
        
          <div className="flex flex-col gap-4">
          <UploadExample type="image" setProgress={setProgress} setData={setCover}>
            <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
              Upload Cover Image
            </button>
          </UploadExample>
          
          {cover && cover.url && cover.url !== "1.png" && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Cover Image Preview:</p>
              <Image1
                src={cover.url} 
                alt="Cover preview" 
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
          
          <p className="text-sm text-gray-500">Progress: {progress.toFixed(1)}%</p>
        </div>
      
        <input
          type="text"
          name="title"
          placeholder="My Awesome Story"
          className="mt-2 p-2 rounded text-4xl font-semibold outline-none bg-transparent"
        />
        {/* <h1 className='text-gray-400 text-2xl font-semibold'>My Awesome Story</h1> */}

        <div className="flex gap-4 items-center">
          <label htmlFor="Category">Choose A Category</label>
          <select
            name="category"
            id=""
            className="mt-2 p-2 border rounded-xl bg-white shadow-lg cursor-pointer"
          >
            <option value="General">General..</option>
            <option value="Web Design">Web Design</option>
            <option value="Development">Development</option>
            <option value="Seo">Search Engines</option>
            <option value="Marketing">Marketing</option>
            <option value="Databases">Databases</option>
          </select>
        </div>

        <textarea
          name="desc"
          id=""
          className="outline-none border border-blue-400 rounded-2xl p-2 shadow-md"
          placeholder="A Short Description"
        />
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mb-2 mr-2">
            <UploadExample type="image" setProgress={setProgress} setData={setImg}>
              <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                📸 Add Image
              </button>
            </UploadExample>

            <UploadExample type="video" setProgress={setProgress} setData={setVid}>
              <button className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                📽️ Add Video
              </button>
            </UploadExample>
          </div>

        <ReactQuill
          theme="snow"
          className="flex-1 p-2 rounded-xl bg-white shadow-md border"
          value={value}
          onChange={setValue}

          readOnly={0 < progress && progress < 100}
          />
          </div>
        <button
          disabled={mutation.isPending || (0<progress && progress<100)}
          className="bg-blue-500 text-white mt-5 p-2 rounded w-full cursor-pointer disabled:bg-gray-400 mb-10"
        >
          {mutation.isPending ? "Creating Post..." : "Create Post"}
        </button>
      </form>


    </div>
  );
};

export default Write;
