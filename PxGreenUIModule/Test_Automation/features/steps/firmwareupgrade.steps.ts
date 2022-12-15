import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Firmware_Tasks } from "../../spec/screenplay/tasks/Firmware_Tasks";
import { Wait, isVisible, Click, isClickable, isSelected, ExecuteScript } from "@serenity-js/protractor";
import { FirmwarePage } from "../../spec/screenplay/ui/FirmwarePage";
import { Ensure, Check, not } from "@serenity-js/assertions";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

When(/User upload valid web image codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.uploadWebImageFile()))
);

Then(/User should get End User Licence Agreement Popup/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.endUserLicenseAgreementPopUpHeader, isVisible()),
    Ensure.that(FirmwarePage.endUserLicenseAgreementPopUpHeader, isVisible())
  )
);

Then(/User accepts the eula to continue/, () =>
  actorInTheSpotlight().attemptsTo(
    ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(FirmwarePage.iAgreeRadioBtn),
    Click.on(FirmwarePage.iAgreeRadioBtn),
    Wait.upTo(Duration.ofSeconds(15)).until(FirmwarePage.acceptBtn, isClickable()),
    Click.on(FirmwarePage.acceptBtn)
  )
);

Then(/User should get Firmware Update pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.firmwareUpdatePopUpHeader, isVisible()),
    Ensure.that(FirmwarePage.firmwareUpdatePopUpHeader, isVisible())
  )
);

Then(/User clicks on Select Processor/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.selectComponentBtn, isVisible()),
    Click.on(FirmwarePage.selectComponentBtn)
  )
);

Then(/User should get Firmware \/ Code Pack Evaluation pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.firmwareUpdatePopUpHeader, isVisible()),
    Ensure.that(FirmwarePage.firmwareUpdatePopUpHeader, isVisible())
  )
);

Then(/User select web image Check box and clicks on OK/, () =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(FirmwarePage.rTKWEBIMAGECheckbox, not(isSelected())).andIfSo(
      Click.on(FirmwarePage.rTKWEBIMAGECheckbox)
    ),
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.oKBtn, isClickable()),
    Click.on(FirmwarePage.oKBtn)
  )
);

Then(/User clicks on Install Updates button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.installUpdatesBtn, isVisible()),
    Click.on(FirmwarePage.installUpdatesBtn)
  )
);

Then(/User clicks on continue button on successful update/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofMinutes(5)).until(FirmwarePage.tickmarkAfterSuccessfulupgrade, isVisible()),
    Wait.upTo(Duration.ofSeconds(15)).until(FirmwarePage.continueBtn, isClickable()),
    Click.on(FirmwarePage.continueBtn)
  )
);

When(/User upload valid language image codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.uploadLanguageImageFile()))
);

Then(/User select language image Check box and clicks on OK/, () =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(FirmwarePage.rTKLANGUAGEIMAGECheckbox, not(isSelected())).andIfSo(
      Click.on(FirmwarePage.rTKLANGUAGEIMAGECheckbox)
    ),
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.oKBtn, isClickable()),
    Click.on(FirmwarePage.oKBtn)
  )
);

When(/User upload valid App firmware codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.uploadAppImageFile()))
);

Then(/User select application image Check box and clicks on OK/, () =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(FirmwarePage.rTOSTOOLKITCheckbox, not(isSelected())).andIfSo(
      Click.on(FirmwarePage.rTOSTOOLKITCheckbox)
    ),
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.oKBtn, isClickable()),
    Click.on(FirmwarePage.oKBtn)
  )
);

Then(/User verifies app firmware upgrade is successful/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofMinutes(10)).until(FirmwarePage.tickmarkAfterSuccessfulupgrade, isVisible()),
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.continueBtn, isClickable())
  )
);

Then(/User clicks on Cancel button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.cancelBtn, isClickable()),
    Click.on(FirmwarePage.cancelBtn)
  )
);

Then(/User should go back to firmware upgrade page/, () =>
  actorInTheSpotlight().attemptsTo(Wait.upTo(Duration.ofSeconds(4)).until(FirmwarePage.openCodepackBtn, isVisible()))
);

Then(/User clicks on Abort button and clicks on continue/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.abortBtn, isClickable()),
    Click.on(FirmwarePage.abortBtn),
    Wait.upTo(Duration.ofSeconds(90)).until(FirmwarePage.firmwareUpgradeIsAborted, isVisible()),
    Ensure.that(FirmwarePage.firmwareUpgradeIsAborted, isVisible()),
    Wait.upTo(Duration.ofSeconds(3)).until(FirmwarePage.continueBtn, isClickable()),
    Click.on(FirmwarePage.continueBtn),
    Wait.upTo(Duration.ofSeconds(4)).until(FirmwarePage.openCodepackBtn, isVisible())
  )
);

When(/User upload Product GUID is not matched codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.absolutePath2))
);

Then(/User should get pop up saying Invalid Product and Clicks Ok/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.invalidProductTextOnPopUp, isVisible()),
    Click.on(FirmwarePage.oKBtnOnAlert)
  )
);

When(/User upload Image GUID is not matched codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.absolutePath3))
);

Then(/User should see Processor Check box is Disabled/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(FirmwarePage.rTKWEBIMAGECheckbox, not(isClickable())),
    Ensure.that(FirmwarePage.rTOSTOOLKITCheckbox, not(isClickable())),
    Ensure.that(FirmwarePage.rTKLANGUAGEIMAGECheckbox, not(isClickable()))
  )
);

When(/User upload invalid file using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.absolutePath4))
);

Then(/User should get pop up saying Please select the correct file type and Try Again and clicks Ok/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.pleaseSelecttheCorrectFileTypeandTryTextOnPopUp, isVisible()),
    Ensure.that(FirmwarePage.pleaseSelecttheCorrectFileTypeandTryTextOnPopUp, isVisible()),
    Click.on(FirmwarePage.oKBtnOnAlert)
  )
);

When(/User upload Data Address is Modified codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.absolutePath5))
);

Then(/User get error message like Codepack integrity check has failed/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(FirmwarePage.codepackIntegrityCheckHasFailed, isVisible()),
    Ensure.that(FirmwarePage.codepackIntegrityCheckHasFailed, isVisible())
  )
);

When(/User upload Data Address is Deleted codepack using Open Codepack button/, () =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.uploadWebImage(Common_Tasks.absolutePath6))
);

Then(/User get error message like Final integrity check has failed/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofMinutes(5)).until(FirmwarePage.finalintegritycheckisInvalid, isVisible()),
    Ensure.that(FirmwarePage.finalintegritycheckisInvalid, isVisible())
  )
);
