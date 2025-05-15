import RealEstateClient from "@/components/RealEstateClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - التطوير العقاري",
  description: "نبتكر مشاريع عقارية متميزة تجمع بين الجودة والاستدامة",
};

export default function RealEstatePage() {
  return <RealEstateClient />;
}