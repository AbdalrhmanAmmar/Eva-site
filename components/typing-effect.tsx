// components/ui/typing-effect.tsx
'use client';

import { useState, useEffect } from 'react';

const messages = [
  "حلول الأمن المتقدمة",
  "حماية شاملة",
  "أنظمة مراقبة ذكية"
];

export function TypingEffect() {
  const [text, setText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setText(currentMessage.substring(0, text.length - 1));
      } else {
        setText(currentMessage.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentMessage) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? 50 : 150);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, messageIndex]);

  return (
    <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 min-h-16">
      {text}
      <span className="animate-pulse">|</span>
    </h2>
  );
}