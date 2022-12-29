import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class ForceChangePasswordDialog {
  static currentPasswordField = Target.the("currrentPassword input").located(by.css('input[name="currPassword"]'));

  static newPasswordField = Target.the("newPassword input").located(by.css('input[name="newPassword"]'));

  static confirmPasswordField = Target.the("confirmPassword input").located(by.css('input[name="confirmPassword"]'));

  static okButton = Target.the('"Ok" button').located(by.css('button[type="submit"]'));
}
