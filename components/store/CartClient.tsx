"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Gift,
  Calculator,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
  category: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "نظام المراقبة الذكي Pro",
    description: "نظام مراقبة متطور مع تقنيات الذكاء الاصطناعي",
    price: 4500,
    originalPrice: 5000,
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg",
    quantity: 1,
    inStock: true,
    category: "أنظمة المراقبة",
  },
  {
    id: 2,
    name: "بوابة التحكم الذكية",
    description: "نظام تحكم متقدم بالدخول مع تقنية التعرف على الوجه",
    price: 3200,
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg",
    quantity: 2,
    inStock: true,
    category: "أنظمة التحكم",
  },
];

const shippingOptions = [
  { id: "standard", name: "الشحن العادي", price: 50, duration: "3-5 أيام عمل" },
  { id: "express", name: "الشحن السريع", price: 100, duration: "1-2 أيام عمل" },
  { id: "same-day", name: "التوصيل في نفس اليوم", price: 200, duration: "خلال 24 ساعة" },
];

export default function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyPromoCode = () => {
    // Mock promo codes
    const promoCodes = {
      "SAVE10": 10,
      "WELCOME20": 20,
      "FIRST50": 50,
    };

    const discount = promoCodes[promoCode as keyof typeof promoCodes];
    if (discount) {
      setAppliedPromo({ code: promoCode, discount });
      setPromoCode("");
    } else {
      alert("كود الخصم غير صحيح");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = selectedShippingOption?.price || 0;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
  const total = subtotal + shippingCost - promoDiscount;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.");
      clearCart();
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h2>
              <p className="text-muted-foreground mb-8">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
            </motion.div>
            <Link href="/store">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                تصفح المنتجات
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/store">
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">سلة التسوق</h1>
            <p className="text-muted-foreground mt-2">
              لديك {cartItems.length} منتج في السلة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-card border border-border/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">المنتجات</h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  إفراغ السلة
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 p-4 bg-background/50 rounded-lg"
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
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold">{item.price} ريال</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice} ريال
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-background border border-border/10 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-primary/10 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-primary/10 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-card border border-border/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                خيارات الشحن
              </h2>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShipping === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border/10 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">{option.duration}</div>
                      </div>
                    </div>
                    <div className="text-primary font-bold">{option.price} ريال</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-card border border-border/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                كود الخصم
              </h2>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-500" />
                    <span className="font-medium">تم تطبيق كود الخصم: {appliedPromo.code}</span>
                    <span className="text-green-500">({appliedPromo.discount}% خصم)</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="أدخل كود الخصم"
                    className="flex-1 px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                    className="px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    تطبيق
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card border border-border/10 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                ملخص الطلب
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString()} ريال</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>التوفير</span>
                    <span>-{savings.toLocaleString()} ريال</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>{shippingCost} ريال</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-500">
                    <span>خصم ({appliedPromo.code})</span>
                    <span>-{promoDiscount.toLocaleString()} ريال</span>
                  </div>
                )}

                <div className="border-t border-border/10 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الإجمالي</span>
                    <span className="text-primary">{total.toLocaleString()} ريال</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full mt-6 py-4 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    إتمام الطلب
                  </>
                )}
              </motion.button>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>دفع آمن ومحمي</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-card border border-border/10 rounded-xl p-6">
              <h3 className="font-bold mb-4">مميزات الشراء معنا</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>ضمان شامل لمدة سنتين</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>شحن مجاني للطلبات أكثر من 1000 ريال</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span>إمكانية الدفع عند الاستلام</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}