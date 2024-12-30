import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartArray: [],
  amount: 0,
  totalItemsInCart: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addAllItemsToCart: (state, action) => {
      const cartArray = action.payload;

      state.totalItemsInCart = state.cartArray.length;

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

      state.totalItemsInCart = state.cartArray.length;

    },

    clearCartOnLogout: (state) => {
      return { ...state, cartArray: [], totalItemsInCart: 0 };
    },

    deleteItemFromCart: (state, action) => {
      const productId = action.payload;

      state.cartArray = state.cartArray.filter(
        (product) => product.cartId !== productId
      );

      state.totalItemsInCart = state.cartArray.length;
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

       state.cartArray.forEach((item) => {
        
        if (item.cartId === cartId) {
          item.quantity += 1;
          }
        });

      state.totalItemsInCart = state.cartArray.length;

    },

    minusOne: (state, action) => {
      const cartId = action.payload;

      state.cartArray = state.cartArray.reduce((acc, curr) => {

        if(curr.cartId == cartId){
            if(curr.quantity > 1){

              acc.push({...curr, quantity: curr.quantity - 1})
            }
          }
        
        else{
            acc.push(curr);
          }

        return acc;

      }, [])

      state.totalItemsInCart = state.cartArray.length;
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
