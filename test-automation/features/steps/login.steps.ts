import { actorCalled, actorInTheSpotlight, Duration } from "@serenity-js/core";
import { Navigate, isClickable, Wait } from "@serenity-js/protractor";
import { Given, Then, When } from "cucumber";
import { Ensure, equals } from "@serenity-js/assertions";
import {
  LogIntoApplication,
  LogIntoApplicationInvalidCredentials
} from "../../spec/screenplay/tasks/LogIntoApplication";
import { LoginPageValidations } from "../../spec/screenplay/LoginPageValidations";
import { AvatarMenu } from "../../spec/screenplay/ui/AvatarMenu";

export namespace failedAttempt {
  export let failedAttempyCount: number = 0;
}

Given(/(.*) launches the application/, (actorName: string) =>
  actorCalled(actorName).attemptsTo(Navigate.to("/if/index.html"))
);

When(/User logs in to the application using (.*) and (.*)/, (username: string, password: string) =>
  actorInTheSpotlight().attemptsTo(LogIntoApplication.with(username, password))
);

When(/User uses invalid credentials (.*) and (.*)/, (username: string, password: string) => {
  failedAttempt.failedAttempyCount += 1;
  return actorInTheSpotlight().attemptsTo(LogIntoApplicationInvalidCredentials.with(username, password));
});

Then("User should be successfully logged into the application", () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.avatarNav, isClickable()),
    Ensure.that(AvatarMenu.avatarNav, isClickable())
  )
);

Then("Error message is displayed to the User", () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(
      LoginPageValidations.HasErrorText(),
      //equals("Invalid User Credentials")
      equals(true)
    )
  )
);
