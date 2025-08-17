import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { useRef } from "react";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const UploadExample = ({children, type, setProgress, setData}) => {
  
  const fileInputRef = useRef(null);
  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();


  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];
    
    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error("File size should not exceed 10MB");
      return;
    }

    // File type validation based on type prop
    let allowedTypes;
    if (type === 'image') {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    } else if (type === 'video') {
      allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    } else {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Only ${type === 'image' ? 'JPEG, PNG, GIF and WebP' : type === 'video' ? 'MP4, WebM and OGG' : 'image and video'} files are allowed`);
      return;
    }

    let authParams;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/upload-auth`, {
        withCredentials: true
      });
      authParams = response.data;
      if (!authParams.signature || !authParams.expire || !authParams.token) {
        throw new Error('Invalid authentication response');
      }
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      toast.error("Authentication failed. Please try again.");
      return;
    }
    
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          if (setProgress && typeof setProgress === 'function') {
            setProgress((event.loaded / event.total) * 100);
          }
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      setData(uploadResponse);
      toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
      if (setProgress && typeof setProgress === 'function') {
        setProgress(0); // Reset progress
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(`${type === 'image' ? 'Image' : 'Video'} upload failed`);
      if (setProgress && typeof setProgress === 'function') {
        setProgress(0); // Reset progress on error
      }
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden file input */}
      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        accept={`${type}/*`}
        onChange={handleUpload}
      />
      
      {/* Clickable area to trigger file selection */}
      <div 
        className="cursor-pointer" 
        onClick={() => fileInputRef.current?.click()}
      >
        {children}
      </div>
    </div>
  );
};

export default UploadExample;
