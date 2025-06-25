"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Maximize2,
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

interface PixelChartsProps {
  data: AnalyticsData;
  pixels: PixelData[];
  dateRange: string;
}

// إزالة البيانات الثابتة - سيتم جلبها من API
const generateChartData = (days: number) => {
  // إرجاع بيانات فارغة إذا لم تكن هناك بيانات حقيقية
  return [];
};

const hourlyData: any[] = [];

export default function PixelCharts({ data, pixels, dateRange }: PixelChartsProps) {
  const [selectedChart, setSelectedChart] = useState<"timeline" | "hourly" | "funnel" | "heatmap">("timeline");
  const [selectedMetric, setSelectedMetric] = useState<"events" | "conversions" | "revenue">("events");

  const getDaysFromRange = (range: string) => {
    switch (range) {
      case "1d": return 1;
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 7;
    }
  };

  const chartData = generateChartData(getDaysFromRange(dateRange));
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d[selectedMetric])) : 0;

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

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "events": return "الأحداث";
      case "conversions": return "التحويلات";
      case "revenue": return "الإيرادات";
      default: return "الأحداث";
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "events": return "bg-blue-500";
      case "conversions": return "bg-green-500";
      case "revenue": return "bg-primary";
      default: return "bg-blue-500";
    }
  };

  // التحقق من وجود بيانات
  const hasData = data.totalEvents > 0 || data.totalConversions > 0 || data.totalRevenue > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">الرسوم البيانية والتحليلات</h2>
            <p className="text-muted-foreground mt-2">
              تصور بياني شامل لأداء Meta Pixel وتحليل البيانات
            </p>
          </div>
        </div>

        <div className="bg-card border border-border/10 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2">لا توجد بيانات للرسوم البيانية</h3>
          <p className="text-muted-foreground mb-6">
            بمجرد بدء جمع البيانات من Meta Pixel، ستظهر الرسوم البيانية التفاعلية هنا.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-500">
              💡 تأكد من تثبيت Meta Pixel وإعداد الأحداث المخصصة لرؤية البيانات
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">الرسوم البيانية والتحليلات</h2>
          <p className="text-muted-foreground mt-2">
            تصور بياني شامل لأداء Meta Pixel وتحليل البيانات
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            <option value="events">الأحداث</option>
            <option value="conversions">التحويلات</option>
            <option value="revenue">الإيرادات</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير
          </motion.button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-4 mb-6">
        {[
          { id: "timeline", label: "الخط الزمني", icon: TrendingUp },
          { id: "hourly", label: "التوزيع اليومي", icon: Calendar },
          { id: "funnel", label: "قمع التحويل", icon: BarChart3 },
          { id: "heatmap", label: "خريطة الحرارة", icon: PieChart },
        ].map((chart) => (
          <motion.button
            key={chart.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedChart(chart.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedChart === chart.id
                ? "bg-primary text-background"
                : "bg-card border border-border/10 hover:border-primary/20"
            }`}
          >
            <chart.icon className="w-4 h-4" />
            <span>{chart.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Timeline Chart */}
        {selectedChart === "timeline" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">اتجاه {getMetricLabel(selectedMetric)}</h3>
              <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-muted-foreground">
                  لا توجد بيانات كافية لعرض الرسم البياني
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hourly Distribution */}
        {selectedChart === "hourly" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6">التوزيع خلال ساعات اليوم</h3>
            
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🕐</div>
                <p className="text-muted-foreground">
                  لا توجد بيانات كافية لعرض التوزيع اليومي
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Conversion Funnel */}
        {selectedChart === "funnel" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6">قمع التحويل</h3>
            
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <p className="text-muted-foreground">
                  لا توجد بيانات كافية لعرض قمع التحويل
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Heatmap */}
        {selectedChart === "heatmap" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6">خريطة حرارة الأنشطة</h3>
            
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-muted-foreground">
                  لا توجد بيانات كافية لعرض خريطة الحرارة
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Meta Pixel Performance */}
      {pixels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">أداء Meta Pixels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pixels.map((pixel) => (
              <div key={pixel.id} className="p-4 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">📘</div>
                  <div>
                    <h4 className="font-medium">Meta Pixel</h4>
                    <p className="text-xs text-muted-foreground">{pixel.name}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">الأحداث</span>
                    <span className="font-bold">{formatNumber(pixel.events)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">التحويلات</span>
                    <span className="font-bold">{formatNumber(pixel.conversions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">الإيرادات</span>
                    <span className="font-bold">{formatCurrency(pixel.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}