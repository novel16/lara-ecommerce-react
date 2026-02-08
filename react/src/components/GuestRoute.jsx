import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function GuestRoute() {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default GuestRoute