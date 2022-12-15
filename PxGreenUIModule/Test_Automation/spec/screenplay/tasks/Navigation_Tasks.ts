import { Task, Duration } from "@serenity-js/core";
import { Click, Wait, isClickable, Target, isVisible } from "@serenity-js/protractor";
import { AvatarMenu } from "../ui/AvatarMenu";
import { GeneralPage } from "../ui/GeneralPage";
import { CommonLocators } from "../ui/CommonLocators";
import { NetworkPage } from "../ui/NetworkPage";
import { FirmwarePage } from "../ui/FirmwarePage";
import { UserManagementPage } from "../ui/UserManagementPage";
import { LicenseInformationPage } from "../ui/LicenseInformationPage";
import { PageNavigationMenu } from "../ui/PageNavigationMenu";
import { LogsPage } from "../ui/LogsPage";
import { by } from "protractor";

export class Navigation_Tasks {
  static NavigationToUserAvatarMenu = () =>
    Task.where(
      `#user navigates to user menu`,
      Wait.for(Duration.ofSeconds(5)),
      Wait.upTo(Duration.ofSeconds(4)).until(AvatarMenu.avatarNav, isClickable()),
      Click.on(AvatarMenu.avatarNav),
      Wait.upTo(Duration.ofSeconds(4)).until(AvatarMenu.loginHistoryNav, isVisible())
    );

  static NavigationToPageNavigationMenu = () =>
    Task.where(
      `#user navigates to page navigation menu`,
      Wait.for(Duration.ofSeconds(5)),
      Click.on(Target.the("Browser").located(by.xpath("//html/body"))),
      Click.on(
        Target.the("Drawer").located(by.xpath('//*[@id="root"]/div[2]/div/div[1]/div/div/div/div[1]/div[1]/button'))
      ),
      Wait.upTo(Duration.ofSeconds(4)).until(PageNavigationMenu.copyrightDisclaimerText, isVisible())
    );

  static NavigationToGeneralPage = () =>
    Task.where(
      `#user clicks on the settings tab and navigates to general page`,
      Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.settingsNavTab, isVisible()),
      Click.on(CommonLocators.settingsNavTab),
      Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.generalNavTab, isClickable()),
      Click.on(GeneralPage.generalNavTab)
    );

  static NavigationToFirmwarePage = () =>
    Task.where(
      `#user clicks on the settings tab and navigates to firmware page`,
      Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.settingsNavTab, isVisible()),
      Click.on(CommonLocators.settingsNavTab),
      Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.firmwareNavTab, isClickable()),
      Click.on(FirmwarePage.firmwareNavTab)
    );

  static NavigationToUserManagementPage = () =>
    Task.where(
      `#user clicks on the settings tab and navigates to user management page`,
      Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.settingsNavTab, isVisible()),
      Click.on(CommonLocators.settingsNavTab),
      Wait.upTo(Duration.ofSeconds(9)).until(UserManagementPage.userManagementNavTab, isClickable()),
      Click.on(UserManagementPage.userManagementNavTab),
      Wait.upTo(Duration.ofSeconds(9)).until(UserManagementPage.tableHeaderFullname, isVisible())
    );

  static NavigationToLicenseInformationPage = () =>
    Task.where(
      `#user navigates to license information page`,
      Wait.upTo(Duration.ofSeconds(4)).until(LicenseInformationPage.licenseInformationNavTab, isClickable()),
      Click.on(LicenseInformationPage.licenseInformationNavTab)
    );

  static NavigationToNetworkPage = () =>
    Task.where(
      `#user clicks on the settings tab and navigates to network page`,
      Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.settingsNavTab, isVisible()),
      Click.on(CommonLocators.settingsNavTab),
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.networkNavTab, isClickable()),
      Click.on(NetworkPage.networkNavTab)
    );

  static NavigationToLogsPage = () =>
    Task.where(
      `#user navigates to Logs page`,
      Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.logsNavTab, isClickable()),
      Click.on(LogsPage.logsNavTab),
      Wait.upTo(Duration.ofSeconds(10)).until(LogsPage.listofLogsBtn, isVisible())
    );
}
