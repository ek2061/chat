import Search from "@/components/Search";
import UserChats from "@/components/UserChats";
import Portal from "@/modules/Portal";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <Portal>
      <div className="sm:hidden">
        <div
          className={`fixed left-0 top-16 z-10 h-screen w-screen bg-gray-800 ${
            isOpen ? "opacity-50" : "opacity-0"
          } transition-all duration-300 ease-in-out`}
          onClick={onClose}
        />
        <div
          className={`fixed left-0 top-16 z-10 h-screen bg-white ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="h-[calc(100vh-64px)] bg-sidebar">
            <Search />
            <UserChats />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Sidebar;
