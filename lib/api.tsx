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

      const response = await fetch(url, {
        ...config,
        // Add timeout to detect network issues faster
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
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
        const errorMessage = data.message || data.error || data.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error("🔴 API request failed:", error);
      
      let errorMessage = 'Unknown API error occurred';
      
      // ✅ Handle specific error types
      if (error.name === 'TimeoutError') {
        errorMessage = 'Request timeout. The server is taking too long to respond.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request was aborted.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.name === 'SyntaxError') {
        errorMessage = 'Invalid response from server. Please try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
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

