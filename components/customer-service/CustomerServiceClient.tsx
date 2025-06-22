"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Users,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  Search,
  Filter,
} from "lucide-react";
import ContactForm from "./ContactForm";
import FAQSection from "./FAQSection";

interface Message {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  timestamp: Date;
  status: "جديد" | "قيد المراجعة" | "تم الرد" | "مغلق";
  priority: "منخفض" | "متوسط" | "عالي" | "عاجل";
}

const mockMessages: Message[] = [
  {
    id: "1",
    customerName: "أحمد محمد",
    customerEmail: "ahmed@example.com",
    subject: "استفسار عن نظام المراقبة",
    message: "أريد معرفة المزيد عن نظام المراقبة الذكي",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "جديد",
    priority: "متوسط",
  },
  {
    id: "2",
    customerName: "سارة خالد",
    customerEmail: "sara@example.com",
    subject: "مشكلة في النظام",
    message: "النظام لا يعمل بشكل صحيح",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "قيد المراجعة",
    priority: "عالي",
  },
];

export default function CustomerServiceClient() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "messages" | "contact" | "faq">("dashboard");
  const [messages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    totalMessages: messages.length,
    newMessages: messages.filter(m => m.status === "جديد").length,
    inProgress: messages.filter(m => m.status === "قيد المراجعة").length,
    resolved: messages.filter(m => m.status === "تم الرد").length,
  };

  const filteredMessages = messages.filter(message =>
    message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "text-blue-500 bg-blue-500/10";
      case "قيد المراجعة": return "text-yellow-500 bg-yellow-500/10";
      case "تم الرد": return "text-green-500 bg-green-500/10";
      case "مغلق": return "text-gray-500 bg-gray-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عاجل": return "text-red-500";
      case "عالي": return "text-orange-500";
      case "متوسط": return "text-yellow-500";
      case "منخفض": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            خدمة العملاء
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            نحن هنا لمساعدتك على مدار الساعة
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "dashboard", label: "لوحة التحكم", icon: TrendingUp },
            { id: "messages", label: "الرسائل", icon: MessageSquare },
            { id: "contact", label: "تواصل معنا", icon: Send },
            { id: "faq", label: "الأسئلة الشائعة", icon: MessageCircle },
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
        <div className="space-y-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalMessages}</div>
                      <div className="text-sm text-muted-foreground">إجمالي الرسائل</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.newMessages}</div>
                      <div className="text-sm text-muted-foreground">رسائل جديدة</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.inProgress}</div>
                      <div className="text-sm text-muted-foreground">قيد المعالجة</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.resolved}</div>
                      <div className="text-sm text-muted-foreground">تم الحل</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">إجراءات سريعة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="p-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-center"
                  >
                    <Send className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">إرسال رسالة جديدة</div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("faq")}
                    className="p-4 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors text-center"
                  >
                    <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">الأسئلة الشائعة</div>
                  </button>
                  
                  <div className="p-4 bg-green-500/10 text-green-500 rounded-lg text-center">
                    <Phone className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">اتصل بنا</div>
                    <div className="text-sm">+966 XX XXX XXXX</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/10 rounded-xl p-6 text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">الهاتف</h3>
                  <p className="text-muted-foreground">+966 XX XXX XXXX</p>
                  <p className="text-sm text-muted-foreground mt-2">متاح 24/7</p>
                </div>
                
                <div className="bg-card border border-border/10 rounded-xl p-6 text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">support@eva-security.com</p>
                  <p className="text-sm text-muted-foreground mt-2">رد خلال 24 ساعة</p>
                </div>
                
                <div className="bg-card border border-border/10 rounded-xl p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">الدردشة المباشرة</h3>
                  <p className="text-muted-foreground">متاح الآن</p>
                  <p className="text-sm text-muted-foreground mt-2">استجابة فورية</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="bg-card border border-border/10 rounded-xl p-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="البحث في الرسائل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Messages List */}
              <div className="bg-card border border-border/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">الرسائل الواردة</h2>
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 bg-background/50 rounded-lg border border-border/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{message.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{message.customerEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{message.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleString("ar-SA")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Form */}
          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-xl p-8"
            >
              <ContactForm />
            </motion.div>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-xl p-8"
            >
              <FAQSection />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}