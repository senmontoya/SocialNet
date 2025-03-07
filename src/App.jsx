import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from './pages/welcome.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Create from './pages/CreateProfile.jsx'
import HeroSection from './components/heroSection.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SectionGroup from './pages/SectionGroups.jsx'
import EditProfile from './pages/EditProfile.jsx'

function App() {


  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Welcome />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/create-profile' element={<Create/>}/>
        <Route path='/heroSection' element={<HeroSection/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/sectionGroups' element={<SectionGroup/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        

      </Routes>
    </BrowserRouter>
  )
}

export default App
