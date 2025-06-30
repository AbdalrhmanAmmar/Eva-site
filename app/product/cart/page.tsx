import CartClient from "@/components/store/CartClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - سلة التسوق",
  description: "مراجعة منتجاتك وإتمام عملية الشراء",
};

export default function CartPage() {
  return <CartClient />;
}