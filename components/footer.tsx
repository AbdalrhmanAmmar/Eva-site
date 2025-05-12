"use client";

import { motion } from 'framer-motion';
import { Twitter, Linkedin, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'تويتر' },
    { icon: Linkedin, href: '#', label: 'لينكد إن' },
    { icon: Mail, href: 'mailto:contact@eva-security.com', label: 'البريد الإلكتروني' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-12 py-6 border-t border-[#898989]/20"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#898989] text-sm">
          &copy; {currentYear} EVA للأمن والحماية. جميع الحقوق محفوظة.
        </div>
        
        <div className="flex space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              aria-label={link.label}
              className="text-[#898989] hover:text-[#F2DF56] transition-colors p-2"
            >
              <link.icon size={18} />
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center text-[#898989]">
        <p>موقعنا قيد التطوير. للأمور العاجلة، يرجى التواصل معنا عبر البريد الإلكتروني.</p>
      </div>
    </motion.footer>
  );
}