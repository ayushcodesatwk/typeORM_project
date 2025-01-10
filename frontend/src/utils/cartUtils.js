import axios from "axios";

export const fetchCart = async () => {

  try {
    const result = await axios.get("http://localhost:4000/cart", {
      withCredentials: true,
    });

    return result;
  } catch (error) {
    console.error("Error fetching cart products: ", error.message);
  }
};