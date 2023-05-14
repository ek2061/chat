import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-blue-300">
      <Navbar />
      <div className="flex w-full flex-1 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
