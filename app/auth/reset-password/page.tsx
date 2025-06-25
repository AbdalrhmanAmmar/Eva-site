import ResetPasswordClient from "@/components/Auth/ResetPasswordClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إعادة تعيين كلمة المرور",
  description: "إعادة تعيين كلمة المرور الخاصة بك",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
