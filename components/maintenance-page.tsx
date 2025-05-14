'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from './background';
import MaintenanceContent from './maintenance-content';
import NewsletterForm from './newsletter-form';
import Footer from './footer';
import CountdownTimer from './countdown-timer';
import Image from 'next/image';

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Background />
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/whitelogo.png"
              alt="EVA Logo"
              width={200}
              height={200}
              className="text-primary"
            />
          </motion.div>
        </header>
        
        <main className="flex-grow flex flex-col items-center justify-center">
          <MaintenanceContent />
          
          <div className="mt-12 md:mt-16 w-full max-w-md">
            <CountdownTimer />
            <NewsletterForm />
          </div>
        </main>
        

      </div>
    </div>
  );
}