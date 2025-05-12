"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MaintenanceContent() {
  const [text, setText] = useState('');
  const fullText = "ايفا العقارية"
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-center"
    >
      <div className="mb-6 relative inline-block">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.5,
            type: "spring",
            stiffness: 100 
          }}
          className="mx-auto flex justify-center mb-6"
        >
          <Image
            src="/images/whitelogo.png"
            alt="EVA Logo"
            width={350}
            height={350}
            className="text-primary"
          />
          <motion.div
            animate={{ 
              boxShadow: ["0px 0px px rgba(242, 223, 86, 0)", "0px 0px 30px rgba(242, 223, 86, 0.5)", "0px 0px 0px rgba(242, 223, 86, 0)"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute inset-0 rounded-full"
          />
        </motion.div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">
        EVA
      </h1>
      
      <p className="text-xl md:text-2xl font-medium text-primary h-8 mb-8">
        {text}<span className="animate-pulse">|</span>
      </p>
      <p className="text-xl md:text-2xl font-medium text-primary h-8 mb-8">
        <span>امن وسلامه | تطوير عقاري | ادارة املاك</span>
      </p>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          الموقع قيد التطوير
        </h2>
        
        <p className="text-muted text-lg mb-6 max-w-xl mx-auto">
          نعمل بجد لنقدم لكم موقعًا جديدًا ومحسنًا. يقوم فريقنا ببناء منصة آمنة لتلبية احتياجات الحماية الخاصة بكم بشكل أفضل.
        </p>
        
        <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-primary">
          <p className="font-medium">موعد الإطلاق: قريباً</p>
        </div>
      </div>
    </motion.div>
  );
}