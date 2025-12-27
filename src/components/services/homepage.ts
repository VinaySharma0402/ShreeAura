// homepageApi.ts
import axios from "axios";
import { API_BASE } from "./auth";

const API_BASE_URL = `${API_BASE}/home-page`;

export const HomePageApi = {
  getAllProducts: async () => axios.get(`${API_BASE_URL}/get-all-products`),
  getProductById: async (id: string) => axios.get(`${API_BASE_URL}/get-product/${id}`),
  searchProductsByName: async (name: string) => axios.get(`${API_BASE_URL}/search`, { params: { name } }),
  searchByPrice: async (price: number) => axios.get(`${API_BASE_URL}/search-by-price`, { params: { price } }),
  searchByBrand: async (brandName: string) => {
    console.log("searchByBrand API called with:", brandName); // 👈 log API hit
    return axios.get(`${API_BASE_URL}/search-by-brand`, {
      params: { brandName },
    });
  },
  getProductsByCategory: async (category: string) => axios.get(`${API_BASE_URL}/category/${category}`),
  getTopRatedProducts: async () => axios.get(`${API_BASE_URL}/top-rated`),

  // ✅ NEW: fetch all categories (make sure backend supports this)
  

  getCategories: async () => axios.get(`${API_BASE_URL}/get-categories`),
  getShopByCategory: async () => axios.get(`${API_BASE_URL}/get-shop-by-category`),
  getShopByName: async () => axios.get(`${API_BASE_URL}/shop-by-name`),

  getAllBlogs: async () => axios.get(`${API_BASE_URL}/get-all-blogs`),
};
