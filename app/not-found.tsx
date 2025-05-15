import NotFoundClient from "@/components/NotFound/NotFoundClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - الصفحة غير موجودة",
  description: "عذراً، الصفحة التي تبحث عنها غير موجودة",
};

export default function NotFound() {
  return <NotFoundClient />;
}