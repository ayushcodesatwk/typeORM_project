import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAllItems } from "../../store/slices/storeSlice";
import { addAllItemsToCart } from "../../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Store = ({ clickFunc }) => {
  const storeArray = useSelector((state) => state.store.storeArr);

  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get the data from backend
  useEffect(() => {
    const fetchProducts = async () => {

      setLoading(true);

      try {
        const result = await axios.get(
          `http://localhost:4000/store?skip=${skip}`
        );
        console.log("Data: ", result);

        for (let i = 0; i < result.data.length; i++) {
          dispatch(addAllItems(result.data[i]));
        }

        setLoading(false);

      } catch (error) {
        console.error("Error fetching products: ", error.message);
      }
    };
    fetchProducts();
  }, [skip]);

  //add item to cart if it doesn't exists
  const addItemHandler = async (item) => {
    try {
      const isLogin = await axios.get("http://localhost:4000/is-login", {
        withCredentials: true,
      });

      console.log("isLogin from store", isLogin);

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

        console.log("RESULT FROM ADDTOCART-", result);

        if (result.status === 200) {
          console.log("addToCart result-- ", result);
          dispatch(addAllItemsToCart(result.data));
          clickFunc("Item added to cart!");
        }
        //we get 201 when we add new item
        else if (result.status === 201) {
          clickFunc("Item added to cart!");
        }
      }
    } catch (error) {
      alert("Please login before adding items...");
      navigate("/login");
      return console.error("Error adding item to cart--", error);
    }
  };


  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      setSkip((prev) => prev + 10); 
    }
  };


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);


  return (
    <>
      <div className="flex bg-gray-900 min-h-screen">
        {/* <ProductFilter/
          selectedCat={checkedItems}
          checkHandler={(name, checked) => checkCategoryHandler(name, checked)}
        /> */}
        <div
          className="flex flex-wrap w-full gap-10 justify-center mt-14 mb-14"
          onScroll={handleScroll}
        >
          {storeArray.map((item, ind) => (
            <div
              key={ind}
              className="border bg-[#F6F4F1] h-fit w-80 cursor-pointer border-[#D1D5DB] hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <div className="h-44 rounded-xl overflow-hidden m-3">
                <Link to={`/store/${item.id}`}>
                  <img
                    src={item.imageURL}
                    alt="item-image"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <Link to={`/store/${item.id}`}>
                <p className="m-3 text-gray-700">{item.title}</p>
              </Link>
              <Link to={`/store/${item.id}`}>
                <p className="font-bold text-xl mt-4 m-3 text-[#333333]">
                  $ {item.price}
                </p>
              </Link>
              <button
                onClick={() => addItemHandler(item)}
                className="font-bold text-xl mt-4 m-3 p-3 bg-purple-900 text-white hover:bg-purple-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Store;
