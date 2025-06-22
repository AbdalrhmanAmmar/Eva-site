import StaffCustomerServiceClient from "@/components/staff/StaffCustomerServiceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة خدمة العملاء",
  description: "لوحة تحكم خدمة العملاء للموظفين",
};

export default function StaffCustomerServicePage() {
  return <StaffCustomerServiceClient />;
}