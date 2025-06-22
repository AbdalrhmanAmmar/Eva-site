"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  Send,
  MoreVertical,
  Star,
  AlertCircle,
  CheckCircle2,
  Archive,
  Trash2,
  Reply,
  Forward,
  Tag,
  Calendar,
  FileText,
  Download,
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  MessageCircle,
  Timer,
  RefreshCw,
  Plus,
  Edit,
  Settings,
} from "lucide-react";

interface CustomerMessage {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  message: string;
  category: string;
  priority: "منخفض" | "متوسط" | "عالي" | "عاجل";
  status: "جديد" | "قيد المراجعة" | "تم الرد" | "مغلق" | "مؤرشف";
  timestamp: Date;
  lastReply?: Date;
  assignedTo?: string;
  tags: string[];
  attachments?: string[];
  replies: Reply[];
  isRead: boolean;
  responseTime?: number;
  source: "موقع" | "شات بوت" | "هاتف" | "بريد إلكتروني";
}

interface Reply {
  id: string;
  message: string;
  timestamp: Date;
  author: string;
  type: "staff" | "customer";
}

const mockMessages: CustomerMessage[] = [
  {
    id: "1",
    customerName: "أحمد محمد العلي",
    customerEmail: "ahmed@example.com",
    customerPhone: "0501234567",
    subject: "استفسار عن نظام المراقبة الذكي",
    message: "السلام عليكم، أريد معرفة المزيد عن نظام المراقبة الذكي وإمكانية تركيبه في منزلي. المنزل مساحته 300 متر مربع ويحتوي على طابقين.",
    category: "استفسار عن المنتجات",
    priority: "متوسط",
    status: "جديد",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ["مراقبة", "منزل", "تركيب"],
    replies: [],
    isRead: false,
    source: "شات بوت",
  },
  {
    id: "2",
    customerName: "فاطمة خالد السعد",
    customerEmail: "fatima@example.com",
    customerPhone: "0509876543",
    subject: "مشكلة في نظام التحكم بالدخول",
    message: "مرحباً، لدي مشكلة في نظام التحكم بالدخول المركب في مكتبي. النظام لا يتعرف على بصمة الإصبع بشكل صحيح منذ أمس.",
    category: "دعم تقني",
    priority: "عالي",
    status: "قيد المراجعة",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastReply: new Date(Date.now() - 1 * 60 * 60 * 1000),
    assignedTo: "محمد أحمد",
    tags: ["دعم تقني", "بصمة", "مكتب"],
    replies: [
      {
        id: "r1",
        message: "شكراً لتواصلك معنا. سنقوم بإرسال فني متخصص لفحص النظام. هل يمكنك تحديد الوقت المناسب للزيارة؟",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        author: "محمد أحمد",
        type: "staff"
      }
    ],
    isRead: true,
    responseTime: 180,
    source: "موقع",
  },
  {
    id: "3",
    customerName: "عبدالله سعد المطيري",
    customerEmail: "abdullah@example.com",
    customerPhone: "0551234567",
    subject: "طلب عرض سعر لمشروع كبير",
    message: "السلام عليكم، أنا مدير مشروع لمجمع تجاري جديد ونحتاج لنظام أمني متكامل يشمل: 50 كاميرا مراقبة، أنظمة إنذار، تحكم بالدخول لـ 20 مدخل.",
    category: "طلب عرض سعر",
    priority: "عاجل",
    status: "تم الرد",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastReply: new Date(Date.now() - 30 * 60 * 1000),
    assignedTo: "سارة محمد",
    tags: ["عرض سعر", "مشروع كبير", "مجمع تجاري"],
    replies: [
      {
        id: "r2",
        message: "شكراً لثقتكم بنا. تم تحويل طلبكم لقسم المبيعات وسيتم التواصل معكم خلال 24 ساعة لتحديد موعد المعاينة.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        author: "سارة محمد",
        type: "staff"
      }
    ],
    isRead: true,
    responseTime: 60,
    source: "بريد إلكتروني",
  },
];

const staffMembers = [
  "محمد أحمد",
  "سارة محمد", 
  "أحمد سالم",
  "فاطمة علي",
  "عبدالله خالد"
];

const categories = [
  "الكل",
  "استفسار عن المنتجات",
  "دعم تقني",
  "طلب عرض سعر",
  "استفسار عن الضمان",
  "شكوى",
  "اقتراح",
  "أخرى"
];

const statuses = [
  "الكل",
  "جديد",
  "قيد المراجعة", 
  "تم الرد",
  "مغلق",
  "مؤرشف"
];

const priorities = [
  "الكل",
  "منخفض",
  "متوسط",
  "عالي",
  "عاجل"
];

export default function StaffCustomerServiceClient() {
  const [messages, setMessages] = useState<CustomerMessage[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [selectedPriority, setSelectedPriority] = useState("الكل");
  const [replyMessage, setReplyMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser] = useState("محمد أحمد");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // تحديث الرسائل من الشات بوت
  useEffect(() => {
    // محاكاة استقبال رسائل جديدة من الشات بوت
    const interval = setInterval(() => {
      // يمكن هنا استقبال الرسائل الحقيقية من API
      console.log("فحص الرسائل الجديدة...");
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "الكل" || message.category === selectedCategory;
    const matchesStatus = selectedStatus === "الكل" || message.status === selectedStatus;
    const matchesPriority = selectedPriority === "الكل" || message.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === "جديد").length,
    inProgress: messages.filter(m => m.status === "قيد المراجعة").length,
    replied: messages.filter(m => m.status === "تم الرد").length,
    avgResponseTime: Math.round(
      messages
        .filter(m => m.responseTime)
        .reduce((sum, m) => sum + (m.responseTime || 0), 0) /
      messages.filter(m => m.responseTime).length || 0
    ),
    todayMessages: messages.filter(m => 
      new Date(m.timestamp).toDateString() === new Date().toDateString()
    ).length,
    unread: messages.filter(m => !m.isRead).length,
  };

  const handleReply = () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      message: replyMessage,
      timestamp: new Date(),
      author: currentUser,
      type: "staff"
    };

    const updatedMessage = {
      ...selectedMessage,
      replies: [...selectedMessage.replies, newReply],
      status: "تم الرد" as const,
      lastReply: new Date(),
      assignedTo: currentUser,
      isRead: true,
    };

    setMessages(prev => 
      prev.map(m => m.id === selectedMessage.id ? updatedMessage : m)
    );
    setSelectedMessage(updatedMessage);
    setReplyMessage("");
  };

  const updateMessageStatus = (messageId: string, newStatus: CustomerMessage['status']) => {
    setMessages(prev =>
      prev.map(m => 
        m.id === messageId 
          ? { 
              ...m, 
              status: newStatus, 
              assignedTo: newStatus === "قيد المراجعة" ? currentUser : m.assignedTo,
              isRead: true,
            }
          : m
      )
    );
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => prev ? { ...prev, status: newStatus, isRead: true } : null);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عاجل": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "عالي": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "متوسط": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "منخفض": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "قيد المراجعة": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "تم الرد": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "مغلق": return "text-gray-500 bg-gray-500/10 border-gray-500/20";
      case "مؤرشف": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "شات بوت": return <MessageSquare className="w-4 h-4" />;
      case "موقع": return <FileText className="w-4 h-4" />;
      case "هاتف": return <Phone className="w-4 h-4" />;
      case "بريد إلكتروني": return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة خدمة العملاء</h1>
          <p className="text-muted-foreground mt-2">
            إدارة ومتابعة رسائل العملاء والرد عليها
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            رسالة جديدة
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">إجمالي</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold">{stats.new}</div>
              <div className="text-sm text-muted-foreground">جديدة</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">قيد المراجعة</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{stats.replied}</div>
              <div className="text-sm text-muted-foreground">تم الرد</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">{stats.avgResponseTime}د</div>
              <div className="text-sm text-muted-foreground">متوسط الرد</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-500" />
            <div>
              <div className="text-2xl font-bold">{stats.todayMessages}</div>
              <div className="text-sm text-muted-foreground">اليوم</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{stats.unread}</div>
              <div className="text-sm text-muted-foreground">غير مقروءة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-primary text-background" : "hover:bg-primary/10"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "kanban" ? "bg-primary text-background" : "hover:bg-primary/10"
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-card border border-border/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/10">
            <h2 className="font-bold">الرسائل ({filteredMessages.length})</h2>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد رسائل</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ backgroundColor: "rgba(var(--primary), 0.05)" }}
                    onClick={() => {
                      setSelectedMessage(message);
                      markAsRead(message.id);
                    }}
                    className={`p-4 cursor-pointer border-b border-border/10 transition-colors ${
                      selectedMessage?.id === message.id ? "bg-primary/10" : ""
                    } ${!message.isRead ? "bg-blue-500/5 border-l-4 border-l-blue-500" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!message.isRead ? "font-bold" : ""}`}>
                            {message.customerName}
                          </h3>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {getSourceIcon(message.source)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.subject}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(message.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                    
                    {message.assignedTo && (
                      <div className="mt-2 text-xs text-primary">
                        مُعيّن إلى: {message.assignedTo}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 bg-card border border-border/10 rounded-xl overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-border/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {selectedMessage.customerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedMessage.customerEmail}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedMessage.customerPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value as CustomerMessage['status'])}
                      className="px-3 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
                    >
                      <option value="جديد">جديد</option>
                      <option value="قيد المراجعة">قيد المراجعة</option>
                      <option value="تم الرد">تم الرد</option>
                      <option value="مغلق">مغلق</option>
                      <option value="مؤرشف">مؤرشف</option>
                    </select>
                    
                    <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {selectedMessage.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {getSourceIcon(selectedMessage.source)}
                    <span>{selectedMessage.source}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTimeAgo(selectedMessage.timestamp)}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Original Message */}
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedMessage.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedMessage.timestamp.toLocaleString("ar-SA")}
                        </div>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
                    
                    {selectedMessage.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-4">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        {selectedMessage.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {selectedMessage.replies.map((reply) => (
                    <div key={reply.id} className={`rounded-lg p-4 ${
                      reply.type === "staff" ? "bg-primary/10 ml-8" : "bg-background/50 mr-8"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          reply.type === "staff" ? "bg-primary/20" : "bg-background"
                        }`}>
                          {reply.type === "staff" ? (
                            <Users className="w-4 h-4 text-primary" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{reply.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {reply.timestamp.toLocaleString("ar-SA")}
                          </div>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">{reply.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <div className="p-6 border-t border-border/10">
                <div className="space-y-4">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50 resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Tag className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      إرسال الرد
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">اختر رسالة للعرض</h3>
                <p className="text-muted-foreground">
                  اختر رسالة من القائمة لعرض التفاصيل والرد عليها
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}