"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer() {
  const calculateTarget = () => {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    return target;
  };

  const [targetDate] = useState(calculateTarget());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <h3 className="text-center text-md font-medium mb-4 text-[#898989]">الوقت المتوقع حتى الإطلاق</h3>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        {timeUnits.map((unit, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-[#F2DF56]/10 border border-[#F2DF56]/30 rounded-md px-2 py-3">
              <span className="text-xl md:text-2xl font-bold text-white">
                {unit.value < 10 ? `0${unit.value}` : unit.value}
              </span>
            </div>
            <span className="text-xs mt-1 text-[#898989]">{unit.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}