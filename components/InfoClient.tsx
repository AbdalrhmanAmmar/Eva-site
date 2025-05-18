"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaTiktok,FaWhatsapp,FaSnapchatGhost  } from "react-icons/fa";


import {
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Linkedin,
  MessageSquareText,
  PhoneCall,
  Ghost,
} from "lucide-react";
import { HeroGeometric } from './ui/shape-landing-hero';

const links = [

  {
    icon: Facebook,
    label: "فيسبوك",
    href: "https://www.facebook.com/evaSaudiRealestate",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Instagram,
    label: "انستغرام",
    href: "https://www.instagram.com/eva_realstate",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Twitter,
    label: "تويتر",
    href: "https://x.com/Eva__RealeState",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: FaSnapchatGhost,
    label: "سناب شات",
    href: "https://www.snapchat.com/add/eva_realestate",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: FaTiktok ,
    label: "تيك توك",
    href: "www.tiktok.com/@eva__realestate",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },

  {
    icon: FaWhatsapp,
    label: "واتساب",
    href: "https://wa.me/966540800987",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    href: "mailto:Sales@EvaSaudi.com",
    color: "bg-secondary/10 border border-secondary/20 text-foreground",
  },
];

export default function InfoClient() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 relative overflow-hidden">
      <HeroGeometric  />
      
      <div className="max-w-lg mx-auto relative z-10">


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