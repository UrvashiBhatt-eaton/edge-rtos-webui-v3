Feature: Validate the Delete User feature in User Management Page

    Admin user should be able to delete the user

    Scenario Outline: Verify that admin user can delete the existing users.
        Given User launches the application
        When User with admin role logs into the application using 'admin' and 'qwerty'
        Then User clicks on the User Management Tab
        And clicks on the Delete button to delete the <Username>
        Then User should Logout out the application
        And Verify deleted user can login into the application using <Username> and <Password>

        Examples:
            | Username | Password           |
            | User_1   | qwerty123          |
            | User_2   | Asdfghasdfgh12345! |
            | User_3   | qwerty             |
            | User_4   | QwertyQwerty12345! |
            | User_5   | qwerty             |