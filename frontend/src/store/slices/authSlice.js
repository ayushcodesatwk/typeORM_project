import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginSignupSwitch: false,
  isLoggedIn: false,
  isUserToken: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    handleLogout: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },

    handleLogin: (state) => {
        if(!state.isLoggedIn){
            state.isLoggedIn  = !state.isLoggedIn;
        }
    },

    loginSignupSwitchHandler: (state) => {
        state.loginSignupSwitch = !state.loginSignupSwitch;
    }
  },
});

export const { handleLogout, handleLogin, loginSignupSwitchHandler } = authSlice.actions;

export default authSlice.reducer;
