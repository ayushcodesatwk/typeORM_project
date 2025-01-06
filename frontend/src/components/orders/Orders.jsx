import React, { useState } from "react";
import Cart from "../cart/Cart";
import axios from "axios";

const Orders = () => {
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const loadScript = (src) => {
    return new Promise((res, rej) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => {
        res(true);
      };

      script.onerror = () => {
        res(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("error at razorpay screen loading..");
      return;
    }

    const options = {
      key: "rzp_test_omD6kXJUMZEbn4",
      amount: amount,
      currency: "INR",
      name: "ecommerce website",
      description: "payment to ecommerce website",
      image: "",
      handler: function (response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: "ecommerce website",
        email: "ayushpal6939@gmail.com",
      },
      theme: {
        color: "#ffff",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = (e) => {
    e.preventDefault();

    const paymentId = e.target.paymentId.value;

    axios
      .get(`http://localhost:4000/payment/${paymentId}`)
      .then((response) => {
        console.log(response.data);
        setResponseState(response.data);
      })
      .catch((err) => console.log("Error getting payment details--", error));
  };

  const createRazorpayOrder = (amount) => {
    let data = JSON.stringify({
      amount: amount * 100,
      currency: "INR",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:4000/orders",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.error("Error creating Razorpay order:", error);
      });
  };

  return (
    <>
      <Cart
        createOrder={(amount) => createRazorpayOrder(amount)}
        responseId={responseId}
        fetchPayment={paymentFetch}
        responseState={responseState}
      />
    </>
  );
};

export default Orders;
