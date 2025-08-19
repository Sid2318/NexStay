import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import FavouriteButton from '../components/FavouriteButton.jsx'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function HomeDetail() {
  const { homeId } = useParams()
  const [home, setHome] = useState(null)
  useEffect(() => {
    axios.get(`/homes/${homeId}`).then(r => setHome(r.data))
  }, [homeId])
  if (!home) return null
  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">Details of {home.houseName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img src={`http://localhost:3000/${home.houseImage}`} alt={home.houseName} className="w-full h-96 object-cover" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='http://localhost:3000/images/no-image.png'}} />
        </div>
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{home.description}</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Location</h3>
            <p className="text-gray-600">{home.houseLocation}</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Price</h3>
            <p className="text-green-600 text-xl font-bold">${home.price} / night</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Rating</h3>
            <div className="flex items-center"><span className="text-yellow-400 text-xl">★</span><span className="ml-2 text-lg">{home.rating} / 5</span></div>
          </div>
          <div className="flex gap-4 items-center">
            <Button href={`http://localhost:3000/api/homes/${home._id}/pdf`} variant="secondary" download>
              Download Details as PDF
            </Button>
            <FavouriteButton homeId={home._id} />
            <Button to={`/book/${home._id}`} variant="success" style={{ backgroundColor: 'green', color: 'white' }}>Book</Button>
          </div>
        </div>
      </div>
    </main>
  )
}


