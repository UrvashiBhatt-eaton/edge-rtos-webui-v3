Feature: Log into Web UI 2.0 Application

    Background:
        Given User launches the application

    Scenario Outline: User logs into the Web application with correct creds
        When User logs in to the application using <Username> and <Password>
        Then User should be successfully logged into the application

        Examples:
            | SNo | Username | Password |
            | 1   | admin    | qwerty   |

    Scenario Outline: User fails to log into the Web application with incorrect creds
        When User uses invalid credentials <Username> and <Password>
        Then Error message is displayed to the User

        Examples:
            | SNo | Username | Password |
            | 1   | admin    | anything |