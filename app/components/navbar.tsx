"use client"; 

import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { Twitter, Facebook, Youtube, Instagram, MapPin, ChevronDown, Search, Heart, User, Phone, MessageCircle, HelpCircle, HeadphonesIcon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Ghana');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [buySellOpen, setBuySellOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const buySellRef = useRef<HTMLDivElement>(null);

  const locations = [
    { code: 'GH', name: 'Ghana' },
    { code: 'Nig', name: 'Nigeria' },
  ];

  const services = [
    { name: 'Web Development', href: '#' },
    { name: 'Mobile Apps', href: '#' },
    { name: 'Digital Marketing', href: '#' },

  ];

  const buySellCategories = [
    { name: 'Cars & Vehicles', href: '#' },
    { name: 'Electronics', href: '#' },

  ];

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (buySellRef.current && !buySellRef.current.contains(event.target as Node)) {
        setBuySellOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="nav text-sm md:text-xl font-bold bg-black text-white text-center py-2 px-4">
        <h4>NOTIFICATION BAR</h4>
      </nav>

      <nav>
        {/* Welcome Section */}
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#253368] text-white py-2 px-4 border-b">
          <p className="text-center sm:text-left text-xs sm:text-sm">Welcome to Bisame online store</p>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-xs sm:text-sm">Follow us:</p>
            <div className="flex gap-3">
              <Twitter className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer hover:text-blue-300 transition-colors" />
              <Facebook className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer hover:text-blue-300 transition-colors" />
              <Youtube className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer hover:text-red-300 transition-colors" />
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer hover:text-pink-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* Main Navigation Section */}
        <div className="container flex flex-col lg:flex-row justify-between items-center gap-3 py-3 px-4 bg-[#253368]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/bisa.png"
              alt="BisaMe Logo"
              width={40} 
              height={32}
              className="w-6 h-5 sm:w-8 sm:h-6 md:w-10 md:h-8 lg:w-12 lg:h-10 object-contain"
            />
           <a href="/"><h6 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white">BisaMe</h6></a> 
          </div>

          {/* Search and Location */}
          <div className="flex items-center gap-2 w-full max-w-2xl">
            {/* Location Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#fb6a09]"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">{selectedLocation}</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px] sm:min-w-[140px]">
                  {locations.map((location) => (
                    <button
                      key={location.code}
                      onClick={() => {
                        setSelectedLocation(location.code);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <div>
                        <p className="font-medium">{location.code}</p>
                        <p className="text-xs text-gray-500">{location.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 min-w-0 relative">
              <input 
                type="text" 
                placeholder="I am looking for ...." 
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 pr-8 sm:pr-10 md:pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb6a09] focus:border-transparent text-xs sm:text-sm md:text-base bg-white"
              />
              <Search className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 sm:px-4 sm:py-1 bg-[#fb6a09] text-white text-xs sm:text-sm rounded-lg hover:bg-[#e55f08] transition-colors">
              SELL
            </button>
            <button className="p-1 sm:p-2 text-white hover:text-red-300 transition-colors">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button className="p-1 sm:p-2 text-white hover:text-blue-300 transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="container bg-white border-t">
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex justify-between items-center py-2 px-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+233 530 729 974</span>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-700">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:flex justify-between items-center py-2 px-4`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 py-4 lg:py-0">
              {/* Services Dropdown */}
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center gap-1 text-gray-700 text-sm font-medium border border-gray-200 bg-gray-50 px-3 py-1.5 rounded transition-all hover:border-gray-300 hover:bg-white"
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
                    {services.map((service, index) => (
                      <a
                        key={service.name}
                        href={service.href}
                        onClick={() => setServicesOpen(false)}
                        className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#fb6a09] transition-colors ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${
                          index === services.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {service.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Buy/Sell Dropdown */}
              <div className="relative" ref={buySellRef}>
                <button
                  onClick={() => setBuySellOpen(!buySellOpen)}
                  className="flex items-center gap-1 text-gray-700 text-sm font-medium border border-gray-200 bg-gray-50 px-3 py-1.5 rounded transition-all hover:border-gray-300 hover:bg-white"
                >
                  Buy/Sell
                  <ChevronDown className={`w-4 h-4 transition-transform ${buySellOpen ? 'rotate-180' : ''}`} />
                </button>

                {buySellOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
                    {buySellCategories.map((category, index) => (
                      <a
                        key={category.name}
                        href={category.href}
                        onClick={() => setBuySellOpen(false)}
                        className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#fb6a09] transition-colors ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${
                          index === buySellCategories.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="#" className="flex items-center gap-1 text-gray-700 text-sm font-medium px-3 py-1.5 hover:text-[#fb6a09] transition-colors">
                <HeadphonesIcon className="w-4 h-4" />
                Customer Support
              </a>

              <a href="#" className="flex items-center gap-1 text-gray-700 text-sm font-medium px-3 py-1.5 hover:text-[#fb6a09] transition-colors">
                <HelpCircle className="w-4 h-4" />
                Need Help
              </a>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4 pt-4 lg:pt-0">
              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                <Phone className="w-4 h-4" />
                +233 59 467 3304
              </div>

              <div className="relative">
                <button className="p-1 text-gray-700 hover:text-gray-900 transition-colors border rounded">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}