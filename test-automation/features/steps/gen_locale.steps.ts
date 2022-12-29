import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { GeneralPage } from "../../spec/screenplay/ui/GeneralPage";
import { General_Tasks } from "../../spec/screenplay/tasks/General_Tasks";
import { isVisible, Wait, Click, Text } from "@serenity-js/protractor";
import { Ensure, equals, endsWith, startsWith } from "@serenity-js/assertions";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

Then(/User clicks on dropdown for Timezone/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(20)).until(GeneralPage.timeZoneInput, isVisible()),
    Click.on(GeneralPage.timeZoneInput),
    Ensure.that(Common_Tasks.generalPageTimezones.count(), equals(32))
  )
);

When(/User selects the Time Zone option - (.*)/, (timezone: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setTimezone(timezone))
);

Then(/Selected (.*) should be displayed under Timezone/, (timezone: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getTimezoneUnderTimezoneField(timezone))
);

Then(/Selected (.*) should also be displayed right side corner/, (timezone: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getTimezoneOnCornerBottom(timezone))
);

When(/User clicks on dropdown for Date Format/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(GeneralPage.dateFormatInput, isVisible()),
    Click.on(GeneralPage.dateFormatInput)
  )
);

When(/User selects Date Format option - (.*)/, (dateFormat: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setDateFormat(dateFormat))
);

Then(/Selected (.*) should be displayed under Date Format/, (dateFormat: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getdateFormatUnderDateFormatField(dateFormat))
);

Then(/User should see Date displayed in the format (.*) on right side corner/, (dateFormat: string) =>
  actorInTheSpotlight().attemptsTo(
    General_Tasks.getdateFormatOnCornerBottom(),
    Ensure.that(
      Text.of(GeneralPage.dateAndTimeDisplayAtBottom),
      endsWith(Common_Tasks.getFormatedDate(dateFormat) + " GMT+05:30")
    )
  )
);

Then(/User clicks on dropdown for Time Format/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(GeneralPage.timeFormatInput, isVisible()),
    Click.on(GeneralPage.timeFormatInput)
  )
);
When(/User selects Time Format option - (.*)/, (timeFormat: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setTimeFormat(timeFormat))
);

Then(/Selected (.*) should be displayed under Time Format/, (timeFormat: string) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getTimeFormatUnderTimeFormatField(timeFormat))
);

Then(/User should see time displayed in (.*) right side corner/, (timeFormat: string) =>
  actorInTheSpotlight().attemptsTo(
    General_Tasks.getTimeFormatOnCornerBottom(),
    Ensure.that(Text.of(GeneralPage.dateAndTimeDisplayAtBottom), startsWith(Common_Tasks.getTimeFormat(timeFormat)))
  )
);
