import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When, Given } from "cucumber";
import { Firmware_Tasks } from "../../spec/screenplay/tasks/Firmware_Tasks";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { Wait, isVisible, Text } from "@serenity-js/protractor";
import { FirmwarePage } from "../../spec/screenplay/ui/FirmwarePage";
import { Ensure, isGreaterThan, property } from "@serenity-js/assertions";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

Given(/User clicks on the Firmware Tab/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToFirmwarePage())
);

Then(/User should see Serial Number value and should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(10)),
    Ensure.that(Text.of(FirmwarePage.serialNumberCurrentValue), property("length", isGreaterThan(0)))
  )
);

Then(/User should see Product Code and should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(FirmwarePage.productCodeCurrentValue), property("length", isGreaterThan(0)))
  )
);

Then(/User should see ProductName and should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(FirmwarePage.productNameCurrentValue), property("length", isGreaterThan(0)))
  )
);

Then(/User should see Model Name and should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(FirmwarePage.modelNameCurrentValue), property("length", isGreaterThan(0)))
  )
);

When(/User enters the (.*) in Assigned Name input/, (assignedname: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(20)).until(FirmwarePage.assignedNameInput, isVisible()),
    Firmware_Tasks.setAssignedNameInput(assignedname)
  )
);

Then(/User should see (.*) under Assigned Name/, (assignedname: string) =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.getAssignedName(assignedname))
);

When(/User selects the (.*) option from the Firmware Upgrade Mode dropdown/, (upgradeMode: string) =>
  actorInTheSpotlight().attemptsTo(
    Firmware_Tasks.clickDropdownFirmwareUpgradeMode(),
    Common_Tasks.clickDropdownItem(upgradeMode)
  )
);

Then(/(.*) should be displayed under Firmware Upgrade Mode/, (upgradeMode: string) =>
  actorInTheSpotlight().attemptsTo(Firmware_Tasks.getFirmwareUpgradeMode(upgradeMode))
);
