import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Wait, isVisible, Hover, Text } from "@serenity-js/protractor";
import { Ensure, equals, not } from "@serenity-js/assertions";
import { Network_Tasks } from "../../spec/screenplay/tasks/Network_Tasks";
import { NetworkPage } from "../../spec/screenplay/ui/NetworkPage";

When(/User click on dropdown option for IOT Enable or Disable/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownIOTEnableOrDisableInput())
);

Then(/User should see False under IOT Enable or Disable field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderIOTEnableOrDisable("False"))
);

Then(/User should not see other options like Device GUID and IOT HUB Server Connectiong String/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.iOTEnableOrDisableCurrentValue, isVisible()),
    Ensure.that(NetworkPage.deviceGUIDInput, not(isVisible())),
    Ensure.that(NetworkPage.iOTHubServerConnectionStringInput, not(isVisible()))
  )
);

Then(/User should see True under IOT Enable or Disable field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderIOTEnableOrDisable("True"))
);

Then(/User should see cloud symbol in the right side corner/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.cloudIcon, isVisible()),
    Ensure.that(NetworkPage.cloudIcon, isVisible())
  )
);

When(/User Enter (.*) for Device GUID/, (guid: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setdeviceGUID(guid))
);

Then(/User should see (.*) under Device GUID field/, (guid: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getDeviceGUID(guid))
);

When(/User Enter (.*) for IOT HUB Server Connectiong String/, (connectionstring: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setIOTHubServerConnectionString(connectionstring))
);

Then(/User should see (.*) under IOT HUB Server Connectiong String field/, (connectionstring: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getIOTHubServerConnectionString(connectionstring))
);

Then(/User should see alert popup for IOT HUB Server Connectiong String on mouse out/, () =>
  actorInTheSpotlight().attemptsTo(
    Hover.over(NetworkPage.iOTHubServerConnectionStringInput),
    Hover.over(NetworkPage.iOTHubServerConnectionStringCurrentValue)
  )
);

Then(/User should not see (.*) under IOT HUB Server Connectiong String field/, (connectionString: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(10)),
    Ensure.that(Text.of(NetworkPage.iOTHubServerConnectionStringCurrentValue), not(equals(connectionString)))
  )
);
