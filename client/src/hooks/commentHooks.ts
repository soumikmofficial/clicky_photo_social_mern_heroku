import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { IComment, IError } from "../types/api";

interface ICommentData {
  pinId: string;
  userId: string;
  comment: string;
}

const fetchCommentsByPinId = async (
  pinId: string | undefined
): Promise<IComment[]> => {
  const res = await axios.get(`/api/v1/comment/${pinId}`);
  return res.data;
};

const createComment = async (commentData: ICommentData): Promise<IComment> => {
  const res = await axios.post(`/api/v1/comment/`, commentData);
  return res.data;
};

const deleteComment = async (commentId: string): Promise<IComment> => {
  const res = await axios.delete(`/api/v1/comment/${commentId}`);
  return res.data;
};

//todo: custom query hooks
export const useCommentsQuery = (pinId: string | undefined) => {
  return useQuery<IComment[], IError>(
    ["fetch-comment-by-pinId", pinId],
    (context) => fetchCommentsByPinId(pinId),
    {
      enabled: !!pinId,
      refetchOnWindowFocus: false,
    }
  );
};

//todo: mutation query hooks
export const useCommentMutation = () => {
  return useMutation<IComment, IError, ICommentData>(createComment);
};

export const useCommentDeleteMutation = () => {
  return useMutation<IComment, IError, string>(deleteComment);
};
