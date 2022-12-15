import { not } from "@serenity-js/assertions";
import { Task, Duration } from "@serenity-js/core";
import { Click, Wait, isClickable, isPresent } from "@serenity-js/protractor";
import { LanguageSelector } from "../ui/LanguageSelector";
import { AvatarMenu } from "../ui/AvatarMenu";
import { Navigation_Tasks } from "../tasks/Navigation_Tasks";

export class Language_Tasks {
  static dismissLanguagePopup = () =>
    Task.where(
      `#Dismiss the Language Popup`,
      Wait.upTo(Duration.ofSeconds(2)).until(LanguageSelector.buttonCancel, isClickable()),
      Click.on(LanguageSelector.buttonCancel)
    );

  static checkLanguageIsListed = (language: string) =>
    Task.where(
      `#Check if ${language} is listed`,
      Wait.upTo(Duration.ofSeconds(4)).until(LanguageSelector.getLanguageOption(language), isPresent())
    );

  static checkLanguageIsNotListed = (language: string) =>
    Task.where(
      `#Check if ${language} is not listed`,
      Wait.upTo(Duration.ofSeconds(4)).until(LanguageSelector.getLanguageOption(language), not(isPresent()))
    );

  static saveLanguageSelection = () =>
    Task.where(
      `#Click Ok on the language popup`,
      Wait.upTo(Duration.ofSeconds(2)).until(LanguageSelector.buttonOk, isClickable()),
      Click.on(LanguageSelector.buttonOk)
    );

  static saveSelectedLanguage = () => Task.where(`#Click Ok the Language Popup`, Click.on(LanguageSelector.buttonOk));

  static selectBrowserDefault = () =>
    Task.where(
      `#user selects browser default`,
      Language_Tasks.showLanguageChoices(),
      Click.on(LanguageSelector.getBrowserDefault())
    );

  static selectEnglishLanguage = () =>
    Task.where(
      `#user selects the English language`,
      Language_Tasks.showLanguageChoices(),
      Click.on(LanguageSelector.getEnglishLanguage())
    );

  static selectFirstLanguage = () =>
    Task.where(`#user selects the first language`, Click.on(LanguageSelector.getFirstLanguage()));

  static selectLanguage = (language: string) => {
    return Task.where(
      `#select language`,
      Language_Tasks.showLanguageChoices(),
      Click.on(LanguageSelector.getLanguageOption(language))
    );
  };

  static showLanguageSelector = () =>
    Task.where(
      `#show the language selector popup`,
      Navigation_Tasks.NavigationToUserAvatarMenu(),
      Wait.upTo(Duration.ofSeconds(4)).until(AvatarMenu.languageNav, isClickable()),
      Click.on(AvatarMenu.languageNav),
      Wait.upTo(Duration.ofSeconds(5)).until(LanguageSelector.languageSelectorCombo, isClickable())
    );

  static showLanguageChoices = () =>
    Task.where(`#show the language choices`, Click.on(LanguageSelector.languageSelectorCombo));
}
