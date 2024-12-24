import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../store/slices/authSlice";
import axios from "axios";
import { clearCartOnLogout } from "../../store/slices/cartSlice";



const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if(result.status == 200){
        navigate("/login");
        dispatch(clearCartOnLogout());
        console.log("logout result--", result);
    };
    return
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
              onClick={() => navigate("/cart", { state: { refresh: true }})}
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
