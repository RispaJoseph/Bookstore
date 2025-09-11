import React, { useState, useEffect } from "react";
import { createBook, fetchBook, updateBook } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function BookForm({ editMode = false }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    author: "",
    published_year: "",
    price: "",
  });
  const nav = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      fetchBook(id).then((b) =>
        setForm({
          title: b.title,
          author: b.author,
          published_year: b.published_year || "",
          price: b.price || "",
        })
      );
    }
  }, [editMode, id]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (editMode) await updateBook(id, form);
      else await createBook(form);
      nav("/books");
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Failed to save");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {editMode ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
          />

          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
          />

          <input
            placeholder="Published Year"
            value={form.published_year}
            onChange={(e) =>
              setForm({ ...form, published_year: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
