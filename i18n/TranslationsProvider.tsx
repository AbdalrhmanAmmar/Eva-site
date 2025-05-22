"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { Resource, createInstance } from "i18next";

export interface ITranslationsProvider {
  children: React.ReactNode;
  locale: string;
  resources?: Resource;
}

export default function TranslationsProvider({ children, locale, resources }: ITranslationsProvider) {
  const i18n = createInstance();

  initTranslations(locale, undefined, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
