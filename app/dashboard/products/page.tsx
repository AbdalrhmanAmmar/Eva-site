import PagesClient from "@/components/dashboard/PagesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة الصفحات",
  description: "إدارة وتتبع جميع صفحات الموقع",
};

export default function PagesPage() {
  return <PagesClient />;
}