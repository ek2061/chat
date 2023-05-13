import UserImage from "@/assets/user.png";
import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import React, { useContext } from "react";

const Navbar: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <img src={currentUser?.photoURL ?? UserImage} alt="" />
        <span>{currentUser?.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
