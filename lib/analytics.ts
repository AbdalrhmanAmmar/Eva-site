import ReactGA from 'react-ga4';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// تهيئة Google Analytics
export const initGA = () => {
  if (GA_TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.initialize(GA_TRACKING_ID);
  }
};

// تتبع مشاهدة الصفحة
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    ReactGA.send({ hitType: "pageview", page: url });
    console.log(`Pageview tracked for: ${url}`);
  }
};

// تتبع حدث
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    ReactGA.event({
      action,
      category,
      label,
      value
    });
  }
};

// الحصول على بيانات التحليلات (محاكاة)
export const fetchAnalyticsData = async (dateRange: string) => {
  // في بيئة الإنتاج، ستقوم بالاتصال بـ Google Analytics API
  // هنا نقوم بمحاكاة البيانات للعرض
  
  // تأخير محاكاة لطلب API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // بيانات محاكاة
  return {
    overview: {
      visitors: { value: 1254, change: 12.5, isPositive: true },
      pageviews: { value: 3876, change: 8.2, isPositive: true },
      bounceRate: { value: 42.3, change: 2.1, isPositive: false },
      avgSessionDuration: { value: 185, change: 5.7, isPositive: true },
    },
    visitorMetrics: {
      dailyVisitors: [120, 145, 132, 156, 142, 168, 180, 175, 190, 210, 205, 220, 215, 230],
      weeklyVisitors: [850, 920, 880, 950, 1020, 980, 1100, 1150, 1200, 1180, 1250, 1300],
      monthlyVisitors: [3200, 3500, 3300, 3700, 4000, 3800, 4200, 4500, 4300, 4600, 4800, 5000],
    },
    pagePerformance: [
      { page: "الصفحة الرئيسية", views: 1200, avgTime: 120, bounceRate: 35 },
      { page: "من نحن", views: 850, avgTime: 90, bounceRate: 40 },
      { page: "خدماتنا", views: 720, avgTime: 105, bounceRate: 38 },
      { page: "الأمن والحماية", views: 650, avgTime: 150, bounceRate: 32 },
      { page: "التطوير العقاري", views: 580, avgTime: 135, bounceRate: 36 },
      { page: "إدارة الأملاك", views: 520, avgTime: 110, bounceRate: 42 },
      { page: "تواصل معنا", views: 480, avgTime: 95, bounceRate: 45 },
    ],
    deviceBreakdown: {
      mobile: 58,
      desktop: 35,
      tablet: 7,
    },
    trafficSources: [
      { source: "البحث العضوي", visitors: 520, percentage: 42 },
      { source: "الزيارات المباشرة", visitors: 320, percentage: 25 },
      { source: "وسائل التواصل", visitors: 240, percentage: 19 },
      { source: "الإعلانات المدفوعة", visitors: 120, percentage: 10 },
      { source: "أخرى", visitors: 54, percentage: 4 },
    ],
    geoDistribution: [
      { country: "السعودية", visitors: 850, percentage: 68 },
      { country: "الإمارات", visitors: 150, percentage: 12 },
      { country: "مصر", visitors: 95, percentage: 8 },
      { country: "الكويت", visitors: 65, percentage: 5 },
      { country: "قطر", visitors: 45, percentage: 4 },
      { country: "أخرى", visitors: 49, percentage: 3 },
    ],
  };
};

// تهيئة Plausible Analytics
export const initPlausible = (domain: string) => {
  if (typeof window !== 'undefined' && domain) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
};