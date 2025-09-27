// API service for connecting to NotificationBackend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notificationbackend-35f6.onrender.com/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('snakeAuthToken');
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.getAuthToken()) {
      headers.Authorization = `Bearer ${this.getAuthToken()}`;
    }

    return headers;
  }

  // Generic request method with timeout and retry
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      // Handle cases where response is not JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: `HTTP error! status: ${response.status}` };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server is not responding');
      } else if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        throw new Error('Server is overloaded or unavailable');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - please check your connection');
      }
      
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth API methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    });

    if (response.success && response.data.token) {
      localStorage.setItem('snakeAuthToken', response.data.token);
      localStorage.setItem('snakeUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });

    if (response.success && response.data.token) {
      localStorage.setItem('snakeAuthToken', response.data.token);
      localStorage.setItem('snakeUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('snakeAuthToken');
    localStorage.removeItem('snakeUser');
  }

  // Products API methods
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getProductCategories() {
    return this.request('/products/categories');
  }

  async getProductSpecies() {
    return this.request('/products/species');
  }

  // Orders API methods
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    const apiCallId = Date.now() + Math.random()
    console.log(`🛒 API: createOrder called (ID: ${apiCallId}) with data:`, orderData)
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id, status, trackingNumber, notes) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber, notes }),
    });
  }

  async cancelOrder(id, reason) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Users API methods
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Products API methods (admin)
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications API methods
  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }

  // User API methods
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
