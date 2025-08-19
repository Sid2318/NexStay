import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Nav() {
  const { pathname } = useLocation()
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null })

  useEffect(() => {
    axios.get('/me').then(res => setAuth(res.data)).catch(() => setAuth({ isLoggedIn: false, user: null }))
  }, [pathname])

  const is = (page) => pathname === page
  const isHost = auth.user?.userType === 'host'
  const isGuest = auth.user?.userType === 'guest'

  const logout = async () => {
    await axios.post('/logout')
    setAuth({ isLoggedIn: false, user: null })
    window.location.href = '/login'
  }

  return (
    <header className="bg-red-500 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex-shrink-0">
            <img src="http://localhost:3000/images/Airbnb3.png" alt="Airbnb Logo" className="w-12 h-12 mr-12" />
          </Link>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/" className={`${is('/') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Home</Link>
            </li>
            {auth.isLoggedIn && isGuest && (
              <>
                <li>
                  <Link to="/homes" className={`${is('/homes') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Home List</Link>
                </li>
                <li>
                  <Link to="/favourites" className={`${is('/favourites') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Favourites</Link>
                </li>
                <li>
                  <Link to="/bookings" className={`${is('/bookings') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Bookings</Link>
                </li>
              </>
            )}
            {auth.isLoggedIn && isHost && (
              <>
                <li>
                  <Link to="/host/host-home-list" className={`${is('/host/host-home-list') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Host Homes</Link>
                </li>
                <li>
                  <Link to="/host/add-home" className={`${is('/host/add-home') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Add Home</Link>
                </li>
              </>
            )}
            {!auth.isLoggedIn && (
              <>
                <li>
                  <Link to="/signup" className={`${is('/signup') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Sign Up</Link>
                </li>
                <li>
                  <Link to="/login" className={`${is('/login') ? 'bg-red-400' : 'hover:bg-red-400'} py-2 px-4 rounded transition duration-300`}>Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {auth.isLoggedIn && (
          <div className="flex items-center">
            <button onClick={logout} className=" hover:bg-red-400 py-2 px-4 rounded transition duration-300">Logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}


