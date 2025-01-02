import axios from "axios";
import React, { useState } from "react";

const UploadProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
    stock: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!preview) return;

    try {
      const res = await axios.post("http://localhost:4000/uploadImage", {
        imageURL: preview,
      });
      console.log("Image upload response-", res);

      if (res.status == 200) {
        product.imageURL = res.data.response.url;

        const result = await axios.post("http://localhost:4000/addProduct", {
          product: product,
        });

        console.log("Adding product result--", result);

        if (result.status == 201) {
          setProduct({
            title: "",
            description: "",
            imageURL: "",
            price: "",
            stock: "",
            category: "",
          });

          document.getElementById("fileInput").value = "";

          alert("Successfully added to the product table! ");
        } else {
          setProduct({
            title: "",
            description: "",
            imageURL: "",
            price: "",
            stock: "",
            category: "",
          });

          document.getElementById("fileInput").value = "";

          alert("Failed to add product to the product table!");
        }
      }
    } catch (error) {
      console.log("ERROR--", error);
      return;
    }
  };

  // for image upload to cloudinary
  const [preview, setPreview] = useState("");

  //pushing just one item to cloudinary from backend to test
  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("preview--", preview);

    if (!preview) return;
    try {
      const res = await axios.post("http://localhost:4000/uploadImage", {
        imageURL: preview,
      });
      console.log("Image upload response-", res);
    } catch (error) {
      console.log("ERROR UPLOADING IMAGE--", error);
    }
  };

  //file change for image type
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    let reader = new FileReader();

    reader.onloadend = function () {
      console.log("READER RESULT-", reader.result);

      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 mt-12 shadow-md w-[600px] min-w-md"
        >
          <h2 className="text-3xl text-yellow-500 font-bold mb-6 text-center">
            Add New Product
          </h2>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
              rows="2"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Image URL
            </label>
            <input
              type="file"
              name="imageURL"
              id="fileInput"
              onChange={handleFileChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              min={0}
              value={product.price}
              onChange={handleChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              min={0}
              value={product.stock}
              onChange={handleChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-yellow-500 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-3 py-2   bg-gray-700 text-white border border-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-bold py-2 hover:bg-yellow-400"
          >
            Add Product
          </button>
        </form>

        {/* <form
          action="#"
          onSubmit={submitHandler}
          className="text-white mt-18"
        >
          <input
            type="file"
            name="file"
            id="input-file"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="bg-white p-2 text-black hover:bg-yellow-400 "
          >
            send all
          </button>

          <img src={preview} height={200} width={200} alt="preview" />
        </form> */}
      </div>
    </>
  );
};

export default UploadProduct;
