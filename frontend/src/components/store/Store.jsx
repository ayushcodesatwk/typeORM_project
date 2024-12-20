import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAllItems } from "../../store/slices/storeSlice";
import {addItemToCart } from "../../store/slices/cartSlice"
import { Link } from "react-router-dom";

const Store = () => {
  const totalItems = useSelector((state) => state.store.totalItems);
  const storeArray = useSelector((state) => state.store.storeArr);
  const dispatch = useDispatch();

  //get the data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("http://localhost:4000/store");
        console.log("Data: ", result);

        for (let i = 0; i < result.data.length; i++) {
          dispatch(addAllItems(result.data[i]));
        }
      } catch (error) {
        console.error("Error fetching products: ", error.message);
      }
    };

    fetchProducts();
  }, []);


  const addItemHandler = async (item) => {
    const result = await axios.post('http://localhost:4000/cart', {
        product: item,
    }, {
      withCredentials: true,
    })

    if(result.status == 201){
      dispatch(addItemToCart( item ));
    }
  }

  return (
    <>  
       <div className="flex bg-gray-900 ">
        {/* <ProductFilter/
          selectedCat={checkedItems}
          checkHandler={(name, checked) => checkCategoryHandler(name, checked)}
        /> */}
        <div className="flex flex-wrap w-full gap-10 justify-center mt-14 mb-14">
          {storeArray.map((item, ind) => (
            <div
              key={ind}
              className="border bg-[#F6F4F1] w-80 cursor-pointer border-[#D1D5DB] hover:scale-110 transition-transform duration-300 shadow-md"
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
