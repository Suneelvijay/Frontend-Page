import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/dealer';

// Helper function to get the token
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

const dealerApi = {
  getProfile: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/profile/update`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  changePassword: async (newPassword) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/password/change`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getTestDriveRequests: async (page = 0, size = 10, status = 'ALL') => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/test-drive-requests/list`, {
        page,
        size,
        ...(status !== 'ALL' && { status })
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getTestDriveRequestById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/test-drive-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  updateTestDriveStatus: async (requestId, status) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/test-drive-requests/${requestId}/status`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { status },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  downloadTestDrives: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/test-drives/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getQuoteRequests: async (page = 0, size = 10, status = 'ALL') => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/quote-requests/list`, {
        page,
        size,
        ...(status !== 'ALL' && { status })
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getQuoteRequestById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/quote-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  downloadQuoteRequests: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/quote-requests/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  updateQuoteRequest: async (requestId, status, quotedPrice, adminResponse) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/quote-requests/${requestId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status,
            quotedPrice,
            adminResponse,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
      }
      throw error;
    }
  },
};

export default dealerApi; 