import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Store from './components/store/Store'
import Cart from './components/cart/Cart'
import Auth from './components/authentication/Auth'
import About from './components/about/About'
import {  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {

  const queryProvider = new QueryClient()

  return (
    <QueryClientProvider client={queryProvider}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/*' element={<Store/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/login' element={<Auth/>}/>
            <Route path='/about' element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App