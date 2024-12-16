import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    storeArr: [],
    totalItem: 0,
}

const storeSlice = createSlice({
    name: 'store',
    initialState: initialState,
    reducers: {
        addItemToCart: (state, action) => {
            
            
        },

        addAllItems: (state, action) => {

            const newProduct = action.payload;

            const exists = state.storeArr.some(product => product.id === newProduct.id);
  
            // If the product doesn't exist, add it to the array
            if (!exists) {
              state.storeArr = [...state.storeArr, newProduct];
            }
        }, 
        totalCount: (state) => {
            state.totalItem = state.storeArr.length;
        }
    }
})

export const { addAllItems, addItemToCart } = storeSlice.actions;


export default storeSlice.reducer;