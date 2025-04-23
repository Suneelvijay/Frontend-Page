/**
 * API client for connecting to the backend server
 */

// Update API base URL to match the backend server
const API_BASE_URL = 'http://localhost:8080/api';

// Define common interfaces
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

interface VerifyEmailRequest {
  email: string;
  otp: string;
}

interface VerifyLoginRequest {
  email: string;
  otp: number;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  [key: string]: any;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

interface DemoRideRequest {
  vehicleId: string;
  customerId?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  notes?: string;
}

interface QuoteRequest {
  vehicleId: number;
  notes?: string;
}

interface QuoteListRequest {
  page: number;
  size: number;
}

interface QuoteResponse {
  id: number;
  vehicleId: number;
  vehicleName: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Vehicle {
  id: string;
  name: string;
  price: string;
  image?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

interface InventoryItem extends Vehicle {
  stock: number;
  dealerId: string;
}

import { isTokenExpired, handleLogout } from './auth-utils'
import { toast } from 'sonner'

/**
 * Wrapper for fetch with error handling
 */
const fetchWithErrorHandling = async <T>(url: string, options: RequestInit = {}, router?: any): Promise<T> => {
  try {
    // Get auth token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      await handleLogout(() => {
        router?.push("/")
        toast.error("Your session has expired. Please log in again.")
      })
      throw new Error("Session expired")
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse JSON response if possible
    const data = await response.json().catch(() => ({})) as T & { message?: string, error?: string };

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Check if it's an account expiration error
      if (data.error && data.error.includes("Your account has expired")) {
        await handleLogout(() => {
          router?.push("/")
          toast.error(data.error || "Your account has expired. Please contact support to extend your account.")
        })
        throw new Error(data.error)
      }
      // Handle regular session expiration
      await handleLogout(() => {
        router?.push("/")
        toast.error("Your session has expired. Please log in again.")
      })
      throw new Error("Session expired")
    }

    // Handle API error responses
    if (!response.ok) {
      throw new Error(data.message || data.error || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  // Register a new user
  register: async (userData: RegisterData): Promise<any> => {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Verify email OTP during registration
  verifyEmail: async (verifyData: VerifyEmailRequest): Promise<any> => {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  },
  
  // Login user
  login: async (credentials: LoginCredentials): Promise<any> => {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // Verify OTP during login
  verifyLogin: async (verifyData: VerifyLoginRequest): Promise<AuthResponse> => {
    return fetchWithErrorHandling<AuthResponse>(`${API_BASE_URL}/api/auth/verify-login`, {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  },

  // Logout user
  logout: async (): Promise<void> => {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
};

/**
 * Customer API calls
 */
export const customerAPI = {
  getProfile: async (): Promise<UserData> => {
    return fetchWithErrorHandling<UserData>(`${API_BASE_URL}/user/profile`);
  },
  
  updateProfile: async (data: Partial<UserData>): Promise<UserData> => {
    return fetchWithErrorHandling<UserData>(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Quote Request APIs
  createQuoteRequest: async (data: QuoteRequest): Promise<QuoteResponse> => {
    return fetchWithErrorHandling<QuoteResponse>(`${API_BASE_URL}/user/quote`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getQuoteRequests: async (data: QuoteListRequest): Promise<{ content: QuoteResponse[], totalElements: number }> => {
    return fetchWithErrorHandling<{ content: QuoteResponse[], totalElements: number }>(`${API_BASE_URL}/user/quote/list`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getQuoteRequestById: async (id: number): Promise<QuoteResponse> => {
    return fetchWithErrorHandling<QuoteResponse>(`${API_BASE_URL}/user/quote/${id}`);
  },

  cancelQuoteRequest: async (id: number): Promise<void> => {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/user/quote/${id}/cancel`, {
      method: 'PUT',
    });
  }
};

/**
 * Vehicles API calls
 */
export const vehiclesAPI = {
  getAllVehicles: async (): Promise<Vehicle[]> => {
    return fetchWithErrorHandling<Vehicle[]>(`${API_BASE_URL}/vehicles`);
  },
  
  getVehicleById: async (id: string): Promise<Vehicle> => {
    return fetchWithErrorHandling<Vehicle>(`${API_BASE_URL}/vehicles/${id}`);
  },
  
  requestDemoRide: async (data: DemoRideRequest): Promise<{ id: string; message: string }> => {
    return fetchWithErrorHandling<{ id: string; message: string }>(`${API_BASE_URL}/api/demo-rides`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

/**
 * Dealer API calls
 */
export const dealerAPI = {
  getDashboardStats: async (): Promise<Record<string, any>> => {
    return fetchWithErrorHandling<Record<string, any>>(`${API_BASE_URL}/api/dealers/dashboard`);
  },
  
  getInventory: async (): Promise<InventoryItem[]> => {
    return fetchWithErrorHandling<InventoryItem[]>(`${API_BASE_URL}/api/dealers/inventory`);
  },
  
  updateInventory: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    return fetchWithErrorHandling<InventoryItem>(`${API_BASE_URL}/api/dealers/inventory`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

/**
 * Admin API calls
 */
export const adminAPI = {
  getAllDealers: async (): Promise<UserData[]> => {
    return fetchWithErrorHandling<UserData[]>(`${API_BASE_URL}/api/admin/dealers`);
  },
  
  getAllCustomers: async (): Promise<UserData[]> => {
    return fetchWithErrorHandling<UserData[]>(`${API_BASE_URL}/api/admin/customers`);
  }
};