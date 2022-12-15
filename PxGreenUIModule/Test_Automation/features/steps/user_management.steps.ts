import { actorInTheSpotlight, Duration, Loop } from "@serenity-js/core";
import { Then, When } from "cucumber";
import { Ensure, equals, Check } from "@serenity-js/assertions";
import { Wait, Attribute, Click, isVisible, Enter, Pick } from "@serenity-js/protractor";
import { UserManagementPage } from "../../spec/screenplay/ui/UserManagementPage";
import { UserManagement_Tasks } from "../../spec/screenplay/tasks/UserManagement_Tasks";
import { UserManagementPageValidations } from "../../spec/screenplay/UserManagementPageValidations";
import {
  LogIntoApplication,
  LogIntoApplicationInvalidCredentials
} from "../../spec/screenplay/tasks/LogIntoApplication";
import { LoginPageValidations } from "../../spec/screenplay/LoginPageValidations";
import { ElementFinder, ElementArrayFinder } from "protractor";
import { Navigation_Tasks } from "../../spec/screenplay/tasks/Navigation_Tasks";
import { AvatarMenu } from "../../spec/screenplay/ui/AvatarMenu";

When(
  "User with admin role logs into the application using {string} and {string}",
  (username: string, password: string) => actorInTheSpotlight().attemptsTo(LogIntoApplication.with(username, password))
);

When(
  /User creates new user with the following information: (.*), (.*), (.*), (.*), (.*), (.*) and (.*)/,
  (
    username: string,
    fullname: string,
    passwordComplexity: number,
    passwordTimeoutDays: string,
    newPassword: string,
    confirmPassword: string,
    role: string
  ) =>
    actorInTheSpotlight().attemptsTo(
      UserManagement_Tasks.createNewUser(
        fullname,
        username,
        passwordComplexity,
        passwordTimeoutDays,
        newPassword,
        confirmPassword,
        role
      )
    )
);

Then(/User clicks on the User Management Tab/, () =>
  actorInTheSpotlight().attemptsTo(Navigation_Tasks.NavigationToUserManagementPage())
);

Then(/User clicks on the Add button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(UserManagementPage.addUserButton, isVisible()),
    Click.on(UserManagementPage.addUserButton)
  )
);

Then(/User clicks on the Edit button to edit the (.*) information/, (username: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(UserManagementPage.findUserToEdit(username), isVisible()),
    Click.on(UserManagementPage.findUserToEdit(username))
  )
);

Then(/clicks on the Delete button to delete the (.*)/, (username: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(UserManagementPage.findUserToDelete(username), isVisible()),
    Click.on(UserManagementPage.findUserToDelete(username))
  )
);

Then(/User should Logout out the application/, () =>
  actorInTheSpotlight().attemptsTo(
    Navigation_Tasks.NavigationToUserAvatarMenu(),
    Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.logoutNav, isVisible()),
    Click.on(AvatarMenu.logoutNav)
  )
);

Then(/User clicks on the Reset button/, () =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(UserManagementPage.resetButton, isVisible()),
    Click.on(UserManagementPage.resetButton)
  )
);

Then(/User clicks on the Reset Dialog button/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(UserManagementPage.resetUserDialogButton))
);

Then(/User clicks on the Save button/, () =>
  actorInTheSpotlight().attemptsTo(Click.on(UserManagementPage.saveUserDialogButton))
);

Then(/User should be re-directed to the login page if the update is successful/, () =>
  actorInTheSpotlight().attemptsTo(Ensure.that(UserManagementPageValidations.getLoginButtonText(), equals("Log In")))
);

Then(/(.*) should be able to login with the (.*)/, (username: string, password: string) =>
  actorInTheSpotlight().attemptsTo(LogIntoApplication.with(username, password))
);

Then(/User should select the Password complexity value: (.*)/, (pwdcomplexity: string) =>
  actorInTheSpotlight().attemptsTo(
    Click.on(UserManagementPage.passwordComplexityDropdownButton),
    Click.on(UserManagementPage.passwordComplexitySelectOption(pwdcomplexity))
  )
);

Then(/User enters the Password: (.*)/, (newpassword: string) =>
  actorInTheSpotlight().attemptsTo(Enter.theValue(newpassword).into(UserManagementPage.newPasswordField))
);

Then(/User should not meet the requirement for Password complexity value (.*)/, (pwdcomplexity: string) =>
  actorInTheSpotlight().attemptsTo(
    Loop.over(UserManagementPage.pwdComplexity(pwdcomplexity)).to(
      Check.whether(
        Attribute.of(Loop.item<ElementFinder>()).called("style"),
        equals("color: rgb(213, 216, 218); margin-right: 5px;")
      ).andIfSo(
        Ensure.that(
          Attribute.of(Loop.item<ElementFinder>()).called("style"),
          equals("color: rgb(213, 216, 218); margin-right: 5px;")
        )
      )
    )
  )
);

Then(
  /(.*) should verify the following information: (.*), (.*) and (.*) are updated/,
  (username: string, fullname: string, newpwdcomplexity: string, role: string) =>
    actorInTheSpotlight().attemptsTo(
      Navigation_Tasks.NavigationToUserManagementPage(),
      Wait.upTo(Duration.ofSeconds(9)).until(UserManagementPage.tableHeaderFullname, isVisible()),
      Wait.upTo(Duration.ofSeconds(10)).until(UserManagementPage.findUserToEdit(username), isVisible()),
      Ensure.that(UserManagementPageValidations.getFullNameText(username), equals(fullname)),
      Ensure.that(UserManagementPageValidations.getUserRole(username), equals(role)),
      Click.on(UserManagementPage.findUserToEdit(username)),
      Ensure.that(UserManagementPageValidations.getPwdComplexityOption(), equals(newpwdcomplexity))
    )
);

Then(
  /(.*) edits the (.*) information: (.*), (.*), (.*), (.*), (.*), (.*) and (.*)/,
  (
    user: string,
    otheruser: string,
    fullname: string,
    passwordComplexity: number,
    passwordTimeoutDays: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    role: string
  ) =>
    actorInTheSpotlight().attemptsTo(
      UserManagement_Tasks.editUser.with(
        fullname,
        passwordComplexity,
        passwordTimeoutDays,
        currentPassword,
        newPassword,
        confirmPassword,
        role
      )
    )
);

Then(/User should see the (.*) error message in the popup/, (errormsg: string) =>
  actorInTheSpotlight().attemptsTo(Ensure.that(UserManagementPageValidations.getErrorMsg(errormsg), equals(errormsg)))
);

Then(
  /(.*) edits the following information: (.*), (.*), (.*), (.*)/,
  (
    username: string,
    passwordTimeoutDays: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) =>
    actorInTheSpotlight().attemptsTo(
      UserManagement_Tasks.editUser.nonAdmin(passwordTimeoutDays, currentPassword, newPassword, confirmPassword)
    )
);

Then(
  /User enters the incorrect current loggedin password: (.*) while updating the password: (.*)/,
  (InvalidPassword: string, newPassword: string) =>
    actorInTheSpotlight().attemptsTo(UserManagement_Tasks.editUser.updateInvalidPwd(InvalidPassword, newPassword))
);

When(
  "User selects the {string} and enters password as {string} to reset",
  (resetOption: string, loggedPassword: string) =>
    actorInTheSpotlight().attemptsTo(UserManagement_Tasks.resetDeviceUserSettings.with(loggedPassword, resetOption))
);

When(/User logs into the application using (.*) and (.*)/, (username: string, password: string) =>
  actorInTheSpotlight().attemptsTo(LogIntoApplication.with(username, password))
);

Then(/User should change the user's role to (.*)/, (role: string) =>
  actorInTheSpotlight().attemptsTo(UserManagement_Tasks.editUser.selectUserRole(role))
);

Then(/User should close the edit drawer/, () =>
  actorInTheSpotlight().attemptsTo(UserManagement_Tasks.editUser.closeEditDrawer())
);

Then(/Verify deleted user can login into the application using (.*) and (.*)/, (username: string, password: string) =>
  actorInTheSpotlight().attemptsTo(
    LogIntoApplicationInvalidCredentials.with(username, password),
    Ensure.that(LoginPageValidations.HasErrorText(), equals(true))
  )
);

Then(/(.*) should be seen in the User Table on row/, (username: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.for(Duration.ofSeconds(9)),
    Ensure.that(UserManagementPageValidations.getUserNameText(username), equals(username))
  )
);

Then(/User should get the (.*) popup/, (popupname: string) =>
  actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(UserManagementPage.sessionExpiredPopupHeader, isVisible()),
    Ensure.that(UserManagementPageValidations.getSessionExpiredPopupHeader(), equals(popupname))
  )
);

Then(/User clicks on the Yes button/, () => actorInTheSpotlight().attemptsTo(Click.on(UserManagementPage.yesBtn)));

Then(
  /User verifies default admin can log into the application using (.*) and (.*)/,
  (username: string, password: string) =>
    actorInTheSpotlight().attemptsTo(
      LogIntoApplication.with(username, password),
      Ensure.that(UserManagementPageValidations.getChangePwdPopupHeader(), equals("Change Password"))
    )
);

Then(/User verifies all user accounts are reset successfully/, () =>
  actorInTheSpotlight().attemptsTo(
    Ensure.that(Pick.from<ElementFinder, ElementArrayFinder>(UserManagementPage.allUserCount).count(), equals(1))
  )
);
