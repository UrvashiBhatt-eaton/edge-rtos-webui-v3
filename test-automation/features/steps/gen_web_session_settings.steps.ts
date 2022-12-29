import { actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { GeneralPage } from "../../spec/screenplay/ui/GeneralPage";
import { General_Tasks } from "../../spec/screenplay/tasks/General_Tasks";
import { isVisible, Wait, Text } from "@serenity-js/protractor";
import { Ensure, equals, or } from "@serenity-js/assertions";
import { LoginPage } from "../../spec/screenplay/ui/LoginPage";

When(/User Set (-?\d+) in User Account Inactivity Timeout input/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setAccountInactivityTimeout(timeoutvalue))
);

Then(/User should see (-?\d+) Seconds under User Account Inactivity Timeout/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getAccountInactivityTimeout(timeoutvalue))
);

Then(/User allow Inactivity for (-?\d+) Seconds/, { timeout: 1800 * 1000 }, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(Wait.for(Duration.ofSeconds(timeoutvalue)))
);

Then(/User should be logged out from the application/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LoginPage.usernameField, isVisible()),
    Ensure.that(LoginPage.usernameField, isVisible())
  )
);

Then(/User should see Error Message for User Account Inactivity Timeout input/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(GeneralPage.errorMsgAccountInactivityTimeout()), or(equals("Too low"), equals("Too high")))
  )
);

When(/User Set (-?\d+) in Maximum Concurrent Sessions input/, (numberofconcurrentsessions: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setMaximumConcurrentSessions(numberofconcurrentsessions))
);

Then(/User should see (-?\d+) under Maximum Concurrent Sessions/, (numberofconcurrentsessions: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getMaximumConcurrentSessions(numberofconcurrentsessions))
);

Then(/User should see Error Message for Maximum Concurrent Sessions input/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(GeneralPage.errorMsgMaximumConcurrentSessions()), or(equals("Too low"), equals("Too high")))
  )
);

When(/User Set (-?\d+) in User Absolute Timeout input/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setUserAbsoluteTimeout(timeoutvalue))
);

Then(/User should see (-?\d+) Seconds under User Absolute Timeout/, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getUserAbsoluteTimeout(timeoutvalue))
);
Then(/User allow Absolute time out for (-?\d+) Seconds/, { timeout: 43200 * 1000 }, (timeoutvalue: number) =>
  actorInTheSpotlight().attemptsTo(Wait.for(Duration.ofSeconds(timeoutvalue)))
);

Then(/User should see Error Message for User Absolute Timeout input/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(GeneralPage.errorMsgUserAbsoluteTimeout()), or(equals("Too low"), equals("Too high")))
  )
);

When(/User Set (-?\d+) in User User Lock Time input/, (locktimevalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setUserLockTime(locktimevalue))
);

Then(/User should see (-?\d+) Seconds under User Lock Time/, (locktimevalue: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setUserLockTime(locktimevalue))
);

Then(/User should see Error Message for User Lock Time input/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(GeneralPage.errorMsgUserLockTime()), or(equals("Too low"), equals("Too high")))
  )
);

When(/User Set (-?\d+) in Maximum Failed Login Attempts input/, (numoffailedattempts: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.setMaximumFailedLoginAttempts(numoffailedattempts))
);

Then(/User should see (-?\d+) under Maximum Failed Login Attempts/, (numoffailedattempts: number) =>
  actorInTheSpotlight().attemptsTo(General_Tasks.getMaximumFailedLoginAttempts(numoffailedattempts))
);

Then(/User should see Error Message for Maximum Failed Login Attempts input/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(GeneralPage.errorMsgMaximumFailedLoginAttempts()), or(equals("Too low"), equals("Too high")))
  )
);
