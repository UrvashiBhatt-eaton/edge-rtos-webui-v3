import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class LicenseInformationPage {
  static licenseInformationNavTab = Target.the("License Information Navigation Tab").located(
    by.xpath("//*[@id='License_InformationItem']/div[2]/div")
  );

  static getlink = () => Target.all("link").located(by.tagName("a"));

  static linksIcon = Target.the("Links Icon on top of the Page").located(
    by.xpath("//span[text()='License Links']/../../div")
  );

  static licenseLinksHeaderText = Target.the("License Links Header on top of the Page").located(
    by.xpath("//span[text()='License Links']")
  );
}
