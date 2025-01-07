import React from "react";
import { useNavigate } from "react-router-dom";

const OrderAccepted = () => {
  const navigate = useNavigate();

return (
    <>
        <div className="flex flex-col gap-10 justify-center items-center bg-gray-900 h-screen">
            <img
                src="/assets/yellow_correct.png"
                height={400}
                width={400}
                alt="order-accepted"
            />
            <h1 className="text-xl font-medium text-white">
                Congratulations! Your order has been placed.
            </h1>

            <button
                onClick={() => navigate("/store")}
                className="font-bold text-xl mt-4 m-3 p-3 bg-[ #4169e1] border border-white text-white hover:bg-purple-500 transition-colors duration-300 delay-150"
            >
                Shop more
            </button>
        </div>
    </>
);
};

export default OrderAccepted;
