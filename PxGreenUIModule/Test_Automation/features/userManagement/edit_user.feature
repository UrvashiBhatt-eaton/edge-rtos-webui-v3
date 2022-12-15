Feature: Validate the Edit User feature in User Management Page

    Admin user should be able to update the user information

    Background:
        Given User launches the application

    Scenario Outline: Verify that any admin user can edit his/her own information
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <UserName> information
        And <UserName> edits the <UserName> information: <FullName>, <NewPasswordComplexity>, <NewPasswordTimeoutDays>, <CurrentPassword>, <NewPassword>, <ConfirmPassword> and <Role>
        And User clicks on the Save button
        Then User should be re-directed to the login page if the update is successful
        And <UserName> should be able to login with the <NewPassword>
        Then <UserName> should verify the following information: <FullName>, <NewPasswordComplexity> and <Role> are updated

        Examples:
            | UserName | FullName  | NewPasswordComplexity | NewPasswordTimeoutDays | CurrentPassword | NewPassword        | ConfirmPassword    | Role  |
            | admin    | Venu      | 1                     | 2                      | qwerty          | qwerty123          | qwerty123          | Admin |
            | admin    | Venugopal | 0                     | 1                      | qwerty123       | qwerty             | qwerty             | Admin |
            | User_1   | Melwyn    | 2                     | 0                      | qwerty          | QwertyQwerty12345! | QwertyQwerty12345! | Admin |

    Scenario Outline: Verify that any admin user can edit other user's information
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <OtherUserName> information
        And <UserName> edits the <OtherUserName> information: <FullName>, <NewPasswordComplexity>, <NewPasswordTimeoutDays>, <CurrentPassword>, <NewPassword>, <ConfirmPassword> and <Role>
        And User clicks on the Save button
        Then <OtherUserName> should verify the following information: <FullName>, <NewPasswordComplexity> and <Role> are updated

        Examples:
            | UserName | OtherUserName | FullName       | NewPasswordComplexity | NewPasswordTimeoutDays | CurrentPassword    | NewPassword        | ConfirmPassword    | Role     |
            | User_1   | User_2        | Shekar         | 2                     | 0                      | QwertyQwerty12345! | QwertyQwerty12345! | QwertyQwerty12345! | Viewer   |
            | admin    | User_3        | Prayas Samriya | 0                     | 0                      | qwerty             | qwerty             | qwerty             | Admin    |
            | admin    | User_1        | Melwyn Dsouza  | 1                     | 1                      | qwerty             | qwerty123          | qwerty123          | Engineer |

    Scenario Outline: Verify that non admin user can edit his own information
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <UserName> information
        And <UserName> edits the following information: <NewPasswordTimeoutDays>, <CurrentPassword>, <NewPassword>, <ConfirmPassword>
        And User clicks on the Save button
        Then User should be re-directed to the login page if the update is successful
        And <UserName> should be able to login with the <NewPassword>

        Examples:
            | UserName | NewPasswordTimeoutDays | CurrentPassword | NewPassword | ConfirmPassword |
            | User_5   | 0                      | asdfgh          | qwerty      | qwerty          |

    Scenario Outline: Verify if the user can update the password by providing incorrect LoggedIn password
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <UserName> information
        And User enters the incorrect current loggedin password: <InvalidLoggedInPassword> while updating the password: <NewPassword>
        And User clicks on the Save button
        Then User should see the Invalid logged in user password error message in the popup

        Examples:
            | UserName | CurrentPassword | InvalidLoggedInPassword | NewPassword |
            | admin    | qwerty          | qwerty123               | Qwerty321   |
            | User_1   | qwerty123       | asdfgh                  | 321qwerty   |

    Scenario Outline: Verify the admin can edit own role when there is an existing admin role.
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <UserName> information
        And User should change the user's role to <UserRole>
        And User clicks on the Save button
        Then User should be re-directed to the login page if the update is successful

        Examples:
            | UserName | CurrentPassword | UserRole |
            | User_3   | qwerty          | Operator |

    Scenario Outline: Verify the admin can edit his/her own role when there is no other user with admin role.
        When User logs into the application using admin and qwerty
        Then User clicks on the User Management Tab
        And User clicks on the Edit button to edit the admin information
        And User should change the user's role to <UserRole>
        And User clicks on the Save button
        Then User should see the One Admin Role is manadatory in System error message in the popup

        Examples:
            | UserRole |
            | Operator |

    Scenario Outline: Verify if the entered password does not meet the password complexity requirements
        When User logs into the application using <UserName> and <CurrentPassword>
        And User clicks on the User Management Tab
        And User clicks on the Edit button to edit the <UserName> information
        And User should select the Password complexity value: <PasswordComplexity>
        And User enters the Password: <NewPassword>
        Then User should not meet the requirement for Password complexity value <PasswordComplexity>

        Examples:
            | UserName | PasswordComplexity | CurrentPassword | NewPassword |
            | admin    | 3                  | qwerty          | qwer        |
            | admin    | 1                  | qwerty          | qwer        |



