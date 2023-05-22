import UserImage from "@/assets/user.png";
import { ChatContext } from "@/context/ChatContext";
import { useContext } from "react";
import { ChatsData } from "./type";

interface UserItemProps {
  loading: boolean;
  chat: ChatsData["key"];
}

export const UserItem: React.FC<UserItemProps> = ({ loading, chat }) => {
  const { dispatch } = useContext(ChatContext);

  const handleSelect = (u: ChatsData["key"]["userInfo"]) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div
      className={`${
        loading && "hidden"
      } flex cursor-pointer items-center gap-2.5 p-2.5 text-white hover:bg-navbar`}
      onClick={() => handleSelect(chat.userInfo)}
    >
      <img
        className="h-10 w-10 rounded-full bg-gray-100 object-cover"
        src={chat.userInfo.photoURL ?? UserImage}
        alt={chat.userInfo.displayName}
      />
      <div className="flex flex-grow flex-col overflow-hidden">
        <span className="text-lg font-medium">{chat.userInfo.displayName}</span>
        {chat.sender && (
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-300">
            {`${chat.sender}: ${chat.lastMessage}`}
          </p>
        )}
      </div>
    </div>
  );
};
