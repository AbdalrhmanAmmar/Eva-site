import LoginClient from "@/components/Auth/LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك",
};

export default function LoginPage() {
  return <LoginClient />;
}