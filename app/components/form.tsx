"use client";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { apiClient, SignInData, SignUpData } from "@/lib/api";
import OtpVerification from "./OtpVerification"; // Add this import

export default function AuthCard() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("GH");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEW STATE FOR OTP FLOW
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [verificationPhoneNumber, setVerificationPhoneNumber] = useState("");

  const countries = [
    { code: "GH", dialCode: "+233", flag: "https://flagcdn.com/w20/gh.png", name: "Ghana", shortName: "GH" },
    { code: "NG", dialCode: "+234", flag: "https://flagcdn.com/w20/ng.png", name: "Nigeria", shortName: "NG" },
    { code: "US", dialCode: "+1", flag: "https://flagcdn.com/w20/us.png", name: "United States", shortName: "US" },
    { code: "GB", dialCode: "+44", flag: "https://flagcdn.com/w20/gb.png", name: "United Kingdom", shortName: "GB" },
  ];

  const currentCountry = countries.find((c) => c.code === selectedCountry);

  // NEW: Handle OTP verification success
  const handleVerificationSuccess = () => {
    console.log("✅ OTP verified successfully!");
    window.location.href = "/dashboard";
  };

  // NEW: Handle back from OTP verification
  const handleBackFromOtp = () => {
    setShowOtpVerification(false);
    setVerificationPhoneNumber("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!phoneNumber.trim()) throw new Error("Please enter your phone number");
      if (!password.trim() || password.length < 6) throw new Error("Password must be at least 6 characters");
      if (!isSignIn && (!firstName.trim() || !lastName.trim())) throw new Error("Please enter your first and last name");

      const fullPhoneNumber = `${currentCountry?.dialCode}${phoneNumber}`;

      if (isSignIn) {
        // Sign In
        const signInData: SignInData = {
          phoneNumber: fullPhoneNumber,
          password,
          countryShortName: currentCountry?.shortName || "GH",
        };

        console.log("🔐 Attempting sign in:", signInData);
        const response = await apiClient.signIn(signInData);

        localStorage.setItem("auth_token", response.data.token);
        console.log("✅ Sign in successful");
        window.location.href = "/dashboard";
      } else {
        // Sign Up - UPDATED FOR OTP FLOW
        const signUpData: SignUpData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          otherNames: otherNames.trim() || null,
          phoneNumber: fullPhoneNumber,
          countryShortName: currentCountry?.shortName || "GH",
          password,
          referralType: null,
          countryCode: currentCountry?.dialCode || "+233",
          countryName: currentCountry?.name || "Ghana",
          referralCode: null,
          email: null,
        };

        console.log("📝 Attempting sign up:", signUpData);
        const response = await apiClient.signUp(signUpData);

        // Store token immediately
        localStorage.setItem("auth_token", response.data.token);
        console.log("✅ Sign up successful - redirecting to OTP verification");

        // Show OTP verification instead of redirecting
        setVerificationPhoneNumber(fullPhoneNumber);
        setShowOtpVerification(true);
      }
    } catch (err: unknown) {
      console.error("❌ Authentication error:", err);
      
      let errorMessage = "Authentication failed";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      
      if (errorMessage.includes('[object Object]') || errorMessage === '[object Object]') {
        errorMessage = "Invalid phone number or password. Please check your credentials.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const clearError = () => setError(null);

  // NEW: Show OTP verification component when needed
  if (showOtpVerification) {
    return (
      <OtpVerification
        phoneNumber={verificationPhoneNumber}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackFromOtp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mx-6">
          <button
            onClick={() => { setIsSignIn(true); clearError(); }}
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors cursor-pointer ${
              isSignIn ? "text-[#fb6a09] border-b-2 border-[#fb6a09]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignIn(false); clearError(); }}
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors cursor-pointer ${
              !isSignIn ? "text-[#fb6a09] border-b-2 border-[#fb6a09]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#fb6a09]">{isSignIn ? "Welcome Back!" : "Join Us!"}</h2>
            <div className="mt-2 w-16 h-1 bg-[#fb6a09] mx-auto rounded-full"></div>
            <p className="mt-2 text-gray-600">
              {isSignIn ? (
                <>Ready to continue your journey on <span className="text-blue-400 font-bold">Bisame</span></>
              ) : (
                <>Start your journey with <span className="text-blue-400 font-bold">Bisame</span></>
              )}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name fields for Sign Up */}
            {!isSignIn && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="otherNames" className="block text-sm font-bold text-gray-700 mb-2">
                    Other Names
                  </label>
                  <input
                    id="otherNames"
                    type="text"
                    value={otherNames}
                    onChange={(e) => setOtherNames(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent"
                    placeholder="Other names (optional)"
                  />
                </div>
              </>
            )}

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#fb6a09] focus-within:border-transparent bg-white">
                <div className="flex items-center border-r border-gray-300 px-3 py-2">
                  {currentCountry && (
                    <>
                      <img 
                        src={currentCountry.flag} 
                        alt={currentCountry.name} 
                        className="w-5 h-4 mr-2 rounded-sm"
                      />
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-transparent py-1 pl-1 pr-6 text-sm focus:outline-none cursor-pointer appearance-none"
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.dialCode}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border-none focus:outline-none bg-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm text-gray-700 font-bold">
                  Password
                </label>
                {isSignIn && (
                  <Link
  href="/reset-password"  // Changed from "/forgotpassword"
  className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
>
  Forgot password?
</Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 py-3 px-8 cursor-pointer ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#fb6a09] hover:bg-[#e55f08]'
                } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb6a09] transition-colors`}
              >
                {loading ? "PLEASE WAIT..." : isSignIn ? "SIGN IN" : "SIGN UP"}
                {!loading && <ArrowRight className="w-4 h-4 text-white" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}