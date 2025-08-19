import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Favourites() {
  const [homes, setHomes] = useState([])
  useEffect(() => { axios.get('/favourites').then(r => setHomes(r.data)) }, [])
  const removeFav = async (id) => {
    await axios.delete(`/favourites/${id}`)
    setHomes(homes.filter(h => h._id !== id))
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Favourites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homes.map(h => (
          <div key={h._id} className="bg-white rounded shadow p-4">
            <img src={`http://localhost:3000/${h.houseImage}`} alt={h.houseName} className="w-full h-48 object-cover rounded" />
            <div className="mt-2 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{h.houseName}</h2>
                <p className="text-gray-600">{h.houseLocation}</p>
              </div>
              <Button onClick={() => removeFav(h._id)} variant="danger" size="sm">Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


