import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/signin'
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import ViewDetails from './pages/ViewDetails';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/viewdetails" element={<ViewDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
