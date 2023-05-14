import React from "react";
import Chats from "./Chats";
import Search from "./Search";

const Sidebar: React.FC = () => {
  return (
    <div className="relative max-w-md flex-1 bg-sidebar">
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
