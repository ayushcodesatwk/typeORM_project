import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cartArray: [],
    amount: 0,
}   


const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        
        addItemToCart: (state, action) => {
            const item = action.payload;

            console.log('CART ITEM--',item);
            

            const existingItem = state.cartArray.find((product) => product.id == item.id);
            console.log('existingItem-- ', existingItem);

            if(existingItem){
                return
            }else{
                state.cartArray.push(item);
            }            

        }, 


        addAllItemsToCart: (state, action) => {

            const newProduct = action.payload;

            console.log(newProduct);

            const exists = state.cartArray.some(product => product.cartId === newProduct.cartId);
  
            // If the product doesn't exist, add it to the array
            if (!exists) {
              state.cartArray = [...state.cartArray, newProduct];
            }

        }, 


        deleteItemFromCart: (state, action) => {
            
            const productId = action.payload;

            const updatedCart = state.cartArray.filter((product) => product.cartId !== productId);

            return {
                ...state, 
                cartArray: updatedCart
            }
        },


        totalAmount: (state) => {
            
            const newAmount = state.cartArray.reduce((acc, curr) => {
                
                const quantity = Number(curr.quantity) || 0; 
                const price = Number(curr.product.price) || 0; 
                return acc + (quantity * price);

            }, 0)


             const roundOff = newAmount.toFixed(2);

            //return new state object with new amount
            return {
                ...state,
                amount: roundOff,
            };
        }
    }
});

export const {addItemToCart, addAllItemsToCart, deleteItemFromCart, totalAmount} = cartSlice.actions; 

export default cartSlice.reducer;