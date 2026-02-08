import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {

    const { user } = useContext(AuthContext) 
    // console.log("protectedroute", user?.name)

  return user  ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute