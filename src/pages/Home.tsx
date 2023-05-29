import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import NotifDialog from "@/components/NotifDialog";
import Sidebar_base from "@/components/Sidebar/base";
import Sidebar_sm from "@/components/Sidebar/sm";
import withPageLayout from "@/hoc/withPageLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { closeSidebar } from "@/store/app.slice";
import { useState } from "react";

const Home = () => {
  const dispatch = useAppDispatch();

  const isAsked: boolean = window.localStorage.getItem("asked_notif") === "Y";
  const [open, setOpen] = useState<boolean>(!isAsked);

  const { isSidebarOpen, windowWidth } = useAppSelector((state) => state.app);

  return (
    <div className="flex min-h-screen flex-col bg-blue-300">
      <Navbar />

      <div className="flex w-full flex-1 overflow-hidden">
        {windowWidth > 640 ? (
          <Sidebar_base />
        ) : (
          <Sidebar_sm
            isOpen={isSidebarOpen}
            onClose={() => dispatch(closeSidebar())}
          />
        )}
        <Chat />
      </div>
      {open && <NotifDialog setOpen={setOpen} />}
    </div>
  );
};

export default withPageLayout(Home);
