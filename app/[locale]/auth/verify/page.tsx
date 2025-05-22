
import VerifyClient from "@/components/Auth/VerifyClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVA - التحقق من الحساب",
  description: "التحقق من حسابك عبر رمز التحقق",
};

export default function VerifyPage() {
  return <VerifyClient />;
}