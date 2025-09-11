import axios from "axios";

export const API_BASE =
    import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getAuthHeader() {
    const token = localStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function requestOtp(payload) {
    return axios.post(`${API_BASE}/auth/request-otp`, payload).then(r => r.data);
}

export async function verifyOtp(payload) {
    return axios.post(`${API_BASE}/auth/verify-otp`, payload).then(r => r.data);
}

export async function refreshToken(payload) {
    return axios.post(`${API_BASE}/auth/refresh-token`, payload).then(r => r.data);
}

export async function fetchBooks(params = {}) {
    return axios.get(`${API_BASE}/books/`, { params }).then(r => r.data);
}

export async function fetchBook(id) {
    return axios.get(`${API_BASE}/books/${id}/`).then(r => r.data);
}

export async function createBook(book) {
    return axios.post(`${API_BASE}/books/`, book, { headers: getAuthHeader() }).then(r => r.data);
}

export async function updateBook(id, book) {
    return axios.put(`${API_BASE}/books/${id}/`, book, { headers: getAuthHeader() }).then(r => r.data);
}

export async function deleteBook(id) {
    return axios.delete(`${API_BASE}/books/${id}/`, { headers: getAuthHeader() }).then(r => r.data);
}

// create order (ViewSet action on detail)
export async function createOrder(bookId) {
    const tokenHeaders = getAuthHeader();
    return axios.post(`${API_BASE}/books/${bookId}/create_order/`, {}, { headers: tokenHeaders }).then(r => r.data);
}

// verify payment (ViewSet action)
export async function verifyPayment(payload) {
    const tokenHeaders = getAuthHeader();
    return axios.post(`${API_BASE}/books/verify_payment/`, payload, { headers: tokenHeaders }).then(r => r.data);
}

export async function fetchMyOrders() {
    return axios.get(`${API_BASE}/auth/me/orders`, { headers: getAuthHeader() }).then(r => r.data);
}