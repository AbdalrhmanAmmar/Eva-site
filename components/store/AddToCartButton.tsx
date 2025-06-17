"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Plus } from "lucide-react";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  disabled?: boolean;
  variant?: "default" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
  onAddToCart?: (productId: number) => void;
}

export default function AddToCartButton({
  productId,
  productName,
  disabled = false,
  variant = "default",
  size = "md",
  onAddToCart,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAdded(true);
      setIsLoading(false);
      
      // Call parent callback if provided
      onAddToCart?.(productId);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 500);
  };

  const getButtonClasses = () => {
    const baseClasses = "transition-all duration-300 rounded-lg font-medium";
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    const variantClasses = {
      default: "bg-primary text-background hover:bg-primary/90",
      icon: "bg-primary/10 text-primary hover:bg-primary/20",
      minimal: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-background",
    };

    const disabledClasses = disabled 
      ? "opacity-50 cursor-not-allowed" 
      : "cursor-pointer";

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses}`;
  };

  const getIcon = () => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }
    
    if (isAdded) {
      return <Check className="w-4 h-4" />;
    }
    
    return variant === "icon" ? <Plus className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (variant === "icon") return null;
    
    if (isLoading) return "جاري الإضافة...";
    if (isAdded) return "تمت الإضافة";
    if (disabled) return "غير متوفر";
    return "إضافة للسلة";
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={getButtonClasses()}
      title={variant === "icon" ? `إضافة ${productName} للسلة` : undefined}
    >
      <div className="flex items-center justify-center gap-2">
        {getIcon()}
        {getButtonText() && <span>{getButtonText()}</span>}
      </div>
    </motion.button>
  );
}