"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";

const stats = [
  {
    icon: MessageSquare,
    label: "الرسائل اليوم",
    value: "24",
    change: "+12%",
    isPositive: true,
  },
  {
    icon: Users,
    label: "العملاء النشطين",
    value: "156",
    change: "+8%",
    isPositive: true,
  },
  {
    icon: CheckCircle2,
    label: "المشاكل المحلولة",
    value: "18",
    change: "+15%",
    isPositive: true,
  },
  {
    icon: Clock,
    label: "متوسط وقت الرد",
    value: "12 دقيقة",
    change: "-5%",
    isPositive: true,
  },
];

const recentActivity = [
  {
    id: 1,
    type: "message",
    title: "رسالة جديدة من أحمد محمد",
    description: "استفسار عن نظام المراقبة",
    time: "منذ 5 دقائق",
    priority: "عالي",
  },
  {
    id: 2,
    type: "resolved",
    title: "تم حل مشكلة فاطمة خالد",
    description: "مشكلة في نظام التحكم بالدخول",
    time: "منذ 15 دقيقة",
    priority: "متوسط",
  },
  {
    id: 3,
    type: "call",
    title: "مكالمة من عبدالله سعد",
    description: "طلب عرض سعر لمشروع كبير",
    time: "منذ 30 دقيقة",
    priority: "عاجل",
  },
];

export default function StaffDashboardClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم الرئيسية</h1>
        <p className="text-muted-foreground mt-2">
          مرحباً بك في لوحة تحكم الموظفين - نظرة عامة على الأنشطة اليومية
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-4 ${
              stat.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">النشاط الأخير</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {activity.type === "message" && <MessageSquare className="w-5 h-5 text-primary" />}
                  {activity.type === "resolved" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {activity.type === "call" && <Phone className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      activity.priority === "عاجل" ? "bg-red-500/10 text-red-500" :
                      activity.priority === "عالي" ? "bg-orange-500/10 text-orange-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {activity.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">إجراءات سريعة</h2>
            <div className="space-y-3">
              <button className="w-full p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  <span>عرض الرسائل الجديدة</span>
                </div>
              </button>
              <button className="w-full p-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>إدارة العملاء</span>
                </div>
              </button>
              <button className="w-full p-3 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  <span>عرض التقارير</span>
                </div>
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card border border-border/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">مؤشرات الأداء</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">معدل الرضا</span>
                  <span className="text-sm font-bold">95%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">سرعة الاستجابة</span>
                  <span className="text-sm font-bold">88%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">حل المشاكل</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">جدول اليوم</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">09:00 - 10:00</span>
            </div>
            <p className="text-sm">اجتماع فريق خدمة العملاء</p>
          </div>
          
          <div className="p-4 bg-blue-500/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span className="font-medium">11:00 - 12:00</span>
            </div>
            <p className="text-sm">مكالمات المتابعة مع العملاء</p>
          </div>
          
          <div className="p-4 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-medium">14:00 - 15:00</span>
            </div>
            <p className="text-sm">مراجعة التقارير الأسبوعية</p>
          </div>
        </div>
      </div>
    </div>
  );
}