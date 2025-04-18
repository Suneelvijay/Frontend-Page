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
  vehicleId: string;
  customerId?: string;
  name: string;
  email: string;
  phone: string;
  options?: string[];
  notes?: string;
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

/**
 * Wrapper for fetch with error handling
 */
const fetchWithErrorHandling = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    // Get auth token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
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
    const data = await response.json().catch(() => ({})) as T & { message?: string };

    // Handle API error responses
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
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
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Verify email OTP during registration
  verifyEmail: async (verifyData: VerifyEmailRequest): Promise<any> => {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  },
  
  // Login user
  login: async (credentials: LoginCredentials): Promise<any> => {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // Verify OTP during login
  verifyLogin: async (verifyData: VerifyLoginRequest): Promise<AuthResponse> => {
    return fetchWithErrorHandling<AuthResponse>(`${API_BASE_URL}/auth/verify-login`, {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  },

  // Logout user
  logout: async (): Promise<void> => {
    return fetchWithErrorHandling<void>(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({}),
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
    return fetchWithErrorHandling<{ id: string; message: string }>(`${API_BASE_URL}/demo-rides`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  requestQuote: async (data: QuoteRequest): Promise<{ id: string; message: string }> => {
    return fetchWithErrorHandling<{ id: string; message: string }>(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

/**
 * Customer API calls
 */
export const customerAPI = {
  getProfile: async (): Promise<UserData> => {
    return fetchWithErrorHandling<UserData>(`${API_BASE_URL}/customers/profile`);
  },
  
  updateProfile: async (data: Partial<UserData>): Promise<UserData> => {
    return fetchWithErrorHandling<UserData>(`${API_BASE_URL}/customers/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

/**
 * Dealer API calls
 */
export const dealerAPI = {
  getDashboardStats: async (): Promise<Record<string, any>> => {
    return fetchWithErrorHandling<Record<string, any>>(`${API_BASE_URL}/dealers/dashboard`);
  },
  
  getInventory: async (): Promise<InventoryItem[]> => {
    return fetchWithErrorHandling<InventoryItem[]>(`${API_BASE_URL}/dealers/inventory`);
  },
  
  updateInventory: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    return fetchWithErrorHandling<InventoryItem>(`${API_BASE_URL}/dealers/inventory`, {
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
    return fetchWithErrorHandling<UserData[]>(`${API_BASE_URL}/admin/dealers`);
  },
  
  getAllCustomers: async (): Promise<UserData[]> => {
    return fetchWithErrorHandling<UserData[]>(`${API_BASE_URL}/admin/customers`);
  }
};