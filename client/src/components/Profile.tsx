import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCreatedPinsQuery, useSavedPinsQuery } from "../hooks/pinHooks";
import { useUserQuery } from "../hooks/userHooks";
import { selectUser } from "../store";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { useLogout } from "../hooks/useLogout";

const randomImg = "https://source.unsplash.com/1600x900?photography";

const btnStyles = "capitalize text-gray-300 transition-all ease duration-1";

const activeBtnStyles =
  "capitalize border-b-2 border-red-600 transition-all ease duration-1 text-red-500";

const Profile = () => {
  const { userId } = useParams();
  const user = useSelector(selectUser);

  const logout = useLogout();

  // todo: states
  const [tab, setTab] = useState<"created" | "saved">("created");

  const { data: createdPins, isLoading: fetchingCreated } =
    useCreatedPinsQuery(userId);
  const { data: savedPins, isLoading: fetchingSaved } =
    useSavedPinsQuery(userId);
  const { data: profile } = useUserQuery(userId);

  // todo: functions
  const handleLogout = () => {
    logout();
  };

  // todo: return
  return (
    <div className="w-full flex flex-col items-center gap-3 overflow-scroll">
      {/* cover */}
      <div className="relative w-full h-340 2xl:h-500 flex justify-center flex-shrink-0">
        <img src={randomImg} alt="" className="h-full w-full object-cover" />
        <a
          href={profile?.avatar}
          className="absolute bottom-0 -translate-y-[-50%] "
        >
          <img
            src={profile?.avatar}
            alt=""
            className="rounded-full shadow-lg w-16 f-16"
          />
        </a>
        {user?._id === profile?._id && (
          <HiOutlineLogout
            className="absolute right-5 top-5 text-red-500 bg-white p-2 shadow-md rounded-full cursor-pointer"
            fontSize={36}
            onClick={handleLogout}
          />
        )}
      </div>
      {/* name */}
      <h1 className="mt-10 font-bold text-2xl">{profile?.name}</h1>
      {/* buttons */}
      <div className="flex gap-5 items-center justify-center py-2">
        <button
          type="button"
          className={tab === "created" ? activeBtnStyles : btnStyles}
          onClick={() => setTab("created")}
        >
          created
        </button>
        <button
          type="button"
          className={tab === "saved" ? activeBtnStyles : btnStyles}
          onClick={() => setTab("saved")}
        >
          saved
        </button>
      </div>
      {/* pins */}
      <div className="w-full">
        {fetchingSaved || fetchingCreated ? (
          <Spinner message="fetching pins" />
        ) : (
          <MasonryLayout pins={tab === "created" ? createdPins : savedPins} />
        )}
      </div>
    </div>
  );
};

export default Profile;
