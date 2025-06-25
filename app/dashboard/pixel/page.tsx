import PixelClient from "@/components/dashboard/PixelClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إدارة Pixel",
  description: "إدارة ومراقبة بيانات Facebook Pixel وGoogle Analytics",
};

export default function PixelPage() {
  return <PixelClient />;
}