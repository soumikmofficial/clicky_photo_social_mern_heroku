import React from "react";
import { AiFillCamera } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { Link, NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { selectUser } from "../store";
import { useSelector } from "react-redux";
import { useCategoriesQuery } from "../hooks/pinHooks";
import { HiOutlineHashtag } from "react-icons/hi";

interface IProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const isActiveStyle = `pl-5 text-white flex items-center gap-2 font-extrabold border-r-2 border-white capitalize transition-all duration-200 ease `;
const isInactiveStyle = `pl-5 text-gray-400 flex items-center gap-2 text-sm capitalize hover:text-white transition-all duration-200 ease`;

const SidebarResponsive: React.FC<IProps> = ({ setIsSidebar }) => {
  const user = useSelector(selectUser);
  // todo: functions
  const closeSidebar = () => {
    setIsSidebar(false);
  };

  //todo: query and mutation
  const { data, isLoading } = useCategoriesQuery();

  // todo: return
  return (
    <aside className="flex flex-col h-screen w-full z-10 animate-slide-in pb-5 bg-dark2">
      <div className="flex justify-between shadow-md px-5 py-4">
        <Link
          to="/"
          className="flex gap-1 items-center justify-center"
          onClick={closeSidebar}
        >
          <AiFillCamera fontSize={20} className="text-red-400" />
          <p>
            CLIC<span className="text-red-400">K</span>Y
          </p>
        </Link>
        <ImCross
          className="ml-auto text-red-400 cursor-pointer md:hidden"
          onClick={closeSidebar}
        />
      </div>
      {/* buttons and links */}
      <div className="flex flex-col py-2 gap-4 flex-grow">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isInactiveStyle
          }
          onClick={closeSidebar}
        >
          <AiFillHome /> Home
        </NavLink>

        <h3 className="ml-5 text-sm ">Discover Categories</h3>
        {isLoading ? (
          <></>
        ) : (
          data &&
          data.map((category, i) => (
            <NavLink
              key={i}
              to={`/category/${category._id}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isInactiveStyle
              }
              onClick={closeSidebar}
            >
              <HiOutlineHashtag fontSize={20} />
              {category._id}
              <p className="text-xs text-red-500">{category.count}</p>
            </NavLink>
          ))
        )}
      </div>
      {user && (
        <Link
          to={`/profile/${user._id}`}
          onClick={closeSidebar}
          className="flex gap-2 items-center justify-center p-2 shadow-lg w-max mx-auto rounded"
        >
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <p className="text-xs text-gray-300">{user.name}</p>
        </Link>
      )}
    </aside>
  );
};

export default SidebarResponsive;
