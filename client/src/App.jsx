import './App.css';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login';
import { useEffect } from 'react';
import UserProfile from './pages/UserProfil/UserProfile';

function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token || token.length < 150) {
      navigate('/login')
    }
  }, [navigate, token])
  
  return (
    <>
      <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/user' element={<UserProfile />} />

      </Routes>
    </>
  )
}

export default App;
