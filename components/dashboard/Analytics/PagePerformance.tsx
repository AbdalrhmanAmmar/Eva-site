"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  MousePointer,
  Eye,
  ArrowUpDown,
  Search,
} from "lucide-react";

interface PageData {
  page: string;
  views: number;
  avgTime: number; // in seconds
  bounceRate: number; // percentage
}

interface PagePerformanceProps {
  data: PageData[];
  fullWidth?: boolean;
}

export default function PagePerformance({ data, fullWidth = false }: PagePerformanceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "avgTime" | "bounceRate">("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredPages = data.filter(page => 
    page.page?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPages = [...filteredPages].sort((a, b) => {
    const factor = sortOrder === "asc" ? 1 : -1;
    return factor * ((a[sortBy] || 0) - (b[sortBy] || 0));
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleSort = (field: "views" | "avgTime" | "bounceRate") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Check if data is empty
  const noData = data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/10 rounded-xl p-6 ${fullWidth ? "col-span-full" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-bold">أداء الصفحات</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في الصفحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 pl-4 pr-10 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>
      
      {noData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="text-right py-3 px-4 font-medium">الصفحة</th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => toggleSort("views")}>
                  <div className="flex items-center gap-1 justify-end">
                    <span>المشاهدات</span>
                    {sortBy === "views" && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => toggleSort("avgTime")}>
                  <div className="flex items-center gap-1 justify-end">
                    <span>متوسط الوقت</span>
                    {sortBy === "avgTime" && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => toggleSort("bounceRate")}>
                  <div className="flex items-center gap-1 justify-end">
                    <span>معدل الارتداد</span>
                    {sortBy === "bounceRate" && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.map((page, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/10 hover:bg-background/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{page.page}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>{page.views?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{formatTime(page.avgTime || 0)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <MousePointer className="w-4 h-4 text-orange-500" />
                      <span>{page.bounceRate || 0}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {sortedPages.length === 0 && !noData && (
        <div className="text-center py-8 text-muted-foreground">
          لم يتم العثور على نتائج
        </div>
      )}
    </motion.div>
  );
}