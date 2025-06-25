"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Plus,
  Edit,
  Trash2,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import PixelSetup from "./PixelSetup";
import PixelAnalytics from "./PixelAnalytics";
import PixelCharts from "./PixelCharts";

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

// إزالة البيانات الثابتة - سيتم جلبها من API
const mockPixelData: PixelData[] = [];

const analyticsData = {
  totalEvents: 0,
  totalConversions: 0,
  totalRevenue: 0,
  conversionRate: 0,
  averageOrderValue: 0,
  topPages: [],
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  trafficSources: [],
};

export default function PixelClient() {
  const [pixels, setPixels] = useState<PixelData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "setup" | "analytics" | "charts">("overview");
  const [selectedPixel, setSelectedPixel] = useState<PixelData | null>(null);
  const [dateRange, setDateRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(analyticsData);

  // جلب البيانات من API
  useEffect(() => {
    fetchPixelData();
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchPixelData = async () => {
    setIsLoading(true);
    try {
      // TODO: استبدال بـ API call حقيقي
      // const response = await fetch('/api/pixel/list');
      // const data = await response.json();
      // setPixels(data);
      
      // مؤقتاً - بيانات فارغة
      setPixels([]);
    } catch (error) {
      console.error('Error fetching pixel data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // TODO: استبدال بـ API call حقيقي
      // const response = await fetch(`/api/pixel/analytics?range=${dateRange}`);
      // const data = await response.json();
      // setAnalytics(data);
      
      // مؤقتاً - بيانات فارغة
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchPixelData(), fetchAnalyticsData()]);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "📘";
      // case "google":
      //   return "🔍";
      // case "tiktok":
      //   return "🎵";
      // case "snapchat":
      //   return "👻";
      default:
        return "📊";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-500/10";
      case "inactive":
        return "text-yellow-500 bg-yellow-500/10";
      case "error":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة Meta Pixel والتحليلات</h1>
          <p className="text-muted-foreground mt-2">
            مراقبة وتحليل بيانات Facebook Pixel
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            <option value="1d">آخر يوم</option>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 3 أشهر</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            تحديث
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: "overview", label: "نظرة عامة", icon: BarChart3 },
          { id: "setup", label: "إعداد Meta Pixel", icon: Settings },
          { id: "analytics", label: "التحليلات", icon: TrendingUp },
          { id: "charts", label: "الرسوم البيانية", icon: Activity },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-primary text-background"
                : "bg-card border border-border/10 hover:border-primary/20"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الأحداث</p>
                    <h3 className="text-2xl font-bold">{formatNumber(analytics.totalEvents)}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <Target className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التحويلات</p>
                    <h3 className="text-2xl font-bold">{formatNumber(analytics.totalConversions)}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">معدل التحويل</p>
                    <h3 className="text-2xl font-bold">{analytics.conversionRate}%</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Pixel List */}
            <div className="bg-card border border-border/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Meta Pixels المُفعلة</h2>
                <button
                  onClick={() => setActiveTab("setup")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إضافة Meta Pixel
                </button>
              </div>

              {pixels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📘</div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد Meta Pixels مُضافة</h3>
                  <p className="text-muted-foreground mb-6">
                    ابدأ بإضافة Meta Pixel الخاص بك لتتبع أداء موقعك
                  </p>
                  <button
                    onClick={() => setActiveTab("setup")}
                    className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    إضافة Meta Pixel الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pixels.map((pixel) => (
                    <div
                      key={pixel.id}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getPlatformIcon(pixel.platform)}</div>
                        <div>
                          <h3 className="font-medium">{pixel.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {pixel.pixelId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatNumber(pixel.events)}</div>
                          <div className="text-xs text-muted-foreground">أحداث</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatNumber(pixel.conversions)}</div>
                          <div className="text-xs text-muted-foreground">تحويلات</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatCurrency(pixel.revenue)}</div>
                          <div className="text-xs text-muted-foreground">إيرادات</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(pixel.status)}`}>
                          {pixel.status === "active" ? "نشط" : pixel.status === "inactive" ? "غير نشط" : "خطأ"}
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device & Traffic Breakdown - فقط إذا كان هناك بيانات */}
            {analytics.totalEvents > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-6">توزيع الأجهزة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        <span>الهاتف المحمول</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-background rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${analytics.deviceBreakdown.mobile}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{analytics.deviceBreakdown.mobile}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-green-500" />
                        <span>سطح المكتب</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-background rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${analytics.deviceBreakdown.desktop}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{analytics.deviceBreakdown.desktop}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tablet className="w-5 h-5 text-purple-500" />
                        <span>الجهاز اللوحي</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-background rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${analytics.deviceBreakdown.tablet}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{analytics.deviceBreakdown.tablet}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-6">مصادر الزيارات</h3>
                  <div className="space-y-4">
                    {analytics.trafficSources.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        لا توجد بيانات متاحة
                      </div>
                    ) : (
                      analytics.trafficSources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary" />
                            <span>{source.source}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(source.visitors)}
                            </span>
                            <div className="w-16 bg-background rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${source.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{source.percentage}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Setup Tab */}
        {activeTab === "setup" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PixelSetup pixels={pixels} setPixels={setPixels} />
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PixelAnalytics data={analytics} dateRange={dateRange} />
          </motion.div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PixelCharts data={analytics} pixels={pixels} dateRange={dateRange} />
          </motion.div>
        )}
      </div>
    </div>
  );
}