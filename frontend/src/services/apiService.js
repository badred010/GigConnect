const API_URL = "http://localhost:5000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return { success: true, message: "Action completed successfully" };
};

const apiService = {
  // --- Authentication ---
  register: (userData) => {
    return fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }).then(handleResponse);
  },
  login: (credentials) => {
    return fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then(handleResponse);
  },

  // --- User Profile ---
  getUserProfile: (token) => {
    return fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  updateUserProfile: (updatedData, token) => {
    return fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    }).then(handleResponse);
  },

  // --- Gigs ---
  getGigs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/gigs?${queryParams}`).then(handleResponse);
  },
  getGigById: (id) => {
    return fetch(`${API_URL}/gigs/${id}`).then(handleResponse);
  },
  getMyGigs: (token) => {
    return fetch(`${API_URL}/gigs/mygigs`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  createGig: (gigData, token) => {
    return fetch(`${API_URL}/gigs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gigData),
    }).then(handleResponse);
  },
  updateGig: (gigId, gigData, token) => {
    return fetch(`${API_URL}/gigs/${gigId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gigData),
    }).then(handleResponse);
  },
  deleteGig: (gigId, token) => {
    return fetch(`${API_URL}/gigs/${gigId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },

  // --- Orders ---
  createOrder: (orderData, token) => {
    return fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }).then(handleResponse);
  },
  getMyOrders: (token) => {
    return fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  getSellerOrders: (token) => {
    return fetch(`${API_URL}/orders/sellerorders`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  getOrderById: (orderId, token) => {
    return fetch(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  updateOrderToPaid: (orderId, paymentDetails, token) => {
    return fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentDetails),
    }).then(handleResponse);
  },
  updateOrderStatus: (orderId, status, token) => {
    return fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }).then(handleResponse);
  },
  updateOrderToDelivered: (orderId, token) => {
    return fetch(`${API_URL}/orders/${orderId}/deliver`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  raiseDispute: (orderId, disputeData, token) => {
    return fetch(`${API_URL}/orders/${orderId}/dispute`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(disputeData),
    }).then(handleResponse);
  },

  // --- Reviews ---
  createReview: (gigId, reviewData, token) => {
    return fetch(`${API_URL}/${gigId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    }).then(handleResponse);
  },
  getGigReviews: (gigId) => {
    return fetch(`${API_URL}/${gigId}/reviews`).then(handleResponse);
  },
  deleteReview: (reviewId, token) => {
    return fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },

  // --- Messages ---
  sendMessage: (messageData, token) => {
    return fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    }).then(handleResponse);
  },
  getMessages: (otherUserId, token) => {
    return fetch(`${API_URL}/messages/${otherUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  getConversations: (token) => {
    return fetch(`${API_URL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },

  // --- Payments ---
  getStripePublishableKey: () => {
    return fetch(`${API_URL}/payments/stripe-key`).then(handleResponse);
  },
  createPaymentIntent: (paymentIntentData, token) => {
    return fetch(`${API_URL}/payments/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentIntentData),
    }).then(handleResponse);
  },

  // --- Admin ---
  adminGetAllUsers: (token) => {
    return fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  adminDeleteUser: (userId, token) => {
    return fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  adminGetAllGigs: (token) => {
    return fetch(`${API_URL}/admin/gigs`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  adminDeleteGig: (gigId, token) => {
    return fetch(`${API_URL}/admin/gigs/${gigId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  adminGetDisputedOrders: (token) => {
    return fetch(`${API_URL}/admin/orders/disputed`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);
  },
  adminResolveOrder: (orderId, newStatus, token) => {
    return fetch(`${API_URL}/admin/orders/${orderId}/resolve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newStatus }),
    }).then(handleResponse);
  },
};

export default apiService;
