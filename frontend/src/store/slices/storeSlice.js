import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    storeArr: [],
    totalItem: 0,
}

const storeSlice = createSlice({
    name: 'store',
    initialState: initialState,
    reducers: {

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
        },

        removeAllItems: (state) => {
            return {
                ...state, storeArr: []
            }
        },

        filterItemSearch: (state, action) => {
            const itemText = action.payload;

            state.storeArr = state.storeArr.reduce((acc, curr) => {
    
                if(curr.title.trim().toLowerCase().includes(itemText.trim().toLowerCase())){
                    acc.push(curr);
                }
                
                return acc;
            }, []);

        }
    }
})

export const { addAllItems, addItemToCart, filterItemSearch, removeAllItems} = storeSlice.actions;

export default storeSlice.reducer;