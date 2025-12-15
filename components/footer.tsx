"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">HexaDrive</h3>
            <p className="text-gray-300">
              Your trusted source for premium auto spare parts. Quality parts, fast delivery, expert support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/items" className="text-gray-300 hover:text-white transition-colors">
                  Browse Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: spareparts.ash@gmail.com</p>
              <p>Phone: 0715757357</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                Facebook
              </Link>
              <Link href="https://www.instagram.com/hexadrivespare_parts?utm_source=qr&igsh=ZnN6OWJnZDQ4cnVo" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                Instagram
              </Link>
              <Link href="https://www.tiktok.com/@hexadrive_spare_parts?_r=1&_t=ZS-92094SJlSvR" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                TikTok
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-300">
            © {new Date().getFullYear()} HexaDrive. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}