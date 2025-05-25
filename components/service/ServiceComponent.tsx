"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Package, Shield, Building2, ClipboardList } from "lucide-react";
import CartComponent from "@/components/Cart/CartComponent";

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

const services: Service[] = [
  {
    id: 1,
    name: "نظام المراقبة الذكي",
    description: "نظام متكامل للمراقبة الأمنية مع تقنيات الذكاء الاصطناعي",
    price: 5000,
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
    category: "security"
  },
  {
    id: 2,
    name: "بوابة التحكم بالدخول",
    description: "نظام متطور للتحكم في الدخول باستخدام التقنيات الحيوية",
    price: 3500,
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
    category: "security"
  },
  {
    id: 3,
    name: "إدارة المباني الذكية",
    description: "حل شامل لإدارة المرافق والصيانة في المباني",
    price: 7500,
    image: "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg",
    category: "property"
  },
  {
    id: 4,
    name: "تطوير المجمعات السكنية",
    description: "خدمات تطوير وإدارة المجمعات السكنية المتكاملة",
    price: 15000,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    category: "real-estate"
  }
];

const categories = [
  { id: "all", name: "جميع الخدمات", icon: Package },
  { id: "security", name: "الأمن والحماية", icon: Shield },
  { id: "real-estate", name: "التطوير العقاري", icon: Building2 },
  { id: "property", name: "إدارة الأملاك", icon: ClipboardList }
];

export default function ServicesClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const addToCart = (service: Service) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === service.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === serviceId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            خدماتنا
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            اكتشف مجموعة خدماتنا المتميزة في مجالات الأمن والحماية والتطوير العقاري وإدارة الأملاك
          </motion.p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-background"
                  : "bg-card border border-border/10 hover:border-primary/20"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/10 rounded-xl overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{service.price} ريال</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(service)}
                    className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    إضافة للسلة
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </motion.button>

        {/* Cart Component */}
        <CartComponent
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      </div>
    </div>
  );
}