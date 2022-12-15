import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Click, Text, Wait, Hover } from "@serenity-js/protractor";
import { Ensure, equals, or, Check, not } from "@serenity-js/assertions";
import { Network_Tasks } from "../../spec/screenplay/tasks/Network_Tasks";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { NetworkPage } from "../../spec/screenplay/ui/NetworkPage";

Then(/User clicks on the Network Tab/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToNetworkPage())
);

When(/User clicks on Download Certificate button/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(NetworkPage.downloadCertificateBtn))
);

Then(/User should be able to download certificate/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(NetworkPage.downloadCertificateBtn))
);

When(/User selects (.*) option from Method of IP Allocation dropdown/, (ipAllocationType: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.selectMethodOfIpAllocation(ipAllocationType))
);

Then(/(.*) should be displayed under Method of IP Allocation/, (methodofIP: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getMethodOfIPUnderMethodofIPAllocationField(methodofIP))
);

When(/User enters the (.*) to (.*) Input field/, (ipAddress: string, paramName) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(paramName, equals("Stored Ethernet IP Address"))
      .andIfSo(Network_Tasks.setStoredEthernetIPAddressInput(ipAddress))
      .otherwise(
        Check.whether(paramName, equals("Stored Ethernet Subnet Mask"))
          .andIfSo(Network_Tasks.setStoredEthernetSubnetMaskInput(ipAddress))
          .otherwise(
            Check.whether(paramName, equals("Stored Ethernet Default Gateway")).andIfSo(
              Network_Tasks.setStoredEthernetDefaultGatewayInput(ipAddress)
            )
          )
      )
  )
);

Then(/User should see (.*) under Present (.*)/, (ipAddress: string, paramName: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(paramName, equals("Ethernet IP Address"))
      .andIfSo(Network_Tasks.getPresentEthernetIPAddressValue(ipAddress))
      .otherwise(
        Check.whether(paramName, equals("Ethernet Subnet Mask"))
          .andIfSo(Network_Tasks.getPresentEthernetSubnetMaskValue(ipAddress))
          .otherwise(
            Check.whether(paramName, equals("Ethernet Default Gateway")).andIfSo(
              Network_Tasks.getPresentEthernetDefaultGatewayValue(ipAddress)
            )
          )
      )
  )
);

Then(/User should see (.*) under Stored (.*)/, (ipAddress: string, paramName: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(paramName, equals("Ethernet IP Address"))
      .andIfSo(Network_Tasks.getStoredEthernetIPAddressValue(ipAddress))
      .otherwise(
        Check.whether(paramName, equals("Ethernet Subnet Mask"))
          .andIfSo(Network_Tasks.getStoredEthernetSubnetMaskValue(ipAddress))
          .otherwise(
            Check.whether(paramName, equals("Ethernet Default Gateway")).andIfSo(
              Network_Tasks.getStoredEthernetDefaultGatewayValue(ipAddress)
            )
          )
      )
  )
);

When(/User enters (-?\d+) for Modbus TCP Com Timeout/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setModbusTCPComTimeout(timeoutvalue))
);

Then(/(-?\d+) Milliseconds should be displayed under Modbus TCP Com Timeout field/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getModbusTCPComTimeout(timeoutvalue))
);

Then(/User should get Error for Modbus TCP Com Timeout/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(NetworkPage.errorMsgModbusTCPComTimeout), or(equals("Too low"), equals("Too high")))
  )
);

When(/User enters (.*) for Trusted IP Address Filter white list/, (ipAddress: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.setIPWhitelistInput(ipAddress))
);

Then(/(.*) IP should be displayed under Trusted IP Address Filter white list field/, (ipAddress: string) =>
  actorInTheSpotlight().attemptsTo(Network_Tasks.getIPWhitelist(ipAddress))
);

Then(/User should see Error Message for IP Whitelist/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(NetworkPage.errorMsgIPWhitelist), equals("Must be a valid comma separated IPv4 address list"))
  )
);

Then(/User should see alert popup for Stored (.*) on mouse out/, (paramName: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(paramName, equals("Ethernet IP Address"))
      .andIfSo(
        Hover.over(NetworkPage.storedEthernetIPAddressInput),
        Hover.over(NetworkPage.storedEthernetIPAddressValue)
      )
      .otherwise(
        Check.whether(paramName, equals("Ethernet Subnet Mask"))
          .andIfSo(
            Hover.over(NetworkPage.storedEthernetSubnetMaskInput),
            Hover.over(NetworkPage.storedEthernetSubnetMaskValue)
          )
          .otherwise(
            Check.whether(paramName, equals("Ethernet Default Gateway")).andIfSo(
              Hover.over(NetworkPage.storedEthernetDefaultGatewayInput),
              Hover.over(NetworkPage.storedEthernetDefaultGatewayValue)
            )
          )
      )
  )
);

Then(/User should see alert popup for Trusted IP Address filter white list on mouse out/, () =>
  actorInTheSpotlight().attemptsTo(
    Hover.over(NetworkPage.ipWhitelistInput),
    Hover.over(NetworkPage.ipWhitelistCurrentValue)
  )
);

Then(/User should not see (.*) under Stored (.*)/, (ipAddress: string, paramName: string) =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(paramName, equals("Ethernet IP Address"))
      .andIfSo(
        Wait.for(Duration.ofSeconds(10)),
        Ensure.that(Text.of(NetworkPage.storedEthernetIPAddressValue), not(equals(ipAddress + " IP")))
      )
      .otherwise(
        Check.whether(paramName, equals("Ethernet Subnet Mask"))
          .andIfSo(
            Wait.for(Duration.ofSeconds(10)),
            Ensure.that(Text.of(NetworkPage.storedEthernetSubnetMaskValue), not(equals(ipAddress + " IP")))
          )
          .otherwise(
            Check.whether(paramName, equals("Ethernet Default Gateway")).andIfSo(
              Wait.for(Duration.ofSeconds(10)),
              Ensure.that(Text.of(NetworkPage.storedEthernetDefaultGatewayValue), not(equals(ipAddress + " IP")))
            )
          )
      )
  )
);

Then(/User should not see (.*) under Trusted IP Address filter white list/, (ipAddress: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(10)),
    Ensure.that(Text.of(NetworkPage.ipWhitelistCurrentValue), not(equals(ipAddress + " IP")))
  )
);
