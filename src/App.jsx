
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Resource from "./pages/Resources";
import Booking from "./pages/Booking";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default Page */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Authentication Pages */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Admin Page */}
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                {/* User Pages */}
                <Route
                    path="/user-dashboard"
                    element={<UserDashboard />}
                />

                <Route
                    path="/resources"
                    element={<Resource />}
                />

                <Route
                    path="/booking"
                    element={<Booking />}
                />

                {/* Invalid URL */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
