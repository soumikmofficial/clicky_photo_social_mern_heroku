import { googleLogout } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { removeUser } from "../features/userSlice";
import { useLogoutMutation } from "./userHooks";

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
