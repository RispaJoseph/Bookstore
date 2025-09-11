import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { requestOtp, verifyOtp } from "../api";
import { setTokens } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [form, setForm] = useState({ email: "", mobile: "", otp: "" });
  const [stage, setStage] = useState("request"); // "request" | "verify"
  const dispatch = useDispatch();
  const nav = useNavigate();

  async function onRequest(e) {
    e.preventDefault();
    try {
      let payload = {};
      if (form.email && form.mobile) {
        alert("Please enter either email OR mobile, not both");
        return;
      } else if (form.email) {
        payload = { email: form.email };
      } else if (form.mobile) {
        payload = { mobile: form.mobile };
      } else {
        alert("Please enter either email or mobile");
        return;
      }

      console.log("👉 Payload being sent:", payload);

      await requestOtp(payload);
      setStage("verify");
    } catch (err) {
      console.error("Request OTP failed:", err.response?.data || err.message);
      alert("Failed to request OTP");
    }
  }

  async function onVerify(e) {
    e.preventDefault();
    try {
      let payload = {};
      if (form.email) payload = { email: form.email };
      else if (form.mobile) payload = { mobile: form.mobile };
      payload.otp = form.otp;

      const res = await verifyOtp(payload);
      dispatch(setTokens({ access: res.access, refresh: res.refresh }));
      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);

      alert("Login successful!");
      nav("/books");
    } catch (err) {
      console.error("Verify OTP failed:", err.response?.data || err.message);
      alert("Invalid OTP");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      {/* Card stretches full on mobile, centers on larger screens */}
      <div className="w-full max-w-lg bg-white rounded-none sm:rounded-xl shadow-md p-8 sm:mx-4 sm:my-6 sm:shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Authentication <span className="text-indigo-500"></span>
        </h2>

        {stage === "request" && (
          <form onSubmit={onRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value, mobile: "" })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
            />

            <div className="text-center text-gray-500 font-medium">OR</div>

            <input
              type="text"
              placeholder="Enter mobile"
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value, email: "" })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
            />

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              Request OTP
            </button>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={onVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none bg-gray-50"
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
