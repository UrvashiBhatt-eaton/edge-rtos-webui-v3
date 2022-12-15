import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Text, Wait, isVisible, Clear, Enter, Hover, ExecuteScript } from "@serenity-js/protractor";
import { Check, Ensure, equals, not } from "@serenity-js/assertions";
import { Network_Tasks } from "../../spec/screenplay/tasks/Network_Tasks";
import { NetworkPage } from "../../spec/screenplay/ui/NetworkPage";

When(/User clicks on dropdown option for Proxy Enable/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.clickDropdownProxyEnableInput())
);

When(/User should see True and False are available choices/, () =>
  actorInTheSpotlight().attemptsTo(Ensure.that(Text.ofAll(NetworkPage.getInputItems), equals(["True", "False"])))
);

Then("User should see False under Proxy Enable field", () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderProxyEnableField("False"))
);

Then(/User should not see other options like Proxy server Address, Port, Username and Password/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.proxyEnableCurrentValue, isVisible()),
    Ensure.that(NetworkPage.proxyServerAddressInput, not(isVisible())),
    Ensure.that(NetworkPage.proxyServerPortInput, not(isVisible())),
    Ensure.that(NetworkPage.proxyUsernameInput, not(isVisible())),
    Ensure.that(NetworkPage.proxyPasswordInput, not(isVisible()))
  )
);

Then(/User should see True under Proxy Enable field/, () =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getValueUnderProxyEnableField("True"))
);

When(/User enters (.*) for Proxy Server Address/, (validServerAddress: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setProxyServerAddressInput(validServerAddress))
);

Then(/User should see (.*) under Proxy Server Address field/, (validServerAddress: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getProxyServerAddress(validServerAddress))
);

When(/User updates the (.*) for Proxy Server Address/, (invalidAddress: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(NetworkPage.proxyServerAddressInput),
    Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.proxyServerAddressInput, isVisible()),
    Clear.theValueOf(NetworkPage.proxyServerAddressInput),
    Network_Tasks.setProxyServerAddressInput(invalidAddress),
    Hover.over(NetworkPage.proxyServerAddressInput),
    Hover.over(NetworkPage.proxyServerAddressCurrentValue)
  )
);

Then(/User should get error message for invalid Proxy Server Address/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(15000)),
    Ensure.that(Text.of(NetworkPage.proxyServerAddressError), equals("Invalid value. Please enter correct value."))
  )
);

When(/User enters (-?\d+) for Proxy Server Port/, (validServerPort: number) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setProxyServerPortInput(validServerPort))
);

Then(/User should see (-?\d+) under Proxy Server Port field/, (validServerPort: number) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getProxyServerPort(validServerPort))
);

Then(/User should see Error Message for Proxy Server Port/, () =>
  actorInTheSpotlight().attemptsTo(Ensure.that(Text.of(NetworkPage.errorMsgProxyServerPort), equals("Too high")))
);

When(/User enters (.*) for Proxy Username/, (username: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(username, not(equals(null)))
      .andIfSo(Network_Tasks.setProxyUsernameInput(username))
      .otherwise(
        Wait.for(Duration.ofSeconds(10)),
        ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(NetworkPage.proxyUsernameInput),
        Clear.theValueOf(NetworkPage.proxyUsernameInput),
        Enter.theValue(" ").into(NetworkPage.proxyUsernameInput)
      )
  )
);

Then(/User should see (.*) under Proxy Username field/, (username: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(username, not(equals(null)))
      .andIfSo(Network_Tasks.getProxyUsername(username))
      .otherwise(
        Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.proxyUsernameCurrentValue, isVisible()),
        Wait.for(Duration.ofSeconds(10)),
        Ensure.that(Text.of(NetworkPage.proxyUsernameCurrentValue), equals(""))
      )
  )
);

When(/User enters (.*) for Proxy Password/, (password: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setProxyPasswordInput(password))
);

Then(/User should see (.*) under Proxy Password field/, (password: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getProxyPassword(password))
);
