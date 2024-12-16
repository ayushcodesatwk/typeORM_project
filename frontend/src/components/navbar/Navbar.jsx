import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();


  return (
    <>
        <div className='w-full flex bg-gray-900 p-3 justify-evenly text-4xl'>
            <h1 className='font-medium text-yellow-500'>    
                E-commerce app
            </h1>

            <div className='text-yellow-500 text-xl mt-2 '>
                <ul className='flex gap-5'>
                    <li className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2" onClick={() => navigate("/store")}>Store</li>
                    <li className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2" onClick={() => navigate("/cart")}>Cart</li>
                    <li className="hover:bg-yellow-300 hover:text-gray-900 cursor-pointer p-2" onClick={() => navigate("/authentication")}>Login</li>
                </ul>
            </div>
        </div>
    </>
  )
}

export default Navbar;