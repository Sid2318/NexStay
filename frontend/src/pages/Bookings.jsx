import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  useEffect(() => {
    axios.get('/bookings').then(r => setBookings(r.data || []))
  }, [])
  return (
    <main className="container mx-auto mt-20">
      {/* <h2 className="text-6xl font-bold text-red-500 mb-4 text-center">My Bookings</h2> */}
      {bookings.length === 0 ? (
        <p className="text-2xl text-gray-700 mb-8 0 text-center">Bookings will Appear here:</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <h3 className="text-xl font-semibold mt-1">{b.homeName}</h3>
              <p className="text-gray-600">{new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</p>
              <p className="text-gray-700">Guests: {b.guests}</p>
              <p className="text-red-600 font-bold">Total: ₹{b.totalPrice}</p>
              <div className="mt-3 flex items-center gap-2">
                {!b.paid ? (
                  <Button to={`/payment/${b.id}`} variant="success" size="sm">Pay</Button>
                ) : (
                  <span className="text-green-600 font-medium">Paid</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}


