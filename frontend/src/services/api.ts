import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CryptoData {
  rank: number;
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number | null;
  change7d: number | null;
}

export interface CryptoResponse {
  data: CryptoData[];
}

/**
 * Fetch top cryptocurrencies by market cap
 * @param limit Number of cryptocurrencies to fetch (default 10, max 100)
 */
export const fetchTopCryptos = async (
  limit: number = 10,
): Promise<CryptoData[]> => {
  const response = await apiClient.get<CryptoResponse>("/api/crypto/top", {
    params: { limit },
  });
  return response.data.data;
};

export default apiClient;
