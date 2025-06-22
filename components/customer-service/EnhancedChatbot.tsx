"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Phone,
  Mail,
  FileText,
  Star,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  options?: string[];
  rating?: number;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  "معلومات عن المنتجات",
  "الأسعار والعروض",
  "خدمة ما بعد البيع",
  "الدعم التقني",
  "معلومات الشحن",
  "سياسة الإرجاع",
];

const botResponses = {
  "معلومات عن المنتجات": {
    content: "نقدم مجموعة واسعة من المنتجات في مجال الأمن والحماية:\n\n• أنظمة المراقبة الذكية\n• بوابات التحكم بالدخول\n• أنظمة الإنذار المتطورة\n• حلول إدارة المباني\n\nأي منتج تريد معرفة المزيد عنه؟",
    options: ["أنظمة المراقبة", "بوابات التحكم", "أنظمة الإنذار", "إدارة المباني"]
  },
  "الأسعار والعروض": {
    content: "لدينا عروض مميزة حالياً:\n\n• خصم 15% على أنظمة المراقبة\n• عرض خاص على باقات الأمن المتكاملة\n• تركيب مجاني للطلبات أكثر من 5000 ريال\n\nهل تريد عرض سعر مخصص؟",
    options: ["طلب عرض سعر", "معرفة العروض الحالية", "التحدث مع مختص"]
  },
  "خدمة ما بعد البيع": {
    content: "نقدم خدمة شاملة بعد البيع:\n\n• ضمان شامل لمدة سنتين\n• صيانة دورية مجانية\n• دعم تقني على مدار الساعة\n• قطع غيار أصلية\n\nكيف يمكنني مساعدتك؟",
    options: ["طلب صيانة", "استعلام عن الضمان", "دعم تقني", "قطع غيار"]
  },
  "الدعم التقني": {
    content: "فريق الدعم التقني جاهز لمساعدتك:\n\n• حل المشاكل التقنية\n• إعداد وتكوين الأنظمة\n• التدريب على الاستخدام\n• التحديثات والترقيات\n\nما نوع المساعدة التي تحتاجها؟",
    options: ["مشكلة تقنية", "إعداد النظام", "طلب تدريب", "تحديث البرنامج"]
  },
  "معلومات الشحن": {
    content: "معلومات الشحن والتوصيل:\n\n• الشحن المجاني للطلبات أكثر من 1000 ريال\n• التوصيل خلال 2-3 أيام عمل\n• إمكانية التوصيل في نفس اليوم (الرياض)\n• تتبع الطلب عبر الرسائل النصية\n\nهل لديك استفسار محدد؟",
    options: ["تتبع الطلب", "تكلفة الشحن", "مواعيد التوصيل", "تغيير العنوان"]
  },
  "سياسة الإرجاع": {
    content: "سياسة الإرجاع والاستبدال:\n\n• إمكانية الإرجاع خلال 14 يوم\n• المنتج يجب أن يكون في حالته الأصلية\n• استرداد كامل للمبلغ\n• خدمة الاستبدال متاحة\n\nهل تريد إرجاع منتج؟",
    options: ["طلب إرجاع", "طلب استبدال", "شروط الإرجاع", "التحدث مع مختص"]
  }
};

export default function EnhancedChatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "مرحباً بك في خدمة عملاء EVA! 👋\n\nأنا مساعدك الذكي وسأكون سعيداً لمساعدتك اليوم. كيف يمكنني خدمتك؟",
      timestamp: new Date(),
      options: quickActions
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords and provide relevant responses
    if (lowerMessage.includes("سعر") || lowerMessage.includes("تكلفة") || lowerMessage.includes("ثمن")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "بالنسبة للأسعار، نقدم حلول متنوعة تناسب جميع الميزانيات:\n\n• أنظمة المراقبة: تبدأ من 2,500 ريال\n• بوابات التحكم: تبدأ من 1,800 ريال\n• الأنظمة المتكاملة: تبدأ من 8,000 ريال\n\nهل تريد عرض سعر مفصل لاحتياجاتك؟",
        timestamp: new Date(),
        options: ["طلب عرض سعر", "مقارنة المنتجات", "التحدث مع مختص"]
      };
    }
    
    if (lowerMessage.includes("تركيب") || lowerMessage.includes("تثبيت")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "خدمات التركيب والتثبيت:\n\n• فريق فنيين معتمدين\n• تركيب احترافي مع ضمان\n• اختبار شامل للنظام\n• تدريب على الاستخدام\n• متابعة ما بعد التركيب\n\nمتى تفضل موعد التركيب؟",
        timestamp: new Date(),
        options: ["حجز موعد", "تكلفة التركيب", "مدة التركيب", "متطلبات التركيب"]
      };
    }
    
    if (lowerMessage.includes("ضمان") || lowerMessage.includes("كفالة")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "معلومات الضمان:\n\n• ضمان شامل لمدة سنتين\n• يشمل قطع الغيار والعمالة\n• صيانة دورية مجانية\n• استبدال فوري في حالة العطل\n• دعم تقني مجاني\n\nهل لديك منتج تحت الضمان؟",
        timestamp: new Date(),
        options: ["فحص الضمان", "طلب صيانة", "تجديد الضمان", "شروط الضمان"]
      };
    }

    if (lowerMessage.includes("مشكلة") || lowerMessage.includes("عطل") || lowerMessage.includes("خلل")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "أعتذر لسماع ذلك. دعني أساعدك في حل المشكلة:\n\n• وصف المشكلة بالتفصيل\n• نوع المنتج المتأثر\n• متى بدأت المشكلة\n• هل جربت إعادة التشغيل؟\n\nيمكنني توصيلك بفني متخصص فوراً.",
        timestamp: new Date(),
        options: ["التحدث مع فني", "إرسال صور المشكلة", "طلب زيارة فنية", "حلول سريعة"]
      };
    }

    // Default response for unrecognized messages
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "شكراً لك على رسالتك. لضمان تقديم أفضل خدمة، يمكنك:\n\n• اختيار من الخيارات أدناه\n• التحدث مع أحد مختصينا\n• إرسال رسالة مفصلة عبر البريد الإلكتروني\n\nكيف تفضل المتابعة؟",
      timestamp: new Date(),
      options: ["التحدث مع مختص", "إرسال بريد إلكتروني", "العودة للقائمة الرئيسية"]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const response = botResponses[action as keyof typeof botResponses];
    
    if (response) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: action,
        timestamp: new Date()
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        options: response.options
      };

      setMessages(prev => [...prev, userMessage, botMessage]);
    }
    setShowQuickActions(false);
  };

  const handleRating = (messageId: string, rating: number) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
  };

  const resetChat = () => {
    setMessages([
      {
        id: "1",
        type: "bot",
        content: "مرحباً بك مرة أخرى! كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
        options: quickActions
      }
    ]);
    setShowQuickActions(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border/10 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/10 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">مساعد EVA الذكي</h3>
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    متصل الآن
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetChat}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="بدء محادثة جديدة"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-background"
                        : "bg-background/50 border border-border/10"
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    
                    {/* Options */}
                    {message.options && (
                      <div className="mt-4 space-y-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(option)}
                            className="block w-full text-left px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-sm"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Rating for bot messages */}
                  {message.type === "bot" && !message.options && (
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      <span className="text-xs text-muted-foreground">مفيد؟</span>
                      <button
                        onClick={() => handleRating(message.id, 1)}
                        className={`p-1 rounded transition-colors ${
                          message.rating === 1 ? "text-green-500" : "text-muted-foreground hover:text-green-500"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, -1)}
                        className={`p-1 rounded transition-colors ${
                          message.rating === -1 ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className={`text-xs text-muted-foreground mt-1 ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}>
                    {message.timestamp.toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user" 
                    ? "bg-primary/10 order-1 mr-3" 
                    : "bg-primary/10 ml-3"
                }`}>
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-background/50 border border-border/10 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">يكتب...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="px-6 py-4 border-t border-border/10">
              <div className="text-sm text-muted-foreground mb-3">اختر من الخيارات السريعة:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-sm text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-border/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-4 py-3 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Contact options */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>أو تواصل معنا عبر:</span>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                الهاتف
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                البريد
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}