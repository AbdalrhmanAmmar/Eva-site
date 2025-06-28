import PointsClient from "@/components/dashboard/points/PointsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة النقاط",
  description: "إدارة وتتبع جميع النقاط في النظام",
};

export default function ProductsPage() {
  return <PointsClient />;
}