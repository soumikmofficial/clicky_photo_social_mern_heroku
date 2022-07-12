import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  name: string;
  email: string;
  avatar: string;
  _id: string;
}

interface IUserSliceState {
  user: IUser | null;
}

const initialState: IUserSliceState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

const { reducer, actions } = userSlice;
export const { addUser, removeUser } = actions;
export default reducer;
