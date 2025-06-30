import { Metadata } from "next";
import ProductsClient from "../../../components/dashboard/Product/ProductsClient";

export const metadata: Metadata = {
  title: "EVA - إدارة المنتجات",
  description: "إدارة وتتبع جميع المنتجات في النظام",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
