import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
      {/* Texto por defecto en BL Melody Regular */}
      <p>Este texto usa el default (BL Melody Regular) por defecto</p>
      
      {/* Variantes de BL Melody */}
      <h1 className="bl-semi">Título en Semi Bold</h1>
      <p className='bl-semi'>Texto en Semi Bold</p>
      <p className="bl-book">Texto en Book</p>
      
      {/* Variantes de BL Melody Bold */}
      <h1 className="bl-bold">Título en Bold</h1>
      <p className="bl-bold">Texto en Bold</p>
      
      {/* Variantes de ANKISH */}
      <p>Texto normal con <span className="ank">palabras en ANKISH</span></p>
      <p className="ank-caps">Este texto completo en ANKISH mayúsculas</p>
    </>
  )
}

export default App