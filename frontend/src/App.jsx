import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Store from './components/store/Store'
import Cart from './components/cart/Cart'
import Auth from './components/authentication/Auth'
import About from './components/about/About'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/*' element={<Store/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/login' element={<Auth/>}/>
            <Route path='/about' element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App