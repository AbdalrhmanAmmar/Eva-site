"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  itemCount?: number;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

export default function CartIcon({
  itemCount = 0,
  showBadge = true,
  size = "md",
  variant = "default",
}: CartIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);

  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-12 h-12";
      default:
        return "w-10 h-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return "hover:bg-primary/10";
      default:
        return "bg-primary/10 hover:bg-primary/20";
    }
  };

  return (
    <Link href="/store/cart">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${getSizeClasses()} ${getVariantClasses()} rounded-full flex items-center justify-center transition-colors cursor-pointer`}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ShoppingCart className={`${getIconSize()} text-primary`} />
        </motion.div>

        <AnimatePresence>
          {showBadge && itemCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}