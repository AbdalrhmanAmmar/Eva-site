"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Shield,
  Building2,
  ClipboardList,
} from "lucide-react";

const services = [
  { icon: Shield, label: "الأمن والحماية", href: "/about" },
  { icon: Building2, label: "التطوير العقاري", href: "/about" },
  { icon: ClipboardList, label: "إدارة الأملاك", href: "/about" },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "المملكة العربية السعودية، الرياض",
    href: "#",
  },
  {
    icon: Phone,
    label: "+966 XX XXX XXXX",
    href: "tel:+966XXXXXXXX",
  },
  {
    icon: Mail,
    label: "info@eva-security.com",
    href: "mailto:info@eva-security.com",
  },
  {
    icon: Clock,
    label: "الأحد - الخميس: 9:00 ص - 5:00 م",
    href: "#",
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link href="/" className="block">
              <Image
                src="/images/whitelogo.png"
                alt="EVA Logo"
                width={120}
                height={120}
                className="w-auto h-16"
              />
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              نقدم حلولاً متكاملة في مجالات الأمن والحماية والتطوير العقاري وإدارة الأملاك، مع التركيز على الابتكار والجودة.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <social.icon className="w-4 h-4 text-primary" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-6">خدماتنا</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <motion.div
                  key={service.label}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  <Link
                    href={service.href}
                    className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                  >
                    <service.icon className="w-4 h-4" />
                    <span>{service.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-6">معلومات الاتصال</h3>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 text-muted hover:text-primary transition-colors"
                >
                  <info.icon className="w-5 h-5 mt-0.5" />
                  <span className="text-sm">{info.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-6">النشرة البريدية</h3>
            <p className="text-sm text-muted mb-4">
              اشترك في نشرتنا البريدية للحصول على آخر الأخبار والتحديثات
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/30 transition-colors text-right"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                اشتراك
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p>© {currentYear} EVA. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}