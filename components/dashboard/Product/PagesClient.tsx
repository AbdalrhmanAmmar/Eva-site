"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Globe,
  Calendar,
  User,
} from "lucide-react";

const mockPages = [
  {
    id: "1",
    title: "الصفحة الرئيسية",
    slug: "/",
    status: "منشور",
    lastModified: "2024-01-15",
    author: "أحمد محمد",
    views: 1250,
  },
  {
    id: "2",
    title: "من نحن",
    slug: "/about",
    status: "منشور",
    lastModified: "2024-01-10",
    author: "سارة أحمد",
    views: 890,
  },
  {
    id: "3",
    title: "خدماتنا",
    slug: "/services",
    status: "مسودة",
    lastModified: "2024-01-08",
    author: "محمد علي",
    views: 0,
  },
];

export default function PagesClient() {
  const [pages] = useState(mockPages);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منشور":
        return "text-green-500 bg-green-500/10";
      case "مسودة":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الصفحات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع صفحات الموقع ({filteredPages.length} صفحة)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة صفحة جديدة
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border/10 rounded-xl p-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث في الصفحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-card border border-border/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10 bg-muted/5">
                <th className="text-right py-4 px-6 font-medium">العنوان</th>
                <th className="text-right py-4 px-6 font-medium">الرابط</th>
                <th className="text-right py-4 px-6 font-medium">الحالة</th>
                <th className="text-right py-4 px-6 font-medium">المؤلف</th>
                <th className="text-right py-4 px-6 font-medium">آخر تعديل</th>
                <th className="text-right py-4 px-6 font-medium">المشاهدات</th>
                <th className="text-right py-4 px-6 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page, index) => (
                <motion.tr
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border/10 hover:bg-muted/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">{page.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{page.slug}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{page.author}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{page.lastModified}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{page.views}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}