import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Tools from './pages/Tools'
import AIChat from './pages/AIChat'
import ExtraFun from './pages/ExtraFun'
import About from './pages/About'
import AboutUs from './pages/AboutUs'
import CustomCursor  from './components/CustomCursor'

export default function App() {
  return (
    <BrowserRouter>


      <CustomCursor />
      

      <div className="min-h-screen bg-[#0d1117]">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools"     element={<Tools />} />
          <Route path="/ai"        element={<AIChat />} />
          <Route path="/extrafun"  element={<ExtraFun />} />
          <Route path="/enfun"     element={<ExtraFun />} />
          <Route path="/about"     element={<About />} />
          <Route path="/aboutus"   element={<AboutUs />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
