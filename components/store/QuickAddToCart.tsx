"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface QuickAddToCartProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, quantity: number) => void;
}

export default function QuickAddToCart({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddToCart(product.id, quantity);
      setIsAdding(false);
      onClose();
      setQuantity(1);
    }, 500);
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-border/10 rounded-2xl p-6 w-full max-w-md z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">إضافة إلى السلة</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h4 className="font-medium line-clamp-2">{product.name}</h4>
                <div className="text-primary font-bold mt-1">
                  {product.price.toLocaleString()} ريال
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">الكمية</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 bg-background border border-border/10 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                    className="w-full text-center py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
                
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                  className="p-2 bg-background border border-border/10 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">المجموع:</span>
              <span className="text-xl font-bold text-primary">
                {(product.price * quantity).toLocaleString()} ريال
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="w-full py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  إضافة للسلة
                </>
              )}
            </motion.button>

            {!product.inStock && (
              <div className="mt-3 text-center text-red-500 text-sm">
                هذا المنتج غير متوفر حالياً
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}