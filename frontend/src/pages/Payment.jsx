import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [method, setMethod] = useState('card')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // naive load from bookings list
    axios.get('/bookings').then(r => {
      const b = (r.data || []).find(x => x.id === bookingId)
      setBooking(b || null)
    })
  }, [bookingId])

  const pay = async () => {
    setLoading(true)
    try {
      // In real life integrate Stripe here. For now mark paid.
      await axios.post(`/bookings/${bookingId}/pay`, { method })
      navigate('/bookings')
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return (
    <main className="container mx-auto p-6"><p>Loading…</p></main>
  )

  return (
    <main className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Payment</h1>
      <p className="text-gray-600 mb-6">{booking.homeName} — ₹{booking.totalPrice}</p>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-3">Choose payment method</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="radio" name="method" value="card" checked={method==='card'} onChange={e => setMethod(e.target.value)} />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="method" value="upi" checked={method==='upi'} onChange={e => setMethod(e.target.value)} />
            <span>UPI</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="method" value="netbanking" checked={method==='netbanking'} onChange={e => setMethod(e.target.value)} />
            <span>Netbanking</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="method" value="cod" checked={method==='cod'} onChange={e => setMethod(e.target.value)} />
            <span>Pay on arrival</span>
          </label>
        </div>
        <div className="mt-6">
          <Button variant="primary" onClick={pay} disabled={loading}>{loading ? 'Processing…' : 'Pay now'}</Button>
        </div>
      </div>
    </main>
  )
}


