import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Store from "./components/store/Store";
import Cart from "./components/cart/Cart";
import Auth from "./components/authentication/Auth";
import About from "./components/about/About";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsLoginUsingToken } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  //set the isLogin to 
  const isLoginCheck = async () => {
    const waitForMe = await axios.get("http://localhost:4000/is-login", {
      withCredentials: true,
    });

    if (waitForMe.status === 200) {
      console.log("true hai--", waitForMe);
      dispatch(setIsLoginUsingToken(waitForMe.data));
    }

    console.log("wait for me check- ", waitForMe);
    return;
  };

  useEffect(() => {
    isLoginCheck();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
