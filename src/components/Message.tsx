import React from "react";

const Message: React.FC = () => {
  return (
    <div className="message owner">
      <div className="messageInfo">
        <img
          src="https://images.pexels.com/photos/8283967/pexels-photo-8283967.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
        />
        <span className="text-xs text-gray-500">just now</span>
      </div>
      <div className="messageContent">
        <p>
          Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello
          Hello Hello Hello
        </p>
      </div>
    </div>
  );
};

export default Message;
