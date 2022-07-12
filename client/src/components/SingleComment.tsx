import React, { useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCommentDeleteMutation } from "../hooks/commentHooks";
import { selectUser } from "../store";
import { IComment, IPin } from "../types/api";

interface IProps {
  pin: IPin;
  comment: IComment;
  refetchComments: any;
}

const SingleComment: React.FC<IProps> = ({ pin, comment, refetchComments }) => {
  const user = useSelector(selectUser);
  // todo: mutaion and query
  const { mutateAsync, isSuccess: deleted } = useCommentDeleteMutation();

  // todo: functions
  const handleDelete = () => {
    mutateAsync(comment._id);
  };

  // todo: useEffects
  useEffect(() => {
    refetchComments();
  }, [deleted, refetchComments]);

  useEffect(() => {}, []);
  // todo: return
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0">
        <Link
          to={`/profile/${pin?.userId._id}`}
          className="flex gap-2 items-center justify-start pt-2"
        >
          <img
            src={comment.userId.avatar}
            alt="avatar"
            className="w-6 f-6 rounded-full"
          />
        </Link>
      </div>
      <div className="flex-grow flex gap-1 flex-col">
        <Link
          to={`/profile/${pin?.userId._id}`}
          className="flex items-center justify-start "
        >
          <p className="text-xs capitalize font-bold text-gray-500">
            {comment?.userId.name}
          </p>
        </Link>
        <p className="text-sm italic text-gray-300">{comment.comment}</p>
      </div>
      {user?._id === comment.userId._id && (
        <>
          {deleted ? (
            "deleted"
          ) : (
            <AiFillDelete
              className="text-red-400 cursor-pointer flex-shrink-0"
              onClick={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SingleComment;
