import React from "react";
import { AiOutlineSearch, AiFillFolderAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUser } from "../store";

interface IProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Topbar: React.FC<IProps> = ({ setSearchTerm, searchTerm }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // todo: functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex  items-center  gap-10  w-full">
      <div className="flex  items-center  gap-1 bg-dark2 w-full py-2 px-4 focus-within:shadow-lg rounded">
        <AiOutlineSearch className="text-white" />
        <input
          type="text"
          className="w-full border-none outline-none bg-dark2 placeholder:text-white"
          placeholder="Search"
          onFocus={() => {
            navigate("/search");
          }}
          onChange={(e) => handleChange(e)}
          value={searchTerm}
        />
      </div>
      <div className="flex items-center justify-end gap-3 flex-shrink-0">
        <Link to={`/profile/${user?._id}`} className="hidden md:block">
          <img src={user?.avatar} alt="user" className=" w-8  rounded-full " />
        </Link>
        <Link to="/create-pin">
          <AiFillFolderAdd fontSize={40} className="text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
