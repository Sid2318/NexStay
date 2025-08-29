import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import HomeList from "./pages/HomeList.jsx";
import "./styles/modern.css";
import HomeDetail from "./pages/HomeDetail.jsx";
import Reserve from "./pages/Reserve.jsx";
import Favourites from "./pages/Favourites.jsx";
import Bookings from "./pages/Bookings.jsx";
import Payment from "./pages/Payment.jsx";
import HostHomes from "./pages/HostHomes.jsx";
import EditHome from "./pages/EditHome.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ChatAssistant from "./components/ChatAssistant.jsx";

// import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <div >
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/homes" element={<HomeList />} />
          <Route path="/homes/:homeId" element={<HomeDetail />} />
          <Route path="/book/:homeId" element={<Reserve />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/host/host-home-list" element={<HostHomes />} />
          <Route path="/host/add-home" element={<EditHome mode="add" />} />
          <Route
            path="/host/edit-home/:homeId"
            element={<EditHome mode="edit" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {/* Chat Assistant that's available on all pages */}
      <ChatAssistant />
    </div>
  );
}
