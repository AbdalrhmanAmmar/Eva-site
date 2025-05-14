"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Camera,
  Lock,
  Users,
  Fingerprint,
  Radio,
  Eye,
  Bell,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "أنظمة المراقبة المتقدمة",
    description: "كاميرات عالية الدقة مع تقنيات الذكاء الاصطناعي للمراقبة الذكية",
    features: [
      "تحليل الفيديو في الوقت الفعلي",
      "تتبع الحركة الذكي",
      "تخزين سحابي آمن",
      "تنبيهات فورية"
    ]
  },
  {
    icon: Lock,
    title: "حلول الأمن الإلكتروني",
    description: "حماية متكاملة للبنية التحتية الرقمية والشبكات",
    features: [
      "حماية من التهديدات المتقدمة",
      "تشفير البيانات",
      "مراقبة الشبكات 24/7",
      "استجابة سريعة للحوادث"
    ]
  },
  {
    icon: Users,
    title: "خدمات الحراسة الاحترافية",
    description: "فريق أمني مدرب على أعلى المستويات",
    features: [
      "حراس أمن معتمدين",
      "تغطية على مدار الساعة",
      "خطط أمنية مخصصة",
      "استجابة سريعة للطوارئ"
    ]
  },
  {
    icon: Fingerprint,
    title: "أنظمة التحكم في الدخول",
    description: "تقنيات متطورة للتحكم في الوصول وإدارة الهويات",
    features: [
      "بصمة الإصبع والوجه",
      "بطاقات ذكية",
      "سجلات دخول متقدمة",
      "إدارة مركزية"
    ]
  }
];

const features = [
  {
    icon: Radio,
    title: "مراقبة 24/7",
    description: "مركز عمليات يعمل على مدار الساعة"
  },
  {
    icon: Eye,
    title: "تقنيات متقدمة",
    description: "أحدث الحلول التكنولوجية في مجال الأمن"
  },
  {
    icon: Bell,
    title: "استجابة فورية",
    description: "فريق متخصص جاهز للتدخل السريع"
  }
];

export default function SecurityClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg"
            alt="Security Solutions"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />
        </div>

        <div className="relative h-full container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-3 bg-primary/10 rounded-2xl mb-8"
            >
              <Shield className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              الأمن والحماية
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl"
            >
              نقدم حلولاً متكاملة للأمن والحماية، مع التركيز على أحدث التقنيات وأفضل الممارسات العالمية
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4"
            >
              <Link href="/info">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg font-semibold text-background bg-primary hover:bg-primary/90 rounded-full transition-all duration-300"
                >
                  تواصل معنا
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-card/50 backdrop-blur-sm border border-border/10 rounded-xl p-6 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex p-3 bg-primary/10 rounded-xl mb-4"
              >
                <feature.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              خدماتنا الأمنية
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              نقدم مجموعة شاملة من الحلول الأمنية المتكاملة لتلبية احتياجاتكم
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-card border border-border/10 rounded-xl p-8 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 5 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل تحتاج إلى حلول أمنية متقدمة؟
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            فريقنا جاهز لمساعدتك في تصميم وتنفيذ خطة أمنية متكاملة تناسب احتياجاتك
          </p>
          <Link href="/info">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold text-background bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>تواصل معنا الآن</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}