import SecurityClient from "@/components/SecurityClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - الأمن والحماية",
  description: "حلول أمنية متكاملة مع التركيز على أحدث التقنيات وأفضل الممارسات العالمية",
};

export default function SecurityPage() {
  return <SecurityClient />;
}