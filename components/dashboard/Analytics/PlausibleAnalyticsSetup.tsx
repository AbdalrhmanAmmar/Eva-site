"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, AlertCircle, CheckCircle, Copy, Code } from "lucide-react";

export default function PlausibleAnalyticsSetup() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError("يرجى إدخال اسم النطاق");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // في بيئة الإنتاج، ستقوم بحفظ اسم النطاق في قاعدة البيانات
      // هنا نقوم بمحاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تخزين اسم النطاق في localStorage للاختبار
      localStorage.setItem("plausible_domain", domain);
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const copySnippet = () => {
    const snippet = `
<!-- Plausible Analytics -->
<script defer data-domain="${domain}" src="https://plausible.io/js/script.js"></script>
<!-- End Plausible Analytics -->
    `.trim();
    
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Settings className="w-5 h-5 text-green-500" />
        </div>
        <h3 className="text-lg font-bold">إعداد Plausible Analytics</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Setup Instructions */}
        <div>
          <h4 className="font-bold mb-4">خطوات الإعداد:</h4>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-background rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="text-sm">انتقل إلى <a href="https://plausible.io/" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Plausible Analytics</a></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-background rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="text-sm">قم بإنشاء حساب جديد أو تسجيل الدخول</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-background rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="text-sm">أضف موقعك الجديد</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-background rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="text-sm">أدخل اسم النطاق الخاص بموقعك (مثال: example.com)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-background rounded-full flex items-center justify-center text-sm font-bold">
                5
              </span>
              <span className="text-sm">أدخل اسم النطاق أدناه وقم بنسخ كود التتبع</span>
            </li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500 text-sm">تم حفظ الإعدادات بنجاح</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">اسم النطاق *</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="مثال: example.com"
              className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              أدخل اسم النطاق بدون http:// أو https://
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">كود التتبع</label>
            <div className="relative">
              <pre className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg text-xs overflow-x-auto">
                {`<!-- Plausible Analytics -->
<script defer data-domain="${domain || 'example.com'}" src="https://plausible.io/js/script.js"></script>
<!-- End Plausible Analytics -->`}
              </pre>
              <button
                type="button"
                onClick={copySnippet}
                className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-md transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={copySnippet}
              className="px-4 py-3 bg-background border border-border/10 rounded-lg hover:bg-muted/10 transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              نسخ الكود
            </motion.button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 pt-6 border-t border-border/10">
        <h4 className="font-bold mb-4">مميزات Plausible Analytics:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-500">✓</span>
            </div>
            <span>خفيف الوزن (أقل من 1 كيلوبايت)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-500">✓</span>
            </div>
            <span>يحترم خصوصية المستخدمين ومتوافق مع GDPR</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-500">✓</span>
            </div>
            <span>لا يستخدم ملفات تعريف الارتباط</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-500">✓</span>
            </div>
            <span>واجهة بسيطة وسهلة الاستخدام</span>
          </li>
        </ul>
      </div>
    </div>
  );
}