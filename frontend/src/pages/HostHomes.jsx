import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button.jsx";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function HostHomes() {
  const [homes, setHomes] = useState([]);
  useEffect(() => {
    axios.get("/host/homes").then((r) => setHomes(r.data));
  }, []);
  const del = async (id) => {
    await axios.delete(`/host/homes/${id}`);
    setHomes(homes.filter((h) => h._id !== id));
  };
  return (
    <div className="container mx-auto p-6 fade-in">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Properties</h1>
        <Button
          to="/host/add-home"
          variant="primary"
          className="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 inline-block"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Property
        </Button>
      </div>

      {homes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No properties yet
          </h2>
          <p className="text-gray-500 mb-6">
            Add your first property to get started.
          </p>
          <Button to="/host/add-home" variant="primary">
            Add Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homes.map((h) => (
            <div
              key={h._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={`http://localhost:3000/${h.houseImage}`}
                  alt={h.houseName}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "http://localhost:3000/images/no-image.png";
                  }}
                />
                <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
                  <div className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {h.rating || "5.0"}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {h.houseName}
                </h2>
                <p className="text-gray-600 mb-2">{h.houseLocation}</p>
                <div className="flex items-center mb-4">
                  <span className="text-lg font-bold">${h.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/ night</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    to={`/host/edit-home/${h._id}`}
                    variant="secondary"
                    className="flex-1 py-2 text-center flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    onClick={() => del(h._id)}
                    variant="danger"
                    className="flex-1 py-2 text-center flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
