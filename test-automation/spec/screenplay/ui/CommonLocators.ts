import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class CommonLocators {
  static alertPopupHeader = (paramName: string) =>
    Target.the("Critical Change Alert popup header").located(by.xpath("//h2[text()='" + paramName + " Alert']"));

  static alertPopupContent = Target.the("Critical Change Alert popup content").located(
    by.xpath("//p[text()='Are you sure you want to continue this operation?']")
  );

  static yesBtn = Target.the("Yes button on the Critical Change Alert popup").located(
    by.xpath("//button[text()='Yes']")
  );

  static noBtn = Target.the("No button on the Critical Change Alert popup").located(by.xpath("//button[text()='No']"));

  static dropdownItem = (itemText: string) =>
    Target.the(itemText + " Option").located(by.xpath("//li[text()='" + itemText + "']"));

  static settingsNavTab = Target.the("Settings Navigation Tab").located(by.xpath("//*[@id='SettingsItem']"));

  static sectionCollapse = (sectionName) =>
    Target.the("Section: " + sectionName + " collapse").located(
      by.xpath("//div[contains(@class, 'settingCardHeader sectionHeader-" + sectionName + "')]")
    );
}
