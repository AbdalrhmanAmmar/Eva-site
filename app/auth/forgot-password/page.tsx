import ForgotPasswordClient from "@/components/Auth/ForgotPasswordClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - استعادة كلمة المرور",
  description: "استعادة كلمة المرور الخاصة بك",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}