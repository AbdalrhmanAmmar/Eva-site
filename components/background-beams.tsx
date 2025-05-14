// components/ui/background-beams.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            transition: { duration: 4, repeat: Infinity, delay: i * 0.5 }
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          style={{
            clipPath: `polygon(0% ${i * 10}%, 100% ${(i + 5) * 10}%, 100% ${(i + 10) * 10}%, 0% ${(i + 5) * 10}%)`
          }}
        />
      ))}
    </div>
  );
}