import StaffDashboardClient from "@/components/staff/StaffDashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - لوحة تحكم الموظفين",
  description: "لوحة تحكم الموظفين الرئيسية",
};

export default function StaffDashboardPage() {
  return <StaffDashboardClient />;
}