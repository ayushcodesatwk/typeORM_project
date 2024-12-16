import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: true,
}


const cartSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        
    }
});

export default cartSlice.reducer;