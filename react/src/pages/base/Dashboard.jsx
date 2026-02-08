import React, {useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'


function Dashboard() {
  const {user} = useContext(AuthContext)


  // console.log("role", user?.role)

  return (
    <div>Dashboard {user?.name}</div>
  )
}

export default Dashboard