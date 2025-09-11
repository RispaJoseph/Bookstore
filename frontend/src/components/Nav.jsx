import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Nav() {
  const access = useSelector((s) => s.auth.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/auth");
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex items-center justify-between">
      {/* Logo / Title */}
      <Link
        to="/"
        className="text-xl font-bold tracking-wide text-indigo-600 hover:text-indigo-700 transition"
      >
        Book Store
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        <Link
          to="/books"
          className="text-gray-700 hover:text-indigo-600 transition"
        >
          Books
        </Link>
        <Link
          to="/orders"
          className="text-gray-700 hover:text-indigo-600 transition"
        >
          My Orders
        </Link>

        {access ? (
          <>
            <Link
              to="/books/new"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Add Book
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-1.5 rounded-lg shadow-sm transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
