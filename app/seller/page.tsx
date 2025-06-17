import { Metadata } from "next";
import SellerDashboardClient from "../../components/seller/SellerDashboardClient";

export const metadata: Metadata = {
  title: "EVA - لوحة تحكم البائع",
  description: "إدارة منتجاتك ومتابعة مبيعاتك",
};

export default function SellerDashboardPage() {
  return <SellerDashboardClient />;
}