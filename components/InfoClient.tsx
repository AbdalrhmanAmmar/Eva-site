"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Linkedin,
  MessageSquareText, // تيك توك (لا يوجد أيقونة رسمية، هذا بديل مناسب)
  PhoneCall,         // واتساب (بديل مناسب)
  Ghost,             // سناب شات (أقرب شكل موجود)
} from "lucide-react";

const links = [
  {
    icon: Globe,
    label: "الموقع الإلكتروني",
    href: "https://eva-security.com",
    color: "bg-primary text-background",
  },
  {
    icon: Facebook,
    label: "فيسبوك",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Instagram,
    label: "انستغرام",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Twitter,
    label: "تويتر",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Ghost, // سناب شات
    label: "سناب شات",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: MessageSquareText, // تيك توك
    label: "تيك توك",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Linkedin,
    label: "لينكد إن",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: PhoneCall, // واتساب
    label: "واتساب",
    href: "#",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    href: "mailto:contact@eva-security.com",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
];


export default function InfoClient() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative w-[350px] h-[350px]  mx-auto mb-4">
            <Image
              src="/images/whitelogo.png"
              alt="EVA Logo"
              fill
              className="object-contain"
            />
            <motion.div
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(242, 223, 86, 0)", "0px 0px 30px rgba(242, 223, 86, 0.5)", "0px 0px 0px rgba(242, 223, 86, 0)"]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="absolute inset-0 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">EVA</h1>
          <p className="text-primary font-medium">ايفا العقاريه</p>
        </motion.div>

        <div className="space-y-3">
          {links.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-4 rounded-lg ${link.color} hover:opacity-90 transition-all transform hover:scale-[1.02] backdrop-blur-sm w-full`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </motion.a>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted text-sm text-center mt-8"
        >
          تواصل معنا عبر منصاتنا الاجتماعية
        </motion.p>
      </div>
    </div>
  );
}