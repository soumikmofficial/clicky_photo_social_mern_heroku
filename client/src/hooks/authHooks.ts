import { googleLogout } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../features/userSlice";
import { useLogoutMutation } from "./userHooks";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { mutate: logout } = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    googleLogout();
    logout();
    dispatch(removeUser());
  };

  return handleLogout;
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return async (token: string) => {
    try {
      const {
        data: { user },
      } = await axios.post("/api/v1/user", {
        token,
      });
      dispatch(addUser(user));
      navigate("/");
    } catch (error: any) {
      console.log(error);
    }
  };
};
