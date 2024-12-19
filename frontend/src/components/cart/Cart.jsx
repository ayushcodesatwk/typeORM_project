import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {

  const cartArray = useSelector((state) => state.cart.cartArray);
  const dispatch = useDispatch();


  return (
    <>
         <div className=' mt-10'>
          <h1 className='text-center font-bold text-5xl text-stone-500'>Your Cart</h1>
          
          {!cartArray.length == 0 ? cartArray.map((item, i) => (

                <div key={i} className='p-10 mt-3 w-1/2 m-auto screen-max-9:w-auto min-w-96 screen-max-7:p-2'>
               
                  <div className='flex'>
                    <div className='flex'>
                      <img className='w-40 h-40 rounded-xl shadow-lg' src={item.image} alt={item.title}/>
                      <div className='mt-3 ml-10 font-medium text-lg'>
                        <p>{item.title}</p>
                        <p className='mt-3'>$ {item.price}</p>
                        <button onClick={() => dispatch(removeItemFromCart(item.id))} className='mt-2 p-2 rounded-md bg-red-400 text-stone-200 hover:bg-red-700 hover:text-white'>Remove Item</button>
                      </div>
                    </div>
                  </div>

                </div>
          )) : <h1 className='font-bold text-4xl text-center mt-5 text-stone-500'>
                   is empty
            </h1>}

            {!cartArray.length == 0 && <>
            <div className='flex flex-col mb-20 m-auto w-1/2 items-end'>
                  <button type="button" className='p-3 w-52 mt-4 bg-green-400 rounded-lg font-medium text-green-800 hover:bg-green-600 hover:text-white hover:scale-105 transition-transform duration-300'>Buy Now</button>
                  <h1 className=' text-xl mt-5 screen-max-7:w-44 pr-3 font-bold text-stone-700'>Total amount: <i>$ {totalAmount}</i></h1>  
            </div>
              
                </>}
        </div>
    </>
  )
}

export default Cart;