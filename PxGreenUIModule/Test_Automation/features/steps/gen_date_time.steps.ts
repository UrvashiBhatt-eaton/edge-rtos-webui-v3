import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Given, Then, When } from "cucumber";
import { GeneralPage } from "../../spec/screenplay/ui/GeneralPage";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { General_Tasks } from "../../spec/screenplay/tasks/General_Tasks";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";
import { isVisible, Wait, Attribute, Text, Click, Clear, Enter } from "@serenity-js/protractor";
import { Ensure, equals, not, startsWith, Check, isLessThan } from "@serenity-js/assertions";

Given(/User clicks on the General Tab/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToGeneralPage())
);

When(/User clicks on dropdown option for Set SNTP Operation Enable/, () =>
  actorInTheSpotlight().attemptsTo(General_Tasks.clickDropdownSetSNTPOperationEnable())
);

When(/User enters the (.*) to SNTP Server 1 input field/, (server1address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setServerAddress(server1address, 1))
);

Then(/User should see (.*) under SNTP Server 1/, (server1address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getServerAddress(server1address, 1))
);

Then(/User enters the (.*) to SNTP Server 2 input field/, (server2address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setServerAddress(server2address, 2))
);

Then(/User should see (.*) under SNTP Server 2/, (server2address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getServerAddress(server2address, 2))
);

Then(/User enters the (.*) to SNTP Server 3 input field/, (server3address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setServerAddress(server3address, 3))
);

Then(/User should see (.*) under SNTP Server 3/, (server3address: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getServerAddress(server3address, 3))
);

Then(/User should see error text for SNTP Server (.*)/, (serverNumber: number) =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(
      Text.of(GeneralPage.getSNTPErrorMessage("Must be a valid Hostname or IPv4 address")),
      equals("Must be a valid Hostname or IPv4 address")
    ),
    Clear.theValueOf(GeneralPage.getSNTPServerInput(serverNumber)),
    Enter.theValue("ntp.etn.com").into(GeneralPage.getSNTPServerInput(serverNumber))
  )
);

Then(/Edit Time button should be hidden/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.getSNTPServerInput(1), isVisible()),
    Ensure.that(GeneralPage.editTimeBtn, not(isVisible()))
  )
);
Then(/Disable should be displayed under SNTP Operation Enable/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    Wait.until(Text.of(GeneralPage.sNTPValue), equals("Disable")),
    Ensure.that(Text.of(GeneralPage.sNTPValue), equals("Disable"))
  )
);

Then(/Three SNTP server fields are hidden and the ability to edit the time is shown/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.editTimeBtn, isVisible()),
    Ensure.that(GeneralPage.getSNTPServerInput(1), not(isVisible())),
    Ensure.that(GeneralPage.getSNTPServerInput(2), not(isVisible())),
    Ensure.that(GeneralPage.getSNTPServerInput(3), not(isVisible()))
  )
);
When(/User clicks on Edit time button/, () =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(Text.of(GeneralPage.sNTPValue), equals("Disable")).andIfSo(
      Wait.upTo(Duration.ofSeconds(20)).until(GeneralPage.editTimeBtn, isVisible()),
      Click.on(GeneralPage.editTimeBtn)
    )
  )
);

Then(/User sets the Time Zone/, () =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setTimezone(Common_Tasks.getTimeZone()))
);

When(/User select Use System time Radio Button and click on Save/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(GeneralPage.useSystemTimeRadioBtn), Click.on(GeneralPage.saveTimeBtn))
);

Then(/Current system date and time should be displayed/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(10)),
    Wait.until(Text.of(GeneralPage.dateAndTimeDisplay), startsWith(new Date().toDateString())),
    Ensure.that(Common_Tasks.getDateAndTimeDifference(), isLessThan(60000))
  )
);

When(/User selects the option Select Manual Time/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(GeneralPage.selectManualTimeRadioBtn))
);

When(/User sets the date and time using widget/, () =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setManualDateandTime())
);

Then(/User should see Manual time displayed/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(10)),
    Check.whether(new Date().getDate(), equals(1))
      .andIfSo(
        Wait.until(
          Text.of(GeneralPage.dateAndTimeDisplay),
          startsWith(new Date(new Date().setDate(new Date().getDate() + 1)).toDateString())
        ),
        Ensure.that(
          Text.of(GeneralPage.dateAndTimeDisplay),
          startsWith(new Date(new Date().setDate(new Date().getDate() + 1)).toDateString())
        ),
        Click.on(GeneralPage.editTimeBtn),
        Ensure.that(
          Attribute.of(GeneralPage.dateAndTimeDisplayOnEditPopup).called("value"),
          startsWith(
            Common_Tasks.addZero(new Date().getMonth() + 1) +
              "/" +
              Common_Tasks.addZero(new Date().getDate() + 1) +
              "/" +
              new Date().getFullYear()
          )
        )
      )
      .otherwise(
        Wait.until(
          Text.of(GeneralPage.dateAndTimeDisplay),
          startsWith(new Date(new Date().setDate(new Date().getDate() - 1)).toDateString())
        ),
        Ensure.that(
          Text.of(GeneralPage.dateAndTimeDisplay),
          startsWith(new Date(new Date().setDate(new Date().getDate() - 1)).toDateString())
        ),
        Click.on(GeneralPage.editTimeBtn),
        Ensure.that(
          Attribute.of(GeneralPage.dateAndTimeDisplayOnEditPopup).called("value"),
          startsWith(
            Common_Tasks.addZero(new Date().getMonth() + 1) +
              "/" +
              Common_Tasks.addZero(new Date().getDate() - 1) +
              "/" +
              new Date().getFullYear()
          )
        )
      )
  )
);

When(/User clicks on the Cancel button on the pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.cancelTimeBtn, isVisible()),
    Click.on(GeneralPage.cancelTimeBtn)
  )
);
When(/the User clicks on the Save to apply the time/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.saveTimeBtn, isVisible()),
    Click.on(GeneralPage.saveTimeBtn)
  )
);
Then(/User should be able to close the pop up/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.sNTPOperationInput, isVisible()),
    Ensure.that(GeneralPage.selectManualTimeRadioBtn, not(isVisible())),
    Ensure.that(GeneralPage.useSystemTimeRadioBtn, not(isVisible()))
  )
);
