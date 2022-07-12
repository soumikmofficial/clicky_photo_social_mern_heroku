import { IPin } from "../types/api";
import { IoMdDownload } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { selectUser } from "../store";
import { useSelector } from "react-redux";
import { useDeletePinMutation, useSaveMutation } from "../hooks/pinHooks";
import { useState } from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import Spinner from "./Spinner";
import { createUsername } from "../utils/createUsername";
interface IProps {
  pin: IPin;
}

const SinglePin: React.FC<IProps> = ({ pin }) => {
  // todo:states
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // todo: mutations
  const { mutateAsync: saveUnsavePin } = useSaveMutation();
  const { mutateAsync: deletePin, isLoading: deletingPin } =
    useDeletePinMutation();

  // todo: functions
  const handleSaveUnsave = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (user) {
      saveUnsavePin({ userId: user._id, pinId: pin._id });
      window.location.reload();
    }
  };

  const handleDelete = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    deletePin(pin._id);
  };

  // todo: return
  return (
    <div className="flex flex-col  px-3 py-2 rounded-lg cursor-pointer">
      <div
        className="relative rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/pin-details/${pin._id}`)}
      >
        <img
          src={pin.image}
          alt="pin"
          className={`w-full rounded-lg ${deletingPin && "opacity-25"}`}
        />
        {isHovered && (
          <div className="absolute flex flex-col justify-between top-0 left-0 right-0 bottom-0 z-20  py-2 px-2">
            {deletingPin ? (
              <Spinner message="deleteing pin" textClass="text-red-600" />
            ) : (
              <>
                {/* save / download */}
                <div className="flex justify-between w-full">
                  {/* download */}
                  <a
                    href={pin.downloadUrl}
                    download
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IoMdDownload
                      className="bg-dark2 text-white p-1 rounded-full opacity-50 hover:opacity-100 hover:shadow-md"
                      fontSize={20}
                    />
                  </a>
                  {/* save */}
                  <div className="flex items-center gap-3 justify-end">
                    <div className="bg-red-800 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {pin.saves.length}{" "}
                    </div>
                    <button
                      className="bg-red-500 opacity-60 hover:opacity-100 text-xs px-2 py-1 rounded-lg text-white font-bold"
                      onClick={(e) => handleSaveUnsave(e)}
                    >
                      {user && pin.saves?.includes(user?._id)
                        ? "unsave"
                        : "save"}
                    </button>
                  </div>
                </div>
                {/* the link visible */}
                <div className="flex items-center justify-between">
                  <a
                    href={pin.image}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center bg-dark2 p-1 gap-2 w-max rounded-lg text-xs opacity-80 hover:opacity-100"
                  >
                    <BsFillArrowUpRightCircleFill /> {pin.image.slice(8, 27)}
                  </a>
                  {pin.userId._id === user?._id && (
                    <AiFillDelete
                      className="bg-dark2 rounded-full p-1 opacity-70 hover:opacity-100"
                      fontSize={20}
                      onClick={(e) => handleDelete(e)}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* user details */}
      <Link
        to={`/profile/${pin.userId._id}`}
        className="flex gap-2 items-center justify-start pt-2"
      >
        <img
          src={pin.userId.avatar}
          alt="avatar"
          className="w-6 f-6 rounded-full"
        />
        <p className="text-xs capitalize font-bold text-gray-300 hover:text-white">
          {createUsername(pin.userId.email)}
        </p>
      </Link>
    </div>
  );
};

export default SinglePin;
