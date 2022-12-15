import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { When, Then } from "cucumber";
import { Wait, isVisible, Text, Click } from "@serenity-js/protractor";
import { CommonLocators } from "../../spec/screenplay/ui/CommonLocators";
import { Ensure, property, isGreaterThan, startsWith } from "@serenity-js/assertions";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

When(/the User selects the (.*) option from the dropdown/, (item: string) =>
  actorInTheSpotlight().attemptsTo(Common_Tasks.clickDropdownItem(item))
);

Then(/User clicks Yes on the Alert popup to apply the (.*)/, (paramName: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.alertPopupHeader(paramName), isVisible()),
    Ensure.that(Text.of(CommonLocators.alertPopupHeader(paramName)), startsWith(paramName)),
    Ensure.that(Text.of(CommonLocators.alertPopupContent), property("length", isGreaterThan(0))),
    Click.on(CommonLocators.yesBtn)
  )
);

Then(/User clicks No on the alert popup/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(CommonLocators.alertPopupContent, isVisible()),
    Ensure.that(Text.of(CommonLocators.alertPopupContent), property("length", isGreaterThan(0))),
    Click.on(CommonLocators.noBtn)
  )
);

Then(/User expands the (.*) section/, (sectionName: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(CommonLocators.sectionCollapse(sectionName), isVisible()),
    Click.on(CommonLocators.sectionCollapse(sectionName)),
    Wait.for(Duration.ofSeconds(15))
  )
);
