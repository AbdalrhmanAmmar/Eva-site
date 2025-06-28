import AnalyticsClient from "@/components/dashboard/Analytics/AnalyticsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - التحليلات",
  description: "تحليلات الموقع وإحصائيات الزوار",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}