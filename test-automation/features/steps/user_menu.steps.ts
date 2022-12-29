import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Wait, isVisible, Click, isClickable, Clear, Enter } from "@serenity-js/protractor";
import { AvatarMenu } from "../../spec/screenplay/ui/AvatarMenu";
import { Ensure } from "@serenity-js/assertions";
import { ImportExportFile_Tasks } from "../../spec/screenplay/tasks/ImportExportFile_Tasks";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

When(/User clicks on Import\/Export option/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.importExportNav, isVisible()),
    Click.on(AvatarMenu.importExportNav)
  )
);

Then(/User should see the Import\/Export Popup/, () =>
  actorInTheSpotlight().attemptsTo(Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.exportBtn, isVisible()))
);

When(/User clicks on the export option/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(AvatarMenu.exportBtn), Wait.for(Duration.ofSeconds(10)))
);

When(/User uploads the JSON configuration file by clicking the Import button/, () =>
  actorInTheSpotlight().attemptsTo(ImportExportFile_Tasks.uploadConfigFile(Common_Tasks.uploadValidConfigFile))
);

When(
  /User uploads the JSON configuration file which contains non-writable paramters by clicking the Import button/,
  () =>
    actorInTheSpotlight().attemptsTo(
      ImportExportFile_Tasks.uploadConfigFile(Common_Tasks.uploadValidConfigNonWritableParametersFile)
    )
);

When(/User uploads the incorrect file by clicking the Import button/, () =>
  actorInTheSpotlight().attemptsTo(ImportExportFile_Tasks.uploadConfigFile(Common_Tasks.uploadIncorrectConfigFile))
);

When(/User uploads incorrect formatted JSON configuration file by clicking the Import button/, () =>
  actorInTheSpotlight().attemptsTo(
    ImportExportFile_Tasks.uploadConfigFile(Common_Tasks.uploadIncorrectFormattedConfigFile)
  )
);

Then(/User verifies the exported file and its contents/, () =>
  actorInTheSpotlight().attemptsTo(ImportExportFile_Tasks.checkFileDownload())
);

Then(/User verifies the configuration is updated to the device/, () =>
  actorInTheSpotlight().attemptsTo(Wait.for(Duration.ofSeconds(5)), Ensure.that(AvatarMenu.importBtn, isClickable()))
);

Then(/User can see the Alert Popup with error content/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(5)),
    Ensure.that(AvatarMenu.importAlertPopupContent, isVisible())
  )
);

Then(/User can see the Alert for selecting the incorrect file/, () =>
  actorInTheSpotlight().attemptsTo(Wait.until(AvatarMenu.importAlertPopupIncorrectFile, isVisible()))
);

Then(/User can see the Alert for selecting the incorrect formatted file/, () =>
  actorInTheSpotlight().attemptsTo(Wait.until(AvatarMenu.importAlertPopupInvalidFile, isVisible()))
);

When(/User clicks on Change Password/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.changePasswordNav, isVisible()),
    Click.on(AvatarMenu.changePasswordNav)
  )
);

When(/User enter the (.*) in Current Password field/, (currentpassword: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.currentPasswordInput, isVisible()),
    Clear.theValueOf(AvatarMenu.currentPasswordInput),
    Enter.theValue(currentpassword).into(AvatarMenu.currentPasswordInput)
  )
);

When(/User enter the (.*) in New Password field/, (newpassword: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.newPasswordInput, isVisible()),
    Clear.theValueOf(AvatarMenu.newPasswordInput),
    Enter.theValue(newpassword).into(AvatarMenu.newPasswordInput)
  )
);

When(/User enter the (.*) in Confirm Password field/, (newpassword: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.confirmPasswordInput, isVisible()),
    Clear.theValueOf(AvatarMenu.confirmPasswordInput),
    Enter.theValue(newpassword).into(AvatarMenu.confirmPasswordInput)
  )
);

When(/User clicks on the Ok button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.oKBtn, isClickable()),
    Click.on(AvatarMenu.oKBtn)
  )
);
