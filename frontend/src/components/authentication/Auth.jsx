import axios from "axios";
import React, { useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleLogin,
  loginSignupSwitchHandler,
} from "../../store/slices/authSlice";
import { fetchCart } from "../../utils/cartUtils";
import { addAllItemsToCart, totalAmount } from "../../store/slices/cartSlice";

const Auth = () => {
  //no need to create states on redux for this page
  const dispatch = useDispatch();
  const loginMode = useSelector((state) => state.auth.loginSignupSwitch);
  const navigate = useNavigate();

  const fnameRef = useRef();
  const lnameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const addRef = useRef();
  const phoneRef = useRef();
  const confirmPassRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;

    if (loginMode) {
      const password = passRef.current.value;

      try {
        const response = await axios.post(
          "http://localhost:4000/login",
          { email, password },
          { withCredentials: true }
        );

        // console.log("response from auth.jsx--", response);
        

        if (response.status === 200 || response.status === 201) {
          dispatch(handleLogin());
          const result = await fetchCart();
          // console.log("result from auth.jsx--", result);

          try {
            if (result.status === 200 || result.status === 201) {
              dispatch(addAllItemsToCart(result.data));
              dispatch(totalAmount());
            }
          } catch (error) {
            console.error("Error fetching cart items:", error.message);
          }
        }
        navigate("/store");
      } catch (error) {
        console.error("Login failed:", error.message);
      }

      emailRef.current.value = "";
      passRef.current.value = "";
    } else {
      const firstName = fnameRef.current.value.trim();
      const lastName = lnameRef.current.value.trim();
      const address = addRef.current.value.trim();
      const phoneNumber = phoneRef.current.value.trim();
      const password = passRef.current.value;
      const confirmPassword = confirmPassRef.current.value;

      if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
        alert("Phone number must be exactly 10 digits.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      if (confirmPassword !== password) {
        alert("Password must be same, try again.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:4000/signup", {
          firstName,
          lastName,
          address,
          phoneNumber,
          email,
          password,
        });

        if (response.status === 201) {
          console.log("User created successfully");
        } else {
          console.error("Failed to create new user:", response.data);
        }
      } catch (error) {
        console.error("Failed to create new user:", error.message);
      }

      fnameRef.current.value = "";
      lnameRef.current.value = "";
      addRef.current.value = "";
      phoneRef.current.value = "";
      emailRef.current.value = "";
      passRef.current.value = "";
      confirmPassRef.current.value = "";
    }
  };

  // loginsignup switch handler
  const switchHandler = () => {
    dispatch(loginSignupSwitchHandler());
  };

  return (
    <>
      <div className="w-full pt-20 screen-max-6:h-[1200px] bg-gray-900 h-auto screen-max-6:w-fit min-h-screen screen-max-12:pt-48">
        <div className="ml-auto  mr-auto w-[500px] p-5 border-2 border-stone-200 mt-20 max-h-[700px] overflow-y-scroll scrollbar-hide ">
          <h2 className="text-3xl font-bold text-center text-stone-100">
            {loginMode ? "Login" : "Sign up"}
          </h2>
          <br />

          {/* form starts from here*/}
          <form onSubmit={submitHandler}>
            {!loginMode && (
              <>
                <label
                  className="font-medium text-stone-100"
                  htmlFor="firstname"
                >
                  First Name
                </label>
                <br />
                <input
                  className="w-full h-10 p-2 font-sans outline-double"
                  type="text"
                  name="firstname"
                  id="firstname"
                  ref={fnameRef}
                  required
                />
                <br /> <br />
                <label
                  className="font-medium text-stone-100"
                  htmlFor="lastname"
                >
                  Last Name
                </label>
                <br />
                <input
                  className="w-full h-10 p-2 font-sans outline-double"
                  type="text"
                  name="lastname"
                  id="lastname"
                  ref={lnameRef}
                  required
                />
                <br /> <br />
                <label className="font-medium text-stone-100" htmlFor="address">
                  Address
                </label>
                <br />
                <input
                  className="w-full h-10 p-2 font-sans outline-double"
                  type="text"
                  name="address"
                  id="address"
                  ref={addRef}
                  required
                />
                <br /> <br />
                <label className="font-medium text-stone-100" htmlFor="phone">
                  Phone
                </label>
                <br />
                <input
                  className="w-full h-10 p-2 font-sans outline-double"
                  type="tel"
                  // for a 10 digit number give pattern
                  pattern="[0-9]{10}"
                  maxLength="10"
                  minLength="10"
                  placeholder="Enter your phone number"
                  name="phone"
                  id="phone"
                  ref={phoneRef}
                  required
                />
                <br /> <br />
              </>
            )}
            <label className="font-medium text-stone-100" htmlFor="email">
              Email
            </label>
            <br />
            <input
              className="w-full h-10 p-2 font-sans outline-double"
              type="email"
              name="email"
              id="email"
              ref={emailRef}
              required
            />
            <br /> <br />
            <label className="font-medium text-stone-100" htmlFor="password">
              Password
            </label>
            <br />
            <input
              className="w-full h-10 p-2 font-sans outline-double"
              type="password"
              ref={passRef}
              name="password"
              id="password"
              required
            />
            <br />
            {!loginMode && (
              <>
                <br />
                <label
                  className="font-medium text-stone-100"
                  htmlFor="confpassword"
                >
                  Confirm Password
                </label>{" "}
                <br />
                <input
                  className="w-full h-10 p-2 font-sans outline-double"
                  type="password"
                  ref={confirmPassRef}
                  name="password"
                  id="confpassword"
                  required
                />
              </>
            )}
            <button
              type="submit"
              className="w-full hover:bg-yellow-400 mt-5 bg-yellow-300 font-medium text-lg p-3 "
            >
              {loginMode ? "Login" : "Sign Up"}
            </button>{" "}
            <br />
            <p
              onClick={switchHandler}
              className=" hover:underline mt-3 cursor-pointer text-stone-100 text-center"
            >
              {loginMode
                ? "Create an account"
                : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
