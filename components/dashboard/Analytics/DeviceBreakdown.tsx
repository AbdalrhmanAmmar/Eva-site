"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
} from "lucide-react";

interface DeviceData {
  mobile: number;
  desktop: number;
  tablet: number;
}

interface DeviceBreakdownProps {
  data: DeviceData;
  fullWidth?: boolean;
}

export default function DeviceBreakdown({ data, fullWidth = false }: DeviceBreakdownProps) {
  const devices = [
    { name: "الهاتف المحمول", value: data.mobile || 0, icon: Smartphone, color: "text-blue-500", bgColor: "bg-blue-500" },
    { name: "سطح المكتب", value: data.desktop || 0, icon: Monitor, color: "text-green-500", bgColor: "bg-green-500" },
    { name: "الجهاز اللوحي", value: data.tablet || 0, icon: Tablet, color: "text-purple-500", bgColor: "bg-purple-500" },
  ];

  // Check if data is empty
  const noData = devices.every(device => device.value === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/10 rounded-xl p-6 ${fullWidth ? "col-span-full" : ""}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Laptop className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">توزيع الأجهزة</h3>
      </div>
      
      {noData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {devices.map((device, i) => {
                  // Calculate the starting position for this segment
                  const previousTotal = devices
                    .slice(0, i)
                    .reduce((sum, d) => sum + d.value, 0);
                  
                  const total = devices.reduce((sum, d) => sum + d.value, 0);
                  
                  // Avoid division by zero
                  if (total === 0) return null;
                  
                  const startAngle = (previousTotal / total) * 360;
                  const endAngle = ((previousTotal + device.value) / total) * 360;
                  
                  // Convert angles to radians and calculate x,y coordinates
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  // Determine if the arc should be drawn as a large arc
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  // Create the SVG arc path
                  const d = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `L 50 50`,
                  ].join(" ");
                  
                  return (
                    <path
                      key={device.name}
                      d={d}
                      className={`${device.bgColor} opacity-80`}
                      stroke="none"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="30" fill="#1E1E1E" />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{devices[0].value}%</div>
                  <div className="text-xs text-muted-foreground">{devices[0].name}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${device.color} bg-opacity-10 rounded-lg`}>
                    <device.icon className={`w-4 h-4 ${device.color}`} />
                  </div>
                  <span>{device.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-background rounded-full h-2">
                    <div
                      className={`${device.bgColor} h-2 rounded-full`}
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{device.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}