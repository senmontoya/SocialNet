import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from './pages/welcome.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Create from './pages/CreateProfile.jsx'
import HeroSection from './components/heroSection.jsx'
import navbar from './components/navbar.jsx'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/Login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/create-profile' element={<Create/>}/>
        <Route path='/heroSection' element={<HeroSection/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
