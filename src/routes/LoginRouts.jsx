import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import Login from '../../pages/login/Login'

function LoginRout() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/*' element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default LoginRout
