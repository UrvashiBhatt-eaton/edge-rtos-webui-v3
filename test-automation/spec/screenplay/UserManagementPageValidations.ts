import { Text, Wait, isVisible } from "@serenity-js/protractor";
import { UserManagementPage } from "./ui/UserManagementPage";
import { LoginPage } from "./ui/LoginPage";
import { Duration } from "@serenity-js/core";

export class UserManagementPageValidations {
  static getUserNameText = (username) => {
    Wait.upTo(Duration.ofSeconds(10)).until(UserManagementPage.findUsernameInTable(username), isVisible());
    return Text.of(UserManagementPage.findUsernameInTable(username));
  };

  static getChangePwdPopupHeader = () => {
    Wait.upTo(Duration.ofSeconds(5)).until(UserManagementPage.changePwdPopupHeader, isVisible());
    return Text.of(UserManagementPage.changePwdPopupHeader);
  };

  static getSessionExpiredPopupHeader = () => {
    Wait.upTo(Duration.ofSeconds(5)).until(UserManagementPage.sessionExpiredPopupHeader, isVisible());
    return Text.of(UserManagementPage.sessionExpiredPopupHeader);
  };

  static getLoginButtonText = () => {
    Wait.upTo(Duration.ofSeconds(15)).until(LoginPage.loginButton, isVisible());
    return Text.of(LoginPage.loginButton);
  };

  static getFullNameText = (username) => {
    return Text.of(UserManagementPage.findFullnameInTable(username));
  };

  static getPwdComplexityOption = () => {
    return Text.of(UserManagementPage.passwordComplexityDropdownButton);
  };

  static getUserRole = (username) => {
    return Text.of(UserManagementPage.findRoleInTable(username));
  };

  static getErrorMsg = (errormsg) => {
    Wait.upTo(Duration.ofSeconds(15)).until(UserManagementPage.errorMsg(errormsg), isVisible());
    return Text.of(UserManagementPage.errorMsg(errormsg));
  };
}
