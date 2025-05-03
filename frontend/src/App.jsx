import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Signup from './pages/Signup';
import Verifyotp from "./pages/Verifyotp"
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Flowchart from './pages/Flowchart';
import Protected from './pages/Protected';
function App() {

  const [count, setCount] = useState(0)

  return (
    <>


      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />


          <Route path="/signup" element={<Signup />}></Route>
          <Route path='/login' element={<Login />} />
          <Route path='/verify-otp' element={<Verifyotp />} />
          <Route path='/dashboard' element={
            <Protected>

              <Dashboard />
            </Protected>
          } />
          <Route path="/flowchart" element={
            <Protected>
              <Flowchart />
            </Protected>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
