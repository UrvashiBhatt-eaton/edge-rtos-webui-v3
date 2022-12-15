import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class GeneralPage {
  static generalNavTab = Target.the("General Navigation Tab").located(by.xpath("//*[@id='PreferenceTab']"));

  static localeSectionHeader = Target.the("Locale section header").located(by.className("sectionHeader-Locale"));

  static sNTPOperationInput = Target.the("Input for SNTP Operation Enable").located(
    by.xpath("//span[text()='SNTP Operation Enable']/..//following-sibling::div")
  );

  static sNTPValue = Target.the("Seleted Value for SNTP Opration enable").located(
    by.xpath("(//span[text()='SNTP Operation Enable']/..//following-sibling::p)[1]")
  );

  static getSNTPServerInput = (serverNumber: number) =>
    Target.the("Input for SNTP Server " + serverNumber + " Field").located(
      by.xpath("//span[text()='SNTP server " + serverNumber + "']/../../div[2]/div/input")
    );

  static getSNTPServerValue = (serverNumber: number) =>
    Target.the("Value under SNTP Server " + serverNumber + " Field").located(
      by.xpath("//span[text()='SNTP server " + serverNumber + "']/../p")
    );

  static getSNTPErrorMessage = (errorText: string) =>
    Target.the("SNTP server error message").located(by.xpath("//p[text()='" + errorText + "']"));

  static editTimeBtn = Target.the("Edit Time Button").located(by.xpath("//span[text()='Edit Time']"));

  static useSystemTimeRadioBtn = Target.the("Use System Time Radio Button").located(
    by.css('input[value="systemDateAndTime"]')
  );
  static dateAndTimeDisplay = Target.the("Date and Time dispayed ").located(by.xpath("//span[text()='Set Time']/../p"));

  static dateAndTimeDisplayAtBottom = Target.the("Application Clock").located(by.id("applicationClock"));

  static dateAndTimeDisplayOnEditPopup = Target.the("Date and Time dispayed ").located(
    by.xpath(
      "//input[contains(@class, 'MuiOutlinedInput-input MuiInputBase-input Mui-disabled MuiInputBase-inputAdornedEnd')][@type='tel']"
    )
  );

  static selectManualTimeRadioBtn = Target.the("Select Manaul Time Radio Button").located(
    by.css('input[value="manualDateAndTime"]')
  );

  static calendarPickerIconBtn = Target.the("Calendar picker icon").located(
    by.xpath("//button[contains(@class, 'MuiIconButton-edgeEnd')]")
  );

  static saveTimeBtn = Target.the("Save button").located(by.xpath("//button[text()='Save']"));

  static calendarWidgetDay = () => {
    var d = new Date().getDate();
    if (d == 1) {
      d += 1;
    } else {
      d -= 1;
    }
    return Target.the("Day: " + d + " of the month").located(by.xpath("//button[text()='" + d + "']"));
  };

  static calendarDateTimeInputField = Target.the("Calendar date & time input field").located(
    by.css('input[type="tel"]')
  );

  static okTimeBtn = Target.the("OK button").located(by.xpath("//span[text()='Ok']"));

  static cancelTimeBtn = Target.the("Cancel button").located(by.xpath("//button[text()='Cancel']"));

  static timeZoneInput = Target.the("Input for Timezone").located(
    by.xpath("//span[text()='Timezone']/..//following-sibling::div/div")
  );

  static getAllTimeZones = Target.all("Available Timezones ").located(
    by.xpath("//ul[contains(@class, 'MuiList-root MuiList-padding MuiMenu-list')]/li")
  );

  static timeZoneItem = (timezone: string) =>
    Target.the("Click on " + timezone + " Option").located(by.xpath("//li[text()='" + timezone + "']"));

  static timeZoneCurrentValue = () =>
    Target.the("timezone Option displayed").located(by.xpath("//span[text()='Timezone']/../p"));

  static dateFormatInput = Target.the("Input for Date Format").located(
    by.xpath("//span[text()='Date Format']/..//following-sibling::div/div")
  );

  static dateFormatItem = (dateformat: string) =>
    Target.the("Date Format Option").located(by.xpath("//li[text()='" + dateformat + "']"));

  static dateFormatCurrentValue = () =>
    Target.the("Date Format Option displayed").located(by.xpath("//span[text()='Date Format']/../p"));

  static timeFormatInput = Target.the("Input for Time Format").located(
    by.xpath("//span[text()='Time Format']/..//following-sibling::div/div")
  );

  static timeFormatItem = (timeformat: string) =>
    Target.the("Time Format Option").located(by.xpath("//li[text()='" + timeformat + "']"));

  static timeFormatCurrentValue = () =>
    Target.the("Time Format Option displayed").located(by.xpath("//span[text()='Time Format']/../p"));

  static rebootOrResetDeviceInput = Target.the("Input for Reboot or Reset Device").located(
    by.xpath("//span[text()='Reboot or Reset Device']/..//following-sibling::div/div")
  );

  static rebootDeviceItem = Target.the("Select Reboot Device Option").located(by.xpath("//li[text()='Reboot Device']"));

  static factoryResetItem = Target.the("Select Factory Reset Option").located(by.xpath("//li[text()='Factory Reset']"));

  static okBtn = Target.the("OK Button").located(by.css("span:contains(^Ok$)"));

  static rebootDeviceAlertHeader = Target.the("Reboot Device Alert Header Text").located(
    by.xpath("//h2[text()='Reboot Device Alert']")
  );

  static factoryResetAlertHeader = Target.the("Factory Reset Alert Header Text").located(
    by.xpath("//h2[text()='Factory Reset Alert']")
  );

  static cancelPopupCrossMark = Target.the("Cancel Pop up Cross Mark").located(by.xpath("//button[text()='No']"));

  static textOnPopUp = Target.the(" text on the pop up").located(
    by.xpath("//p[text()='Are you sure you want to continue this operation?']")
  );

  static userAccountInactivityTimeoutInput = Target.the("Input for User account Inactivity timeout").located(
    by.xpath("(//span[text()='User account Inactivity timeout']/../following::div/div/input)[1]")
  );

  static userAccountInactivityTimeoutInputText = Target.the("Input for User account Inactivity timeout").located(
    by.xpath("(//span[text()='User account Inactivity timeout']/../following::div/div//div/p)[1]")
  );

  static accountInactivityTimeoutCurrentValue = () =>
    Target.the("User account Inactivity timeout Value displayed").located(
      by.xpath("//span[text()='User account Inactivity timeout']/../p")
    );

  static errorMsgAccountInactivityTimeout = () =>
    Target.the("Error Message displayed").located(
      by.xpath("(//span[text()='User account Inactivity timeout']/../following::div/p)[2]")
    );

  static maximumConcurrentSessionsInput = Target.the("Input for Maximum Concurrent Sessions").located(
    by.xpath("(//span[text()='Maximum Concurrent Sessions']/../following::div/div/input)[1]")
  );

  static maximumConcurrentSessionsInputText = Target.the("Input for Maximum Concurrent Sessions").located(
    by.xpath("(//span[text()='Maximum Concurrent Sessions']/../following::div/div//div/p)[1]")
  );

  static maximumConcurrentSessionsCurrentValue = () =>
    Target.the("Maximum Concurrent Sessions Value displayed").located(
      by.xpath("//span[text()='Maximum Concurrent Sessions']/../p")
    );

  static errorMsgMaximumConcurrentSessions = () =>
    Target.the("Error Message displayed").located(
      by.xpath("(//span[text()='Maximum Concurrent Sessions']/../following::div/p)[2]")
    );

  static userAbsoluteTimeoutInput = Target.the("Input for User Absolute Timeout").located(
    by.xpath("(//span[text()='User Absolute Timeout']/../following::div/div/input)[1]")
  );

  static userAbsoluteTimeoutInputText = Target.the("Input for User Absolute Timeout").located(
    by.xpath("(//span[text()='User Absolute Timeout']/../following::div/div//div/p)[1]")
  );

  static userAbsoluteTimeoutCurrentValue = () =>
    Target.the("User Absolute Timeout Value displayed").located(
      by.xpath("//span[text()='User Absolute Timeout']/../p")
    );

  static errorMsgUserAbsoluteTimeout = () =>
    Target.the("Error Message displayed").located(
      by.xpath("(//span[text()='User Absolute Timeout']/../following::div/p)[2]")
    );

  static userLockTimeInput = Target.the("Input for User Lock Time").located(
    by.xpath("(//span[text()='User Lock Time']/../following::div/div/input)[1]")
  );

  static userLockTimeInputText = Target.the("Input for User Lock Time").located(
    by.xpath("(//span[text()='User Lock Time']/../following::div/div//div/p)[1]")
  );

  static userLockTimeCurrentValue = () =>
    Target.the("User Lock Time Value displayed").located(by.xpath("//span[text()='User Lock Time']/../p"));

  static errorMsgUserLockTime = () =>
    Target.the("Error Message displayed").located(by.xpath("(//span[text()='User Lock Time']/../following::div/p)[2]"));

  static maximumFailedLoginAttemptsInput = Target.the("Input for Maximum Failed Login Attempts").located(
    by.xpath("(//span[text()='Maximum Failed Login Attempts']/../following::div/div/input)[1]")
  );

  static maximumFailedLoginAttemptsInputText = Target.the("Input for Maximum Failed Login Attempts").located(
    by.xpath("(//span[text()='Maximum Failed Login Attempts']/../following::div/div//div/p)[1]")
  );

  static maximumFailedLoginAttemptsCurrentValue = () =>
    Target.the("Maximum Failed Login Attempts Value displayed").located(
      by.xpath("//span[text()='Maximum Failed Login Attempts']/../p")
    );

  static errorMsgMaximumFailedLoginAttempts = () =>
    Target.the("Error Message displayed").located(
      by.xpath("(//span[text()='Maximum Failed Login Attempts']/../following::div/p)[2]")
    );
}
