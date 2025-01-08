import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/navbar/Navbar";
const Store = lazy(() => import("./components/store/Store"))
const Auth = lazy(() => import("./components/authentication/Auth"))
const About = lazy(() => import("./components/about/About"))
const ProductPage = lazy(() => import("./components/product-page/ProductPage"))
const UploadProduct = lazy(() => import("./components/product-uploader/UploadProduct")) 
const Orders = lazy(() => import("./components/orders/Orders"))
const AllOrders = lazy(() => import("./components/all-orders/AllOrders"));

import { useDispatch } from "react-redux";
import { setIsLoginUsingToken } from "./store/slices/authSlice";
import { Bounce, ToastContainer, toast } from "react-toastify";


function App() {
  const dispatch = useDispatch();

  //set the isLogin to
  const isLoginCheck = async () => {
    const waitForMe = await axios.get("http://localhost:4000/is-login", {
      withCredentials: true,
    });

    if (waitForMe.status === 200) {
      console.log("user is already logged in--", waitForMe);
      dispatch(setIsLoginUsingToken(waitForMe.data));
    }

    console.log("user is not logged in--", waitForMe);
    return;
  };

  //toast notification
  const notify = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
  };

  useEffect(() => {
    isLoginCheck();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<Store clickFunc={(msg) => notify(msg)}/>} />
          <Route path="/store/:productId" element={<ProductPage clickFunc={(msg) => notify(msg)}/>} />
          <Route path="/cart" element={<Orders />} />
          <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/uploadProduct" element={<UploadProduct />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        toastStyle={{ }}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      />
    </>
  );
}

export default App;
