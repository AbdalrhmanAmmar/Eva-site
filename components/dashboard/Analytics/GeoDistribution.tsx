"use client";

import { motion } from "framer-motion";
import { Map, Flag } from "lucide-react";

interface GeoData {
  country: string;
  visitors: number;
  percentage: number;
}

interface GeoDistributionProps {
  data: GeoData[];
}

export default function GeoDistribution({ data }: GeoDistributionProps) {
  const getCountryCode = (country: string) => {
    const countryCodes: Record<string, string> = {
      "السعودية": "sa",
      "الإمارات": "ae",
      "مصر": "eg",
      "الكويت": "kw",
      "قطر": "qa",
      "البحرين": "bh",
      "عمان": "om",
      "الأردن": "jo",
      "لبنان": "lb",
      "العراق": "iq",
      "المغرب": "ma",
      "تونس": "tn",
      "الجزائر": "dz",
      "ليبيا": "ly",
      "السودان": "sd",
      "فلسطين": "ps",
      "سوريا": "sy",
      "اليمن": "ye",
    };
    
    return countryCodes[country || ""] || "xx";
  };

  // Check if data is empty
  const noData = !data || data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/10 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Map className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">التوزيع الجغرافي</h3>
      </div>
      
      {noData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map Visualization (Placeholder) */}
          <div className="bg-background/50 rounded-xl p-4 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                خريطة التوزيع الجغرافي
              </p>
            </div>
          </div>
          
          {/* Country List */}
          <div className="space-y-4">
            {data.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 rounded overflow-hidden relative">
                    {country.country !== "أخرى" ? (
                      <img
                        src={`https://flagcdn.com/${getCountryCode(country.country)}.svg`}
                        alt={country.country}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <Flag className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{country.country}</div>
                    <div className="text-sm text-muted-foreground">
                      {country.visitors?.toLocaleString() || 0} زائر
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${country.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{country.percentage || 0}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}