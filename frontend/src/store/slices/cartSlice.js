import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cartArray: [],
}


const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        
    }
});

export default cartSlice.reducer;