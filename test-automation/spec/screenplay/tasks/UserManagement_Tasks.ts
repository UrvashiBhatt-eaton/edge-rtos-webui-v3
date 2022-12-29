import { Task } from "@serenity-js/core";
import { Enter, Click, Clear } from "@serenity-js/protractor";
import { UserManagementPage } from "../ui/UserManagementPage";

export class UserManagement_Tasks {
  static createNewUser = (
    fullName: string,
    userName: string,
    passwordComplexity: number,
    passwordTimeoutDays: string,
    newPassword: string,
    confirmPassword: string,
    role: string
  ) =>
    Task.where(
      `#user creating the new user`,
      Enter.theValue(fullName).into(UserManagementPage.fullnameField),
      Enter.theValue(userName).into(UserManagementPage.usernameField),
      Click.on(UserManagementPage.passwordComplexityDropdownButton),
      Click.on(UserManagementPage.passwordComplexitySelectOption(passwordComplexity)),
      Enter.theValue(passwordTimeoutDays).into(UserManagementPage.passwordTimeoutdaysField),
      Enter.theValue(newPassword).into(UserManagementPage.newPasswordField),
      Enter.theValue(confirmPassword).into(UserManagementPage.confirmPasswordField),
      Click.on(UserManagementPage.userRoleDropdownButton),
      Click.on(UserManagementPage.roleSelectOption(role))
    );

  static editUser = {
    with: (
      fullName: string,
      passwordComplexity: number,
      passwordTimeoutDays: string,
      currentPassword: string,
      newPassword: string,
      confirmPassword: string,
      role: string
    ) =>
      Task.where(
        `#user edits the admin user information`,
        Clear.theValueOf(UserManagementPage.fullnameField),
        Enter.theValue(fullName).into(UserManagementPage.fullnameField),
        Click.on(UserManagementPage.passwordComplexityDropdownButton),
        Click.on(UserManagementPage.passwordComplexitySelectOption(passwordComplexity)),
        Clear.theValueOf(UserManagementPage.passwordTimeoutdaysField),
        Enter.theValue(passwordTimeoutDays).into(UserManagementPage.passwordTimeoutdaysField),
        Enter.theValue(currentPassword).into(UserManagementPage.loggedInPasswordField),
        Enter.theValue(newPassword).into(UserManagementPage.newPasswordField),
        Enter.theValue(confirmPassword).into(UserManagementPage.confirmPasswordField),
        Click.on(UserManagementPage.userRoleDropdownButton),
        Click.on(UserManagementPage.roleSelectOption(role))
      ),
    nonAdmin: (passwordTimeoutDays: string, currentPassword: string, newPassword: string, confirmPassword: string) =>
      Task.where(
        `#user edits the non admin user information`,
        Clear.theValueOf(UserManagementPage.passwordTimeoutdaysField),
        Enter.theValue(passwordTimeoutDays).into(UserManagementPage.passwordTimeoutdaysField),
        Enter.theValue(currentPassword).into(UserManagementPage.loggedInPasswordField),
        Enter.theValue(newPassword).into(UserManagementPage.newPasswordField),
        Enter.theValue(confirmPassword).into(UserManagementPage.confirmPasswordField)
      ),

    updateInvalidPwd: (invalidPassword: string, newPassword: string) =>
      Task.where(
        `#user enters the invalid credentails`,
        Enter.theValue(invalidPassword).into(UserManagementPage.loggedInPasswordField),
        Enter.theValue(newPassword).into(UserManagementPage.newPasswordField),
        Enter.theValue(newPassword).into(UserManagementPage.confirmPasswordField)
      ),

    selectUserRole: (role: string) =>
      Task.where(
        `#user clicks on the dropdown to select the user role`,
        Click.on(UserManagementPage.userRoleDropdownButton),
        Click.on(UserManagementPage.roleSelectOption(role))
      ),
    closeEditDrawer: () => Task.where(`#user clicks on the cancel button`, Click.on(UserManagementPage.cancelButton)),
    closeErrorPopUp: () => Task.where(`#user clicks on the ok button`, Click.on(UserManagementPage.okButton))
  };

  static resetDeviceUserSettings = {
    with: (loggedUserPassword: string, resetOption: string) =>
      Task.where(
        `#user resets the user's account`,
        Enter.theValue(loggedUserPassword).into(UserManagementPage.loggedInPasswordField),
        Click.on(UserManagementPage.resetActionDropdownButton),
        UserManagement_Tasks.resetOptionSelection(resetOption)
      )
  };

  static resetOptionSelection = (resetOption) => {
    if (resetOption == "default admin account") {
      return Click.on(UserManagementPage.resetDefaultAdminAccountOption);
    } else if (resetOption == "all user accounts") {
      return Click.on(UserManagementPage.resetAllUserAccountsOption);
    }
  };
}
