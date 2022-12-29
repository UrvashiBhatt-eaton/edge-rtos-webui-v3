import { contain } from "@serenity-js/assertions";
import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class FirmwarePage {
  static firmwareNavTab = Target.the("Firmware Navigation Tab").located(by.xpath("//*[@id='FirmwareTab']"));

  static openCodepackBtn = Target.the("Open Codepack button").located(by.css("#fwOpenCodepackBtn"));

  static serialNumberCurrentValue = Target.the("Serial Number Value displayed").located(
    by.xpath("//span[text()='Serial Number']/../p")
  );

  static productCodeCurrentValue = Target.the("Product Code displayed").located(
    by.xpath("//span[text()='Product Code']/../p")
  );

  static productNameCurrentValue = Target.the("Product Name Value displayed").located(
    by.xpath("//span[text()='Product Name']/../p")
  );

  static modelNameCurrentValue = Target.the("Model Name Value displayed").located(
    by.xpath("//span[text()='Model Name']/../p")
  );

  static assignedNameInput = Target.the("Input for Assigned Name").located(
    by.xpath("(//span[text()='Assigned Name']/../following::div/div/input)[1]")
  );

  static assignedNameCurrentValue = Target.the("Assigned Name Value displayed").located(
    by.xpath("//span[text()='Assigned Name']/../p")
  );

  static firmwareUpgradeModeInput = Target.the("Input for Firmware Upgrade Mode").located(
    by.xpath("//span[text()='Firmware Upgrade Mode']/..//following-sibling::div/div")
  );

  static alertPopupHeader = (upgradeMode: string) =>
    Target.the("Critical Change Alert popup").located(by.xpath("//h2[text()='" + upgradeMode + " Alert']"));

  static alertPopupContent = Target.the("Critical Change Alert popup content").located(
    by.xpath("//p[text()='Are you sure you want to continue this operation?']")
  );

  static yesBtn = Target.the("Yes button on the Critical Change Alert popup").located(by.xpath("//span[text()='Yes']"));

  static firmwareUpgradeModeCurrentValue = Target.the("Firmware Upgrade Mode Option displayed").located(
    by.xpath("//span[text()='Firmware Upgrade Mode']/../p")
  );

  //Firmware upgrade
  static openCodepackInput = Target.the("Open Codepack button Input").located(by.css("#fileChooser"));

  static endUserLicenseAgreementPopUpHeader = Target.the("Header Text for End User License Agreement").located(
    by.xpath("//h6[text()='End User License Agreement']")
  );

  static iAgreeRadioBtn = Target.the("I Agree radio button").located(by.xpath("//input[@value='agree']"));

  static cancelBtn = Target.the("Cancel button on the pop up").located(by.xpath("//button[text()='Cancel']"));

  static acceptBtn = Target.the("Accept button on the pop up").located(by.xpath("//button[text()='Accept']"));

  static firmwareUpdatePopUpHeader = Target.the("Header Text for Firmware Update").located(
    by.xpath("//h6[text()='Firmware Update']")
  );

  static selectComponentBtn = Target.the("Select Component button on the pop up").located(
    by.xpath("//button[text()='Select Component']")
  );

  static installUpdatesBtn = Target.the("Install Updates button on the pop up").located(
    by.xpath("//button[text()='Install Updates']")
  );

  static firmwareCodePackEvaluationPopUpHeader = Target.the("Header Text for Firmware / Code Pack Evaluation").located(
    by.xpath("//h6[text()='Firmware / Code Pack Evaluation']")
  );

  static rTKWEBIMAGECheckbox = Target.the("Check box for RTK_WEB_IMAGE on the pop up").located(
    by.xpath("//td[text()='RTK_WEB_IMAGE']/..//input")
  );

  static rTOSTOOLKITCheckbox = Target.the("Check box for RTOS TOOL KIT on the pop up").located(
    by.xpath("//td[text()='RTOS TOOL KIT']/..//input")
  );

  static rTKLANGUAGEIMAGECheckbox = Target.the("Check box for RTK LANGUAGE IMAGE on the pop up").located(
    by.xpath("//td[text()='RTK LANGUAGE IMAGE']/..//input")
  );

  static oKBtn = Target.the("OK button on the pop up").located(by.xpath("//button[text()='OK']"));

  static abortBtn = Target.the("Abort button on the pop up").located(by.xpath("//button[text()='Abort']"));

  static continueBtn = Target.the("Continue button on the pop up").located(by.xpath("//button[text()='Continue']"));

  static invalidProductTextOnPopUp = Target.the("Invalid Product text on Alert").located(
    by.xpath("//span[text()='Invalid Product']")
  );

  static oKBtnOnAlert = Target.the("Ok button on Alert").located(by.xpath("//button[text()='Ok']"));

  static tickmarkAfterSuccessfulupgrade = Target.the("Tickmark after successful upgrade").located(by.id("successTick"));

  static reloadBtnOnAlert = Target.the("Reload button on Alert").located(by.xpath("//button[text()='Reload']"));

  static pleaseSelecttheCorrectFileTypeandTryTextOnPopUp = Target.the(
    "Please select the correct file type and try again text on Alert"
  ).located(by.xpath("//span[text()='Please select the correct file type and try again.']"));

  static codepackIntegrityCheckHasFailed = Target.the("Codepack integrity check has failed text on pop up").located(
    by.xpath("//div[text()='Codepack integrity check has failed.']")
  );

  static finalintegritycheckisInvalid = Target.the("Final integrity check is Invalid text on pop up").located(
    by.xpath("//div[text()='Final integrity check is Invalid.']")
  );

  static firmwareUpgradeIsAborted = Target.the("Firmware upgrade is aborted text on pop up").located(
    by.xpath("//div[text()='Firmware upgrade is aborted.']")
  );
}
