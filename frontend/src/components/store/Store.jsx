import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAllItems, removeAllItems } from "../../store/slices/storeSlice";
import { addAllItemsToCart } from "../../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductFilter from "../filter/ProductFilter";
import Loader from "../loader/Loader";



const Store = ({ clickFunc }) => {
  const storeArray = useSelector((state) => state.store.storeArr);

  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get the data from backend on scrolling
  useEffect(() => {
    const fetchProducts = async () => {

      setLoading(true);

      try {
        const result = await axios.get(
          `http://localhost:4000/store?skip=${skip}`
        );
        console.log("Data: ", result);

        if(result.status == 200){

          for (let i = 0; i < result.data.length; i++) {
            dispatch(addAllItems(result.data[i]));
          }
  
          setLoading(false);

        }


      } catch (error) {
        console.error("Error fetching products: ", error.message);
      }
    };
    fetchProducts();
  }, [skip]);

   //handle scroll
   const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      setSkip((prev) => prev + 10); 
    }
  };

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


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  //selected category handler 
  const checkCategoryHandler = async (category, priceCategory) => {
      console.log("category--", category, "price category---", priceCategory);

      setLoading(true);

      try {
        //either of these approach will work to get result
        
        // const result = await axios.get(
        //   `http://localhost:4000/filter?category=${category}&priceCategory=${priceCategory}`
        // );

        const result = await axios.get(
          `http://localhost:4000/filter`, {
            params: {
                category: category,
                priceCategory: priceCategory
            }}
        );

        console.log("filtered Data: ", result);

        if(result.status == 200){
          
          dispatch(removeAllItems());

          for (let i = 0; i < result.data.length; i++) {
            dispatch(addAllItems(result.data[i]));
          }
 
          setLoading(false);
        }

      } catch (error) {
        console.error("Error filering out products: ", error.message);
      }
  } 

  return (
    <>
      <div className="flex pt-24 bg-gray-900 screen-max-6:w-fit min-h-screen">
        <ProductFilter
          // selectedCat={checkedItems}
          checkHandler={(category, priceCat) => checkCategoryHandler(category, priceCat)}
        />
        <div className="flex flex-col ml-80 gap-5 items-center screen-max-9:mt-20">
            <div
              className="flex flex-wrap gap-10 justify-center mb-14"
              onScroll={handleScroll}
            >
              {storeArray.map((item, ind) => (
                <div
                  key={ind}
                  className="border bg-[#4f156e] h-fit w-80 cursor-pointer border-[#D1D5DB] hover:scale-110 transition-transform duration-300 shadow-md"
                >
                  <div className="h-44 overflow-hidden m-3">
                    <Link to={`/store/${item.id}`}>
                      <img
                        src={item.imageURL}
                        alt="item-image"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <Link to={`/store/${item.id}`}>
                    <p className="m-3 text-white">{item.title}</p>
                  </Link>
                  <Link to={`/store/${item.id}`}>
                    <p className="font-bold text-xl mt-4 m-3 text-[#fff]">
                      $ {item.price}
                    </p>
                  </Link>
                  <button
                    onClick={() => addItemHandler(item)}
                    className="font-bold text-xl mt-4 m-3 p-3 bg-[ #4169e1] border border-white text-white hover:bg-purple-500 transition-colors duration-300 delay-150"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
              {loading && <Loader/>}
        </div>
      </div>
    </>
  );
};

export default Store;
