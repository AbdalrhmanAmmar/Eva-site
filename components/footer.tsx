// components/footer.tsx
'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEye } from 'react-icons/fa';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-black/50 backdrop-blur-lg border-t border-gray-800 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <FaShieldAlt className="text-blue-400 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              EVA
            </span>
          </motion.div>
          
          <div className="flex gap-6">
            <motion.a 
              whileHover={{ y: -3 }}
              href="#"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaLock /> الخصوصية
            </motion.a>
            <motion.a 
              whileHover={{ y: -3 }}
              href="#"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaEye /> الشروط
            </motion.a>
          </div>
          
          <motion.p 
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm"
          >
            © 2023 EVA. جميع الحقوق محفوظة.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}