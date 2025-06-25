"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Copy,
  Code,
  Settings,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react";

interface PixelData {
  id: string;
  name: string;
  pixelId: string;
  platform: "facebook"; // | "google" | "tiktok" | "snapchat";
  status: "active" | "inactive" | "error";
  events: number;
  conversions: number;
  revenue: number;
  lastUpdated: Date;
}

interface PixelSetupProps {
  pixels: PixelData[];
  setPixels: (pixels: PixelData[]) => void;
}

// فقط منصة Meta نشطة
const platforms = [
  {
    id: "facebook",
    name: "Meta Pixel (Facebook)",
    icon: "📘",
    description: "تتبع الأحداث والتحويلات على Facebook و Instagram",
    setupGuide: [
      "انتقل إلى Facebook Business Manager",
      "اختر 'Events Manager' من القائمة",
      "انقر على 'Connect Data Sources' ثم 'Web'",
      "اختر 'Facebook Pixel' وانقر على 'Connect'",
      "انسخ Pixel ID والصقه أدناه",
    ],
  },
  // المنصات الأخرى معطلة مؤقتاً
  // {
  //   id: "google",
  //   name: "Google Analytics 4",
  //   icon: "🔍",
  //   description: "تحليلات شاملة لموقعك مع Google Analytics",
  //   setupGuide: [
  //     "انتقل إلى Google Analytics",
  //     "أنشئ حساب جديد أو استخدم حساب موجود",
  //     "أضف موقعك كـ 'Property' جديد",
  //     "اختر 'Google Analytics 4'",
  //     "انسخ Measurement ID (G-XXXXXXXXXX)",
  //   ],
  // },
  // {
  //   id: "tiktok",
  //   name: "TikTok Pixel",
  //   icon: "🎵",
  //   description: "تتبع الأداء والتحويلات من إعلانات TikTok",
  //   setupGuide: [
  //     "انتقل إلى TikTok Ads Manager",
  //     "اذهب إلى 'Assets' ثم 'Events'",
  //     "انقر على 'Manage' ثم 'Create Pixel'",
  //     "اختر 'Manually Install Pixel Code'",
  //     "انسخ Pixel ID والصقه أدناه",
  //   ],
  // },
  // {
  //   id: "snapchat",
  //   name: "Snapchat Pixel",
  //   icon: "👻",
  //   description: "قياس فعالية إعلانات Snapchat",
  //   setupGuide: [
  //     "انتقل إلى Snapchat Ads Manager",
  //     "اذهب إلى 'Events Manager'",
  //     "انقر على 'Create Pixel'",
  //     "اختر 'Install Pixel Code Manually'",
  //     "انسخ Pixel ID والصقه أدناه",
  //   ],
  // },
];

export default function PixelSetup({ pixels, setPixels }: PixelSetupProps) {
  const [isAddingPixel, setIsAddingPixel] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    pixelId: "",
    platform: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [copiedCode, setCopiedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم Meta Pixel مطلوب";
    }

    if (!formData.pixelId.trim()) {
      newErrors.pixelId = "معرف Meta Pixel مطلوب";
    } else if (!/^\d{15}$/.test(formData.pixelId)) {
      newErrors.pixelId = "معرف Meta Pixel يجب أن يكون 15 رقم";
    }

    if (!formData.platform) {
      newErrors.platform = "يرجى اختيار المنصة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: استبدال بـ API call حقيقي
      // const response = await fetch('/api/pixel/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const newPixel = await response.json();

      // مؤقتاً - إضافة محلية
      const newPixel: PixelData = {
        id: Date.now().toString(),
        name: formData.name,
        pixelId: formData.pixelId,
        platform: formData.platform as "facebook",
        status: "active",
        events: 0,
        conversions: 0,
        revenue: 0,
        lastUpdated: new Date(),
      };

      setPixels([...pixels, newPixel]);
      setFormData({ name: "", pixelId: "", platform: "" });
      setIsAddingPixel(false);
      setSelectedPlatform("");
    } catch (error) {
      console.error('Error creating pixel:', error);
      setErrors({ general: 'حدث خطأ في إضافة Meta Pixel' });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePixelCode = (platform: string, pixelId: string): string => {
    if (platform === "facebook") {
      return `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`;
    }

    // المنصات الأخرى معطلة
    // switch (platform) {
    //   case "google":
    //     return `<!-- Google Analytics 4 -->
    // <script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>
    // <script>
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', '${pixelId}');
    // </script>
    // <!-- End Google Analytics 4 -->`;

    //   case "tiktok":
    //     return `<!-- TikTok Pixel Code -->
    // <script>
    // !function (w, d, t) {
    //   w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    //   ttq.load('${pixelId}');
    //   ttq.page();
    // }(window, document, 'ttq');
    // </script>
    // <!-- End TikTok Pixel Code -->`;

    //   case "snapchat":
    //     return `<!-- Snapchat Pixel Code -->
    // <script type='text/javascript'>
    // (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    // {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    // a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
    // r.src=n;var u=t.getElementsByTagName(s)[0];
    // u.parentNode.insertBefore(r,u);})(window,document,
    // 'https://sc-static.net/scevent.min.js');
    // snaptr('init', '${pixelId}', {
    // 'user_email': '__INSERT_USER_EMAIL__'
    // });
    // snaptr('track', 'PAGE_VIEW');
    // </script>
    // <!-- End Snapchat Pixel Code -->`;

    //   default:
    //     return "";
    // }

    return "";
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const deletePixel = async (pixelId: string) => {
    try {
      // TODO: استبدال بـ API call حقيقي
      // await fetch(`/api/pixel/${pixelId}`, { method: 'DELETE' });
      
      setPixels(pixels.filter(p => p.id !== pixelId));
    } catch (error) {
      console.error('Error deleting pixel:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إعداد Meta Pixel</h2>
          <p className="text-muted-foreground mt-2">
            أضف وأدر Meta Pixel لتتبع أداء موقعك على Facebook و Instagram
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsAddingPixel(true);
            setSelectedPlatform("facebook");
            setFormData(prev => ({ ...prev, platform: "facebook" }));
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة Meta Pixel جديد
        </motion.button>
      </div>

      {/* Setup Form */}
      {isAddingPixel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">إعداد Meta Pixel</h3>
            <button
              onClick={() => {
                setIsAddingPixel(false);
                setSelectedPlatform("");
                setFormData({ name: "", pixelId: "", platform: "" });
                setErrors({});
              }}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Setup Guide */}
            <div>
              <h4 className="font-bold mb-4">خطوات الإعداد:</h4>
              <ol className="space-y-3">
                {platforms[0].setupGuide.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-background rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.general}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">اسم Meta Pixel *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: Meta Pixel - الموقع الرئيسي"
                  className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-border/10'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">معرف Meta Pixel *</label>
                <input
                  type="text"
                  value={formData.pixelId}
                  onChange={(e) => setFormData(prev => ({ ...prev, pixelId: e.target.value }))}
                  placeholder="123456789012345"
                  className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-primary ${
                    errors.pixelId ? 'border-red-500' : 'border-border/10'
                  }`}
                />
                {errors.pixelId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.pixelId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  معرف Meta Pixel يتكون من 15 رقم
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "جاري الحفظ..." : "حفظ Meta Pixel"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingPixel(false);
                    setSelectedPlatform("");
                    setFormData({ name: "", pixelId: "", platform: "" });
                    setErrors({});
                  }}
                  className="px-6 py-3 bg-background border border-border/10 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>

          {/* Generated Code */}
          {formData.pixelId && (
            <div className="mt-8 pt-6 border-t border-border/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">كود Meta Pixel المُولد:</h4>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(generatePixelCode("facebook", formData.pixelId), "code")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  {copiedCode === "code" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode === "code" ? "تم النسخ!" : "نسخ الكود"}
                </motion.button>
              </div>
              <div className="bg-background border border-border/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {generatePixelCode("facebook", formData.pixelId)}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                انسخ هذا الكود والصقه في قسم &lt;head&gt; في موقعك
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Existing Pixels */}
      {pixels.length > 0 && (
        <div className="bg-card border border-border/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Meta Pixels المُضافة</h3>
          <div className="space-y-4">
            {pixels.map((pixel) => (
              <div
                key={pixel.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/10"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📘</div>
                  <div>
                    <h4 className="font-medium">{pixel.name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {pixel.pixelId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    pixel.status === "active" ? "text-green-500 bg-green-500/10" :
                    pixel.status === "inactive" ? "text-yellow-500 bg-yellow-500/10" :
                    "text-red-500 bg-red-500/10"
                  }`}>
                    {pixel.status === "active" ? "نشط" : pixel.status === "inactive" ? "غير نشط" : "خطأ"}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => copyToClipboard(generatePixelCode(pixel.platform, pixel.pixelId), pixel.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {copiedCode === pixel.id ? <CheckCircle2 className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    {copiedCode === pixel.id ? "تم النسخ!" : "نسخ الكود"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deletePixel(pixel.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-blue-500">💡 نصائح مهمة</h3>
        <ul className="space-y-2 text-sm">
          <li>• تأكد من وضع كود Meta Pixel في جميع صفحات موقعك</li>
          <li>• استخدم Facebook Pixel Helper للتحقق من صحة التثبيت</li>
          <li>• قم بإعداد الأحداث المخصصة لتتبع التحويلات بدقة</li>
          <li>• راجع بيانات Pixel بانتظام لتحسين أداء إعلاناتك</li>
        </ul>
      </div>
    </div>
  );
}