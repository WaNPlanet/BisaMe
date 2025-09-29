"use client";
import { useState, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function ForgotPassword() {
  const [codes, setCodes] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 5);
    if (/^\d+$/.test(pasteData)) {
      const newCodes = [...codes];
      pasteData.split('').forEach((char, index) => {
        if (index < 5) newCodes[index] = char;
      });
      setCodes(newCodes);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newCodes.findIndex(code => code === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[4]?.focus();
      }
    }
  };

  const allFilled = codes.every(code => code !== '');
  const buttonColor = allFilled ? 'bg-[#e55f08]' : 'bg-[#fb6a09] opacity-70';

  return (
    <main>
      <Navbar />
      {/* Forgot Password Content */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold ">
                Verify your account
              </h2>
           
              <p className="mt-2 text-gray-600">
                We've sent a verification code to your phone
              </p>
            </div>

            {/* Verification Code Inputs */}
            <form className="space-y-6">
              <div className="flex justify-center gap-3">
                {codes.map((code, index) => (
                  <input
                    key={index}
                    ref={el => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent"
                  />
                ))}
              </div>

              {/* Resend Code */}
              <div className="text-center">
              
                  <button
                    type="button"
                    className="font-medium text-[#fb6a09]  transition-colors"
                  >
                    Resend
                  </button>
               
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!allFilled}
                  className={`w-full py-3 px-4 ${buttonColor} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb6a09] transition-colors ${allFilled ? 'hover:bg-[#d45407]' : 'cursor-not-allowed'}`}
                >
                  Verify Account
                </button>
              </div>

              
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}