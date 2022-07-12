import { useState } from "react";
import { Topbar, Feed, PinDetails, CreatePin, Search } from "../components";
import { Routes, Route, Navigate } from "react-router-dom";

const Pins = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full flex flex-col flex-start gap-3 pt-2 bg-dark1">
      {/* topbar */}
      <Topbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* main body */}

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/category/:categoryId" element={<Feed />} />
        <Route path="/pin-details/:pinId" element={<PinDetails />} />
        <Route path="/create-pin" element={<CreatePin />} />
        <Route path="/search" element={<Search searchTerm={searchTerm} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default Pins;
