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

    setIsLoginUsingToken: (state, action) => {

      const isLogIn = action.payload;

      state.isLoggedIn = isLogIn;
      
    },

    loginSignupSwitchHandler: (state) => {
        state.loginSignupSwitch = !state.loginSignupSwitch;
    }
  },
});

export const { handleLogout, handleLogin, loginSignupSwitchHandler, setIsLoginUsingToken } = authSlice.actions;

export default authSlice.reducer;
