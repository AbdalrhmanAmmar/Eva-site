import PropertyManagementClient from "@/components/PropertyManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة الأملاك",
  description: "خدمات إدارة شاملة للممتلكات العقارية مع التركيز على الكفاءة والجودة",
};

export default function PropertyManagementPage() {
  return <PropertyManagementClient />;
}