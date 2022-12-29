Feature: Validate the Reset User feature in User Management Page

    Admin user should be able to Reset the users credentail

    Background:
        Given User launches the application
        When User with admin role logs into the application using 'admin' and 'qwerty'
        And User clicks on the User Management Tab
        Then User clicks on the Reset button

    Scenario: Verify that admin user can reset Default admin account.
        When User selects the 'default admin account' and enters password as 'qwerty' to reset
        And User clicks on the Reset Dialog button
        Then User should get the Session Expired popup
        And User clicks on the Yes button
        Then User verifies default admin can log into the application using admin and Admin*1

    Scenario: Verify that admin user can reset All user account.
        When User selects the 'all user accounts' and enters password as 'qwerty' to reset
        And User clicks on the Reset Dialog button
        Then User should get the Session Expired popup
        And User clicks on the Yes button
        When User logs into the application using admin and qwerty
        And User clicks on the User Management Tab
        Then User verifies all user accounts are reset successfully
