"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "./i18nConfig";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const localeFlag: { [key: string]: string } = {
  en: "🇬🇧",
  ar: "🇪🇬",

};

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    // redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button >
          {localeFlag[currentLocale]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex gap-2" onClick={() => handleChange("ar")}>
          <span>🇪🇬</span>
          <span>العربية</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onClick={() => handleChange("en")}>
          <span>AR</span>
          <span>English</span>
        </DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
