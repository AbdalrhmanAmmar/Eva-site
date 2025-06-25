"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { ThemeToggle } from './Theme-toggle';
import { useAuthStore } from "@/stores/authStore";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/info", label: "تواصل معنا" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  console.log("User role:", user?.role);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/whitelogo.png"
                alt="EVA Logo"
                width={100}
                height={100}
                className="w-auto h-12"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/90 hover:text-foreground transition-colors relative group py-2"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
{user && (
  user.role === 'admin' ? (
    <Link
      href="/admin"
      className="text-foreground/90 hover:text-foreground transition-colors relative group py-2"
    >
      <span>لوحة التحكم</span>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  ) : user.role === 'user' ? (
    <Link
      href="/user"
      className="text-foreground/90 hover:text-foreground transition-colors relative group py-2"
    >
      <span>لوحة المستخدم</span>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  ) : null
)}

      
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>حسابي</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden pt-20"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl text-foreground/90 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xl text-foreground/90 hover:text-foreground transition-colors"
                    >
                      <UserCircle className="w-5 h-5" />
                      <span>حسابي</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-xl text-foreground/90 hover:text-foreground transition-colors bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xl text-foreground/90 hover:text-foreground transition-colors bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-full"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}