import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button.jsx";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function EditHome({ mode }) {
  const { homeId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    houseLocation: "",
    rating: "",
    description: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (mode === "edit" && homeId) {
      axios.get(`/homes/${homeId}`).then((r) =>
        setForm({
          houseName: r.data.houseName,
          price: r.data.price,
          houseLocation: r.data.houseLocation,
          rating: r.data.rating,
          description: r.data.description || "",
        })
      );
    }
  }, [mode, homeId]);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("houseImage", file);
    if (mode === "add") {
      await axios.post("/host/homes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.put(`/host/homes/${homeId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    navigate("/host/host-home-list");
  };

  return (
    <div className="container mx-auto p-6 fade-in">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {mode === "add" ? "Add New Property" : "Edit Property"}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "add"
            ? "List your property on NexStay to start receiving bookings."
            : "Update your property information to keep it accurate and attractive."}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="houseName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Name
                </label>
                <input
                  id="houseName"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g. Cozy Beach House"
                  value={form.houseName}
                  onChange={(e) =>
                    setForm({ ...form, houseName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Per Night ($)
                </label>
                <input
                  id="price"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g. 120"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  id="location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g. Miami, Florida"
                  value={form.houseLocation}
                  onChange={(e) =>
                    setForm({ ...form, houseLocation: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating (0.0-5.0)
                </label>
                <input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g. 4.5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Describe your property..."
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Image
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-32 w-32 rounded-md overflow-hidden bg-gray-100">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <label
                    htmlFor="file-upload"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
                  >
                    Choose Image
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              className="mr-3"
              onClick={() => navigate("/host/host-home-list")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-8 py-3">
              {mode === "add" ? "Add Property" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
