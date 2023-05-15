import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import NotifDialog from "@/components/NotifDialog";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const Home = () => {
  const isAsked: boolean = window.localStorage.getItem("asked_notif") === "Y";
  const [open, setOpen] = useState<boolean>(!isAsked);

  return (
    <div className="flex min-h-screen flex-col bg-blue-300">
      <Navbar />
      <div className="flex w-full flex-1 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
      {open && <NotifDialog setOpen={setOpen} />}
    </div>
  );
};

export default Home;
