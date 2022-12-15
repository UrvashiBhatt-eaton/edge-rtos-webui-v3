import { actorInTheSpotlight, Task, Duration } from "@serenity-js/core";
import { ExecuteScript, Wait, isVisible } from "@serenity-js/protractor";
import { Then } from "cucumber";
import { Ensure, equals } from "@serenity-js/assertions";
import { Language_Tasks } from "../../spec/screenplay/tasks/Language_Tasks";
import { ClickBody } from "../../spec/screenplay/tasks/ClickBody";
import { LanguageValidations } from "../../spec/screenplay/LanguageValidations";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { AvatarMenu } from "../../spec/screenplay/ui/AvatarMenu";

Then(/Clears language settings/, () =>
  actorInTheSpotlight().attemptsTo(
    Task.where(
      `#actor clears local storage`,
      ExecuteScript.sync('localStorage.removeItem("lang")'),
      ExecuteScript.sync('localStorage.removeItem("langSetting")')
    )
  )
);

Then(/User navigates to language selector/, () =>
  actorInTheSpotlight().attemptsTo(Language_Tasks.showLanguageSelector())
);

Then(/User navigates to user menu/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(AvatarMenu.avatarNav, isVisible()),
    Navigation_Tasks.NavigationToUserAvatarMenu()
  )
);

Then(/User navigates to page navigation menu/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToPageNavigationMenu())
);

Then(/User navigates to general page/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToGeneralPage())
);

Then(/User navigates to firmware page/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToFirmwarePage())
);

Then(/User navigates to user management page/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToUserManagementPage())
);

Then(
  /Verify (.*) is listed/,
  (language: string) =>
    actorInTheSpotlight().attemptsTo(Language_Tasks.showLanguageChoices()) &&
    actorInTheSpotlight().attemptsTo(Language_Tasks.checkLanguageIsListed(language))
);

Then(
  /Verify (.*) is not listed/,
  (language: string) =>
    actorInTheSpotlight().attemptsTo(Language_Tasks.showLanguageChoices()) &&
    actorInTheSpotlight().attemptsTo(Language_Tasks.checkLanguageIsNotListed(language))
);

Then(/Dismiss the language selection popup/, () =>
  actorInTheSpotlight().attemptsTo(Language_Tasks.dismissLanguagePopup())
);

Then(/Choose the Browser Default/, () => actorInTheSpotlight().attemptsTo(Language_Tasks.selectBrowserDefault()));

Then(/Select (.*) language/, (language: string) =>
  actorInTheSpotlight().attemptsTo(Language_Tasks.selectLanguage(language))
);

Then(/Dismiss the language selection combo/, () => actorInTheSpotlight().attemptsTo(ClickBody()));

Then(/Save the language selection/, () => actorInTheSpotlight().attemptsTo(Language_Tasks.saveSelectedLanguage()));

Then(
  /Verify the language selection is (.*)/,
  (language: string) =>
    actorInTheSpotlight().attemptsTo(Language_Tasks.showLanguageChoices()) &&
    actorInTheSpotlight().attemptsTo(Ensure.that(LanguageValidations.getSelectedLanguage(), equals(language)))
);

Then(/Verify the Language string in User menu is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(Ensure.that(LanguageValidations.getLanguageNavText(), equals(translatedString)))
);

Then(/Verify the Copyright disclaimer in the drawer is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(LanguageValidations.getCopyrightDisclaimerText(), equals(translatedString))
  )
);

Then(/Verify the Fullname is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(Ensure.that(LanguageValidations.getFullnameText(), equals(translatedString)))
);

Then(/Verify the Open Codepack is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(Ensure.that(LanguageValidations.getOpenCodepackText(), equals(translatedString)))
);

Then(/Verify the Locale is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(LanguageValidations.getLocaleSectionHeaderText(), equals(translatedString))
  )
);

Then(/Verify the login label is translated to (.*)/, (translatedString: string) =>
  actorInTheSpotlight().attemptsTo(Ensure.that(LanguageValidations.getLoginUsernameLabel(), equals(translatedString)))
);
