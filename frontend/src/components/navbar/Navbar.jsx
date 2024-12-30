import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../store/slices/authSlice";
import axios from "axios";
import { clearCartOnLogout } from "../../store/slices/cartSlice";
import SearchBar from "../search-bar/SearchBar";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const totalItemsInCart = useSelector((state) => state.cart.totalItemsInCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  //login
  const loginHandler = () => {
    navigate("/login");
  };

  //logout
  const logoutHandler = async () => {
    dispatch(handleLogout());
    //always set withCredentials to true
    const result = await axios.get("http://localhost:4000/login", {
      withCredentials: true,
    });
    if (result.status == 200) {
      navigate("/login");
      dispatch(clearCartOnLogout());
      console.log("logout result--", result);
    }
    return;
  };

  return (
    <>
      <div className="w-full flex fixed bg-gray-900 p-3 justify-evenly text-4xl">
        <h1 className="font-medium text-yellow-500 cursor-pointer">
          E-commerce
        </h1>
        <SearchBar />

        <div className="text-yellow-500 text-xl mt-2 ">
          <ul className="flex gap-5">
            <li
              className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
              onClick={() => navigate("/store", { state: { refresh: true } })}
            >
              Store
            </li>
            <li
              className="relative hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2"
              onClick={() => navigate("/cart", { state: { refresh: true } })}
            >
              <div className="flex h-fit">
                <p>Cart</p>
                <p className="absolute top-0 right-0 w-6 h-6 transform translate-x-1/2 -translate-y-1/2 text-base pl-2 font-bold text-black bg-yellow-600 rounded-full">
                  {totalItemsInCart}
                </p>
              </div>
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
