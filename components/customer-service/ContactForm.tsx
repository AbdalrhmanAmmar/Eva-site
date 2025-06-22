"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  X,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  priority: "منخفض" | "متوسط" | "عالي" | "عاجل";
  attachments: File[];
}

const categories = [
  "استفسار عام",
  "دعم تقني",
  "طلب عرض سعر",
  "شكوى",
  "اقتراح",
  "طلب صيانة",
  "استفسار عن الضمان",
  "أخرى"
];

const priorities = [
  { value: "منخفض", color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "متوسط", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { value: "عالي", color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "عاجل", color: "text-red-500", bg: "bg-red-500/10" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
    priority: "متوسط",
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleInputChange = (field: keyof ContactFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - formData.attachments.length);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "البريد الإلكتروني غير صحيح";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.subject.trim()) newErrors.subject = "الموضوع مطلوب";
    if (!formData.category) newErrors.category = "الفئة مطلوبة";
    if (!formData.message.trim()) newErrors.message = "الرسالة مطلوبة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          category: "",
          message: "",
          priority: "متوسط",
          attachments: []
        });
      }, 3000);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-4">تم إرسال رسالتك بنجاح!</h3>
        <p className="text-muted-foreground mb-6">
          شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك خلال 24 ساعة.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm">
            <strong>رقم التذكرة:</strong> #EVA-{Date.now().toString().slice(-6)}
          </p>
          <p className="text-sm mt-2">
            يمكنك استخدام هذا الرقم لمتابعة حالة طلبك
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">تواصل معنا</h3>
        <p className="text-muted-foreground">
          أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              الاسم الكامل *
            </label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                  errors.name ? "border-red-500" : "border-border/10"
                }`}
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                  errors.email ? "border-red-500" : "border-border/10"
                }`}
                placeholder="example@domain.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              رقم الهاتف *
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                  errors.phone ? "border-red-500" : "border-border/10"
                }`}
                placeholder="05xxxxxxxx"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              الفئة *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                errors.category ? "border-red-500" : "border-border/10"
              }`}
            >
              <option value="">اختر الفئة</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>
        </div>

        {/* Subject and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              الموضوع *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 ${
                errors.subject ? "border-red-500" : "border-border/10"
              }`}
              placeholder="موضوع الرسالة"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              الأولوية
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange("priority", priority.value)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    formData.priority === priority.value
                      ? `${priority.bg} ${priority.color} border-2 border-current`
                      : "bg-background border border-border/10 hover:border-primary/20"
                  }`}
                >
                  {priority.value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2">
            الرسالة *
          </label>
          <div className="relative">
            <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={6}
              className={`w-full pl-4 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary/50 resize-none ${
                errors.message ? "border-red-500" : "border-border/10"
              }`}
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>
          )}
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium mb-2">
            المرفقات (اختياري)
          </label>
          <div className="border-2 border-dashed border-border/20 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              اسحب الملفات هنا أو انقر للتحديد
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              اختيار الملفات
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              الحد الأقصى: 5 ملفات، 10MB لكل ملف
            </p>
          </div>

          {/* Uploaded Files */}
          {formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background border border-border/10 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال الرسالة
            </>
          )}
        </motion.button>
      </form>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/10">
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-medium">الهاتف</p>
          <p className="text-sm text-muted-foreground">+966 XX XXX XXXX</p>
        </div>
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-medium">البريد الإلكتروني</p>
          <p className="text-sm text-muted-foreground">support@eva-security.com</p>
        </div>
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-medium">الدردشة المباشرة</p>
          <p className="text-sm text-muted-foreground">متاح 24/7</p>
        </div>
      </div>
    </div>
  );
}