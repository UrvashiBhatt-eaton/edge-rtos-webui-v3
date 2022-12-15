import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class UserManagementPage {
  static userManagementNavTab = Target.the("User Management").located(by.xpath("//*[@id='User_ManagementTab']"));

  static addUserButton = Target.the('"Add" button').located(by.css('button[value="addUser"]'));

  static fullnameField = Target.the("fullusername input").located(by.id("fullname"));

  static usernameField = Target.the("username input").located(by.id("userName"));

  static passwordComplexityDropdownButton = Target.the("password Complexity").located(
    by.xpath('//*[@id="passwordComplexity"]')
  );

  static passwordTimeoutdaysField = Target.the("passwordtimeoutdays input").located(by.css("#pwdTimeout"));

  static newPasswordField = Target.the("newpassword input").located(by.id("pwd"));

  static confirmPasswordField = Target.the("confirmpassword input").located(by.id("confirmPwd"));

  static loggedInPasswordField = Target.the("loggedinpassword input").located(by.id("loggedInUserPwd"));

  static userRoleDropdownButton = Target.the("user role").located(by.xpath('//*[@id="userRole"]'));

  static saveUserDialogButton = Target.the('"Save" button').located(by.buttonText("Save"));

  static cancelButton = Target.the('"Cancel" button').located(by.buttonText("Cancel"));

  static okButton = Target.the('"Ok" button').located(by.buttonText("Ok"));

  static errorMsg = function (message) {
    const errortext = Target.the('"Error" message').located(by.xpath("//span[text()='" + message + "']"));
    return errortext;
  };

  static pwdComplexity = function (option) {
    let optionVal = Number(option);
    const pwdRequirement = Target.all("pwd requirement").located(
      by.xpath('//*[@id="pwdComplexity_' + optionVal + '"' + "]")
    );
    return pwdRequirement;
  };

  static resetUserDialogButton = Target.the('"Reset Dialog" button').located(by.id("resetDialogBtn"));

  static resetButton = Target.the('"Reset" button').located(by.id("resetBtn"));

  static resetAllUserAccountsOption = Target.the("reset option2").located(by.id("allUserAccountsMenuItem"));

  static resetDefaultAdminAccountOption = Target.the("reset option1").located(by.id("defaultAdminAccountMenuItem"));

  static resetActionDropdownButton = Target.the("select reset option ").located(by.id("resetActionDropdownBtn"));

  static passwordComplexitySelectOption = function (option) {
    let optionVal = Number(option) + 1;
    const selection = Target.the("Select option").located(by.xpath('//*[@id="menu-"]/div[3]/ul/li[' + optionVal + "]"));
    return selection;
  };

  static findUserToDelete = function (username) {
    const text = Target.the("User to be deleted").located(by.id(username + "_delete"));
    return text;
  };

  static findUserToEdit = function (username) {
    const text = Target.the("User to be edited").located(by.id(username + "_edit"));
    return text;
  };

  static roleSelectOption = function (option) {
    let optionVal;
    switch (option) {
      case "Admin":
        optionVal = 1;
        break;
      case "Engineer":
        optionVal = 2;
        break;
      case "Operator":
        optionVal = 3;
        break;
      case "Viewer":
        optionVal = 4;
        break;
    }
    const selection = Target.the("Select option").located(by.xpath('//*[@id="menu-"]/div[3]/ul/li[' + optionVal + "]"));
    return selection;
  };

  static findUsernameInTable = (username) => Target.the("Username in the table").located(by.id(username + "_un"));

  static findFullnameInTable = (username) => Target.the("Fullname in the table").located(by.id(username + "_fn"));

  static findRoleInTable = (username) => Target.the("Role in the table").located(by.id(username + "_ro"));

  static tableHeaderFullname = Target.the("Fullname in the Table header").located(by.css("#umFullname"));

  static yesBtn = Target.the("Yes button on the Session Expired popup").located(by.buttonText("Yes"));

  static allUserCount = Target.all("Rows present in the user management table").located(
    by.className("MuiTableRow-root userManagementRow")
  );

  static changePwdPopupHeader = Target.the("Change Password popup header").located(
    by.xpath("//h6[text()='Change Password']")
  );

  static sessionExpiredPopupHeader = Target.the("Session Expired popup header").located(
    by.xpath("//h2[text()='Session Expired']")
  );
}
