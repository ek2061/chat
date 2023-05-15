import { BellAlertIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";

const NotifDialog: React.FC<{ setOpen: Dispatch<SetStateAction<boolean>> }> = ({
  setOpen,
}) => {
  const handleOk = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
      closeDialog();
    }
  };

  const closeDialog = () => {
    window.localStorage.setItem("asked_notif", "Y");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-14 right-2 flex h-28 w-72 flex-col justify-end rounded-md bg-chatbar shadow-lg">
      <div className="absolute top-0 flex items-center space-x-2 p-3">
        <BellAlertIcon className="h-10 w-10" />
        <p className="overflow-hidden text-sm text-gray-100">
          Turn on notifications to receive instant messages from friends!!
        </p>
      </div>

      <div className="flex w-full justify-between space-x-1 p-2">
        <button
          className="h-10 w-1/2 cursor-pointer border-none bg-sidebar text-white"
          onClick={handleOk}
        >
          ok
        </button>
        <button
          className="h-10 w-1/2 cursor-pointer border-none bg-sidebar text-white"
          onClick={closeDialog}
        >
          no
        </button>
      </div>
    </div>
  );
};

export default NotifDialog;
