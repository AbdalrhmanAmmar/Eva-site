import SignupClient from "@/components/Auth/SignupClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - إنشاء حساب",
  description: "إنشاء حساب جديد",
};

export default function SignupPage() {
  return <SignupClient />;
}