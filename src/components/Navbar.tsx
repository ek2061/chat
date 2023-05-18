import UserImage from "@/assets/user.png";
import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "firebase/auth";
import React, { useContext } from "react";

const Navbar: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex h-16 items-center justify-between bg-navbar p-2.5 text-gray-100">
      <span className="text-2xl font-bold">Chat</span>
      <div className="flex gap-2.5">
        <img
          className="h-10 w-10 rounded-full bg-gray-100"
          src={currentUser?.photoURL ?? UserImage}
          alt="user-avatar"
        />
        <span className="flex items-center text-lg">
          {currentUser?.displayName}
        </span>
        <button
          className="flex cursor-pointer items-center space-x-2 rounded-md border-none bg-gray-500 text-sm text-gray-100"
          onClick={() => signOut(auth)}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="max-sm:hidden">logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
