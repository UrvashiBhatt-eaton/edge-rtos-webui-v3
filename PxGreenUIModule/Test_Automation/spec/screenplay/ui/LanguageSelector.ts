import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class LanguageSelector {
  static loadingLanguageText = Target.the("Select Language Popup").located(by.css("#loadingLanguage"));

  static languageSelectorCombo = Target.the("Language Selector Combo").located(by.css("#selectLanguage"));

  static getBrowserDefault = () => Target.the("Browser Default").located(by.css("#langOptionBrowserDefault"));

  static getFirstLanguage = () => Target.the("First language").located(by.css("data-value='1'"));

  static getEnglishLanguage = () => Target.the("English").located(by.css("#langOptionEnglish"));

  static buttonOk = Target.the("OK").located(by.id("languageSelectionOk"));

  static buttonCancel = Target.the("Cancel").located(by.id("languageSelectionCancel"));

  static getLanguageOption = (language: string) =>
    Target.the("Language Option").located(by.css("#langOption" + language.replace(/ /g, "")));
}
