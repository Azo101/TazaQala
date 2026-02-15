import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResidentPage from './pages/ResidentPage'
import DriverPage from './pages/DriverPage'
import DispatcherPage from './pages/DispatcherPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resident" element={<ResidentPage />} />
      <Route path="/driver" element={<DriverPage />} />
      <Route path="/dispatcher" element={<DispatcherPage />} />
    </Routes>
  )
}

export default App
