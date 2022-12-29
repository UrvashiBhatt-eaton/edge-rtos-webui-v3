import { Wait, isVisible, isClickable } from "@serenity-js/protractor";
import { Duration } from "@serenity-js/core";
import { LoginPage } from "./ui/LoginPage";
import { AvatarMenu } from "./ui/AvatarMenu";

export class LoginPageValidations {
  static HasErrorText = () => {
    Wait.upTo(Duration.ofSeconds(3)).until(LoginPage.loginErrorText, isVisible());
    return !!LoginPage.loginErrorText;
  };
  static LoginSuccess = () => {
    Wait.upTo(Duration.ofSeconds(3)).until(AvatarMenu.avatarNav, isClickable());
    return !!AvatarMenu.avatarNav;
  };
}
