import InfoClient from "@/components/InfoClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - الأمن والحماية",
  description: "صفحة معلومات الاتصال",
};

export default function InfoPage() {
  return <InfoClient />;
}
