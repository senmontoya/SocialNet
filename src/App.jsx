import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from './pages/welcome.jsx'
import Login from './pages/login.jsx'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/Login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
