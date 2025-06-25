"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Target,
  Clock,
  Globe,
} from "lucide-react";

interface AnalyticsData {
  totalEvents: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topPages: Array<{
    page: string;
    views: number;
    conversions: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

interface PixelAnalyticsProps {
  data: AnalyticsData;
  dateRange: string;
}

export default function PixelAnalytics({ data, dateRange }: PixelAnalyticsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);
  };

  const getDateRangeText = (range: string) => {
    switch (range) {
      case "1d": return "آخر يوم";
      case "7d": return "آخر 7 أيام";
      case "30d": return "آخر 30 يوم";
      case "90d": return "آخر 3 أشهر";
      default: return "آخر 7 أيام";
    }
  };

  // إزالة البيانات الثابتة - سيتم جلبها من API
  const trendData = {
    events: { value: 0, isPositive: true },
    conversions: { value: 0, isPositive: true },
    revenue: { value: 0, isPositive: true },
    conversionRate: { value: 0, isPositive: false },
  };

  // التحقق من وجود بيانات
  const hasData = data.totalEvents > 0 || data.totalConversions > 0 || data.totalRevenue > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">التحليلات المتقدمة</h2>
          <p className="text-muted-foreground mt-2">
            تحليل مفصل لأداء Meta Pixel خلال {getDateRangeText(dateRange)}
          </p>
        </div>

        <div className="bg-card border border-border/10 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">لا توجد بيانات متاحة</h3>
          <p className="text-muted-foreground mb-6">
            لم يتم جمع أي بيانات بعد. تأكد من تثبيت Meta Pixel بشكل صحيح على موقعك.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-500">
              💡 قد يستغرق ظهور البيانات بضع ساعات بعد تثبيت Meta Pixel
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">التحليلات المتقدمة</h2>
        <p className="text-muted-foreground mt-2">
          تحليل مفصل لأداء Meta Pixel خلال {getDateRangeText(dateRange)}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              trendData.events.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {trendData.events.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trendData.events.value)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatNumber(data.totalEvents)}</h3>
          <p className="text-sm text-muted-foreground">إجمالي الأحداث</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              trendData.conversions.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {trendData.conversions.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trendData.conversions.value)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatNumber(data.totalConversions)}</h3>
          <p className="text-sm text-muted-foreground">التحويلات</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              trendData.revenue.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {trendData.revenue.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trendData.revenue.value)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(data.totalRevenue)}</h3>
          <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <MousePointer className="w-6 h-6 text-purple-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              trendData.conversionRate.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {trendData.conversionRate.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trendData.conversionRate.value)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{data.conversionRate}%</h3>
          <p className="text-sm text-muted-foreground">معدل التحويل</p>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-bold">متوسط قيمة الطلب</h3>
          </div>
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {formatCurrency(data.averageOrderValue)}
          </div>
          <p className="text-sm text-muted-foreground">
            متوسط قيمة كل طلب مكتمل
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-500" />
            <h3 className="text-lg font-bold">إجمالي الزوار</h3>
          </div>
          <div className="text-3xl font-bold text-indigo-500 mb-2">
            {formatNumber(data.trafficSources.reduce((sum, source) => sum + source.visitors, 0))}
          </div>
          <p className="text-sm text-muted-foreground">
            عدد الزوار الفريدين
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-bold">متوسط وقت الجلسة</h3>
          </div>
          <div className="text-3xl font-bold text-pink-500 mb-2">
            --:--
          </div>
          <p className="text-sm text-muted-foreground">
            دقيقة:ثانية
          </p>
        </motion.div>
      </div>

      {/* Top Pages Performance */}
      {data.topPages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">أداء الصفحات الرئيسية</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="text-right py-3 px-4 font-medium">الصفحة</th>
                  <th className="text-right py-3 px-4 font-medium">المشاهدات</th>
                  <th className="text-right py-3 px-4 font-medium">التحويلات</th>
                  <th className="text-right py-3 px-4 font-medium">معدل التحويل</th>
                  <th className="text-right py-3 px-4 font-medium">الأداء</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((page, index) => {
                  const conversionRate = ((page.conversions / page.views) * 100).toFixed(2);
                  return (
                    <tr key={index} className="border-b border-border/10">
                      <td className="py-3 px-4 font-medium">{page.page}</td>
                      <td className="py-3 px-4">{formatNumber(page.views)}</td>
                      <td className="py-3 px-4">{formatNumber(page.conversions)}</td>
                      <td className="py-3 px-4">{conversionRate}%</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-background rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min(parseFloat(conversionRate) * 10, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Traffic Sources Detailed */}
      {data.trafficSources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">تفاصيل مصادر الزيارات</h3>
          <div className="space-y-4">
            {data.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(source.visitors)} زائر
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}