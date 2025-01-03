import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { addAllItemsToCart } from "../../store/slices/cartSlice";
import axios from "axios";

const ProductPage = ({ clickFunc }) => {
  const dispatch = useDispatch();
  const storeArr = useSelector((state) => state.store.storeArr);
  const navigate = useNavigate();
  const { productId } = useParams();

  const product = storeArr.find((item) => item.id == productId);

  console.log(product);

  const { title, imageURL, description, price, stock, category, createdAt } =
    product;

  //add item to cart if it doesn't exists
  //increases quantity if it does exist
  const addItemHandler = async (item) => {
    try {
      const isLogin = await axios.get("http://localhost:4000/is-login", {
        withCredentials: true,
      });

      console.log(isLogin);

      if (isLogin.data) {
        const result = await axios.post(
          "http://localhost:4000/cart",
          {
            product: item,
          },
          {
            withCredentials: true,
          }
        );

        if (result.status === 200) {
          console.log("addToCart result-- ", result);
          dispatch(addAllItemsToCart(result.data));
          clickFunc("Item added to cart!");
        } else if (result.status === 201) {
          clickFunc("Item added to cart!");
        }
      }
    } catch (error) {
      alert("Please login before adding items...");
      navigate("/login");
      return console.error("Error adding item to cart--", error);
    }
  };

  return (
    <>
      <div className="flex justify-center screen-max-6:w-fit screen-max-6:h-fit screen-max-12:flex-col screen-max-12:items-center bg-gray-900 min-h-screen">
        {/* product image */}
        <div className="pt-40 screen-max-9:pt-52 screen-max-12:w-[500px]">
          <img
            src={imageURL}
            alt="product-image"
            className="w-[600px] h-[700px] p-5 bg-white"
          />
        </div>

        {/* product details */}
        <div className=" h-fit w-[500px] text-white mt-40 screen-max-12:mt-20 ml-16 screen-max-12:ml-5 screen-max-12:w-[600px]">
          <div>
            <h1 className="text-3xl ">{title}</h1>

            <h1 className="mt-10 font-bold text-3xl">$ {price}</h1>

            <div className="border-2 border-white mt-12 p-5 ">
              <p className="text-yellow-500 font-bold text-xl hover:underline ">
                Description
              </p>
              <p className="pl-2 mt-2 text-lg">{description}</p>

              <p className="text-yellow-500 font-bold text-xl hover:underline mt-5">
                Stock
              </p>
              <p className="pl-2 mt-2 text-lg">{stock} items in stock</p>

              <p className="text-yellow-500 font-bold inline-block text-xl hover:underline mt-5">
                Category
              </p>
              <p className="pl-2 mt-2 text-lg">{category}</p>

              <p className="text-yellow-500 font-bold text-xl hover:underline mt-5">
                Added on
              </p>
              <p className="pl-2 mt-2 text-lg">{createdAt.split("T")[0]}</p>

              <button
                onClick={() => addItemHandler(product)}
                className="mt-4 bg-purple-800 w-full text-xl p-5 font-bold hover:bg-purple-500"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
