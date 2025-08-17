import React from "react";
import Search from "./Search";
import { Link } from "react-router-dom";
import { SignedIn } from '@clerk/clerk-react';

const SideMenu = () => {
  return (
    <div className="hidden md:block sticky top-8 h-max">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      
      {/* Saved Posts - Only show for authenticated users */}
      <SignedIn>
        <h1 className="mt-7 mb-4 text-sm font-medium">Quick Actions</h1>
        <div className="flex flex-col gap-2 text-sm">
          <Link 
            to="/saved" 
            className="hover:text-blue-800 underline text-blue-600 font-medium"
          >
            📚 Saved Posts
          </Link>
        </div>
      </SignedIn>
      
      <h1 className=" mt-7 mb-4 text-sm font-medium">Filters</h1>
      {/* filters */}
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor=" " className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            className="cursor-pointer appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-700"
          />
          Newest
        </label>

        <label htmlFor=" " className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            className="cursor-pointer appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-700"
          />
          Most Popular
        </label>

        <label htmlFor=" " className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            className="cursor-pointer appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-700"
          />
          Trending
        </label>

         <label htmlFor=" " className='flex items-center gap-2 cursor-pointer'>
                <input type="radio" name='sort' value="newest" className='cursor-pointer appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-700' />
                Oldest
            </label>

      </div>

      {/* categories */}
      <h1 className=" mt-7 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <Link className="hover:text-blue-800 underline" to="/posts">
          All Posts
        </Link>
        <Link
          className="hover:text-blue-800 underline"
          to="/posts?cat=web-design"
        >
          Web-Design
        </Link>
        <Link
          className="hover:text-blue-800 underline"
          to="/posts?cat=development"
        >
          Development
        </Link>
        <Link
          className="hover:text-blue-800 underline"
          to="/posts?cat=marketing"
        >
          Marketing
        </Link>
        <Link className="hover:text-blue-800 underline" to="/posts?cat=seo">
          Search Engines
        </Link>
        <Link
          className="hover:text-blue-800 underline"
          to="/posts?cat=marketing"
        >
          Databases
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
