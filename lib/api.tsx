const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://195.35.36.122:1991/";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  phoneNumber: string;
  countryShortName: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: UserProfile;
    token: string;
  };
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SignInData {
  phoneNumber: string;
  password: string;
  countryShortName: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  otherNames: string | null;
  phoneNumber: string;
  countryShortName: string;
  password: string;
  referralType: string | null;
  countryCode: string;
  countryName: string;
  referralCode: string | null;
  email: string | null;
}

export interface ForgotPasswordData {
  phoneNumber: string;
  countryShortName: string;
}

export interface ResetPasswordData {
  phoneNumber: string;
  verificationCode: string;
  newPassword: string;
}

export interface VerifyOtpData {
  verificationCode: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Remove leading slash from endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      console.log(`🌐 Making API request to: ${url}`, config);

      // Create abort controller with longer timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📨 Response status: ${response.status}`);

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else if (response.status === 204) {
        data = {};
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response type: ${contentType}. Response: ${text}`);
      }

      console.log("📊 API response:", data);

      // Check both HTTP status AND API success flag
      if (!response.ok || (data && data.success === false)) {
        // IMPROVED ERROR HANDLING - Handle object responses properly
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        if (data) {
          // Try different possible error message fields
          if (typeof data.message === 'string') {
            errorMessage = data.message;
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (data.message && typeof data.message === 'object') {
            // If message is an object, stringify it
            try {
              errorMessage = JSON.stringify(data.message);
            } catch {
              errorMessage = 'Invalid error format';
            }
          } else if (data.error && typeof data.error === 'object') {
            // If error is an object, stringify it
            try {
              errorMessage = JSON.stringify(data.error);
            } catch {
              errorMessage = 'Invalid error format';
            }
          } else if (data.errors && Array.isArray(data.errors)) {
            // Handle array of errors
            errorMessage = data.errors.map((err: any) => 
              typeof err === 'string' ? err : JSON.stringify(err)
            ).join(', ');
          } else {
            // Fallback: stringify the entire response data
            try {
              errorMessage = JSON.stringify(data);
            } catch {
              errorMessage = 'Unknown error occurred';
            }
          }
        }

        console.error('🚨 API Error Details:', {
          status: response.status,
          responseData: data,
          extractedMessage: errorMessage
        });

        // Handle 401 specifically - clear auth token
        if (response.status === 401) {
          this.clearAuthToken();
        }

        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error("🔴 API request failed:", error);
      
      let errorMessage = 'Unknown API error occurred';
      
      // ✅ Handle specific error types
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. The server is taking too long to respond. Please try again.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.name === 'SyntaxError') {
        errorMessage = 'Invalid response from server. Please try again.';
      } else if (error instanceof Error) {
        // Handle [object Object] specifically
        if (error.message === '[object Object]' || error.message.includes('[object Object]')) {
          errorMessage = 'Operation failed. Please check your input and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      console.error("🎯 Throwing clean error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Auth methods - using consistent endpoint format
  async signIn(signInData: SignInData): Promise<AuthResponse> {
    return this.request<AuthResponse>("api/authentication/signin", {
      method: "POST",
      body: JSON.stringify(signInData),
    });
  }

  async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    return this.request<AuthResponse>("api/authentication/signup", {
      method: "POST",
      body: JSON.stringify(signUpData),
    });
  }

  async verifyOtp(verificationCode: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/verify-otp", {
      method: "POST",
      body: JSON.stringify({ verificationCode }),
    });
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordData): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/forgot-password", {
      method: "POST",
      body: JSON.stringify(forgotPasswordData),
    });
  }

  async resetPassword(resetPasswordData: ResetPasswordData): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/reset-password", {
      method: "POST",
      body: JSON.stringify(resetPasswordData),
    });
  }

  // NEW VERIFICATION METHODS
  // For signup verification
  async verifySignupOtp(verificationCode: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/verify-otp", {
      method: "POST",
      body: JSON.stringify({ verificationCode }),
    });
  }

  // For password reset verification  
  async verifyPasswordResetOtp(verificationCode: string, phoneNumber: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/verify-password-reset-otp", {
      method: "POST",
      body: JSON.stringify({ verificationCode, phoneNumber }),
    });
  }

  // Check if there's a specific endpoint for password reset verification
  async checkVerificationCode(verificationCode: string, phoneNumber: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("api/authentication/check-verification-code", {
      method: "POST",
      body: JSON.stringify({ verificationCode, phoneNumber }),
    });
  }

  // Token management
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const token = localStorage.getItem("auth_token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.warn("Failed to get auth token from localStorage:", error);
      return {};
    }
  }

  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("auth_token", token);
      } catch (error) {
        console.error("Failed to store auth token:", error);
      }
    }
  }

  clearAuthToken(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("auth_token");
      } catch (error) {
        console.error("Failed to clear auth token:", error);
      }
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return !!localStorage.getItem("auth_token");
    } catch {
      return false;
    }
  }

  // User profile methods
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<ApiResponse<UserProfile>>("api/user/profile", {
      method: "GET",
    });
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<ApiResponse<UserProfile>>("api/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing connection to:', this.baseUrl);
      const response = await fetch(this.baseUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for connection test
      });
      console.log('🏥 Connection test result:', response.status);
      return response.ok;
    } catch (error) {
      console.error('💥 Connection test failed:', error);
      return false;
    }
  }

  // Generic methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export default ApiClient;