import { Text, Wait, isVisible } from "@serenity-js/protractor";
import { Duration } from "@serenity-js/core";
import { LoginPage } from "./ui/LoginPage";

export class ForceChangePwdValidation {
  static PwdUpdateSuccess = () => {
    Wait.upTo(Duration.ofSeconds(15)).until(LoginPage.loginButton, isVisible());
    return Text.of(LoginPage.loginButton);
  };
}
