import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState(null);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const result = await axios.get("http://localhost:4000/all-orders", {
        withCredentials: true,
      });

      if (result.status === 200) {
        console.log("All orders--", result.data);
        setAllOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching all orders--", error.message);
      setError(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const deleteOrder = async (orderId) => {

      if(!orderId){
        console.error("Order Id is required");
        return;
      }

      const url = `http://localhost:4000/delete-order/${orderId}`

      try {
        const result = await axios.delete(url);

        if(result.status === 200){
          console.log("Order deleted successfully", result.data);
          fetchAllOrders();
        }
      }catch(error){
          console.error("Error deleting order--", error.message);
      }
  }

  return (
    <div className="bg-gray-900 pt-28 screen-max-9:pt-44 min-h-screen text-white p-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">
        All Orders
      </h1>
      {allOrders ? (
        allOrders.orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-800 border w-1/2 screen-max-12:w-full m-auto rounded-lg shadow-lg p-6 mb-10"
          >
            <h2 className="text-2xl font-semibold mb-4">Order #{order.id}</h2>
            <p className="text-yellow-500 mb-2">
              Order Date: {order.orderDate}
            </p>
            <p className="text-purple-500 mb-4">
              Total Price: ${order.totalPrice}
            </p>

            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">
                Order Items:
              </h3>
              <ul>
                {allOrders.orderItemsMap[order.id] &&
                  allOrders.orderItemsMap[order.id].map((item, i) => (
                    <>
                      {item && (
                      <>
                        <li key={i} className="mb-4">
                          <div className="flex justify-between">
                            <div>
                              <img
                                src={item.product.imageURL}
                                alt={item.product.title}
                                className="w-16 h-16 rounded-lg mr-4"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {item.product.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {item.product.category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: ${item.price}</p>
                            </div>
                          </div>
                        </li>

                      </>
                      )}
                    </>
                  ))}
              </ul>
            </div>

            <div className="bg-purple-500 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">
                Payment Info:
              </h3>
              <p className="text-sm">
                Payment Method: {order.payment.paymentMethod}
              </p>
              <p className="text-sm">
                Payment Date: {order.payment.paymentDate}
              </p>
              <p className="text-sm">Amount Paid: ${order.payment.amount}</p>
            </div>

            <button className=" border font-bold hover:bg-[#ff5c5c] w-full text-white py-2 px-4 rounded mt-4 transition-colors duration-300 delay-150" onClick={() => deleteOrder(order.id)}>Delete Order</button>
          </div>
        ))
      ) : error ? (
        <div className="flex justify-center items-center bg-gray-900 h-full">
          <p className="font-bold text-white text-center ">
            Error fetching orders {error.message}
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-gray-900 h-full">
          <Loader />
        </div>
      )}
      {allOrders && allOrders.orders.length === 0 && (
        <div className="flex justify-center items-center bg-gray-900 h-full">
          <p className="font-bold text-white text-center ">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
