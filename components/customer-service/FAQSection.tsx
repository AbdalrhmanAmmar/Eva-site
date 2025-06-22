"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Tag, HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "ما هي أنواع أنظمة المراقبة المتوفرة؟",
    answer: "نقدم مجموعة متنوعة من أنظمة المراقبة:\n\n• كاميرات IP عالية الدقة (4K, 8MP)\n• كاميرات مراقبة خارجية مقاومة للطقس\n• كاميرات داخلية بتقنية الرؤية الليلية\n• أنظمة مراقبة لاسلكية\n• كاميرات بتقنية الذكاء الاصطناعي\n• أنظمة تسجيل متطورة (NVR/DVR)\n\nجميع أنظمتنا تأتي مع ضمان شامل وخدمة تركيب احترافية.",
    category: "المنتجات",
    tags: ["مراقبة", "كاميرات", "أمان"]
  },
  {
    id: "2",
    question: "كم تستغرق عملية التركيب؟",
    answer: "مدة التركيب تعتمد على حجم المشروع:\n\n• المنازل الصغيرة (2-4 كاميرات): 2-4 ساعات\n• المنازل الكبيرة (5-8 كاميرات): 4-6 ساعات\n• المكاتب والمحلات: 1-2 يوم عمل\n• المشاريع الكبيرة: حسب المواصفات\n\nنقوم بإجراء معاينة مسبقة لتحديد الوقت المطلوب بدقة ونلتزم بالمواعيد المحددة.",
    category: "التركيب",
    tags: ["تركيب", "وقت", "مدة"]
  },
  {
    id: "3",
    question: "هل تقدمون خدمة الصيانة؟",
    answer: "نعم، نقدم خدمة صيانة شاملة:\n\n• صيانة دورية مجدولة\n• صيانة طارئة 24/7\n• تنظيف وفحص الكاميرات\n• تحديث البرامج والأنظمة\n• استبدال قطع الغيار\n• فحص شامل للشبكة والاتصالات\n\nلدينا عقود صيانة سنوية بأسعار مخفضة مع استجابة سريعة.",
    category: "الصيانة",
    tags: ["صيانة", "خدمة", "دعم"]
  },
  {
    id: "4",
    question: "ما هي شروط الضمان؟",
    answer: "نقدم ضمان شامل على جميع منتجاتنا:\n\n• ضمان المنتجات: سنتان كاملتان\n• ضمان التركيب: سنة واحدة\n• يشمل قطع الغيار والعمالة\n• صيانة مجانية خلال فترة الضمان\n• استبدال فوري في حالة العطل\n• دعم تقني مجاني\n\nالضمان يغطي جميع الأعطال ما عدا الأضرار المتعمدة أو الكوارث الطبيعية.",
    category: "الضمان",
    tags: ["ضمان", "كفالة", "حماية"]
  },
  {
    id: "5",
    question: "هل يمكنني مراقبة النظام عن بعد؟",
    answer: "بالطبع! جميع أنظمتنا تدعم المراقبة عن بعد:\n\n• تطبيق جوال مجاني (iOS & Android)\n• مراقبة عبر المتصفح\n• إشعارات فورية عند الحركة\n• تسجيل وحفظ الفيديو\n• تحكم كامل بالكاميرات\n• مشاركة الوصول مع أفراد العائلة\n\nيمكنك مراقبة منزلك أو مكتبك من أي مكان في العالم بأمان تام.",
    category: "التقنية",
    tags: ["مراقبة عن بعد", "تطبيق", "جوال"]
  },
  {
    id: "6",
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نوفر طرق دفع متنوعة لراحتكم:\n\n• الدفع النقدي عند التسليم\n• التحويل البنكي\n• بطاقات الائتمان (فيزا، ماستركارد)\n• الدفع الإلكتروني (مدى، أبل باي)\n• التقسيط بدون فوائد (حتى 12 شهر)\n• الدفع عبر التطبيقات (STC Pay, Urpay)\n\nجميع المعاملات آمنة ومحمية بأعلى معايير الأمان.",
    category: "الدفع",
    tags: ["دفع", "تقسيط", "بطاقة"]
  },
  {
    id: "7",
    question: "هل تقدمون خدمات للشركات؟",
    answer: "نعم، نتخصص في الحلول المؤسسية:\n\n• أنظمة أمنية متكاملة للشركات\n• حلول مراقبة للمصانع والمستودعات\n• أنظمة التحكم بالدخول للموظفين\n• مراقبة المواقع البعيدة\n• تكامل مع أنظمة إدارة المباني\n• تدريب الموظفين على الاستخدام\n\nلدينا فريق متخصص في المشاريع الكبيرة مع أسعار تنافسية للشركات.",
    category: "الشركات",
    tags: ["شركات", "مؤسسات", "مشاريع كبيرة"]
  },
  {
    id: "8",
    question: "كيف يمكنني طلب عرض سعر؟",
    answer: "يمكنك طلب عرض سعر بعدة طرق:\n\n• ملء النموذج في موقعنا الإلكتروني\n• الاتصال على الرقم المجاني\n• زيارة أحد فروعنا\n• التواصل عبر الواتساب\n• البريد الإلكتروني\n• المحادثة المباشرة في الموقع\n\nسنقوم بمعاينة مجانية وتقديم عرض مفصل خلال 24 ساعة.",
    category: "العروض",
    tags: ["عرض سعر", "تسعير", "معاينة"]
  }
];

const categories = ["الكل", "المنتجات", "التركيب", "الصيانة", "الضمان", "التقنية", "الدفع", "الشركات", "العروض"];

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "الكل" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">الأسئلة الشائعة</h3>
        <p className="text-muted-foreground">
          إجابات على أكثر الأسئلة شيوعاً حول منتجاتنا وخدماتنا
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث في الأسئلة الشائعة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-10 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === category
                ? "bg-primary text-background"
                : "bg-background border border-border/10 hover:border-primary/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">لم يتم العثور على أسئلة تطابق بحثك</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border border-border/10 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full p-6 text-right flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="text-muted-foreground whitespace-pre-line mb-4">
                        {faq.answer}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Contact CTA */}
      <div className="text-center p-6 bg-primary/10 border border-primary/20 rounded-lg">
        <h4 className="font-bold mb-2">لم تجد إجابة لسؤالك؟</h4>
        <p className="text-muted-foreground mb-4">
          فريق خدمة العملاء جاهز لمساعدتك
        </p>
        <button className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors">
          تواصل معنا
        </button>
      </div>
    </div>
  );
}