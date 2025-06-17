import AddProductClient from "@/components/seller/AddProductClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إضافة منتج جديد",
  description: "إضافة منتج جديد إلى متجرك",
};

export default function AddProductPage() {
  return <AddProductClient />;
}