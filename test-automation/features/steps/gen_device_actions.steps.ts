import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { GeneralPage } from "../../spec/screenplay/ui/GeneralPage";
import { General_Tasks } from "../../spec/screenplay/tasks/General_Tasks";
import { isVisible, Wait, Text, Click, isPresent } from "@serenity-js/protractor";
import { Ensure, equals, not, property, isGreaterThan } from "@serenity-js/assertions";

When(/User clicks on dropdown for Reboot or Reset Device/, () =>
  actorInTheSpotlight().attemptsTo(General_Tasks.clickRebootOrResetDevice())
);

Then(/User should see Reboot Device Alert Pop up and text on the pop up should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.rebootDeviceAlertHeader, isVisible()),
    Ensure.that(Text.of(GeneralPage.rebootDeviceAlertHeader), equals("Reboot Device Alert")),
    Ensure.that(Text.of(GeneralPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then(/User Clicks on Close Button on Reboot Device Alert Popup/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.rebootDeviceAlertHeader, isVisible()),
    Click.on(GeneralPage.cancelPopupCrossMark)
  )
);

Then(/User should be able to close Reboot Device pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.rebootOrResetDeviceInput, isVisible()),
    Ensure.that(GeneralPage.rebootDeviceAlertHeader, not(isPresent())),
    Ensure.that(GeneralPage.textOnPopUp, not(isPresent()))
  )
);

Then(/User should see Factory Reset Alert Pop up and text on the pop up should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.factoryResetAlertHeader, isVisible()),
    Ensure.that(Text.of(GeneralPage.factoryResetAlertHeader), equals("Factory Reset Alert")),
    Ensure.that(Text.of(GeneralPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then(/User Clicks on Close Button on Factory Reset Alert Popup/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.factoryResetAlertHeader, isVisible()),
    Click.on(GeneralPage.cancelPopupCrossMark)
  )
);

Then(/User should be able to close Factory Reset Alert pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.rebootOrResetDeviceInput, isVisible()),
    Ensure.that(GeneralPage.factoryResetAlertHeader, not(isVisible())),
    Ensure.that(GeneralPage.textOnPopUp, not(isVisible()))
  )
);
