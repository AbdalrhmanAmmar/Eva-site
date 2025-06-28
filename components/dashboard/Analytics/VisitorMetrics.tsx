"use client";

import { motion } from "framer-motion";
import {
  Globe,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Search,
} from "lucide-react";

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface TrafficSourcesProps {
  data: TrafficSource[];
  fullWidth?: boolean;
}

export default function TrafficSources({ data, fullWidth = false }: TrafficSourcesProps) {
  const sources = Array.isArray(data) ? data : [];

  const getSourceIcon = (source: string) => {
    if (source?.includes("بحث")) return Search;
    if (source?.includes("مباشر")) return ExternalLink;
    if (source?.includes("تواصل")) return MessageSquare;
    if (source?.includes("إعلان")) return BarChart3;
    return Globe;
  };

  const getSourceColor = (source: string) => {
    if (source?.includes("بحث")) return "text-green-500";
    if (source?.includes("مباشر")) return "text-blue-500";
    if (source?.includes("تواصل")) return "text-purple-500";
    if (source?.includes("إعلان")) return "text-orange-500";
    return "text-primary";
  };

  const getSourceBgColor = (source: string) => {
    if (source?.includes("بحث")) return "bg-green-500/10";
    if (source?.includes("مباشر")) return "bg-blue-500/10";
    if (source?.includes("تواصل")) return "bg-purple-500/10";
    if (source?.includes("إعلان")) return "bg-orange-500/10";
    return "bg-primary/10";
  };

  const noData = sources.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/10 rounded-xl p-6 ${fullWidth ? "col-span-full" : ""}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">مصادر الزيارات</h3>
      </div>

      {noData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sources.map((source, index) => {
            const SourceIcon = getSourceIcon(source.source);
            const sourceColor = getSourceColor(source.source);
            const sourceBgColor = getSourceBgColor(source.source);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${sourceBgColor} rounded-lg`}>
                    <SourceIcon className={`w-4 h-4 ${sourceColor}`} />
                  </div>
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.visitors?.toLocaleString() || 0} زائر
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-background rounded-full h-2">
                    <div
                      className={`bg-primary h-2 rounded-full`}
                      style={{ width: `${source.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{source.percentage || 0}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {fullWidth && !noData && (
        <div className="mt-6 pt-6 border-t border-border/10">
          <h4 className="font-medium mb-4">توزيع مصادر الزيارات</h4>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full max-w-[60px] bg-primary rounded-t-sm mx-auto transition-all duration-500 relative group`}
                    style={{
                      height: `${source.percentage * 2}%`,
                      opacity: 0.7 + (source.percentage / 100) * 0.3,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {source.percentage}% ({source.visitors} زائر)
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    {source.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
