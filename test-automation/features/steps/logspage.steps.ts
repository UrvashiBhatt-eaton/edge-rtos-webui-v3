import { actorInTheSpotlight, Duration, Loop, TakeNote, Note } from "@serenity-js/core";
import { Then, Given } from "cucumber";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { Wait, isVisible, Text, Click, isEnabled, isClickable } from "@serenity-js/protractor";
import { LogsPage } from "../../spec/screenplay/ui/LogsPage";
import { Ensure, property, isGreaterThan, Check, or, equals, endsWith } from "@serenity-js/assertions";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";
import { ElementFinder } from "protractor";

Given(/User clicks on the Logs Tab/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(LogsPage.logsNavTab, isVisible()),
    Navigation_Tasks.NavigationToLogsPage()
  )
);

Then(/User should see List Of Logs button and Disabled Export Logs button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Ensure.that(LogsPage.listofLogsBtn, isVisible()),
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Ensure.that(LogsPage.clearLogsBtn, isVisible()),
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Ensure.that(LogsPage.exportLogsBtn, isVisible())
  )
);

Then(/User should see text message Select a log to display/, () =>
  actorInTheSpotlight().attemptsTo(Ensure.that(LogsPage.selectALogToDisplayText, isVisible()))
);

Then(
  /User clicks on List of logs button and Verify at leaset one type log item and Each Log type should not be blank/,
  () =>
    actorInTheSpotlight().attemptsTo(
      Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
      Click.on(LogsPage.listofLogsBtn),
      Check.whether(Common_Tasks.typeOfLogs.count(), or(isGreaterThan(1), equals(1))).andIfSo(
        Loop.over(LogsPage.getTypeOfLogsItems).to(
          Ensure.that(Text.of(Loop.item<ElementFinder>()), property("length", isGreaterThan(0)))
        )
      )
    )
);

Then(/User clicks on List of logs button and verify each type of logs/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Click.on(LogsPage.listofLogsBtn),
    Loop.over(LogsPage.getTypeOfLogsItems).to(
      Wait.for(Duration.ofSeconds(2)),
      TakeNote.of(Text.of(Loop.item<ElementFinder>())).as("Selected Log Type"),
      Click.on(Loop.item<ElementFinder>()),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LogsPage.noLogEntriesToDisplayText, isVisible())
        .andIfSo(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        .otherwise(
          Check.whether(LogsPage.clearLogsBtn, isEnabled())
            .andIfSo(
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.typeOfLogHeader, isVisible()),
              Ensure.that(Text.of(LogsPage.typeOfLogHeader), equals(Note.of("Selected Log Type"))),
              Loop.over(LogsPage.getTextOfEachHeaderOnLogsTable).to(
                Ensure.that(Text.of(Loop.item<ElementFinder>()), property("length", isGreaterThan(0)))
              ),
              Loop.over(LogsPage.getTextOfEachField).to(
                Ensure.that(Text.of(Loop.item<ElementFinder>()), property("length", isGreaterThan(0)))
              ),
              Click.on(LogsPage.listofLogsBtn)
            )
            .otherwise(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        )
    )
  )
);

Then(/Total Logs count should be displyed if logs are present/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Click.on(LogsPage.listofLogsBtn),
    Loop.over(LogsPage.getTypeOfLogsItems).to(
      Wait.for(Duration.ofSeconds(2)),
      TakeNote.of(Text.of(Loop.item<ElementFinder>())).as("Selected Log Type"),
      Click.on(Loop.item<ElementFinder>()),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LogsPage.noLogEntriesToDisplayText, isVisible())
        .andIfSo(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        .otherwise(
          Check.whether(LogsPage.clearLogsBtn, isEnabled())
            .andIfSo(
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.typeOfLogHeader, isVisible()),
              Ensure.that(Text.of(LogsPage.typeOfLogHeader), equals(Note.of("Selected Log Type"))),
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.getTotalLogCount, isVisible()),
              Ensure.that(
                Text.of(LogsPage.getTotalLogCount),
                endsWith(<string>(<unknown>Common_Tasks.getNoOfRows.count()))
              ),
              Click.on(LogsPage.listofLogsBtn)
            )
            .otherwise(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        )
    )
  )
);

Then(/Verify Cancel button for clear Logs if logs are present/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Click.on(LogsPage.listofLogsBtn),
    Loop.over(LogsPage.getTypeOfLogsItems).to(
      Wait.for(Duration.ofSeconds(2)),
      TakeNote.of(Text.of(Loop.item<ElementFinder>())).as("Selected Log Type"),
      Click.on(Loop.item<ElementFinder>()),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LogsPage.noLogEntriesToDisplayText, isVisible())
        .andIfSo(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        .otherwise(
          Check.whether(LogsPage.clearLogsBtn, isEnabled())
            .andIfSo(
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.typeOfLogHeader, isVisible()),
              Ensure.that(Text.of(LogsPage.typeOfLogHeader), equals(Note.of("Selected Log Type"))),
              Click.on(LogsPage.clearLogsBtn),
              Click.on(LogsPage.cancelBtn),
              Click.on(LogsPage.listofLogsBtn)
            )
            .otherwise(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        )
    )
  )
);

Then(/Verify Export Logs button if logs are present/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Click.on(LogsPage.listofLogsBtn),
    Loop.over(LogsPage.getTypeOfLogsItems).to(
      Wait.for(Duration.ofSeconds(2)),
      TakeNote.of(Text.of(Loop.item<ElementFinder>())).as("Selected Log Type"),
      Click.on(Loop.item<ElementFinder>()),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LogsPage.noLogEntriesToDisplayText, isVisible())
        .andIfSo(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        .otherwise(
          Check.whether(LogsPage.exportLogsBtn, isEnabled())
            .andIfSo(
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.typeOfLogHeader, isVisible()),
              Ensure.that(Text.of(LogsPage.typeOfLogHeader), equals(Note.of("Selected Log Type"))),
              Click.on(LogsPage.exportLogsBtn),
              Wait.for(Duration.ofSeconds(6)),
              Click.on(LogsPage.listofLogsBtn)
            )
            .otherwise(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        )
    )
  )
);

Then(/Verify Clear button for Clear Logs if logs are present/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(9)).until(LogsPage.listofLogsBtn, isVisible()),
    Click.on(LogsPage.listofLogsBtn),
    Loop.over(LogsPage.getTypeOfLogsItems).to(
      Wait.for(Duration.ofSeconds(2)),
      TakeNote.of(Text.of(Loop.item<ElementFinder>())).as("Selected Log Type"),
      Click.on(Loop.item<ElementFinder>()),
      Wait.for(Duration.ofSeconds(5)),
      Check.whether(LogsPage.noLogEntriesToDisplayText, isVisible())
        .andIfSo(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        .otherwise(
          Check.whether(LogsPage.clearLogsBtn, isEnabled())
            .andIfSo(
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.typeOfLogHeader, isVisible()),
              Click.on(LogsPage.clearLogsBtn),
              Click.on(LogsPage.clearBtn),
              Wait.upTo(Duration.ofSeconds(30)).until(LogsPage.noLogEntriesToDisplayText, isVisible()),
              Ensure.that(LogsPage.noLogEntriesToDisplayText, isVisible()),
              Click.on(LogsPage.listofLogsBtn)
            )
            .otherwise(Wait.until(LogsPage.listofLogsBtn, isClickable()), Click.on(LogsPage.listofLogsBtn))
        )
    )
  )
);
