import React from "react";
import { Link } from "react-router-dom";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg justify-center items-center gap-6">
      {/* links */}
      <div className="flex gap-3 space-y-3 justify-center items-center p-4 ">
        <ul className="">
          <Link
            to="/posts"
            className="bg-blue-800 px-4 py-2 font-bold text-white rounded-2xl"
          >
            All Posts
          </Link>

          <Link
            to="/posts?cat=web-design"
            className="hover:bg-blue-100 rounded-3xl px-4 py-2"
          >
            Web Design
          </Link>

          <Link to="/posts?cat=development" className="hover:bg-blue-100 rounded-3xl px-4 py-2">
            Developments
          </Link>

          <Link to="/posts?cat=seo" className="hover:bg-blue-100 rounded-3xl px-4 py-2">
            Search Engines
          </Link>

          <Link to= "/posts?cat=databases" className='hover:bg-blue-100 rounded-3xl px-4 py-2'>
            Databases
            </Link>

            <Link to= "/posts?cat=marketing" className='hover:bg-blue-100 rounded-3xl px-4 py-2'>
            Marketing
            </Link>

        </ul>
      </div>

      {/* search */}
      <div className=" items-cente bg-gray-200 flex items-center rounded-full">
        <input
          type="text"
          placeholder="Search.."
          className="outline-none p-2 border border-gray-400 rounded-4xl hover:border-blue-800"
        />
      </div>
    </div>
  );
};

export default MainCategories;
