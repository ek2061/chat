import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <img
          src="https://images.pexels.com/photos/8283967/pexels-photo-8283967.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
        />
        <span>Jane</span>
        <button>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
