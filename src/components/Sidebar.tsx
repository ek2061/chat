import React from "react";
import Search from "./Search";
import UserChats from "./UserChats";

const Sidebar: React.FC = () => {
  return (
    <div className="relative max-w-md flex-1 bg-sidebar">
      <Search />
      <UserChats />
    </div>
  );
};

export default Sidebar;
