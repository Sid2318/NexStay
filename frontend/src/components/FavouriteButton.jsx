import React, { useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function FavouriteButton({ homeId }) {
  const [auth, setAuth] = useState({ isLoggedIn: false })
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    axios.get('/me').then(res => setAuth(res.data)).catch(() => setAuth({ isLoggedIn: false }))
  }, [])

  useEffect(() => {
    if (!auth.isLoggedIn) return
    axios.get('/favourites').then(r => {
      const present = (r.data || []).some(h => h._id === homeId)
      setIsFav(present)
    })
  }, [auth.isLoggedIn, homeId])

  const toggle = async () => {
    if (!auth.isLoggedIn) {
      window.location.href = '/login'
      return
    }
    if (isFav) {
      await axios.delete(`/favourites/${homeId}`)
      setIsFav(false)
    } else {
      await axios.post('/favourites', { homeId })
      setIsFav(true)
    }
  }

  return (
    <button onClick={toggle}
      className="p-2 rounded-md border border-gray-200 bg-white hover:bg-red-800 transition-colors duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill={isFav ? 'currentColor' : 'none'}
        className={`w-5 h-5 ${isFav ? 'text-red-500' : 'text-gray-500'}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
  )
}


