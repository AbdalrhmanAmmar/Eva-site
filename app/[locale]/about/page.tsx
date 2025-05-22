import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - من نحن",
  description: "تعرف على خدماتنا في الأمن والحماية، التطوير العقاري، وإدارة الأملاك",
};

export default function AboutPage() {
  return <AboutClient />;
}