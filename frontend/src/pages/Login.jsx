import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button.jsx'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/login', { email, password })
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex items-center justify-center">
        <main className="w-full max-w-md p-10 bg-white rounded-xl shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Login to your account</h1>
          <p className="text-center text-sm text-gray-500 mb-8">Please enter your credentials below</p>

          <form onSubmit={submit} className="max-w-md mx-auto">
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>

            <div className="text-center mt-6 border-t pt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?
                <Link to="/signup" className="font-medium text-red-600 hover:text-red-800 ml-1">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}


