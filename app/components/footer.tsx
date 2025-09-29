import { Link } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Logo and Contact Info */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image 
                src="/bisa.png"
                alt="BisaMe Logo"
                width={40} 
                height={32}
                className="w-8 h-6 object-contain"
              />
              <h3 className="text-lg font-bold text-white">BisaMe</h3>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-medium text-white">Customer Support:</p>
              <p className="font-bold">+233 59 309 8902</p>
              <p>Koree Mari Link</p>
              <p>Achimota, Greater Accra</p>
              <p>bisamecustomercare@gmail.com</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">QUICK LINKS</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <a href="#" className="block hover:text-[#fb6a09] transition-colors">Wishlist</a>
              <a href="#" className="block hover:text-[#fb6a09] transition-colors">Customer Support</a>
              <a href="#" className="block hover:text-[#fb6a09] transition-colors">About Us</a>
              <a href="#" className="block hover:text-[#fb6a09] transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-[#fb6a09] transition-colors">Terms of Use</a>
            </div>
          </div>

          {/* Column 3: Download App */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold">DOWNLOAD APP</h6>
           <div className="space-y-3">
  {/* Google Play Button */}
  <button className="w-full  text-white py-2 px-4 rounded bg-cyan-950 hover:bg-[#e55f08] transition-colors flex items-center justify-start gap-2 cursor-pointer">
    <Image 
      src="/google.png" 
      alt="Google Play"
      width={40}
      height={20}
      className="w-6 h-6"
    />
    <div className="text-left">
      <p className="text-xs">GET IT ON</p>
      <p className="text-sm font-medium">Google Play</p>
    </div>
  </button>
  
  {/* App Store Button */}
  <button className="w-full bg-cyan-950 text-white py-2 px-4 rounded hover:bg-[#e55f08] transition-colors flex items-center justify-start gap-2 cursor-pointer">
    <Image 
      src="/app.png" 
      alt="App Store"
      width={40}
      height={20}
      className="w-6 h-6"
    />
    <div className="text-left">
      <p className="text-xs">Download on the</p>
      <p className="text-sm font-medium">App Store</p>
    </div>
  </button>
</div>
          </div>

          {/* Column 4: Popular Tags */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold">POPULAR TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Game", "iPhone", "TV", "Asus Laptop", "Macbook", "SSD", 
                  "Graphics Card", "PowerBank","Smart TV", 
                "Speaker", "Tablet", "Microwave", "Samsung"
              ].map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-700 px-3 py-1 rounded text-xs hover:bg-[#fb6a09] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Border */}
       <div className="border-t border-gray-700 mt-7 pt-4 text-center text-sm text-gray-400">
  <p>Bisame online store&copy; {new Date().getFullYear()}.</p>
</div>
      </div>
    </footer>
  )
}