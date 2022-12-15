import { Task, Duration } from "@serenity-js/core";
import {
  Click,
  Wait,
  isClickable,
  isVisible,
  Enter,
  Clear,
  Text,
  isSelected,
  Hover,
  ExecuteScript
} from "@serenity-js/protractor";
import { GeneralPage } from "../ui/GeneralPage";
import { Ensure, equals, endsWith } from "@serenity-js/assertions";
import { by, Key } from "protractor";
import { AvatarMenu } from "../ui/AvatarMenu";

export class General_Tasks {
  static clickDropdownSetSNTPOperationEnable = () =>
    Task.where(
      `#user click on dropdown for Set SNTP Operation Enable`,
      Wait.upTo(Duration.ofSeconds(12)).until(GeneralPage.sNTPOperationInput, isClickable()),
      Click.on(GeneralPage.sNTPOperationInput)
    );

  static setServerAddress = (serverAddress: string, serverNumber: number) => {
    return Task.where(
      `#Enter server Address`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.getSNTPServerValue(serverNumber), isVisible()),
      Clear.theValueOf(GeneralPage.getSNTPServerInput(serverNumber)),
      Enter.theValue(serverAddress).into(GeneralPage.getSNTPServerInput(serverNumber)),
      Hover.over(GeneralPage.getSNTPServerInput(serverNumber)),
      Hover.over(AvatarMenu.avatarNav)
    );
  };

  static getServerAddress = (serverAddress: string, serverNumber: number) => {
    return Task.where(
      `#Get server Address`,
      Wait.for(Duration.ofSeconds(10)),
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.getSNTPServerValue(serverNumber), isVisible()),
      Ensure.that(Text.of(GeneralPage.getSNTPServerValue(serverNumber)), equals(serverAddress))
    );
  };

  static setManualDateandTime = () => {
    return Task.where(
      `#Enter Date and Time Manually`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.selectManualTimeRadioBtn, isSelected()),
      Click.on(GeneralPage.calendarPickerIconBtn),
      Click.on(GeneralPage.calendarWidgetDay()),
      Click.on(GeneralPage.calendarDateTimeInputField)
    );
  };

  static clickRebootOrResetDevice = () =>
    Task.where(
      `#user click on dropdown for Reboot or Reset Device`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.rebootOrResetDeviceInput, isClickable()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(GeneralPage.rebootOrResetDeviceInput),
      Click.on(GeneralPage.rebootOrResetDeviceInput)
    );

  static setTimezone = (timezone: string) => {
    return Task.where(
      `#Set Timezone`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.timeZoneItem(timezone), isVisible()),
      Click.on(GeneralPage.timeZoneItem(timezone))
    );
  };

  static getTimezoneUnderTimezoneField = (timezone: string) => {
    return Task.where(
      `#Get Timezone value under Timezone field`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.timeZoneCurrentValue(), isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(GeneralPage.timeZoneCurrentValue()), equals(timezone))
    );
  };

  static getTimezoneOnCornerBottom = (timezone: string) => {
    return Task.where(
      `#Get Timezone value displayed right side corner bottom`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.dateAndTimeDisplayAtBottom, isVisible()),
      Ensure.that(Text.of(GeneralPage.dateAndTimeDisplayAtBottom), endsWith(timezone))
    );
  };

  static setDateFormat = (dateFormat: string) => {
    return Task.where(
      `#Set Date Format`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.dateFormatItem(dateFormat), isVisible()),
      Click.on(GeneralPage.dateFormatItem(dateFormat))
    );
  };

  static getdateFormatUnderDateFormatField = (dateFormat: string) => {
    return Task.where(
      `#Get date format value under Date Format field`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.dateFormatCurrentValue(), isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(GeneralPage.dateFormatCurrentValue()), equals(dateFormat))
    );
  };

  static getdateFormatOnCornerBottom = () => {
    return Task.where(
      `#Get Date format displayed right side corner bottom`,
      Wait.upTo(Duration.ofSeconds(12)).until(GeneralPage.dateAndTimeDisplayAtBottom, isVisible())
    );
  };

  static setTimeFormat = (timeFormat: string) => {
    return Task.where(
      `#Set Time Format`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.timeFormatItem(timeFormat), isVisible()),
      Click.on(GeneralPage.timeFormatItem(timeFormat))
    );
  };

  static getTimeFormatUnderTimeFormatField = (timeFormat: string) => {
    return Task.where(
      `#Get time format value under Time Format field`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.timeFormatCurrentValue(), isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(GeneralPage.timeFormatCurrentValue()), equals(timeFormat))
    );
  };

  static getTimeFormatOnCornerBottom = () => {
    return Task.where(
      `#Get time format displayed right side corner bottom`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.dateAndTimeDisplayAtBottom, isVisible())
    );
  };

  static setAccountInactivityTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Set Account Inactivity Timeout`,
      Wait.for(Duration.ofMilliseconds(5000)),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(
        GeneralPage.userAccountInactivityTimeoutInput
      ),
      Wait.upTo(Duration.ofSeconds(15)).until(GeneralPage.userAccountInactivityTimeoutInput, isVisible()),
      Clear.theValueOf(GeneralPage.userAccountInactivityTimeoutInput),
      Enter.theValue(timeoutvalue + Key.TAB).into(GeneralPage.userAccountInactivityTimeoutInput),
      Hover.over(GeneralPage.userAccountInactivityTimeoutInputText),
      Hover.over(GeneralPage.userAccountInactivityTimeoutInput)
    );
  };

  static getAccountInactivityTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Get Account Inactivity Timeout under User Account Inactivity Timeout field`,
      Wait.upTo(Duration.ofSeconds(15)).until(GeneralPage.accountInactivityTimeoutCurrentValue(), isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(GeneralPage.accountInactivityTimeoutCurrentValue()), equals(timeoutvalue + " Seconds"))
    );
  };

  static setMaximumConcurrentSessions = (numberofconcurrentsessions: number) => {
    return Task.where(
      `#Set Maximum Concurrent Sessions`,
      Wait.for(Duration.ofSeconds(10)),
      Wait.upTo(Duration.ofSeconds(10)).until(GeneralPage.maximumConcurrentSessionsInput, isVisible()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(
        GeneralPage.maximumConcurrentSessionsInput
      ),
      Clear.theValueOf(GeneralPage.maximumConcurrentSessionsInput),
      Enter.theValue(numberofconcurrentsessions).into(GeneralPage.maximumConcurrentSessionsInput),
      Hover.over(GeneralPage.maximumConcurrentSessionsInput),
      Hover.over(GeneralPage.maximumConcurrentSessionsInputText)
    );
  };

  static getMaximumConcurrentSessions = (numberofconcurrentsessions: number) => {
    return Task.where(
      `#Get value of Maximum Concurrent Sessions under Maximum Concurrent Sessions field`,
      Wait.for(Duration.ofSeconds(12)),
      Wait.upTo(Duration.ofSeconds(10)).until(GeneralPage.maximumConcurrentSessionsCurrentValue(), isVisible()),
      Ensure.that(
        Text.of(GeneralPage.maximumConcurrentSessionsCurrentValue()),
        equals(numberofconcurrentsessions.toString())
      )
    );
  };

  static setUserAbsoluteTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Set User Absolute Timeout`,
      Wait.upTo(Duration.ofSeconds(20)).until(GeneralPage.userAbsoluteTimeoutInput, isVisible()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(GeneralPage.userAbsoluteTimeoutInput),
      Clear.theValueOf(GeneralPage.userAbsoluteTimeoutInput),
      Enter.theValue(timeoutvalue).into(GeneralPage.userAbsoluteTimeoutInput),
      Hover.over(GeneralPage.userAbsoluteTimeoutInputText),
      Hover.over(GeneralPage.userAbsoluteTimeoutInput)
    );
  };

  static getUserAbsoluteTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Get value of User Absolute Timeout under User Absolute Timeout field`,
      Wait.upTo(Duration.ofSeconds(15)).until(GeneralPage.userAbsoluteTimeoutCurrentValue(), isVisible()),
      Wait.for(Duration.ofSeconds(12)),
      Ensure.that(Text.of(GeneralPage.userAbsoluteTimeoutCurrentValue()), equals(timeoutvalue + " Seconds"))
    );
  };

  static setUserLockTime = (locktimevalue: number) => {
    return Task.where(
      `#Set User Lock Time`,
      Wait.for(Duration.ofMilliseconds(5000)),
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.userLockTimeInput, isVisible()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(GeneralPage.userLockTimeInput),
      Clear.theValueOf(GeneralPage.userLockTimeInput),
      Enter.theValue(locktimevalue + Key.TAB).into(GeneralPage.userLockTimeInput),
      Hover.over(GeneralPage.userLockTimeInputText),
      Hover.over(GeneralPage.userLockTimeInput)
    );
  };

  static getUserLockTime = (locktimevalue: number) => {
    return Task.where(
      `#Get value of User Lock Time under User Lock Time field`,
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.userLockTimeCurrentValue(), isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(GeneralPage.userLockTimeCurrentValue()), equals(locktimevalue + " Seconds"))
    );
  };

  static setMaximumFailedLoginAttempts = (numoffailedattempts: number) => {
    return Task.where(
      `#Set Maximum Failed Login Attempts`,
      Wait.upTo(Duration.ofSeconds(15)).until(GeneralPage.maximumFailedLoginAttemptsInput, isVisible()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(
        GeneralPage.maximumFailedLoginAttemptsInput
      ),
      Clear.theValueOf(GeneralPage.maximumFailedLoginAttemptsInput),
      Enter.theValue(numoffailedattempts).into(GeneralPage.maximumFailedLoginAttemptsInput),
      Hover.over(GeneralPage.maximumFailedLoginAttemptsInput),
      Hover.over(GeneralPage.maximumFailedLoginAttemptsInputText)
    );
  };

  static getMaximumFailedLoginAttempts = (numoffailedattempts: number) => {
    return Task.where(
      `#Get value of Maximum Failed Login Attempts under Maximum Failed Login Attempts field`,
      Wait.for(Duration.ofSeconds(12)),
      Wait.upTo(Duration.ofSeconds(10)).until(GeneralPage.maximumFailedLoginAttemptsCurrentValue(), isVisible()),
      Ensure.that(Text.of(GeneralPage.maximumFailedLoginAttemptsCurrentValue()), equals(numoffailedattempts.toString()))
    );
  };
}
