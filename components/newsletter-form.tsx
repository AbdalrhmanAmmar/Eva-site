"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full mt-8 p-6 rounded-lg border border-[#898989]/20 bg-[#1E1E1E]/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4 text-[#F2DF56]">
          <Bell size={18} />
          <h3 className="font-medium">احصل على إشعار عند الإطلاق</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-[#898989]">
              بريدك الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="w-full px-4 py-3 bg-[#898989]/10 border border-[#898989]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2DF56]/50 transition-colors text-right"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
              isSubmitting 
                ? 'bg-[#898989]/50 cursor-not-allowed' 
                : 'bg-[#F2DF56] text-[#1E1E1E] hover:bg-[#F2DF56]/90'
            }`}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'أخطرني'}
          </button>
        </form>
        
        <p className="mt-4 text-xs text-[#898989] text-center">
          نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </motion.div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          تم بنجاح! سيتم إخطارك عند إطلاق الموقع.
        </div>
      )}
    </>
  );
}