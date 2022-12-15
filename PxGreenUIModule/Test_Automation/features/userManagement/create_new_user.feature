Feature: Validate the Create User feature in User Management Page

    Admin user should be able to create new users

    Scenario Outline: Verify that user can create the new user
        Given User launches the application
        When User with admin role logs into the application using 'admin' and 'qwerty'
        And User clicks on the User Management Tab
        And User clicks on the Add button
        Then User creates new user with the following information: <Username>, <Fullname>, <PasswordComplexity>, <PasswordTimeoutDays>, <NewPassword>, <ConfirmPassword> and <Role>
        Then User clicks on the Save button
        And <Username> should be seen in the User Table on row

        Examples:
            | Username | Fullname    | PasswordComplexity | PasswordTimeoutDays | NewPassword        | ConfirmPassword    | Role     |
            | User_1   | Test User 1 | 0                  | 0                   | qwerty             | qwerty             | Admin    |
            | User_2   | Test User 2 | 0                  | 0                   | qwerty             | qwerty             | Admin    |
            | User_3   | Test User 3 | 0                  | 0                   | asdfgh             | asdfgh             | Engineer |
            | User_4   | Test User 4 | 2                  | 0                   | QwertyQwerty12345! | QwertyQwerty12345! | Operator |
            | User_5   | Test User 5 | 0                  | 0                   | asdfgh             | asdfgh             | Engineer |
