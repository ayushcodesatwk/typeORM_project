import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cartArray: [],
    quantity: 1,
}   


const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        
        addItemToCart: (state, action) => {
            const item = action.payload;

            const existingItem = state.cartArray.find((product) => product.id == item.id);
            console.log('existingItem--', existingItem);

            state.cartArray.push(item);
        }
    }
});

export const {addItemToCart} = cartSlice.actions; 

export default cartSlice.reducer;