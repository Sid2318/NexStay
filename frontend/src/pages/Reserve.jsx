import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button.jsx";
import "../styles/modern.css";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function Reserve() {
  const { homeId } = useParams();
  const [home, setHome] = useState(null);
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    paymentMode: "cod",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [result, setResult] = useState(null);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios.get(`/homes/${homeId}`).then((r) => {
      setHome(r.data);
      setTotalPrice(r.data.price); // Initialize with single night price
    });
  }, [homeId]);

  // Calculate nights and total price when dates change
  useEffect(() => {
    if (form.checkIn && form.checkOut && home) {
      const checkInDate = new Date(form.checkIn);
      const checkOutDate = new Date(form.checkOut);

      // Calculate difference in days
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nightCount = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

      setNights(nightCount);
      setTotalPrice(home.price * nightCount);
    }
  }, [form.checkIn, form.checkOut, home]);

  const submit = async (e) => {
    e.preventDefault();
    // Add calculated nights to the form data
    const bookingData = {
      ...form,
      nights: nights,
      totalPrice: totalPrice,
    };

    const r = await axios.post(`/book/${homeId}`, bookingData);
    setResult(r.data);
    if (r.status === 201) {
      // Ensure Bookings page reflects latest
      window.location.href = "/bookings";
    }
  };

  if (!home) return null;

  return (
    <main className="container property-details py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left column - Property details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{home.houseName}</h1>
            <p className="text-gray">{home.houseLocation}</p>
          </div>

          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={`http://localhost:3000/${home.houseImage}`}
              alt={home.houseName}
              className="property-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "http://localhost:3000/images/no-image.png";
              }}
            />
          </div>

          <div className="property-section">
            <h3 className="text-xl font-semibold mb-2">About this property</h3>
            <p className="text-gray-600">{home.description}</p>
          </div>

          <div className="flex items-center mt-4">
            <div className="rating mr-4">
              <span className="star">★</span>
              <span className="ml-1">{home.rating}</span>
            </div>
            <div className="price-tag font-semibold">
              ₹{home.price} <span className="text-gray">night</span>
            </div>
          </div>
        </div>

        {/* Right column - Reservation form */}
        <div>
          <div className="modern-card p-8">
            <h2 className="text-2xl font-semibold mb-6">
              Complete your reservation
            </h2>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Check-in date</label>
                  <input
                    className="form-control"
                    type="date"
                    min={new Date().toISOString().split("T")[0]} // Can't select dates in the past
                    value={form.checkIn}
                    onChange={(e) =>
                      setForm({ ...form, checkIn: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out date</label>
                  <input
                    className="form-control"
                    type="date"
                    min={form.checkIn || new Date().toISOString().split("T")[0]} // Must be after check-in date
                    value={form.checkOut}
                    onChange={(e) =>
                      setForm({ ...form, checkOut: e.target.value })
                    }
                    required
                  />
                  {form.checkIn &&
                    form.checkOut &&
                    new Date(form.checkOut) <= new Date(form.checkIn) && (
                      <p className="text-red-500 text-sm mt-1">
                        Check-out date must be after check-in date
                      </p>
                    )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Number of guests</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your full name</label>
                <input
                  className="form-control"
                  placeholder="John Doe"
                  value={form.guestName}
                  onChange={(e) =>
                    setForm({ ...form, guestName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  className="form-control"
                  placeholder="your@email.com"
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) =>
                    setForm({ ...form, guestEmail: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone number</label>
                <input
                  className="form-control"
                  placeholder="+1 (123) 456-7890"
                  value={form.guestPhone}
                  onChange={(e) =>
                    setForm({ ...form, guestPhone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment method</label>
                <select
                  className="form-control"
                  value={form.paymentMode}
                  onChange={(e) =>
                    setForm({ ...form, paymentMode: e.target.value })
                  }
                >
                  <option value="cod">Cash on arrival</option>
                  <option value="card">Credit/Debit card</option>
                </select>
              </div>

              <div className="border-t border-light-gray pt-6 mt-6">
                <div className="flex justify-between mb-4">
                  <span>
                    ${home.price} × {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                  <span>₹{totalPrice}</span>
                </div>

                {/* You can add service fee or other charges here if needed */}

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="success"
                className="w-full btn btn-primary"
              >
                Reserve
              </Button>
            </form>

            {result && (
              <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">Booking confirmed!</span>
                </div>
                <p>Your stay for {result.nights} nights has been booked.</p>
                <p className="font-semibold mt-2">
                  Total: ₹{result.totalPrice}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
