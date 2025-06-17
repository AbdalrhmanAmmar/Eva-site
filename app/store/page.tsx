import StoreClient from "@/components/store/StoreClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - المتجر",
  description: "تسوق منتجاتنا المتميزة في مجال الأمن والحماية والتطوير العقاري",
};

export default function StorePage() {
  return <StoreClient />;
}