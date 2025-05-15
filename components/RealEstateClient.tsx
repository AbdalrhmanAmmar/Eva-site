"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Home,
  Building,
  BarChart3,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  Ruler,
  Lightbulb,
  Leaf,
  Clock,
} from "lucide-react";

const services = [
  {
    icon: Home,
    title: "المجمعات السكنية",
    description: "تطوير مجمعات سكنية عصرية تلبي احتياجات الحياة العائلية",
    features: [
      "تصاميم معمارية مبتكرة",
      "مرافق ترفيهية متكاملة",
      "مساحات خضراء واسعة",
      "أنظمة أمنية متطورة"
    ]
  },
  {
    icon: Building,
    title: "المشاريع التجارية",
    description: "إنشاء مراكز تجارية ومكتبية بمواصفات عالمية",
    features: [
      "موقع استراتيجي",
      "تقنيات ذكية",
      "مساحات مرنة",
      "خدمات لوجستية"
    ]
  },
  {
    icon: Leaf,
    title: "المباني المستدامة",
    description: "تطوير مباني صديقة للبيئة تحقق معايير الاستدامة",
    features: [
      "كفاءة استهلاك الطاقة",
      "أنظمة إعادة تدوير",
      "مواد بناء صديقة للبيئة",
      "تصميم مستدام"
    ]
  },
  {
    icon: BarChart3,
    title: "إعادة التطوير",
    description: "تحديث وتطوير العقارات القائمة لتعزيز قيمتها",
    features: [
      "تحديث المرافق",
      "تحسين الكفاءة",
      "تجديد التصميم",
      "زيادة القيمة"
    ]
  }
];

const features = [
  {
    icon: Ruler,
    title: "تصميم مبتكر",
    description: "تصاميم عصرية تجمع بين الجمال والوظيفة"
  },
  {
    icon: Lightbulb,
    title: "حلول ذكية",
    description: "تقنيات متطورة لتحسين تجربة المستخدم"
  },
  {
    icon: Clock,
    title: "تنفيذ سريع",
    description: "التزام بالجداول الزمنية وتسليم المشاريع"
  }
];

const projects = [
  {
    title: "مجمع سكني الواحة",
    description: "مجمع سكني فاخر يضم 200 وحدة سكنية مع مرافق متكاملة",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    status: "مكتمل"
  },
  {
    title: "برج الأعمال الذكي",
    description: "مركز أعمال حديث بتقنيات ذكية ومساحات مكتبية مرنة",
    image: "https://images.pexels.com/photos/262367/pexels-photo-262367.jpeg",
    status: "قيد الإنشاء"
  },
  {
    title: "المجمع التجاري الأخضر",
    description: "مركز تجاري مستدام يضم متاجر ومطاعم ومساحات ترفيهية",
    image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
    status: "قريباً"
  }
];

export default function RealEstateClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
            alt="Real Estate Development"
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
              <Building2 className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              التطوير العقاري
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl"
            >
              نبتكر مشاريع عقارية متميزة تجمع بين الجودة والاستدامة، مع التركيز على تلبية احتياجات عملائنا
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
              خدمات التطوير العقاري
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              نقدم مجموعة متكاملة من خدمات التطوير العقاري لتلبية مختلف الاحتياجات
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

        {/* Projects Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              مشاريعنا
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              نفخر بتقديم مشاريع عقارية متميزة تعكس رؤيتنا في التطوير المستدام
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-card border border-border/10 rounded-xl overflow-hidden group"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-primary/90 text-background px-3 py-1 rounded-full text-sm">
                    {project.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
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
            هل لديك مشروع عقاري؟
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            فريقنا من الخبراء جاهز لمساعدتك في تحويل رؤيتك إلى واقع
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