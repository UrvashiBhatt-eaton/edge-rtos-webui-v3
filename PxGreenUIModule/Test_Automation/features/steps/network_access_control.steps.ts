import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Wait, isVisible, Text, Click } from "@serenity-js/protractor";
import { Ensure, equals, property, isGreaterThan, endsWith } from "@serenity-js/assertions";
import { Network_Tasks } from "../../spec/screenplay/tasks/Network_Tasks";
import { NetworkPage } from "../../spec/screenplay/ui/NetworkPage";

When(/User clicks on dropdown option for Modbus TCP/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownModbusTCPInput())
);

Then(/User should get Disable alert pop up and text on the pop up should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.disableAlertHeader, isVisible()),
    Ensure.that(Text.of(NetworkPage.disableAlertHeader), equals("Disable Alert")),
    Ensure.that(Text.of(NetworkPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then(/User clicks on Yes button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.yesBtn, isVisible()),
    Click.on(NetworkPage.yesBtn),
    Wait.for(Duration.ofSeconds(10))
  )
);

Then(/User should see Disable under Modbus TCP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderModbusTCP("Disable"))
);

Then(/User should get Enable alert pop up and text on the pop up should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.enableAlertHeader, isVisible()),
    Ensure.that(Text.of(NetworkPage.enableAlertHeader), equals("Enable Alert")),
    Ensure.that(Text.of(NetworkPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then(/User should see Enable under Modbus TCP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderModbusTCP("Enable"))
);

When(/User clicks on dropdown option for Bacnet IP/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownBacnetIPInput())
);

Then(/User should see Disable under Bacnet IP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderBacnetIP("Disable"))
);

Then(/User should see Enable under Bacnet IP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderBacnetIP("Enable"))
);

When(/User clicks on dropdown option for HTTP/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownHTTPInput())
);

Then(/User should see Disable under HTTP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderHTTP("Disable"))
);

Then(/User should see another pop up with HTTP disabled message to reload the app/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(NetworkPage.httpDisabledMessage, isVisible()),
    Ensure.that(
      Text.of(NetworkPage.httpDisabledMessage),
      equals("Http is disabled, please reload the app to use Https mode.")
    ),
    Click.on(NetworkPage.reloadBtn)
  )
);

Then(/User should see Enable under HTTP field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderHTTP("Enable"))
);

When(/User clicks on dropdown option for CORS Origin Type/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownCORSOriginTypeInput())
);

Then(/User should get allows Origin with device IP alert pop up and text on the pop up should not be blank/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.allowsOriginwithdeviceIPAlertHeader, isVisible()),
    Ensure.that(
      Text.of(NetworkPage.allowsOriginwithdeviceIPAlertHeader),
      endsWith("allows Origin with device IP Alert")
    ),
    Ensure.that(Text.of(NetworkPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then("User should get allows Origin alert pop up and text on the pop up should not be blank", () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.allowsallOriginHeader, isVisible()),
    Ensure.that(Text.of(NetworkPage.allowsallOriginHeader), endsWith("allows all Origin Alert")),
    Ensure.that(Text.of(NetworkPage.textOnPopUp), property("length", isGreaterThan(0)))
  )
);

Then(/User should see allows Origin with device IP under CORS Origin Type field/, () =>
  actorInTheSpotlight().attemptsTo(
    Network_Tasks.getValueUnderCORSOriginType("(Active device IP) - allows Origin with device IP")
  )
);

Then(/User should see allows all Origin under CORS Origin Type field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderCORSOriginType("(*) - allows all Origin"))
);
