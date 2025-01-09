import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllItemsToCart,
  deleteItemFromCart,
} from "../../store/slices/cartSlice";
import { totalAmount } from "../../store/slices/cartSlice";
import { plusOne, minusOne } from "../../store/slices/cartSlice";
import OrderAccepted from "./OrderAccepted";
import { useNavigate } from "react-router-dom";


const Cart = ({ createOrder, responseId, fetchPayment, responseState }) => {
  const cartArray = useSelector((state) => state.cart.cartArray);
  const amount = useSelector((state) => state.cart.amount);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("responseState from orders--", responseState);

  //deleting item from cart
  const deleteItemHandler = async (cartId) => {
    try {
      const result = await axios.delete("http://localhost:4000/cart", {
        data: { cartId: cartId },
        withCredentials: true,
      });

      console.log("deleted item--", result);

      if (result.status === 200) {
        dispatch(deleteItemFromCart(cartId));
        dispatch(totalAmount());
        console.log("Item deleted from cart successfully...");
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  //fetching cart Item as per logged in userid
  const fetchCartItem = async () => {
    try {
      const result = await axios.get("http://localhost:4000/cart", {
        withCredentials: true,
      });

      console.log("cart Data: ", result.data);

      dispatch(addAllItemsToCart(result.data));

      dispatch(totalAmount());
    } catch (error) {
      console.error("Error fetching cart products: ", error.message);
    }
  };
  useEffect(() => {
    fetchCartItem();
  }, []);

  //increase quantity by one
  const plusOneClick = async (cartId) => {
    console.log("cartId from cartJSX PLUSCLICK-", cartId);

    try {
      const result = await axios.put(
        "http://localhost:4000/plus-one",
        { cartId: cartId },
        { withCredentials: true }
      );

      console.log("result from plusOne--", result);

      if (result.status === 200) {
        dispatch(plusOne(cartId));
        dispatch(totalAmount());
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  console.log("Cart.jsx RENDERED", cartArray);

  //reduce quantity by one
  const minusOneClick = async (cartId) => {
    console.log("cartId from cartJSX MINUSCLICK-", cartId);

    try {
      const result = await axios.put(
        "http://localhost:4000/minus-one",
        { cartId: cartId },
        { withCredentials: true }
      );

      console.log("result status minusOne--", result);

      if (result.status === 200) {
        dispatch(minusOne(cartId));
        dispatch(totalAmount());
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  return (
    <>
    {responseId ? <OrderAccepted/> : <div className="pt-28 screen-max-9:pt-44 min-h-screen bg-gray-900 screen-max-6:w-fit">
        <h1 className="text-center font-bold text-5xl text-yellow-400">
          Your Cart
        </h1>

        {!cartArray.length == 0 ? (
          cartArray.map((item, i) => (
            <div
              key={i}
              className="p-10 text-white mt-3 w-1/2 m-auto screen-max-9:w-auto min-w-96 screen-max-7:p-2 border border-yellow-200"
            >
              <div className="flex">
                <div className="flex w-full">
                  <img
                    className="w-40 h-40 first-line:shadow-lg"
                    src={item.product.imageURL}
                    alt={item.product.title}
                  />
                  <div className="mt-3 ml-10 flex justify-between w-full font-medium text-lg">
                    <div>
                      <p>{item.product.title}</p>
                      <p className="mt-3 font-bold">
                        $ {item.product.price} × {item.quantity} = ${" "}
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="mt-3 font-bold w-24">
                        <button
                          onClick={() => plusOneClick(item.cartId)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-l hover:scale-110 transition-transform duration-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => minusOneClick(item.cartId)}
                          className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-r hover:scale-105 transition-transform duration-300"
                        >
                          -
                        </button>
                      </p>
                    </div>
                    <button
                      onClick={() => deleteItemHandler(item.cartId)}
                      className="pr-4 pl-4 h-1/3 bg-white text-black  hover:bg-red-700 hover:text-white hover:scale-110 transition-transform duration-300"
                    >
                      remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
              <h1 className="font-bold text-4xl text-center mt-5 text-yellow-400">
                is empty
              </h1>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="p-3 w-52 mt-4 bg-purple-300 font-bold hover:bg-purple-600 hover:text-white text-black hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate("/all-orders")}
                >
                  Check your orders
                </button>
              </div>
          </>
        )}
        
        {!cartArray.length == 0 && (
          <>
            <div className="flex flex-col pb-20 m-auto w-1/2 items-end">
              <h1 className=" text-xl mt-5 screen-max-7:w-44 font-bold text-yellow-400">
                Total amount: $ {amount}
              </h1>
              <div className="flex gap-5">
              <button
                type="button"
                className="p-3 w-52 mt-4 bg-purple-300 font-bold hover:bg-purple-600 hover:text-white text-black hover:scale-105 transition-transform duration-300"
                onClick={() => navigate("/all-orders")}
              >
                Orders
              </button>
                <button
                  type="button"
                  className="p-3 w-52 mt-4 bg-green-300 font-bold hover:bg-green-600 hover:text-white text-black hover:scale-105 transition-transform duration-300"
                  onClick={() => createOrder(amount)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>}
      
    </>
  );
};

export default Cart;
