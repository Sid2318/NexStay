import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function HostHomes() {
  const [homes, setHomes] = useState([])
  useEffect(() => { axios.get('/host/homes').then(r => setHomes(r.data)) }, [])
  const del = async (id) => {
    await axios.delete(`/host/homes/${id}`)
    setHomes(homes.filter(h => h._id !== id))
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Host Homes</h1>
        <Button to="/host/add-home" variant="primary">Add Home</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homes.map(h => (
          <div key={h._id} className="bg-white rounded shadow p-4">
            <img src={`http://localhost:3000/${h.houseImage}`} alt={h.houseName} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{h.houseName}</h2>
            <div className="mt-3 flex gap-2">
              <Button to={`/host/edit-home/${h._id}`} variant="secondary" size="sm">Edit</Button>
              <Button onClick={() => del(h._id)} variant="danger" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


