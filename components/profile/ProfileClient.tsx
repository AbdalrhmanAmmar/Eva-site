"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Phone,
  Mail,
  Lock,
  Edit2,
  Award,
  Gift,
  Trophy,
  Crown,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  points: number;
  rank: "bronze" | "silver" | "gold";
  pointsToNextRank: number;
}

interface LeaderboardUser {
  name: string;
  points: number;
  rank: string;
}

const mockLeaderboard: LeaderboardUser[] = [
  { name: "أحمد محمد", points: 1500, rank: "gold" },
  { name: "سارة أحمد", points: 1200, rank: "gold" },
  { name: "محمد علي", points: 800, rank: "silver" },
  { name: "فاطمة خالد", points: 600, rank: "silver" },
  { name: "عمر يوسف", points: 400, rank: "bronze" },
];

const rankColors = {
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-400 to-yellow-600",
};

const rankThresholds = {
  bronze: 0,
  silver: 500,
  gold: 1000,
};

export default function ProfileClient() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "عبدالرحمن عادل ",
    email: "mohammed@example.com",
    phone: "0501234567",
    points: 750,
    rank: "silver",
    pointsToNextRank: 250,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [activeTab, setActiveTab] = useState<"profile" | "points" | "leaderboard">("profile");

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const pointsToRiyals = Math.floor(profile.points / 100); // 100 points = 1 SAR

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${rankColors[profile.rank]} flex items-center justify-center`}>
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                <Crown className="w-4 h-4 text-background" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="w-4 h-4" />
                <span className="capitalize">{profile.rank}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-background"
                  : "bg-card border border-border/10 text-foreground hover:border-primary/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-primary"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditing ? "إلغاء" : "تعديل"}</span>
                </motion.button>
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">الاسم</label>
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">رقم الجوال</label>
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      حفظ التغييرات
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">الاسم</div>
                        <div>{profile.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">رقم الجوال</div>
                        <div>{profile.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                        <div>{profile.email}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Points Section */}
          {activeTab === "points" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Points Overview */}
              <div className="bg-card border border-border/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6">نقاطك ومكافآتك</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-background/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{profile.points}</div>
                    <div className="text-sm text-muted-foreground">النقاط الحالية</div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{pointsToRiyals} ريال</div>
                    <div className="text-sm text-muted-foreground">القيمة النقدية</div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{profile.pointsToNextRank}</div>
                    <div className="text-sm text-muted-foreground">نقطة للمستوى التالي</div>
                  </div>
                </div>
              </div>

              {/* Rank Progress */}
              <div className="bg-card border border-border/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6">مستوى العضوية</h2>
                <div className="relative pt-8">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-background/50 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(profile.points / rankThresholds.gold) * 100}%`,
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
            </motion.div>
          )}

          {/* Leaderboard Section */}
          {activeTab === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border/10 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold mb-6">قائمة المتصدرين</h2>
              <div className="space-y-4">
                {mockLeaderboard.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-background/50 rounded-lg"
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