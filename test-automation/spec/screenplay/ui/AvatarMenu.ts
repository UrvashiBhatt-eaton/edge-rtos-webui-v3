import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class AvatarMenu {
  static avatarNav = Target.the("Avatar").located(by.css("#userMenu"));

  static changePasswordNav = Target.the("Change Password item").located(by.css("#changePasswordItem"));

  static userNameOnLoginHistory = Target.the("User Name on Login History").located(
    by.xpath("//label[text()='Username']/../div/input")
  );

  static currentPasswordInput = Target.the("Current Password Input").located(
    by.xpath("//label[text()='Current Password']/../div/input")
  );

  static newPasswordInput = Target.the("New Password Input").located(
    by.xpath("//label[text()='New Password']/../div/input")
  );

  static confirmPasswordInput = Target.the("Confirm Password Input").located(
    by.xpath("//label[text()='Confirm Password']/../div/input")
  );

  static cancelBtn = Target.the("Cancel button").located(
    by.xpath('//button[contains(@class, "MuiButton-outlinedSizeMedium")]')
  );

  static oKBtn = Target.the("OK button").located(
    by.xpath('//button[contains(@class, "MuiButton-containedSizeMedium")]')
  );

  static loginHistoryNav = Target.the("Login History item").located(by.css("#loginHistoryItem"));

  static getLastLogin = Target.the("Last Login").located(by.xpath("//label[text()='Last Login']/../div/input"));

  static getFailedAttempts = Target.the("Number of Failed Attempts").located(
    by.xpath("//label[text()='Failed Attempts']/../div/input")
  );

  static languageNav = Target.the("Language item").located(by.css("#languageItem"));

  static logoutNav = Target.the("Log Out item").located(by.css("#logOutItem"));

  static importExportNav = Target.the("Import/Export item").located(by.css("#importExportItem"));

  static exportBtn = Target.the("Export button").located(by.css("#exportBtn"));

  static checkFileContent = () => {
    let result = 0;
    let fs = require("fs");
    let fileData = fs.readFileSync("./tempDownload/config.json", "utf8");
    var parsedData = JSON.parse(fileData);
    if (Array.isArray(parsedData)) {
      result = parsedData.length;
    }
    return result;
  };

  static importBtn = Target.the("Import button").located(by.css("#importBtn"));

  static uploadConfigFileBtn = Target.the("Import configuration file Input").located(by.css("#fileChooser"));

  static importAlertPopupContent = Target.the("Import Alert popup content").located(
    by.xpath(
      "//span[text()='The following parameters were not imported. The likely cause is invalid or out of range data values or write permission.']"
    )
  );

  static importAlertPopupIncorrectFile = Target.the("Alert for selecting incorrect config file type").located(
    by.xpath("//span[text()='Please select the correct file type and try again.']")
  );

  static importAlertPopupInvalidFile = Target.the("Alert for selecting incorrect formatted config file").located(
    by.xpath("//span[text()='Invalid file format.']")
  );
}
