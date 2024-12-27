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
      <div className="min-h-screen bg-gray-900 -mt-32">
        <div className="flex m-32 pt-32 text-white gap-20 screen-max-12:flex-col screen-max-12:m-12">
          <div className="h-full w-full max-w-[500px] mx-auto bg-white rounded-lg shadow-lg relative">
            <div className="p-5 h-auto w-full relative">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: title,
                    isFluidWidth: true,
                    src: imageURL,
                    width: 100,
                    height: 800,
                  },
                  largeImage: {
                    src: imageURL,
                    width: 1800,
                    height: 2000,
                  },
                }}
              />
            </div>
          </div>

          <div className="w-1/2 text-white screen-max-12:w-full">
            <h1 className="text-4xl mt-3 font-medium w-full">{title}</h1>
            <h1 className="font-bold text-4xl mt-4">$ {price}</h1>
            <div className="border-2 border-yellow-500 p-5 mt-10 shadow-lg">
              <p className="text-yellow-500 text-xl underline mr-2">
                Description:
              </p>
              <p className="mt-5 ml-2 text-base">{description}</p>

              <p className="text-yellow-500 text-xl underline mt-5 ">
                Category:
              </p>
              <p className="pr-3 mt-3 ml-2 text-lg capitalize inline-block">
                {category}
              </p>

              <div>
                <p className="text-yellow-500 text-xl underline mt-5 mr-2">
                  Added on:
                </p>
                <p className="pr-3 mt-5 ml-2 text-lg capitalize">
                  {createdAt.split("T")[0]}
                </p>
              </div>

              <div className="flex ">
                <p className="text-yellow-500 text-xl underline mt-5 mr-2">
                  Items left:
                </p>
                <p className="pr-3 mt-5 ml-2 text-lg ">{stock}</p>
              </div>
              <button
                onClick={() => addItemHandler(product)}
                className="font-bold text-xl mt-4 p-3 w-full hover:bg-purple-700 text-white bg-purple-500"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
