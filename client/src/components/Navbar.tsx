import React, { FC } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { AiFillCamera } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store";

interface IProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: FC<IProps> = ({ setIsSidebar }) => {
  const user = useSelector(selectUser);

  return (
    <nav className="shadow-md px-5 py-4 h-10vh bg-dark2">
      <div className="flex items-center justify-between">
        {/* burger */}
        <HiOutlineMenuAlt2
          fontSize={20}
          className="cursor-pointer"
          onClick={() => {
            setIsSidebar(true);
          }}
        />
        {/* logo */}
        <Link to="/" className="flex gap-1 items-center justify-center">
          <AiFillCamera fontSize={20} className="text-red-400" />
          <p>
            CLIC<span className="text-red-400">K</span>Y
          </p>
        </Link>
        <Link to={`/profile/${user?._id}`}>
          <img src={user?.avatar} className="w-7 rounded-full" alt="" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
