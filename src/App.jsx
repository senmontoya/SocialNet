import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 style={{ fontSize: '2rem' }}>Probando la fuente ANKISH</h1>
      <p style={{ fontSize: '1.5rem' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, laboriosam.</p>
      <h2 style={{ fontSize: '3rem' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, laboriosam.</h2>
      <strong><h1 style={{ fontSize: '3rem' }}>h HLorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, laboriosam.</h1></strong>
    </>
  )
}

export default App