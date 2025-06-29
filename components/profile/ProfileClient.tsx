"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Phone, Mail, Lock, Edit2, Award, Gift, Trophy, Crown, Star, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import PointsRedemption from "./PointsRedemption";

const rankColors = {
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-400 to-yellow-600",
};

const rankIcons = {
  bronze: <Award className="w-5 h-5 text-amber-800" />,
  silver: <Award className="w-5 h-5 text-gray-600" />,
  gold: <Crown className="w-5 h-5 text-yellow-600" />,
};

const rankThresholds = {
  bronze: 0,
  silver: 500,
  gold: 1000,
};

export default function ProfileClient() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [activeTab, setActiveTab] = useState<"profile" | "points" | "leaderboard">("profile");

  if (!user?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">يجب تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
      </div>
    );
  }

  // حساب المستوى والنقاط
  const points =  0;
  const currentRank = points >= rankThresholds.gold ? "gold" : 
                     points >= rankThresholds.silver ? "silver" : "bronze";
  const pointsToNextRank = currentRank === "gold" ? 0 : 
                          currentRank === "silver" ? rankThresholds.gold - points : 
                          rankThresholds.silver - points;

  const handleSave = () => {
    // setUser({ ...user, ...editedProfile });
    setIsEditing(false);
  };

  const handleRedeemPoints = async (pointsAmount: number): Promise<boolean> => {
    // Mock API call
    console.log(`Redeeming ${pointsAmount} points`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 my-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${rankColors[currentRank]} flex items-center justify-center shadow-md`}>
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 shadow-sm bg-primary">
                {rankIcons[currentRank]}
              </div>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-gradient-to-r ${rankColors[currentRank]} text-white`}>
                  {currentRank === "gold" ? "ذهبي" : currentRank === "silver" ? "فضي" : "برونزي"}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {points} نقطة
                </span>
              </div>
              
              <div className="mt-4 w-full bg-background rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full bg-gradient-to-r ${rankColors[currentRank]}`}
                  style={{
                    width: `${Math.min(100, (points / rankThresholds.gold) * 100)}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pointsToNextRank > 0 
                  ? `تبقى ${pointsToNextRank} نقطة للوصول إلى المستوى ${currentRank === "bronze" ? "الفضي" : "الذهبي"}`
                  : "وصلت إلى أعلى مستوى!"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 gap-2">
          {[
            { id: "profile", label: "الملف الشخصي", icon: User },
            { id: "points", label: "النقاط والمكافآت", icon: Gift },
            { id: "leaderboard", label: "المتصدرين", icon: Trophy },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-background shadow-md"
                  : "bg-card text-foreground border border-border/10 hover:bg-accent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm">{isEditing ? "إلغاء" : "تعديل"}</span>
                </motion.button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground mb-2">الاسم</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground mb-2">رقم الجوال</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                        +966
                      </div>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full pl-16 pr-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full mt-4 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    حفظ التغييرات
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">الاسم</div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">رقم الجوال</div>
                        <div className="font-medium">+966 {user.phone!}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Points Section */}
          {activeTab === "points" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Points Card */}
              <div className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">نقاطك ومكافآتك</h2>
                <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-6 text-center text-background shadow-lg">
                  <div className="text-4xl font-bold mb-2">{points}</div>
                  <div className="text-lg">نقطة</div>
                  <div className="mt-4 text-sm opacity-90">
                    {points >= 100 ? `يمكنك استبدال ${Math.floor(points/100)} ريال` : "اجمع 100 نقطة لاستبدالها بريال"}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-background/50 p-4 rounded-lg border border-border/10">
                    <div className="text-sm text-muted-foreground">المستوى الحالي</div>
                    <div className="font-medium capitalize">
                      {currentRank === "gold" ? "ذهبي" : currentRank === "silver" ? "فضي" : "برونزي"}
                    </div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-border/10">
                    <div className="text-sm text-muted-foreground">النقاط المتبقية للترقية</div>
                    <div className="font-medium">{pointsToNextRank}</div>
                  </div>
                </div>
              </div>

              {/* Points Redemption */}
              <div className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm">
                <PointsRedemption userPoints={points} onRedeem={handleRedeemPoints} />
              </div>

              {/* Available Points Packages */}
              <div className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">حزم النقاط المتاحة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { points: 1000, price: 100 },
                    { points: 5000, price: 450 },
                    { points: 10000, price: 850 }
                  ].map((pkg, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="bg-background/50 p-4 rounded-lg border border-border/10 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-lg">{pkg.points.toLocaleString()} نقطة</span>
                      </div>
                      <div className="text-primary font-bold mb-3">{pkg.price} ريال</div>
                      <div className="text-xs text-muted-foreground">
                        قيمة النقطة: {(pkg.price / pkg.points).toFixed(2)} ريال
                      </div>
                      <button className="w-full mt-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                        شراء الآن
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rank Progress */}
              <div className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">مستوى العضوية</h2>
                <div className="relative pt-8">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-background/50 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(points / rankThresholds.gold) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-8">
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${rankColors.bronze} flex items-center justify-center mb-2`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm">برونزي</div>
                      <div className="text-xs text-muted-foreground">{rankThresholds.bronze} نقطة</div>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${rankColors.silver} flex items-center justify-center mb-2`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm">فضي</div>
                      <div className="text-xs text-muted-foreground">{rankThresholds.silver} نقطة</div>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${rankColors.gold} flex items-center justify-center mb-2`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm">ذهبي</div>
                      <div className="text-xs text-muted-foreground">{rankThresholds.gold} نقطة</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Earn Points */}
              <div className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">كيفية كسب النقاط</h2>
                <div className="space-y-3">
                  {[
                    { action: "إكمال الطلب الأول", points: "+50 نقطة" },
                    { action: "تقييم المنتج", points: "+10 نقاط" },
                    { action: "مشاركة التطبيق", points: "+30 نقطة" },
                    { action: "الشراء في عطلة نهاية الأسبوع", points: "+20 نقطة" },
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex justify-between items-center p-3 bg-background/50 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-foreground">{item.action}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                        {item.points}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard Section */}
          {activeTab === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6">قائمة المتصدرين</h2>
              <div className="space-y-4">
                {[
                  { name: "أحمد محمد", points: 1500, rank: "gold" },
                  { name: "سارة أحمد", points: 1200, rank: "gold" },
                  { name: "محمد علي", points: 800, rank: "silver" },
                  { name: "فاطمة خالد", points: 600, rank: "silver" },
                  { name: "عمر يوسف", points: 400, rank: "bronze" },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-background/50 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${rankColors[user.rank as keyof typeof rankColors]} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.points} نقطة</div>
                    </div>
                    <Trophy className={`w-5 h-5 ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-muted-foreground"}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}