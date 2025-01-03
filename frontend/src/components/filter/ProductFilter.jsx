import React, { useState } from "react";


const ProductFilter = ({checkHandler}) => {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceCategory, setSelectedPriceCategory] = useState('');

  const handleChange = (event) => {
      setSelectedCategory(event.target.value);

      checkHandler(event.target.value, selectedPriceCategory)
  };

  const handlePriceChange = (event) => {
      setSelectedPriceCategory(event.target.value);

      checkHandler(selectedCategory, event.target.value)
  }

  return (
    <>
      <div className="w-auto screen-max-9:mt-20 fixed h-fit p-8 pt-3 ml-10 bg-[#4f156e] border-4 border-purple-600 max-h-[800px] overflow-y-scroll">
        <h1 className="text-center text-2xl font-extrabold text-white">Filter</h1>
        <h1 className="font-medium text-xl hover:underline cursor-pointer mt-5 text-white">Categories</h1>
        <ul className="mt-3 flex flex-col gap-1 ml-3 text-white">
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="all">All</label>
            <input
              type="radio"
              className="h-4 w-4 ml-4 mt-1"
              name="category"
              id="all"
              value=""
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="electronics">Electronics</label>
            <input
              type="radio"
              className="h-4 w-4 ml-4 mt-1"
              name="category"
              id="electronics"
              value="Electronics"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="home-appliances">Home Appliances</label>
            <input
              type="radio"
              className="h-4 w-4 ml-4 mt-1"
              name="category"
              id="home-appliances"
              value="Home Appliances"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="fitness">Fitness</label>
            <input
              type="radio"
              name="category"
              id="fitness"
              className="h-4 w-4 ml-4 mt-1"
              value="Fitness"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="wearables">Wearables</label>
            <input
              type="radio"
              name="category"
              id="wearables"
              className="h-4 w-4 ml-4 mt-1"
              value="Wearables"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="lighting">Lighting</label>
            <input
              type="radio"
              name="category"
              id="lighting"
              className="h-4 w-4 ml-4 mt-1"
              value="Lighting"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="furniture">Furniture</label>
            <input
              type="radio"
              name="category"
              id="furniture"
              className="h-4 w-4 ml-4 mt-1"
              value="Furniture"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="transportation">Transportation</label>
            <input
              type="radio"
              name="category"
              id="transportation"
              className="h-4 w-4 ml-4 mt-1"
              value="Transportation"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="home-security">Home Security</label>
            <input
              type="radio"
              name="category"
              id="home-security"
              className="h-4 w-4 ml-4 mt-1"
              value="Home Security"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="kitchen-appliances">Kitchen Appliances</label>
            <input
              type="radio"
              name="category"
              id="kitchen-appliances"
              className="h-4 w-4 ml-4 mt-1"
              value="Kitchen Appliances"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="personal-care">Personal Care</label>
            <input
              type="radio"
              name="category"
              id="personal-care"
              className="h-4 w-4 ml-4 mt-1"
              value="Personal Care"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="outdoor">Outdoor</label>
            <input
              type="radio"
              name="category"
              id="outdoor"
              className="h-4 w-4 ml-4 mt-1"
              value="Outdoor"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="cleaning">Cleaning</label>
            <input
              type="radio"
              name="category"
              id="cleaning"
              className="h-4 w-4 ml-4 mt-1"
              value="Cleaning"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="home-automation">Home Automation</label>
            <input
              type="radio"
              name="category"
              id="home-automation"
              className="h-4 w-4 ml-4 mt-1"
              value="Home Automation"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="home-decor">Home decor</label>
            <input
              type="radio"
              name="category"
              id="home-decor"
              className="h-4 w-4 ml-4 mt-1"
              value="Home Decor"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="health">Health</label>
            <input
              type="radio"
              name="category"
              id="health"
              className="h-4 w-4 ml-4 mt-1"
              value="Health"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="audio">Audio</label>
            <input
              type="radio"
              name="category"
              id="audio"
              className="h-4 w-4 ml-4 mt-1"
              value="Audio"
              onChange={handleChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="accessories">Accessories</label>
            <input
              type="radio"
              name="category"
              id="accessories"
              className="h-4 w-4 ml-4 mt-1"
              value="Accessories"
              onChange={handleChange}
            />
          </li>
        </ul>

        {/* sort by price */}
        <h1 className="font-medium text-xl mt-5 hover:underline cursor-pointer text-white">Price</h1>
        <ul className="mt-3 flex flex-col gap-1 ml-3 text-white">
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="low-to-high">Low to High</label>
            <input
              type="radio"
              name="price-category"
              id="low-to-high"
              className="h-4 w-4 ml-4 mt-1"
              value="asc"
              onChange={handlePriceChange}
            />
          </li>
          <li className="flex justify-between hover:scale-105 transition-transform duration-300">
            <label htmlFor="high-to-low">High to Low</label>
            <input
              type="radio"
              name="price-category"
              id="high-to-low"
              className="h-4 w-4 ml-4 mt-1"
              value="desc"
              onChange={handlePriceChange}
            />
          </li>
        </ul>

      </div>
    </>
  );
};

export default ProductFilter;
