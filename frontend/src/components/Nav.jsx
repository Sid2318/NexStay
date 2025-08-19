import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/modern.css";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export default function Nav() {
  const { pathname } = useLocation();
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

  useEffect(() => {
    axios
      .get("/me")
      .then((res) => setAuth(res.data))
      .catch(() => setAuth({ isLoggedIn: false, user: null }));
  }, [pathname]);

  const is = (page) => pathname === page;
  const isHost = auth.user?.userType === "host";
  const isGuest = auth.user?.userType === "guest";

  const logout = async () => {
    await axios.post("/logout");
    setAuth({ isLoggedIn: false, user: null });
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-amber-100 border-b border-light-gray">
      <nav className="container navbar flex items-center justify-between py-2">
        <div className="flex items-center">
          <Link to="/" className="navbar-brand flex-shrink-0">
            <img
              src="http://localhost:3000/images/NexStay.png"
              alt="NexStay Logo"
              className="w-11 h-12 mr-10"
            />
          </Link>

          <ul className="flex items-center gap-6 ml-8">
            <li>
              <Link to="/" className={`nav-link ${is("/") ? "active" : ""}`}>
                Home
              </Link>
            </li>
            {auth.isLoggedIn && isGuest && (
              <>
                <li>
                  <Link
                    to="/homes"
                    className={`nav-link ${is("/homes") ? "active" : ""}`}
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favourites"
                    className={`nav-link ${is("/favourites") ? "active" : ""}`}
                  >
                    Saved
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bookings"
                    className={`nav-link ${is("/bookings") ? "active" : ""}`}
                  >
                    Trips
                  </Link>
                </li>
              </>
            )}
            {auth.isLoggedIn && isHost && (
              <>
                <li>
                  <Link
                    to="/host/host-home-list"
                    className={`nav-link ${
                      is("/host/host-home-list") ? "active" : ""
                    }`}
                  >
                    My Listings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/host/add-home"
                    className={`nav-link ${
                      is("/host/add-home") ? "active" : ""
                    }`}
                  >
                    Add Property
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {!auth.isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`btn btn-secondary mr-2 ${is("/login") ? "active" : ""}`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`btn btn-primary ml-2 ${is("/signup") ? "active" : ""}`}
            >
              Sign up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              {auth.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
