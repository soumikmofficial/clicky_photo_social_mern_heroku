import { Link, useParams } from "react-router-dom";
import { useCommentMutation, useCommentsQuery } from "../hooks/commentHooks";
import {
  useDeletePinMutation,
  useFetchSinglePinQuery,
  usePinsQuery,
  useSaveMutation,
} from "../hooks/pinHooks";
import Spinner from "./Spinner";
import { IoMdDownload } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectUser } from "../store";
import { useEffect, useState, useRef } from "react";
import SingleComment from "./SingleComment";
import { IPin } from "../types/api";
import MasonryLayout from "./MasonryLayout";
import { AiFillDelete } from "react-icons/ai";
import { createUsername } from "../utils/createUsername";
import { BsBookmarkHeart } from "react-icons/bs";

const PinDetails: React.FC = () => {
  const { pinId } = useParams();
  const user = useSelector(selectUser);
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  // todo: states
  const [input, setInput] = useState("");
  const [more, setMore] = useState<IPin[] | []>([]);
  const { data: pin, isLoading: fetchingPin } = useFetchSinglePinQuery(pinId);
  const { data: comments, refetch: refetchComments } = useCommentsQuery(pinId);

  const {
    data: similarPins,
    refetch: fetchSimilarPins,
    isRefetching: fetchingSimilarPins,
  } = usePinsQuery({
    category: pin?.category,
  });
  const { mutateAsync: saveUnsave } = useSaveMutation();
  const { mutateAsync: deletePin } = useDeletePinMutation();

  const {
    mutateAsync,
    isLoading: posting,
    isSuccess: postedComment,
  } = useCommentMutation();

  // todo: functions
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && pinId && !posting) {
      mutateAsync({ userId: user._id, pinId, comment: input });
      setInput("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSaveUnsave = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (user && pin) {
      saveUnsave({ userId: user._id, pinId: pin._id });
      window.location.reload();
    }
  };

  const handleDelete = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    pin && deletePin(pin._id);
  };

  // todo: useEffects
  useEffect(() => {
    fetchSimilarPins();
  }, [fetchSimilarPins, pin]);

  useEffect(() => {
    if (postedComment) {
      setInput("");
      refetchComments();
    }
  }, [postedComment, refetchComments]);

  useEffect(() => {
    if (similarPins) {
      const otherPins = similarPins.filter((p) => p._id !== pin?._id);
      setMore(otherPins);
    }
  }, [similarPins, pin?._id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [comments]);

  // todo: return
  if (fetchingPin || fetchingSimilarPins) {
    return <Spinner message="fetching your pin" />;
  }

  return (
    <div className="flex-grow overflow-scroll flex flex-col align-center gap-5">
      {/* main details section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 bg-dark2 w-full rounded-t-2xl rounded-b-lg lg:h-[440px] py-2 px-2 lg:max-w-[1550px]">
        {/* image and url and save count*/}

        <div className="flex justify-start items-center rounded-t-2xl rounded-b-lg flex-shrink-0 relative flex-col gap-2  lg:max-w-[500px]">
          {/* the download bar */}
          <div className="flex items-center justify-between w-full">
            <a href={pin?.downloadUrl}>
              <IoMdDownload
                className="bg-gray-800 text-white rounded-full p-[3px]"
                fontSize={18}
              />
            </a>
            {/* delete save buttons */}
            <div className="flex gap-5 justify-end items-center">
              <button
                className="opacity-60 hover:opacity-100 text-sm rounded-lg font-bold"
                onClick={(e) => handleSaveUnsave(e)}
              >
                {user && pin?.saves?.includes(user?._id) ? "unsave" : "save"}
              </button>
              {pin?.userId._id === user?._id && (
                <AiFillDelete
                  className="rounded-full p-1 opacity-70 hover:opacity-100 text-red-500 cursor-pointer self-end"
                  fontSize={25}
                  onClick={(e) => handleDelete(e)}
                />
              )}
            </div>
          </div>
          <a
            href={pin?.image}
            target="_blank"
            rel="noreferrer"
            className="relative"
          >
            <p className="absolute bottom-2 right-3 lg:right-3 text-red-500 flex items-center gap-2 text-sm">
              <span>{pin?.saves.length}</span> <BsBookmarkHeart />
            </p>
            <img
              src={pin?.image}
              alt="pin"
              className="max-h-[400px] rounded-t-2xl rounded-b-lg object-contain"
            />
          </a>
        </div>
        {/* details */}
        <div className="flex-grow px-3 flex flex-col gap-5 lg:gap-1">
          {/* title and user */}
          <div className="flex items-center gap-1 justify-center flex-col lg:items-start mb-3">
            <h2 className="font-bold text-2xl md:text-3xl text-center">
              {pin?.title}
            </h2>
            {/* posted by */}
            <Link
              to={`/profile/${pin?.userId._id}`}
              className="flex gap-1 items-center justify-start"
            >
              <span className="font-bold text-xs mr-1 text-gray-500">by</span>
              <img
                src={pin?.userId.avatar}
                alt="avatar"
                className="w-6 f-6 rounded-full"
              />
              <p className="text-xs capitalize font-bold text-gray-400">
                {pin && createUsername(pin.userId.email)}
              </p>
            </Link>
          </div>
          {/* about the pin */}
          <div className="mt-2 lg:mt-0">
            <p className="text-m lg:text-sm text-gray-200 lg:text-left text-center">
              {pin?.about}
            </p>
          </div>
          {/* comments */}
          <div className="flex-shrink-0  flex-grow lg:max-h-[250px] max-h-[300px] flex flex-col gap-2 py-2">
            <p className="flex items-center gap-2 underline">
              Comments{" "}
              <span className="text-sm font-bold">
                {comments && comments?.length}
              </span>{" "}
            </p>
            <div
              className="overflow-scroll flex flex-col gap-3"
              ref={scrollRef}
            >
              {pin &&
                comments &&
                comments.map((comment) => (
                  <SingleComment
                    key={comment._id}
                    pin={pin}
                    comment={comment}
                    refetchComments={refetchComments}
                  />
                ))}
            </div>
          </div>
          {/* form */}
          <div className="flex gap-2 items-center ">
            <Link
              to={`/profile/${pin?.userId._id}`}
              className="items-center justify-start pt-2 hidden lg:flex"
            >
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-6 f-6 rounded-full flex-shrink-0 "
              />
            </Link>
            <form
              className="flex gap-4 w-full"
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                required
                name="comment"
                className="w-full px-2 py-2 outline-none border-b-2 border-gray-300 text-lg bg-dark2"
                placeholder="Make a comment..."
                value={input}
                onChange={(e) => handleChange(e)}
                maxLength={200}
              />
              <button
                type="submit"
                className="bg-red-500 self-center px-4 py-1 text-white rounded-lg cursor-pointer flex-shrink-0"
                disabled={posting}
              >
                {posting ? "posting" : "post"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full ">
        <h1 className="text-center font-bold text-gray-400">More like this</h1>
        {more.length < 1 ? (
          <h3 className="text-center mt-3 text-gray-500">
            oops! no similar pins for now
          </h3>
        ) : (
          <MasonryLayout pins={more} />
        )}
      </div>
    </div>
  );
};

export default PinDetails;
