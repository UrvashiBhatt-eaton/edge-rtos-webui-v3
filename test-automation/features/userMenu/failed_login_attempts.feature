Feature: Validate User Menu - Login History - No of Failed Attempts

  User should be able see No of Failed Attempts in Login History

  Scenario: Verify no of Failed attempts
    Given User launches the application
    And User uses invalid credentials admin and wrongPassword1
    And User uses invalid credentials admin and Wrongpassword2
    And User logs into the application using admin and qwerty
    And User navigates to user menu
    When User clicks on Login History
    Then User should see no of failed attempts
