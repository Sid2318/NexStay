import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import FavouriteButton from "../components/FavouriteButton.jsx";
import Button from "../components/Button.jsx";
import "../styles/modern.css";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function HomeDetail() {
  const { homeId } = useParams();
  const [home, setHome] = useState(null);
  useEffect(() => {
    axios.get(`/homes/${homeId}`).then((r) => setHome(r.data));
  }, [homeId]);
  if (!home)
    return (
      <main
        className="container"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="loader"
          style={{
            width: "48px",
            height: "48px",
            border: "5px solid var(--light-gray)",
            borderBottomColor: "var(--primary)",
            borderRadius: "50%",
            animation: "rotation 1s linear infinite",
          }}
        >
          <style>{`
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
      </main>
    );

  return (
    <main className="container property-details ">
      <div className="property-header">
        <h1>{home.houseName}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="rating">
            <span className="star">★</span>
            <span className="ml-1">{home.rating}</span>
          </div>
          <span className="text-gray">•</span>
          <span className="text-gray">{home.houseLocation}</span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <img
          src={`http://localhost:3000/${home.houseImage}`}
          alt={home.houseName}
          className="property-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "http://localhost:3000/images/no-image.png";
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <div className="property-section">
            <h2>Description</h2>
            <p className="mt-4">{home.description}</p>
          </div>

          <div className="property-section">
            <h3>Location</h3>
            <p className="mt-4">{home.houseLocation}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="modern-card p-6 sticky" style={{ top: "2rem" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="price-tag text-xl">
                <strong>₹{home.price}</strong>{" "}
                <span className="text-gray">night</span>
              </div>
              <div className="rating">
                <span className="star">★</span>
                <span className="ml-1">{home.rating}</span>
              </div>
            </div>

            <Button
              to={`/book/${home._id}`}
              variant="success"
              className="w-full mb-4 btn btn-primary"
            >
              Reserve
            </Button>

            <div className="flex gap-2">
              <Button
                href={`http://localhost:3000/api/homes/${home._id}/pdf`}
                variant="secondary"
                download
                className="flex-1 btn btn-secondary"
              >
                Download PDF
              </Button>
              <div style={{ width: "48px" }}>
                <FavouriteButton homeId={home._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
