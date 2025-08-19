import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function EditHome({ mode }) {
  const { homeId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ houseName: '', price: '', houseLocation: '', rating: '', description: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (mode === 'edit' && homeId) {
      axios.get(`/homes/${homeId}`).then(r => setForm({
        houseName: r.data.houseName,
        price: r.data.price,
        houseLocation: r.data.houseLocation,
        rating: r.data.rating,
        description: r.data.description || ''
      }))
    }
  }, [mode, homeId])

  const submit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (file) data.append('houseImage', file)
    if (mode === 'add') {
      await axios.post('/host/homes', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await axios.put(`/host/homes/${homeId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    navigate('/host/host-home-list')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{mode === 'add' ? 'Add Home' : 'Edit Home'}</h1>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 max-w-md">
        <input className="border p-2 rounded" placeholder="House Name" value={form.houseName} onChange={e => setForm({ ...form, houseName: e.target.value })} required />
        <input className="border p-2 rounded" type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Location" value={form.houseLocation} onChange={e => setForm({ ...form, houseLocation: e.target.value })} required />
        <input className="border p-2 rounded" type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} required />
        <textarea className="border p-2 rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2 rounded" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} />
        <Button type="submit" variant="primary">{mode === 'add' ? 'Add' : 'Save'}</Button>
      </form>
    </div>
  )
}


