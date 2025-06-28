"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Settings } from "lucide-react";
import GoogleAnalyticsSetup from "./GoogleAnalyticsSetup"; 
import PlausibleAnalyticsSetup from "./PlausibleAnalyticsSetup";

export default function AnalyticsSetupSelector() {
  const [selectedProvider, setSelectedProvider] = useState<"google" | "plausible">("google");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">إعداد التحليلات</h3>
      </div>

      <div className="flex gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedProvider("google")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            selectedProvider === "google"
              ? "bg-primary text-background"
              : "bg-card border border-border/10 hover:border-primary/20"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Google Analytics</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedProvider("plausible")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            selectedProvider === "plausible"
              ? "bg-primary text-background"
              : "bg-card border border-border/10 hover:border-primary/20"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Plausible Analytics</span>
        </motion.button>
      </div>

      {selectedProvider === "google" ? (
        <GoogleAnalyticsSetup />
      ) : (
        <PlausibleAnalyticsSetup />
      )}
    </div>
  );
}