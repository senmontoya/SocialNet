import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

import Create from './pages/CreateProfile.jsx'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create-profile' element={<Create />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
