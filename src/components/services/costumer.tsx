import { API_BASE } from "./auth";

// ============================
// User Interfaces
// ============================
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  passcode?: string;
}
// ============================
// Review Interfaces
// ============================
export interface Review {
  product: ProductDetails;
  users: User;
  rating: number;
  review: string;
  createdAt: string;
  description: string;


}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  city: string;
  address: string;
  pincode: number;
  chatId: number;
}

export interface ProductDetails {
  productId: string;
  seller: Seller;

}

// ============================
// Order Interfaces
// ============================

// Matches backend OrderDao
export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  products: OrderItemRequest[]; // ✅ changed from productIds: string[]
  address: string;
  pincode: number;
  price: number;
  phone: string;
  paymentMethod?: string; // optional if you want to include payment method
}

// Matches backend OrderResponse
export interface OrderResponse {
  orderId: string;
  products: {
    imageUrl: string;
    [productName: string]: number | string;
    productPrice: number;

  };
  totalPrice: number;
  address: string;
  phone: string;
  status: number;
  orderTime: string;
}



// ============================
// Helper: Auth Headers
// ============================
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token
    ? {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    : { "Content-Type": "application/json" };
};

// ============================
// User Profile Management
// ============================

// Fetch user profile
export const fetchUserProfile = async (userId: string | undefined): Promise<User> => {
  const res = await fetch(`${API_BASE}/user/profile?id=${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const token = await res.text(); // backend returns JWT
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.User;
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  const res = await fetch(`${API_BASE}/user/update-profile?id=${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update user profile");

  const token = await res.text(); // backend returns new JWT
  localStorage.setItem("token", token); // update token
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.User;
};

// ============================
// Order Management
// ============================

// Place new order
export const placeOrder = async (
  order: OrderRequest,
  latitude: number,
  longitude: number,
  transactionOrderId: string
): Promise<string> => {
  console.log("Placing order with transactionOrderId:", transactionOrderId);
  const res = await fetch(
    `${API_BASE}/user/place-order?latitude=${latitude}&longitude=${longitude}&transactionOrderId=${transactionOrderId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(order),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to place order");
  }
  console.log(order);
  return await res.text(); // e.g. "your order is placed"
};

// Fetch all orders of a user
export const fetchOrders = async (userId: string): Promise<OrderResponse[]> => {
  const res = await fetch(`${API_BASE}/user/your-order?id=${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text(); // get actual response (in case of HTML/error)
    console.error("Failed to fetch orders, response:", text);
    throw new Error(`Failed to fetch orders. Status: ${res.status}`);
  }

  const data = await res.json(); // read JSON once
  console.log("Fetched orders response:", data);
  return data; // return the JSON directly
};

// ============================
// Razorpay Payment Integration
// ============================

// Create Razorpay order (calls backend /create-order)
export const createRazorpayOrder = async (
  userId: string,
  amount: number
): Promise<any> => {
  const res = await fetch(`${API_BASE}/user/create-order`, {
    method: "POST",
    headers: getAuthHeaders(), // ✅ use your helper (adds Bearer token)
    body: JSON.stringify({ id: userId, amount }),
  });

  const text = await res.text(); // read raw response
  if (!res.ok) {
    console.error("Failed to create Razorpay order:", text);
    throw new Error(text || "Failed to create Razorpay order");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from server: ${text}`);
  }
};


// Check Razorpay order/payment status
export const checkRazorpayOrderStatus = async (
  orderId: string,
  paymentId: string
): Promise<string> => {
  const res = await fetch(
    `${API_BASE}/user/check-order?orderId=${orderId}&paymentId=${paymentId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to check Razorpay order status");
  }

  return await res.text(); // e.g., "Payment Successful ✅"
};
// ✅ Cancel order
export const cancelOrder = async (orderId: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/user/cancel-order?orderId=${orderId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to cancel order:", text);
    throw new Error(`Failed to cancel order. Status: ${res.status}`);
  }

  return await res.text(); // e.g. "Order canceled"
};

// ============================
// Review System
// ============================



// Submit a product review
export const submitReview = async (review: Review): Promise<string> => {
  // Format to match backend Review interface - matches WriteReview function format
  const reviewPayload = review;

  // Use exact same format as WriteReview: { review: ... }
  // Backend expects @RequestBody Reviews - send directly, not wrapped
  // Try /user/write-review path since other user endpoints use /user/ prefix
  const res = await fetch(`${API_BASE}/user/write-review`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewPayload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to submit review:", text);
    throw new Error(`Failed to submit review. Status: ${res.status}`);
  }

  return await res.text(); // e.g. "Review submitted successfully"
};

export const checkReviewAvaibility = async (userId: string, productId: string): Promise<string> => {
  console.log(`Checking review availability: userId=${userId}, productId=${productId}`);
  // Endpoint confirmed working: /user/review-availability
  const url = `${API_BASE}/user/review-availability?userId=${userId}&productId=${productId}`;
  console.log(`API URL: ${url}`);

  const headers = getAuthHeaders();
  console.log("Auth headers being sent:", headers);

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  const responseText = await res.text();
  console.log(`Review availability response status: ${res.status}, body:`, responseText);

  if (!res.ok) {
    console.error("Review availability check failed:", res.status, responseText);
    // Include the response text in error for better debugging
    throw new Error(`Review check failed: ${responseText || res.status}`);
  }

  return responseText; // e.g. "Review available" or similar
};

export const WriteReview = async (review: Review) => {
  const res = await fetch(`${API_BASE}/write-review`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ review }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to write review:", text);
    throw new Error(`Failed to write review. Status: ${res.status}`);
  }

  return await res.text(); // e.g. "Review written"
};




