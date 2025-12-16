"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/items", label: "Items" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Search on each input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
        setMobileMenuOpen(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, router]);

  if (isAdmin) {
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
              HexaDrive
            </Link>
          </div>
          
          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative flex items-center w-full">
              <Input
                type="text"
                placeholder="Search by name or product number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-20"
              />
              {searchQuery && (
                <X
                  className="absolute right-12 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/items");
                  }}
                />
              )}
              <Search 
                className="absolute right-3 h-4 w-4 text-gray-400"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-left text-xl font-bold">HexaDrive</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mx-2">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Button
                      key={link.href}
                      asChild
                      variant="ghost"
                      className="justify-start"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile Search - Below the header */}
        <div className="md:hidden pb-4">
          <div className="relative flex items-center w-full">
            <Input
              type="text"
              placeholder="Search by name or product number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-20"
            />
            {searchQuery && (
              <X
                className="absolute right-12 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/items");
                }}
              />
            )}
            <Search 
              className="absolute right-3 h-4 w-4 text-gray-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}