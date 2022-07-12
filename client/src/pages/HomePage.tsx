import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SidebarResponsive, Profile, Pins, Sidebar } from "../components";

// .....................................................
const HomePage = () => {
  // todo: states and refs
  // todo: states
  const [isSidebar, setIsSidebar] = useState(false);

  // todo: return
  return (
    <div className="relative flex flex-col md:flex-row bg-dark1 transition-height duration-75 ease-out h-screen overflow-hidden">
      {/* navbar */}
      <div className="md:hidden">
        <Navbar setIsSidebar={setIsSidebar} />
      </div>
      {/* sidebar */}
      <div className="flex md:hidden absolute left-0 top-0 w-3/5 md:max-w-220">
        {isSidebar && <SidebarResponsive setIsSidebar={setIsSidebar} />}
      </div>
      <div className="hidden h-screen md:flex w-1/6 min-w-[200px]">
        <Sidebar setIsSidebar={setIsSidebar} />
      </div>

      {/* main content */}
      <div className="flex flex-1 bg-dark1 h-90vh md:h-screen px-5 py-2">
        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/*" element={<Pins />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;
