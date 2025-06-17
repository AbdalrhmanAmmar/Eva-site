import SellerProductsClient from "@/components/seller/SellerProductsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة المنتجات",
  description: "إضافة وتعديل منتجاتك",
};

export default function SellerProductsPage() {
  return <SellerProductsClient />;
}