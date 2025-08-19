import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastname: '', email: '', password: '', confirmPassword: '', userType: 'guest', terms: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/signup', form)
      window.location.href = '/login'
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Signup failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md p-10 bg-white rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create your account</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Please fill in the following details</p>

        <form onSubmit={submit} className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={e => setForm({ ...form, lastname: e.target.value })}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">User Type</p>
            <div className="flex gap-4">
              <label htmlFor="guest" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="guest"
                  id="guest"
                  className="mr-2 text-red-500 focus:ring-red-500"
                  checked={form.userType === 'guest'}
                  onChange={e => setForm({ ...form, userType: e.target.value })}
                />
                <span className="text-gray-700">Guest</span>
              </label>
              <label htmlFor="host" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="host"
                  id="host"
                  className="mr-2 text-red-500 focus:ring-red-500"
                  checked={form.userType === 'host'}
                  onChange={e => setForm({ ...form, userType: e.target.value })}
                />
                <span className="text-gray-700">Host</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="terms" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                className="mr-2 text-red-500 focus:ring-red-500"
                checked={form.terms}
                onChange={e => setForm({ ...form, terms: e.target.checked })}
                required
              />
              <span className="text-gray-700">I agree to the terms and conditions</span>
            </label>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Signing up…' : 'Sign Up'}
          </Button>

          <div className="text-center mt-6 border-t pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?
              <Link to="/login" className="font-medium text-red-600 hover:text-red-800 ml-1">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}


