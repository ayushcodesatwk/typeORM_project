import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout, handleLogin } from "../../store/slices/authSlice";
import axios from "axios";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = () => {
    navigate("/login");
  };

  const logoutHandler = async () => {
    dispatch(handleLogout());
    const result = await axios.get("http://localhost:4000/login");
    console.log("user loggedout", result);
  };

  return (
    <>
      <div className="w-full flex bg-gray-900 p-3 justify-evenly text-4xl">
        <h1 className="font-medium text-yellow-500">E-commerce</h1>

        <div className="text-yellow-500 text-xl mt-2 ">
          <ul className="flex gap-5">
            <li
              className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
              onClick={() => navigate("/store")}
            >
              Store
            </li>
            <li
              className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
              onClick={() => navigate("/cart")}
            >
              Cart
            </li>
            {isLoggedIn ? (
              <li
                className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
                onClick={logoutHandler}
              >
                Logout
              </li>
            ) : (
              <li
                className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
                onClick={loginHandler}
              >
                Login
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
