import { Config } from "@/interfaces/Config";

const i18nConfig: Config = {
  locales: ["en", "ar", "de"],
  defaultLocale: "en",
  prefixDefault: true,
  noPrefix: false,
  cookieOptions: {
    name: "language",
  },
};

export default i18nConfig;
