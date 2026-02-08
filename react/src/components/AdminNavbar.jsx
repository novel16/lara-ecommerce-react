import React from 'react'
import { Link } from 'react-router-dom'

function AdminNavbar() {
  return (
    <header className="bg-gray-800 text-white">
        <nav className='py-4 px-16 flex justify-between items-center'>
            <h1 className="text-xl font-bold">E-Commerce App</h1>

            <div>
                <Link to="/admin" className="mr-4 hover:underline">Dashboard</Link>
                <Link to="products" className="mr-4 hover:underline">Products</Link>
                <Link to="/admin/stocks" className="mr-4 hover:underline">Stocks</Link>
                <Link to="/orders" className="hover:underline">Orders</Link>
                
            </div>

            <div>
                <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
            </div>
        </nav>
    </header>
  )
}

export default AdminNavbar