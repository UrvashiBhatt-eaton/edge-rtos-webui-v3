import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Wait, isVisible, Click, Attribute } from "@serenity-js/protractor";
import { AvatarMenu } from "../../spec/screenplay/ui/AvatarMenu";
import { Ensure, equals } from "@serenity-js/assertions";
import { failedAttempt } from "../../features/steps/login.steps";

When(/User clicks on Login History/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.loginHistoryNav, isVisible()),
    Click.on(AvatarMenu.loginHistoryNav)
  )
);

Then(/User should see no of failed attempts/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.getFailedAttempts, isVisible()),
    Ensure.that(
      Attribute.of(AvatarMenu.getFailedAttempts).called("value"),
      equals(failedAttempt.failedAttempyCount.toString())
    )
  )
);
