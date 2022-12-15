import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class LoginPage {
  static usernameField = Target.the("username input").located(by.css("#email"));

  static passwordField = Target.the("password input").located(by.css("#password"));

  static loginButton = Target.the('"Log In" button').located(by.css("#loginButton"));

  static loginErrorText = Target.the("error message").located(by.css("#loginError"));
}
