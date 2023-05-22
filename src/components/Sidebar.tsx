import React from "react";
import Search from "./Search";
import UserChats from "./UserChats";

const Sidebar: React.FC = () => {
  return (
    <div className="relative flex h-[calc(100vh-64px)] w-1/4 max-w-sm flex-col bg-sidebar max-md:w-1/3 max-sm:hidden">
      <Search />
      <UserChats />
    </div>
  );
};

export default Sidebar;
