import React, { useState } from "react";
import Cart from "../cart/Cart";
import axios from "axios";
import { clearCartOnLogout } from "../../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
  const cartItems = useSelector((state) => state.cart.cartArray);
  const totalAmount = useSelector((state) => state.cart.amount);
  const dispatch = useDispatch();

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
      alert("Error at Razorpay screen loading.");
      return;
    }

    //after successful payment handler function will be called
    //and the order will be created in the database
    //and the cart will be cleared by calling the api in the backend
    const options = {
      key: "rzp_test_omD6kXJUMZEbn4",
      amount: amount,
      currency: "INR",
      name: "ecommerce website",
      description: "Payment to ecommerce website",
      image: "",
      handler: async function (response) {
        setResponseId(response.razorpay_payment_id);

        console.log("razorpay_payment_id--", response.razorpay_payment_id);

        //create the order after successful payment
        try {
          const result = await axios.post(
            "http://localhost:4000/createOrder",
            {
              totalPrice: totalAmount,
              orderItem: cartItems,
              paymentId: response.razorpay_payment_id,
            },
            { withCredentials: true }
          );

          console.log("handler function result--", result);

          if (result.status === 200 || result.status === 201) {
            console.log("Order created successfully", result.data);

            // clear the cart after successful order creation
            try {
              const result = await axios.delete(
                "http://localhost:4000/clearCart",
                {
                  withCredentials: true,
                }
              );

              console.log("Cart cleared successfully", result.data);

              if (result.status === 200) {
                dispatch(clearCartOnLogout());
              }
            } catch (error) {
              console.log("Error clearing cart data--", error);
            }
          } else {
            console.log("Error creating order", result.data);
          }
        } catch (error) {
          console.log("Error creating order", error);
        }
      },
      prefill: {
        name: "E-commerce website",
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
      .catch((err) => console.log("Error getting payment details--", err));
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
        console.log(
          "createRazorpayOrder response.data- ",
          JSON.stringify(response.data)
        );
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
      />

      {/* <form onSubmit={paymentFetch}>
        <input type="text" name="paymentId" />
        <button type="submit" className="p-2">
          Submit
        </button>
      </form> */}

      {/* <div>
        {responseState.map((response) => (
          <ul className="border border-white p-2" key={response.id}>
            <li>{response.id}</li>
            <li>{response.amount}</li>
            <li>{response.status}</li>
          </ul>
        ))}
      </div> */}
    </>
  );
};

export default Orders;
