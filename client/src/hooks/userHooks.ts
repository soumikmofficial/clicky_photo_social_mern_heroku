import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { IError, IUserID } from "../types/api";

interface ILogoutResponse {
  status: string;
}

// todo: functions
const fetchUser = async (userId: string | undefined): Promise<IUserID> => {
  const res = await axios.get(`/api/v1/user/${userId}`);
  return res.data;
};

const logout = async (): Promise<ILogoutResponse> => {
  const res = await axios.delete("/api/v1/user/logout");
  return res.data;
};

// todo: custom query hooks

export const useUserQuery = (userId: string | undefined) => {
  return useQuery<IUserID, IError>(
    ["fetch-user", userId],
    (context) => fetchUser(userId),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useLogoutMutation = () => {
  return useMutation<ILogoutResponse, IError>(logout);
};
