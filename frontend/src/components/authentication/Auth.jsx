import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin, loginSignupSwitchHandler } from "../../store/slices/authSlice";


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

  //form submitHandler
  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredMail = emailRef.current.value;

    //just sign in to existing account
    if (loginMode) {
      const enteredPass = passRef.current.value;
      console.log(enteredPass);

      const result = await axios.post(
        "http://localhost:4000/login",
        {
          email: enteredMail,
          password: enteredPass,
        },
        {
          withCredentials: true, // This allows cookies to be sent and received
        } 
      )

      console.log("line 35--", result);

      if (result.status == 200) {
        console.log("USER LOGGED IN SUCCESSFULLY");
        dispatch(handleLogin());
        navigate("/store");
      } else {
        console.log("LOGIN FAILED");
      }

      emailRef.current.value = "";
      passRef.current.value = "";

    } else {
      //create new user
      const enteredFname = fnameRef.current.value.trim();
      const enteredLname = lnameRef.current.value.trim();
      const enteredAddress = addRef.current.value.trim();
      const enteredPhone = phoneRef.current.value.trim();
      const enteredPass = passRef.current.value;
      const enteredConfPass = confirmPassRef.current.value;

      //verify phone
      if (enteredPhone.length !== 10 || isNaN(enteredPhone)) {
        return alert("Phone number must be exactly 10 digits.");
      }

      //regex to verify email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(enteredMail)) {
        return alert("Please enter a valid email address.");
      }

      //password must contain atleast 6 characters
      if (enteredPass.length < 6) {
        return alert("Password must be at least 6 characters.");
      }

      //password must match
      if (enteredConfPass !== enteredPass) {
        return alert("Password must be same, try again.");
      }


      const result = await axios.post(
        "http://localhost:4000/signup",
        {
          fname: enteredFname,
          lname: enteredLname,
          address: enteredAddress,
          phone: enteredPhone,
          email: enteredMail,
          password: enteredPass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (result.status == 201) {
        console.log("USER CREATED SUCCESSFULLY");
      } else {
        console.log("FAILED TO CREATE NEW USER");
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
  }

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
