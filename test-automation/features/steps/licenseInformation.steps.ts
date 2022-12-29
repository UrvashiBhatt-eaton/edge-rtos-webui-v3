import { Then, Given } from "cucumber";
import { actorInTheSpotlight, Duration, Loop, Note, TakeNote } from "@serenity-js/core";
import { Wait, Website, Switch, isVisible, Attribute, Click, Close } from "@serenity-js/protractor";
import { Ensure, equals, isGreaterThan, or } from "@serenity-js/assertions";
import { LicenseInformationPage } from "../../spec/screenplay/ui/LicenseInformationPage";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { ElementFinder } from "protractor";
import { Common_Tasks } from "../../spec/screenplay/tasks/Common_Tasks";

Given(/User click on Licence Information Tab/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(LicenseInformationPage.licenseInformationNavTab, isVisible()),
    Navigation_Tasks.NavigationToLicenseInformationPage()
  )
);

Then(/User should see Icon and License Links is at the top of the page/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(LicenseInformationPage.linksIcon, isVisible()),
    Ensure.that(LicenseInformationPage.licenseLinksHeaderText, isVisible())
  )
);

Then(/User should see at least one link/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofMilliseconds(10000)),
    Ensure.that(Common_Tasks.pickedlinks.count(), or(isGreaterThan(1), equals(1)))
  )
);

Then(/User click on each link and verify it works/, () =>
  actorInTheSpotlight().attemptsTo(
    Loop.over(LicenseInformationPage.getlink()).to(
      TakeNote.of(Attribute.of(Loop.item<ElementFinder>()).called("href")).as("License Info Page URL"),
      Click.on(Loop.item<ElementFinder>()),
      Switch.toNewWindow(),
      Wait.for(Duration.ofSeconds(15)),
      Ensure.that(Website.url(), equals(Note.of("License Info Page URL"))),
      Close.anyNewWindows()
    )
  )
);
