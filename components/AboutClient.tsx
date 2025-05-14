"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shield, Building2, ClipboardList, Target, Users, Trophy, Lightbulb, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "الأمن والحماية",
    description: "نقدم حلولاً متكاملة للأمن والحماية، مع التركيز على أحدث التقنيات وأفضل الممارسات العالمية. خدماتنا تشمل:",
    features: [
      "أنظمة المراقبة المتقدمة",
      "حلول الأمن الإلكتروني",
      "خدمات الحراسة الاحترافية",
      "أنظمة التحكم في الدخول"
    ],
    image: "https://images.pexels.com/photos/257636/pexels-photo-257636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/security"
  },
  {
    icon: Building2,
    title: "التطوير العقاري",
    description: "نبتكر مشاريع عقارية متميزة تجمع بين الجودة والاستدامة. نتخصص في:",
    features: [
      "تطوير المجمعات السكنية",
      "المشاريع التجارية المتكاملة",
      "المباني الذكية والمستدامة",
      "إعادة تطوير العقارات"
    ],
    image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/about"
  },
  {
    icon: ClipboardList,
    title: "إدارة الأملاك",
    description: "نوفر خدمات إدارة شاملة للممتلكات العقارية مع التركيز على:",
    features: [
      "إدارة المرافق المتكاملة",
      "خدمات الصيانة الدورية",
      "إدارة عقود الإيجار",
      "تحسين كفاءة التشغيل"
    ],
    image: "https://images.pexels.com/photos/7578939/pexels-photo-7578939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/about"
  }
];

const values = [
  { icon: Target, title: "الدقة", description: "نلتزم بأعلى معايير الدقة في جميع خدماتنا" },
  { icon: Users, title: "العمل الجماعي", description: "نؤمن بقوة العمل الجماعي وتكامل الخبرات" },
  { icon: Trophy, title: "التميز", description: "نسعى دائماً للتميز في كل ما نقدمه" }
];

const achievements = [
  { number: "10+", text: "سنوات من الخبرة" },
  { number: "500+", text: "عميل راضٍ" },
  { number: "100+", text: "مشروع مكتمل" },
  { number: "50+", text: "خبير متخصص" }
];

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
            alt="EVA Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        </div>

        <div className="relative h-full container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <Image
                src="/images/whitelogo.png"
                alt="EVA Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#F2DF56] to-white leading-tight"
            >
              نحو مستقبل أكثر
              <br />
              أماناً وابتكاراً
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed max-w-2xl"
            >
              EVA تجمع بين تقنيات الحماية المتطورة والخبرات العقارية، لنقدم لك حلولاً شاملة ومتكاملة تبني الثقة وتحقق التميز.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-4"
            >
              <Link href="/info">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg font-semibold text-background bg-[#F2DF56] hover:bg-[#e5cd45] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  اكتشف خدماتنا
                </motion.button>
              </Link>
              <Link href="/info">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  تواصل معنا
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-block p-2 bg-primary/10 rounded-lg mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">رؤيتنا</h2>
          <p className="text-lg text-muted max-w-4xl mx-auto">
            نسعى لأن نكون الشريك الموثوق في تقديم حلول متكاملة تجمع بين الأمن والتطوير العقاري وإدارة الأملاك، مع التركيز على الابتكار والجودة والاستدامة.
          </p>
        </motion.div>

        {/* Services Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              خـدمـاتـنـا
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              حلول متكاملة مصممة خصيصاً لاحتياجاتك
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link key={service.title} href={service.href}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ y: -10 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border/20 group hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
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
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              قـيـمـنـا
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  type: "spring",
                  damping: 10
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)"
                }}
                className="text-center p-8 bg-card rounded-xl border border-border/20 hover:border-primary/30 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6"
                >
                  <value.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-primary/10 border border-primary/20 rounded-2xl p-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {achievement.number}
              </div>
              <div className="text-sm text-muted">{achievement.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}