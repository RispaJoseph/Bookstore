import React, { useEffect, useState } from "react";
import { fetchBooks } from "../api";
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const params = {};
      if (q) params.search = q; // ✅ use `search` instead of `q`
      params.page = page;
      try {
        const data = await fetchBooks(params);
        if (data.results) setBooks(data.results);
        else setBooks(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [q, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Browse Books
        </h2>

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            placeholder="Search title or author..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
          />
        </div>

        {/* Books grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                    <Link to={`/books/${b.id}`} className="hover:underline">
                      {b.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600">by {b.author}</p>
                  <p className="text-gray-800 font-medium mt-2">₹{b.price}</p>
                </div>
                <Link
                  to={`/books/${b.id}`}
                  className="mt-4 inline-block text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No books found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg transition ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">{page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}  
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
