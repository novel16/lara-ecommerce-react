import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function AdminDashboard() {

    const {user} = useContext(AuthContext)

  return (
    <div>AdminDashboard {user?.role}</div>
  )
}

export default AdminDashboard