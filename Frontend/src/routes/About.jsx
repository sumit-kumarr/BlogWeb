import React from "react";
import { FaPenFancy, FaTrashAlt, FaCommentDots, FaGoogle } from "react-icons/fa";

const About = () => {
  return (
    <div className="px-6 py-10 mt-4 max-w-5xl mx-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">
        About Our Blog Platform
      </h1>

      {/* Intro Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 leading-relaxed text-gray-700">
        <p className="mb-4">
          Welcome to <span className="font-semibold text-blue-500">Our Blog Platform!</span> — 
          your space to share thoughts, tell stories, and connect with a community of curious minds.
          We’ve built this platform with **simplicity and creativity** in mind.
        </p>

        <p className="mb-4">
          Whether you're a passionate writer, a casual blogger, or just here to read,
          you’ll find tools that make your blogging journey smooth and enjoyable.
        </p>

        {/* Feature List */}
        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-4">
          ✨ What You Can Do Here
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <FaPenFancy className="text-blue-500 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Create Posts</h3>
              <p>Write and publish your own blog posts with our easy-to-use editor.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaTrashAlt className="text-red-500 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Delete Posts</h3>
              <p>Control your content — remove posts anytime you wish.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaCommentDots className="text-green-500 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Comment on Posts</h3>
              <p>Engage with other readers and writers by sharing your thoughts.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaGoogle className="text-yellow-500 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Google Authentication</h3>
              <p>Sign in securely with your Google account — no hassle, no password.</p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <p className="font-medium text-blue-500 mt-6">
          Join us today, share your voice, and be part of our growing community! 🚀
        </p>
      </div>

        {/* Footer */}
        <div>
            <p className="text-center text-gray-500 mt-8">
                &copy; {new Date().getFullYear()} BlogWeb || Made By sumit😎. All rights reserved.
            </p>
        </div>
    </div>
  );
};

export default About;
