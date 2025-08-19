import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RatingStars from "../components/RatingStars.jsx";
import FavouriteButton from "../components/FavouriteButton.jsx";
import Button from "../components/Button.jsx";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function IndexPage() {
  const [homes, setHomes] = useState([]);
  useEffect(() => {
    axios
      .get("/homes")
      .then((r) => setHomes(r.data))
      .catch(() => setHomes([]));
  }, []);
  return (
    <div>
      {/* Hero section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-20"
        style={{
          backgroundImage: `url('http://localhost:3000/images/background1.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center min-h-[500px]">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold mb-4 text-white leading-tight">
                Find Your Next
                <br />
                <span className="text-red-500">Adventure</span>
              </h1>
              <p className="text-xl mb-12 text-white opacity-90 leading-relaxed">
                Discover unique stays, experiences, and places all around the
                world. Your journey begins here.
              </p>
              <Button to="/homes" variant="primary" size="sm">
                Browse Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Properties */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-red-600 mb-10">
            Popular Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {homes.map((h) => (
              <div
                key={h._id}
                className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:3000/${h.houseImage}`}
                    alt={h.houseName}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "http://localhost:3000/images/no-image.png";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">
                      {h.houseName}
                    </h3>
                  </div>
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 text-gray-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-600 text-sm truncate">
                      {h.houseLocation}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <RatingStars rating={h.rating} />
                    <p className="text-gray-800 font-semibold">
                      <span className="text-lg font-bold text-red-600">
                        Rs{h.price}
                      </span>
                      <span className="text-sm text-gray-500">/night</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      to={`/homes/${h._id}`}
                      variant="secondary"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <div className="ml-3">
                      <FavouriteButton homeId={h._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
