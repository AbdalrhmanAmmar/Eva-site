"use client";

import { motion } from "framer-motion";
import {
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MousePointer,
} from "lucide-react";

interface OverviewData {
  visitors: {
    value: number;
    change: number;
    isPositive: boolean;
  };
  pageviews: {
    value: number;
    change: number;
    isPositive: boolean;
  };
  bounceRate: {
    value: number;
    change: number;
    isPositive: boolean;
  };
  avgSessionDuration: {
    value: number;
    change: number;
    isPositive: boolean;
  };
}

interface AnalyticsOverviewProps {
  data: OverviewData;
}

export default function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const stats = [
    {
      icon: Users,
      label: "الزوار",
      value: formatNumber(data.visitors.value || 0),
      change: data.visitors.change || 0,
      isPositive: data.visitors.isPositive,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Eye,
      label: "مشاهدات الصفحات",
      value: formatNumber(data.pageviews.value || 0),
      change: data.pageviews.change || 0,
      isPositive: data.pageviews.isPositive,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: MousePointer,
      label: "معدل الارتداد",
      value: `${data.bounceRate.value || 0}%`,
      change: data.bounceRate.change || 0,
      isPositive: data.bounceRate.isPositive,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Clock,
      label: "متوسط مدة الجلسة",
      value: formatTime(data.avgSessionDuration.value || 0),
      change: data.avgSessionDuration.change || 0,
      isPositive: data.avgSessionDuration.isPositive,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${
            stat.isPositive ? "text-green-500" : "text-red-500"
          }`}>
            {stat.isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{stat.change}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}