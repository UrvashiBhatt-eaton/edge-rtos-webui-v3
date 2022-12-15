import { Text } from "@serenity-js/protractor";
import { PageNavigationMenu } from "./ui/PageNavigationMenu";
import { AvatarMenu } from "./ui/AvatarMenu";
import { UserManagementPage } from "./ui/UserManagementPage";
import { FirmwarePage } from "./ui/FirmwarePage";
import { GeneralPage } from "./ui/GeneralPage";
import { LoginPage } from "./ui/LoginPage";
import { LanguageSelector } from "./ui/LanguageSelector";

export class LanguageValidations {
  static checkLanguageIsListed = (language: string) => {
    return LanguageSelector.getLanguageOption(language);
  };

  static getSelectedLanguage = () => {
    return Text.of(LanguageSelector.languageSelectorCombo);
  };

  static getLanguageNavText = () => {
    return Text.of(AvatarMenu.languageNav);
  };

  static getCopyrightDisclaimerText = () => {
    return Text.of(PageNavigationMenu.copyrightDisclaimerText);
  };

  static getFullnameText = () => {
    return Text.of(UserManagementPage.tableHeaderFullname);
  };

  static getOpenCodepackText = () => {
    return Text.of(FirmwarePage.openCodepackBtn);
  };

  static getLocaleSectionHeaderText = () => {
    return Text.of(GeneralPage.localeSectionHeader);
  };

  static getLoginUsernameLabel = () => {
    return Text.of(LoginPage.loginButton);
  };
}
