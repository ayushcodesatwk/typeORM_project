import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartArray: [],
  amount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addAllItemsToCart: (state, action) => {
      const cartArray = action.payload;

      // console.log("product array from cart-", cartArray);

      // cartArray.forEach((item, i) => {

      //     const exists = state.cartArray.some(product => product.cartId === item.cartId);

      //     console.log(exists);

      //     // If the product doesn't exist, add it to the array
      //     if (!exists) {
      //       state.cartArray.push(item);
      //     }
      //     else{
      //         for(let i = 0; i<state.cartArray.length; i++){

      //             if(item.cartId === state.cartArray[i].cartId){

      //                 if(item.quantity !== state.cartArray[i].quantity){
      //                 state.cartArray[i].quantity = item.quantity
      //                 }
      //             }
      //         }

      //     }
      // });

      console.log("product array from cart-", cartArray);

      // Create a map for existing cart items for fast lookup
      const existingCartMap = new Map(
        state.cartArray.map((item) => [item.cartId, item])
      );

      cartArray.forEach((item) => {
        const existingItem = existingCartMap.get(item.cartId);

        if (!existingItem) {
          // If the product doesn't exist, add it to the array
          state.cartArray.push(item);
        } else {
          // Update quantity if it differs
          if (item.quantity !== existingItem.quantity) {
            existingItem.quantity = item.quantity;
          }
        }
      });
    },

    clearCartOnLogout: (state) => {
      console.log("cartArray just before logout-- ", state.cartArray);

      return { ...state, cartArray: [] };
    },

    deleteItemFromCart: (state, action) => {
      const productId = action.payload;

      const updatedCart = state.cartArray.filter(
        (product) => product.cartId !== productId
      );

      return {
        ...state,
        cartArray: updatedCart,
      };
    },

    totalAmount: (state) => {
      const newAmount = state.cartArray.reduce((acc, curr) => {
        const quantity = Number(curr.quantity) || 0;
        const price = Number(curr.product.price) || 0;
        return acc + quantity * price;
      }, 0);

      const roundOff = newAmount.toFixed(2);

      //return new state object with new amount
      return {
        ...state,
        amount: roundOff,
      };
    },

    plusOne: (state, action) => {
      const cartId = action.payload;

      state.cartArray.map((item) => {
        if (item.cartId == cartId) {
          item.quantity += 1;
        }
      });
    },

    minusOne: (state, action) => {
      const cartId = action.payload;

      state.cartArray = state.cartArray.map((item) => {
        if (item.cartId === cartId) {
          if (item.quantity === 1) {
            
            const updatedCart = state.cartArray.filter(
              (product) => product.cartId !== cartId
            );

            return {
            ...state,
            cartArray: updatedCart,
            };

          } else {
            item.quantity -= 1;

            return {...state}
          }
        }
      });
    },
  },
});

export const {
  addItemToCart,
  addAllItemsToCart,
  deleteItemFromCart,
  clearCartOnLogout,
  totalAmount,
  minusOne,
  plusOne
} = cartSlice.actions;

export default cartSlice.reducer;
