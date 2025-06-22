import CustomerServiceClient from "@/components/customer-service/CustomerServiceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - خدمة العملاء",
  description: "خدمة عملاء متميزة على مدار الساعة لمساعدتك في جميع استفساراتك",
};

export default function CustomerServicePage() {
  return <CustomerServiceClient />;
}