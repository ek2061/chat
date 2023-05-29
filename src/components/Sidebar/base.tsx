import Search from "@/components/Search";
import UserChats from "@/components/UserChats";
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="relative flex h-[calc(100vh-64px)] w-1/4 max-w-sm flex-col bg-sidebar max-md:w-1/3 max-sm:hidden">
      <Search />
      <UserChats />
    </div>
  );
};

export default Sidebar;
