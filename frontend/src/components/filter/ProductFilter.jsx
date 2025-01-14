import React, { useState } from "react";

const ProductFilter = ({ checkHandler }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceCategory, setSelectedPriceCategory] = useState("");

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);

    checkHandler(event.target.value, selectedPriceCategory);
  };

  const handlePriceChange = (event) => {
    setSelectedPriceCategory(event.target.value);

    checkHandler(selectedCategory, event.target.value);
  };

  return (
    <>
      <div className="w-1/4 screen-max-12:w-full screen-max-7:w-3/4 screen-max-6:w-full screen-max-6:m-0  h-fit screen-max-7:h-[400px] p-8 pt-3 ml-10 screen-max-6:ml-0 bg-[#4f156e] border-4 border-purple-600 max-h-[800px] overflow-y-scroll">
        <h1 className="text-center text-2xl font-extrabold text-white">
          Filter
        </h1>
        <h1 className="font-medium text-xl hover:underline cursor-pointer mt-5 text-white">
          Categories
        </h1>
        <ul className="mt-3 flex flex-col gap-1 ml-3 text-white">
          {/* Categories list */}
          {[
            "All",
            "Electronics",
            "Home Appliances",
            "Fitness",
            "Wearables",
            "Lighting",
            "Furniture",
            "Transportation",
            "Home Security",
            "Kitchen Appliances",
            "Personal Care",
            "Outdoor",
            "Cleaning",
            "Home Automation",
            "Home Decor",
            "Health",
            "Audio",
            "Accessories",
          ].map((category, index) => (
            <li
              key={index}
              className="flex justify-between hover:scale-105 transition-transform duration-300"
            >
              <label htmlFor={category.toLowerCase().replace(" ", "-")}>
                {category}
              </label>
              <input
                type="radio"
                name="category"
                id={category.toLowerCase().replace(" ", "-")}
                className="h-4 w-4 ml-4 mt-1"
                value={category}
                onChange={handleChange}
              />
            </li>
          ))}
        </ul>

        <h1 className="font-medium text-xl mt-5 hover:underline cursor-pointer text-white">
          Price
        </h1>
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
