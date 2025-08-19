import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Reserve() {
  const { homeId } = useParams()
  const [home, setHome] = useState(null)
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1, paymentMode: 'cod', guestName: '', guestEmail: '', guestPhone: '' })
  const [result, setResult] = useState(null)

  useEffect(() => { axios.get(`/homes/${homeId}`).then(r => setHome(r.data)) }, [homeId])

  const submit = async (e) => {
    e.preventDefault()
    const r = await axios.post(`/book/${homeId}`, form)
    setResult(r.data)
  }

  if (!home) return null

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Book {home.houseName}</h1>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 max-w-md">
        <input className="border p-2 rounded" type="date" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} required />
        <input className="border p-2 rounded" type="date" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} required />
        <input className="border p-2 rounded" type="number" min="1" value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} required />
        <select className="border p-2 rounded" value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
          <option value="cod">Cash</option>
          <option value="card">Card</option>
        </select>
        <input className="border p-2 rounded" placeholder="Name" value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Email" type="email" value={form.guestEmail} onChange={e => setForm({ ...form, guestEmail: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Phone" value={form.guestPhone} onChange={e => setForm({ ...form, guestPhone: e.target.value })} required />
        <Button type="submit" variant="success">Reserve</Button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>Booking confirmed. Nights: {result.nights}, Total: ${'{'}result.totalPrice{'}'}</p>
        </div>
      )}
    </div>
  )
}


