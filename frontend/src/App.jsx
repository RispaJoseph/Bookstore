import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Auth from "./pages/Auth";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookForm from "./pages/BookForm";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route
          path="/books/new"
          element={<ProtectedRoute><BookForm /></ProtectedRoute>}
        />
        <Route
          path="/books/:id/edit"
          element={<ProtectedRoute><BookForm editMode /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute><Orders /></ProtectedRoute>}
        />

      </Routes>
    </div>
  );
}
