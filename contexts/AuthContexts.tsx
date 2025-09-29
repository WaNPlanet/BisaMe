
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  apiClient,
  UserProfile,
  SignInData,
  SignUpData,
  ApiResponse,
  AuthResponse,
} from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (signInData: SignInData) => Promise<boolean>;
  signUp: (signUpData: SignUpData) => Promise<boolean>;
  signOut: () => void;
  verifyOtp: (verificationCode: string) => Promise<ApiResponse>;
  forgotPassword: (
    phoneNumber: string,
    countryShortName: string
  ) => Promise<ApiResponse>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const safeError = (err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err) {
      return (err as any).message;
    }
    return fallback;
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(safeError(err, "Failed to load user profile"));
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (signInData: SignInData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await apiClient.signIn(signInData);
      localStorage.setItem("auth_token", response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setError(safeError(err, "Sign in failed. Please check your credentials."));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (signUpData: SignUpData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await apiClient.signUp(signUpData);
      localStorage.setItem("auth_token", response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setError(safeError(err, "Sign up failed. Please try again."));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setError(null);
  };

  const verifyOtp = async (verificationCode: string): Promise<ApiResponse> => {
    try {
      return await apiClient.verifyOtp(verificationCode);
    } catch (err) {
      setError(safeError(err, "Verification failed"));
      throw err;
    }
  };

  const forgotPassword = async (
    phoneNumber: string,
    countryShortName: string
  ): Promise<ApiResponse> => {
    try {
      return await apiClient.forgotPassword({ phoneNumber, countryShortName });
    } catch (err) {
      setError(safeError(err, "Failed to send reset code"));
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    verifyOtp,
    forgotPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

