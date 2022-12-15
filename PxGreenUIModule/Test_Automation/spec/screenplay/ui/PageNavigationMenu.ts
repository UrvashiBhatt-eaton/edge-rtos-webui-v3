import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class PageNavigationMenu {
  static copyrightDisclaimerText = Target.the("Copyright Disclaimer").located(by.css("#copyrightDisclaimer"));
  static pageNavigationMenuBar = Target.the("Page Navigation Menu Hamburger").located(by.css("#User_ManagementItem"));
}
