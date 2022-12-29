import { Task, Duration } from "@serenity-js/core";
import { Enter, Click, Clear, Wait, isVisible, isClickable } from "@serenity-js/protractor";
import { LoginPage } from "../ui/LoginPage";
import { Check, Ensure, not } from "@serenity-js/assertions";
import { AvatarMenu } from "../ui/AvatarMenu";

export const LogIntoApplication = {
  with: (username: string, password: string) =>
    Task.where(
      `#user logs into the application using valid credentials`,
      Wait.upTo(Duration.ofSeconds(10)).until(LoginPage.usernameField, isVisible()),
      Clear.theValueOf(LoginPage.usernameField),
      Enter.theValue(username).into(LoginPage.usernameField),
      Enter.theValue(password).into(LoginPage.passwordField),
      Click.on(LoginPage.loginButton),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LoginPage.loginErrorText, isVisible())
        .andIfSo(
          Clear.theValueOf(LoginPage.usernameField),
          Enter.theValue(username).into(LoginPage.usernameField),
          Enter.theValue("Admin*1").into(LoginPage.passwordField),
          Click.on(LoginPage.loginButton),
          Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.currentPasswordInput, isVisible()),
          Clear.theValueOf(AvatarMenu.currentPasswordInput),
          Enter.theValue("Admin*1").into(AvatarMenu.currentPasswordInput),
          Clear.theValueOf(AvatarMenu.newPasswordInput),
          Wait.for(Duration.ofSeconds(2)),
          Enter.theValue(password).into(AvatarMenu.newPasswordInput),
          Clear.theValueOf(AvatarMenu.confirmPasswordInput),
          Wait.for(Duration.ofSeconds(2)),
          Enter.theValue(password).into(AvatarMenu.confirmPasswordInput),
          Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.oKBtn, isClickable()),
          Click.on(AvatarMenu.oKBtn),
          Wait.for(Duration.ofSeconds(2)),
          Clear.theValueOf(LoginPage.usernameField),
          Enter.theValue(username).into(LoginPage.usernameField),
          Enter.theValue(password).into(LoginPage.passwordField),
          Click.on(LoginPage.loginButton)
        )
        .otherwise(Ensure.that(LoginPage.loginErrorText, not(isVisible())))
    )
};

export const LogIntoApplicationInvalidCredentials = {
  with: (username: string, password: string) =>
    Task.where(
      `#user logs into the application using invalid credentials`,
      Clear.theValueOf(LoginPage.usernameField),
      Enter.theValue(username).into(LoginPage.usernameField),
      Enter.theValue(password).into(LoginPage.passwordField),
      Click.on(LoginPage.loginButton)
    )
};
