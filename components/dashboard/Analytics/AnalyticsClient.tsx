"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Eye,
  MousePointer,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Map,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Search,
  Settings,
} from "lucide-react";
import AnalyticsOverview from "./AnalyticsOverview";
import VisitorMetrics from "./VisitorMetrics";
import PagePerformance from "./PagePerformance";
import DeviceBreakdown from "./DeviceBreakdown";
import TrafficSources from "./TrafficSources";
import GeoDistribution from "./GeoDistribution";
import AnalyticsSetupSelector from "./AnalyticsSetupSelector";
import { fetchAnalyticsData } from "@/lib/analytics";

export default function AnalyticsClient() {
  const [dateRange, setDateRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "visitors" | "pages" | "devices" | "sources" | "geo" | "setup">("overview");
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      visitors: { value: 0, change: 0, isPositive: true },
      pageviews: { value: 0, change: 0, isPositive: true },
      bounceRate: { value: 0, change: 0, isPositive: true },
      avgSessionDuration: { value: 0, change: 0, isPositive: true },
    },
    visitorMetrics: {
      dailyVisitors: [],
      weeklyVisitors: [],
      monthlyVisitors: [],
    },
    pagePerformance: [],
    deviceBreakdown: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
    trafficSources: [],
    geoDistribution: [],
  });

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnalyticsData(dateRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تحليلات الموقع</h1>
          <p className="text-muted-foreground mt-2">
            تحليل شامل لأداء الموقع وسلوك الزوار
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
            <option value="12m">آخر سنة</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadAnalyticsData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            تحديث
          </motion.button>
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

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-4">
        {[
          { id: "overview", label: "نظرة عامة", icon: BarChart3 },
          { id: "visitors", label: "الزوار", icon: Users },
          { id: "pages", label: "الصفحات", icon: FileText },
          { id: "devices", label: "الأجهزة", icon: Smartphone },
          { id: "sources", label: "مصادر الزيارات", icon: Globe },
          { id: "geo", label: "التوزيع الجغرافي", icon: Map },
          { id: "setup", label: "الإعدادات", icon: Settings },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
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
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="mr-3 text-muted-foreground">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <AnalyticsOverview data={analyticsData.overview} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VisitorMetrics data={analyticsData.visitorMetrics} dateRange={dateRange} />
                  <PagePerformance data={analyticsData.pagePerformance} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DeviceBreakdown data={analyticsData.deviceBreakdown} />
                  <TrafficSources data={analyticsData.trafficSources} />
                </div>
              </motion.div>
            )}

            {/* Visitors Tab */}
            {activeTab === "visitors" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <VisitorMetrics data={analyticsData.visitorMetrics} dateRange={dateRange} fullWidth />
              </motion.div>
            )}

            {/* Pages Tab */}
            {activeTab === "pages" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <PagePerformance data={analyticsData.pagePerformance} fullWidth />
              </motion.div>
            )}

            {/* Devices Tab */}
            {activeTab === "devices" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <DeviceBreakdown data={analyticsData.deviceBreakdown} fullWidth />
              </motion.div>
            )}

            {/* Sources Tab */}
            {activeTab === "sources" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <TrafficSources data={analyticsData.trafficSources} fullWidth />
              </motion.div>
            )}

            {/* Geo Tab */}
            {activeTab === "geo" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <GeoDistribution data={analyticsData.geoDistribution} />
              </motion.div>
            )}

            {/* Setup Tab */}
            {activeTab === "setup" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <AnalyticsSetupSelector />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Integration Info */}
      {activeTab !== "setup" && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Settings className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">إعداد التحليلات</h3>
              <p className="text-sm text-muted-foreground mb-4">
                لتفعيل تحليلات الموقع بشكل كامل، يرجى إضافة معرف التحليلات الخاص بك في إعدادات الموقع.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab("setup")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  إعداد التحليلات
                </button>
                <a 
                  href="https://support.google.com/analytics/answer/9304153" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-background border border-border/10 rounded-lg hover:bg-muted/10 transition-colors"
                >
                  معرفة المزيد
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}