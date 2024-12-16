import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Store from './components/store/Store'
import Cart from './components/cart/Cart'
import Auth from './components/authentication/Auth'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/*' element={<Store/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/authentication' element={<Auth/>}/>
            <Route path='/store' element={<Store/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App