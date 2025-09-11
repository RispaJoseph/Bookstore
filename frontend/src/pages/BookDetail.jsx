import React, { useEffect, useState } from "react";
import { fetchBook, createOrder, verifyPayment, deleteBook } from "../api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const access = useSelector((s) => s.auth.access);
  const nav = useNavigate();

  useEffect(() => {
    fetchBook(id).then(setBook).catch(console.error);
  }, [id]);

  async function handleBuy() {
    if (!access) {
      alert("Login required");
      nav("/auth");
      return;
    }
    try {
      const res = await createOrder(id);
      const options = {
        key: res.key,
        amount: res.amount,
        currency: res.currency,
        name: book.title,
        description: book.author,
        order_id: res.order_id,
        handler: async function (response) {
          const verifyRes = await verifyPayment(response);
          if (verifyRes.detail) alert("Payment: " + verifyRes.detail);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      alert("Deleted");
      nav("/books");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed");
    }
  }

  if (!book) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">{book.title}</h2>

        {/* Metadata */}
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Author:</span> {book.author}</p>
          <p><span className="font-semibold">Year:</span> {book.published_year}</p>
          <p className="text-lg font-semibold text-gray-900">
            Price: ₹{book.price}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleBuy}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Buy Now
          </button>

          {access && (
            <Link
              to={`/books/${id}/edit`}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Edit
            </Link>
          )}

          {access && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
