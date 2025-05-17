'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Building2, ClipboardList, CheckCircle2, ArrowRight, Package, Star, Users } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

const products = [
  {
    id: 1,
    name: "نظام المراقبة الذكي",
    description: "نظام متكامل للمراقبة الأمنية مع تقنيات الذكاء الاصطناعي",
    price: "يبدأ من 5,000 ريال",
    features: [
      "كاميرات عالية الدقة",
      "تحليل فيديو ذكي",
      "تنبيهات فورية",
      "تخزين سحابي"
    ],
    image: "https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg"
  },
  {
    id: 2,
    name: "بوابة التحكم بالدخول",
    description: "نظام متطور للتحكم في الدخول باستخدام التقنيات الحيوية",
    price: "يبدأ من 3,500 ريال",
    features: [
      "بصمة الوجه والإصبع",
      "تحكم عن بعد",
      "سجل دخول متقدم",
      "تكامل مع الأنظمة الأخرى"
    ],
    image: "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg"
  },
  {
    id: 3,
    name: "نظام إدارة المباني",
    description: "حل شامل لإدارة المرافق والصيانة في المباني",
    price: "يبدأ من 7,500 ريال",
    features: [
      "إدارة الصيانة",
      "التحكم في الطاقة",
      "إدارة الأصول",
      "تقارير تحليلية"
    ],
    image: "https://images.pexels.com/photos/3182530/pexels-photo-3182530.jpeg"
  }
];

const stats = [
  { number: "15+", text: "سنة خبرة" },
  { number: "1000+", text: "عميل راضٍ" },
  { number: "500+", text: "مشروع مكتمل" },
  { number: "24/7", text: "دعم فني" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroGeometric />

      {/* الخدمات الرئيسية */}
      <section className="py-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">خدماتنا المتميزة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم حلولاً متكاملة في مجالات الأمن والحماية والتطوير العقاري وإدارة الأملاك
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/10 rounded-xl p-8 hover:border-primary/20 transition-all"
          >
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">الأمن والحماية</h3>
            <p className="text-muted-foreground mb-6">
              حلول أمنية متكاملة مع التركيز على أحدث التقنيات وأفضل الممارسات العالمية
            </p>
            <Link href="/security" className="text-primary hover:text-primary/80 flex items-center gap-2">
              اكتشف المزيد <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/10 rounded-xl p-8 hover:border-primary/20 transition-all"
          >
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">التطوير العقاري</h3>
            <p className="text-muted-foreground mb-6">
              نبتكر مشاريع عقارية متميزة تجمع بين الجودة والاستدامة
            </p>
            <Link href="/real-estate" className="text-primary hover:text-primary/80 flex items-center gap-2">
              اكتشف المزيد <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border/10 rounded-xl p-8 hover:border-primary/20 transition-all"
          >
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">إدارة الأملاك</h3>
            <p className="text-muted-foreground mb-6">
              خدمات إدارة شاملة للممتلكات العقارية مع التركيز على الكفاءة
            </p>
            <Link href="/property-management" className="text-primary hover:text-primary/80 flex items-center gap-2">
              اكتشف المزيد <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* المنتجات */}
      <section className="py-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">منتجاتنا</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            مجموعة متميزة من الحلول الأمنية والتقنية المتكاملة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-card border border-border/10 rounded-xl overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="text-primary font-bold mb-4">{product.price}</div>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/info">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    طلب عرض سعر
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* قسم لماذا نحن */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">لماذا تختار EVA؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم حلولاً متكاملة مع التركيز على الجودة والابتكار
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">حلول متكاملة</h3>
              <p className="text-muted-foreground">
                نقدم حلولاً شاملة تغطي جميع احتياجاتك الأمنية والعقارية
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">جودة عالية</h3>
              <p className="text-muted-foreground">
                نلتزم بأعلى معايير الجودة في جميع خدماتنا ومنتجاتنا
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center p-6"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">دعم متميز</h3>
              <p className="text-muted-foreground">
                فريق متخصص يقدم الدعم على مدار الساعة
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل */}
      <section className="py-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل تحتاج إلى حلول متكاملة؟
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            فريقنا جاهز لمساعدتك في اختيار الحلول المناسبة لاحتياجاتك
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
      </section>
    </div>
  );
}