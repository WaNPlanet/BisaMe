"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#fb6a09]">Reset Password</h2>
            <div className="mt-2 w-16 h-1 bg-[#fb6a09] mx-auto rounded-full"></div>
          </div>
          
          <p className="text-gray-600 mb-6">
            To reset your password, you'll need to verify your phone number first.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/reset-password"
              className="block w-full py-3 bg-[#fb6a09] text-white rounded-lg hover:bg-[#e55f08] font-medium transition-colors"
            >
              START PASSWORD RESET
            </Link>
            
            <Link
              href="/"
              className="block py-2 text-blue-400 hover:text-blue-500 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}