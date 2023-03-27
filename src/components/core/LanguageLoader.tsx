import { I18n } from "i18n-js";
import moment from "moment";
import "moment/locale/it";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TRANSLATIONS_EN } from "../../locale/translations_en";
import { TRANSLATIONS_IT } from "../../locale/translations_it";
import { languageState } from "../../reducers/store";

export const i18n = new I18n({ it: TRANSLATIONS_IT, en: TRANSLATIONS_EN });

/**
 * Manages initialization of translation system
 */
export function initI18n() {
  i18n.locale = useSelector(languageState).code;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";
}

export const LanguageLoader = () => {
  const { code: langCode } = useSelector(languageState);

  /**
   * Manages moment locale change on App language change
   */
  useEffect(() => {
    if (!langCode) return;
    moment.locale(langCode);
    console.log(`Locale set to ${langCode}`);
  }, [langCode]);

  initI18n();
  return null;
};
