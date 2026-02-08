// homepageApi.ts
import axios from "axios";
import { API_BASE } from "./auth";
import type { Review } from "./costumer";

// Define strict types for the API responses
export interface Product {
  id: number;
  productId?: string;
  name: string;
  brand: string;
  category: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  badge?: string;
  tags?: string[];
  // properties from new API check response
  subCategory?: string;
  available?: boolean;
  imageUrl?: string;
}

const API_BASE_URL = `${API_BASE}/home-page`;

export const HomePageApi = {
  getAllProducts: async () => axios.get(`${API_BASE_URL}/get-all-products`),
  getProductById: async (id: string) => axios.get(`${API_BASE_URL}/get-product/${id}`),
  searchProductsByName: async (name: string) => axios.get(`${API_BASE_URL}/search`, { params: { name } }),
  searchByPrice: async (price: number) => axios.get(`${API_BASE_URL}/search-by-price`, { params: { price } }),
  searchByBrand: async (brandName: string) => {
    console.log("searchByBrand API called with:", brandName);
    return axios.get(`${API_BASE_URL}/search-by-brand`, {
      params: { brandName },
    });
  },
  getProductsByCategory: async (category: string) => axios.get(`${API_BASE_URL}/category/${category}`),
  getTopRatedProducts: async () => axios.get(`${API_BASE_URL}/top-rated`),

  // Categories
  getCategories: async () => axios.get(`${API_BASE_URL}/get-categories`),

  // Shops
  getShopByCategory: async () => axios.get(`${API_BASE_URL}/get-shop-by-category`),
  getShopByName: async () => axios.get(`${API_BASE_URL}/shop-by-name`),

  // Blogs
  getAllBlogs: async () => axios.get(`${API_BASE_URL}/get-all-blogs`),

  // Best Deals
  getTopRateds: async () => axios.get(`${API_BASE_URL}/get-best-deals`),

  // Product Reviews
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const res = await fetch(`${API_BASE_URL}/get-product-review?productId=${productId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to get product reviews:", text);
      throw new Error(`Failed to get product reviews. Status: ${res.status}`);
    }

    return await res.json();
  },
};