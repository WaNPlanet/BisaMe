"use client";
import { useState, useRef, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface OtpVerificationProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export default function OtpVerification({ phoneNumber, onVerificationSuccess, onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const code = verificationCode || otp.join("");
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Verifying OTP:", code);
      const response = await apiClient.verifyOtp(code);
      
      if (response.success) {
        console.log("✅ OTP verification successful");
        onVerificationSuccess();
      } else {
        setError(response.message || "Verification failed");
      }
    } catch (err: any) {
      console.error("❌ OTP verification error:", err);
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // You might need to call a resend OTP endpoint here
      // For now, we'll simulate success
      console.log("🔄 Resending OTP to:", phoneNumber);
      
      // Set cooldown for 30 seconds
      setResendCooldown(30);
      
      // Clear OTP fields
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      
      // Show success message
      setError(null);
      // In a real app, you'd show a success message
      console.log("✅ Verification code resent");
      
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#fb6a09]">Verify Your Phone</h2>
            <div className="mt-2 w-16 h-1 bg-[#fb6a09] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Enter the 6-digit verification code sent to
            </p>
            <p className="font-semibold text-gray-800">{phoneNumber}</p>
          </div>

          {/* OTP Input Fields */}
          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  disabled={loading}
                  className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-semibold focus:border-[#fb6a09] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some(digit => digit === "")}
              className={`w-full py-3 px-4 cursor-pointer ${
                loading || otp.some(digit => digit === "") 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#fb6a09] hover:bg-[#e55f08]'
              } text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb6a09] transition-colors`}
            >
              {loading ? "VERIFYING..." : "VERIFY CODE"}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                  className={`font-medium ${
                    resendCooldown > 0 || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-500"
                  } transition-colors`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}