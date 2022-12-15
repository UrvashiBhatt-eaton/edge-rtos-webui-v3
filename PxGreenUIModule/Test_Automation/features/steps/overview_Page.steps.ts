import { actorInTheSpotlight, Duration, Loop } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";
import { OverviewPage } from "../../spec/screenplay/ui/OverviewPage";
import { Wait, Attribute, Pick, Text, ResizeBrowserWindow, isVisible } from "@serenity-js/protractor";
import {
  Ensure,
  equals,
  property,
  isGreaterThan,
  not,
  matches,
  or,
  isLessThan,
  Check,
  Expectation,
  and,
  startsWith
} from "@serenity-js/assertions";
import { ElementArrayFinder, ElementFinder } from "protractor";

function isWithin(lowerBound: any, upperBound: any) {
  return Expectation.to(`have value within ${lowerBound} and ${upperBound}`).soThatActual(
    and(or(isGreaterThan(lowerBound), equals(lowerBound)), or(isLessThan(upperBound), equals(upperBound)))
  );
}

Then(/User should see at least one card and at least one param inside the card/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    Check.whether(Common_Tasks.overviewPageCards.count(), or(isGreaterThan(1), equals(1))).andIfSo(
      Loop.over(OverviewPage.cards).to(
        Ensure.that(
          Pick.from<ElementFinder, ElementArrayFinder>(OverviewPage.paramNames.of(Loop.item())).count(),
          or(isGreaterThan(1), equals(1))
        )
      )
    )
  )
);

Then(/User should see Parameters/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(20000)),
    Loop.over(OverviewPage.paramNames).to(
      Ensure.that(Text.of(Loop.item<ElementFinder>()), not(or(equals(""), equals("Loading Channel..."))))
    )
  )
);

Then(/User should see each Parameter name starting with Capital letter/, () =>
  actorInTheSpotlight().attemptsTo(
    Loop.over(OverviewPage.paramNames).to(Ensure.that(Text.of(Loop.item<ElementFinder>()), matches(/^[A-Z]/)))
  )
);

Then(/User should see hover text of all visible parameters/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(20000)),
    Loop.over(OverviewPage.paramDescriptions).to(
      Ensure.that(Text.of(Loop.item<ElementFinder>()), property("length", isGreaterThan(0)))
    )
  )
);

Then(/User should see panel titles are left aligned with param names/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    Loop.over(OverviewPage.cardTitles).to(
      Wait.upTo(Duration.ofSeconds(5)).until(Loop.item<ElementFinder>(), isVisible()),
      Ensure.that(
        Attribute.of(Loop.item<ElementFinder>()).called("style"),
        startsWith("padding-left: 16px; padding-right: 16px;")
      )
    )
  )
);

Then(/User should see all param values inside the card are right aligned to the param names/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    Loop.over(OverviewPage.paramValues).to(
      Wait.upTo(Duration.ofSeconds(5)).until(Loop.item<ElementFinder>(), isVisible()),
      Ensure.that(
        Attribute.of(Loop.item<ElementFinder>()).called("style"),
        equals("text-align: right; word-break: break-word; max-width: 200px;")
      )
    )
  )
);

Then(/User should see values of parameters/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(20000)),
    Loop.over(OverviewPage.paramValues).to(
      Ensure.that(Text.of(Loop.item<ElementFinder>()), not(or(equals(""), equals("--"))))
    )
  )
);

Then(/User should see text is wrapped/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(6000)),
    Loop.over(OverviewPage.paramValues).to(
      Ensure.that(
        Attribute.of(Loop.item<ElementFinder>()).called("style"),
        equals("text-align: right; word-break: break-word; max-width: 200px;")
      )
    )
  )
);

Then(/If more than one card check the all card widths are equal/, () =>
  actorInTheSpotlight().attemptsTo(
    Check.whether(Common_Tasks.overviewPageCards.count(), isGreaterThan(1)).andIfSo(
      Loop.over(OverviewPage.cards).to(
        Ensure.that(
          Common_Tasks.SizeOf(Loop.item()),
          isWithin(
            Common_Tasks.SizeOfElemMinusWidth(Common_Tasks.overviewPageCards.first()),
            Common_Tasks.SizeOfElemPlusWidth(Common_Tasks.overviewPageCards.first())
          )
        )
      )
    )
  )
);

When(/User set resolution (-?\d+) and (-?\d+)/, (width: number, height: number) =>
  actorInTheSpotlight().attemptsTo(Wait.for(Duration.ofMilliseconds(6000)), ResizeBrowserWindow.to(width, height))
);
