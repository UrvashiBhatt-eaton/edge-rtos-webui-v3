import { Task, Duration } from "@serenity-js/core";
import { Click, Wait, isClickable, isVisible, Enter, Clear, Text, Hover, ExecuteScript } from "@serenity-js/protractor";
import { FirmwarePage } from "../ui/FirmwarePage";
import { Ensure, equals } from "@serenity-js/assertions";

export class Firmware_Tasks {
  static getValue = (target, inputvalue) =>
    Task.where(
      `#get value`,
      Wait.upTo(Duration.ofSeconds(9)).until(target, isVisible()),
      Wait.for(Duration.ofSeconds(10)),
      Ensure.that(Text.of(target), equals(inputvalue))
    );

  static setValue = (target, target2, inputvalue: string) => {
    return Task.where(
      `#Set Value`,
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(target),
      Clear.theValueOf(target),
      Enter.theValue(inputvalue).into(target),
      Hover.over(target),
      Hover.over(target2)
    );
  };

  static setAssignedNameInput = (assignedname: string) =>
    Firmware_Tasks.setValue(FirmwarePage.assignedNameInput, FirmwarePage.assignedNameCurrentValue, assignedname);

  static getAssignedName = (assignedname: string) =>
    Firmware_Tasks.getValue(FirmwarePage.assignedNameCurrentValue, assignedname);

  static clickDropdownFirmwareUpgradeMode = () =>
    Task.where(
      `#user clicks on dropdown for Firmware Upgrade Mode`,
      Wait.upTo(Duration.ofSeconds(20)).until(FirmwarePage.firmwareUpgradeModeInput, isClickable()),
      Click.on(FirmwarePage.firmwareUpgradeModeInput)
    );

  static getFirmwareUpgradeMode = (upgradeMode: string) =>
    Firmware_Tasks.getValue(FirmwarePage.firmwareUpgradeModeCurrentValue, upgradeMode);

  static uploadWebImage = (filepath: any) =>
    Task.where(
      `#user upload valid web image code pack`,
      Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.openCodepackBtn, isClickable()),
      Enter.theValue(filepath).into(FirmwarePage.openCodepackInput),
      Wait.for(Duration.ofMilliseconds(5000))
    );
}
