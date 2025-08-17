import React from "react";
import Post from "../Components/Post";
import SideMenu from "../Components/SideMenu";

const Postlist = () => {
  const[open, setOpen] = React.useState(false);
  return (
    <div>
      <h1 className="mb-8 mt-4 m-3 text-2xl font-semibold">Development Blog</h1>
      <button onClick={() => setOpen(!open)} className="md:hidden text-sm bg-blue-800 px-3 py-2 text-white mb-4 rounded-2xl">{open ? "Close":"Filter Or Search"}</button>

      <div className="flex gap-8">
        {/* post */}
        <div className="">
          <Post/>
        </div>

        {/* side menu */}
        <div className={`md:block ${open ? "block" : "hidden"}`}>
          <SideMenu/>
        </div>
      </div>
    </div>
  );
};

export default Postlist;
