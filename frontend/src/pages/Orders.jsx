import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(
          "Failed to fetch orders:",
          err.response ? err.response.data : err.message
        );
        alert("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Orders
        </h2>

        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {order.book.title}
              </h3>
              <p className="text-gray-600">by {order.book.author}</p>
              <p className="mt-2 text-gray-800 font-medium">
                Amount Paid: ₹{(order.amount / 100).toFixed(2)}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>

                {order.razorpay_payment_id && (
                  <p className="text-sm text-gray-500">
                    Payment ID: {order.razorpay_payment_id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
