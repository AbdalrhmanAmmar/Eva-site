"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Loader2, User, Bot, Phone, Mail } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onMessageReceived?: (message: string, userInfo?: any) => void;
}

const quickReplies = [
  "معلومات عن المنتجات",
  "الأسعار والعروض", 
  "خدمة ما بعد البيع",
  "الدعم التقني",
  "تواصل مع مختص"
];

const botResponses: { [key: string]: string } = {
  "معلومات عن المنتجات": "نقدم مجموعة واسعة من المنتجات:\n• أنظمة المراقبة الذكية\n• بوابات التحكم بالدخول\n• أنظمة الإنذار\n• حلول إدارة المباني\n\nأي منتج تريد معرفة المزيد عنه؟",
  "الأسعار والعروض": "لدينا عروض مميزة:\n• خصم 15% على أنظمة المراقبة\n• تركيب مجاني للطلبات أكثر من 5000 ريال\n• ضمان شامل لمدة سنتين\n\nهل تريد عرض سعر مخصص؟",
  "خدمة ما بعد البيع": "نقدم خدمة شاملة:\n• ضمان لمدة سنتين\n• صيانة دورية مجانية\n• دعم تقني 24/7\n• قطع غيار أصلية\n\nكيف يمكنني مساعدتك؟",
  "الدعم التقني": "فريق الدعم التقني جاهز:\n• حل المشاكل التقنية\n• إعداد الأنظمة\n• التدريب على الاستخدام\n• التحديثات\n\nما نوع المساعدة التي تحتاجها؟",
  "تواصل مع مختص": "يمكنك التواصل معنا:\n• الهاتف: +966 XX XXX XXXX\n• البريد: support@eva-security.com\n• زيارة مكاتبنا\n\nسيتم تحويلك لأحد المختصين."
};

export default function Chatbot({ onMessageReceived }: ChatbotProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "مرحباً! أنا مساعد EVA الذكي. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string }>({});
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [infoStep, setInfoStep] = useState<"name" | "email" | "done">("name");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleUserMessage = (content: string) => {
    const userMessage = addMessage(content, "user");
    
    // إرسال الرسالة للمكون الأب
    if (onMessageReceived) {
      onMessageReceived(content, userInfo);
    }

    // إذا كنا نجمع معلومات المستخدم
    if (collectingInfo) {
      handleInfoCollection(content);
      return;
    }

    setIsTyping(true);
    setShowQuickReplies(false);

    setTimeout(() => {
      let botResponse = "شكراً لرسالتك. ";
      
      // البحث عن رد مناسب
      const foundResponse = Object.keys(botResponses).find(key => 
        content.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(content.toLowerCase())
      );

      if (foundResponse) {
        botResponse = botResponses[foundResponse];
      } else if (content.toLowerCase().includes("مشكلة") || content.toLowerCase().includes("عطل")) {
        botResponse = "أعتذر لسماع ذلك. دعني أساعدك:\n• وصف المشكلة بالتفصيل\n• نوع المنتج\n• متى بدأت المشكلة\n\nهل تريد التحدث مع فني متخصص؟";
      } else if (content.toLowerCase().includes("سعر") || content.toLowerCase().includes("تكلفة")) {
        botResponse = "بالنسبة للأسعار:\n• أنظمة المراقبة: من 2,500 ريال\n• بوابات التحكم: من 1,800 ريال\n• الأنظمة المتكاملة: من 8,000 ريال\n\nهل تريد عرض سعر مفصل؟";
      } else if (content.toLowerCase().includes("تواصل") || content.toLowerCase().includes("مختص")) {
        botResponse = "لتوصيلك بأحد المختصين، أحتاج بعض المعلومات:";
        setCollectingInfo(true);
        setInfoStep("name");
      } else {
        botResponse += "يمكنني مساعدتك في:\n• معلومات المنتجات\n• الأسعار والعروض\n• الدعم التقني\n• التواصل مع مختص\n\nاختر ما يناسبك أو اكتب استفسارك.";
      }

      addMessage(botResponse, "bot");
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleInfoCollection = (content: string) => {
    if (infoStep === "name") {
      setUserInfo(prev => ({ ...prev, name: content }));
      setInfoStep("email");
      setTimeout(() => {
        addMessage(`شكراً ${content}! الآن أحتاج بريدك الإلكتروني للتواصل معك.`, "bot");
        setIsTyping(false);
      }, 500);
    } else if (infoStep === "email") {
      setUserInfo(prev => ({ ...prev, email: content }));
      setInfoStep("done");
      setCollectingInfo(false);
      
      const finalUserInfo = { ...userInfo, email: content };
      
      setTimeout(() => {
        addMessage(
          `ممتاز! تم حفظ معلوماتك:\n• الاسم: ${userInfo.name}\n• البريد: ${content}\n\nسيتم التواصل معك خلال 30 دقيقة من قبل أحد المختصين.`,
          "bot"
        );
        setIsTyping(false);
        
        // إرسال المعلومات الكاملة
        if (onMessageReceived) {
          onMessageReceived("طلب تواصل مع مختص", finalUserInfo);
        }
      }, 500);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleUserMessage(reply);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    handleUserMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-primary text-background flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="fixed bottom-6 left-6 w-[calc(100%-3rem)] md:w-[400px] bg-card border border-border/10 rounded-2xl shadow-xl z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/10 bg-primary/5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">مساعد EVA</h3>
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        متصل الآن
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
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
                        <div className="whitespace-pre-line text-sm">{message.content}</div>
                      </div>
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

              {/* Quick Replies */}
              {showQuickReplies && !collectingInfo && (
                <div className="px-4 py-2 border-t border-border/10">
                  <div className="text-xs text-muted-foreground mb-2">اختر من الخيارات:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.slice(0, 3).map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border/10">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      collectingInfo 
                        ? infoStep === "name" 
                          ? "اكتب اسمك..." 
                          : "اكتب بريدك الإلكتروني..."
                        : "اكتب رسالتك..."
                    }
                    className="flex-1 px-3 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>أو تواصل عبر:</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>الهاتف</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>البريد</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}