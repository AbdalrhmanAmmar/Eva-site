"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "security" | "real-estate" | "property";
}

interface CartItem extends Service {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (serviceId: number, delta: number) => void;
  onRemoveItem: (serviceId: number) => void;
}

export default function CartComponent({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}: CartProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: 300 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border/10 p-6 z-50 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">سلة المشتريات</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            السلة فارغة
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-background/50 rounded-lg p-4"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-primary font-bold">{item.price} ريال</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-primary/10 rounded-md transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-primary/10 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border/10 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">المجموع</span>
                <span className="text-xl font-bold text-primary">{totalAmount} ريال</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                إتمام الطلب
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}