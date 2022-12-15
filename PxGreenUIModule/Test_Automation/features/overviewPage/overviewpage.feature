Feature: Validate Overview Page

     User should be able see Card(s) with read only fields

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty

     Scenario: Verifying if card(s) are visible on the page
          Then User should see at least one card and at least one param inside the card

     Scenario: Verifying if the parameter names are displayed
          Then User should see Parameters
          Then User should see each Parameter name starting with Capital letter

     Scenario: Verifying values of parameters
          Then User should see values of parameters
          Then User should see text is wrapped

     Scenario: Verifying hover text of parameters
          Then User should see hover text of all visible parameters

     Scenario: Verifying Panel titles are left aligned with param names
          Then User should see panel titles are left aligned with param names

     Scenario: Verify all param values inside the card are right aligned to the param names
          Then User should see all param values inside the card are right aligned to the param names

     Scenario Outline: Verifying cards widths are same on different resolution
          When User set resolution <width> and <height>
          Then If more than one card check the all card widths are equal

          Examples:
               | width | height |
               | 768   | 1024   |
               | 1100  | 584    |
               | 1366  | 768    |