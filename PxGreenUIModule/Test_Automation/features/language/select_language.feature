Feature: Language Selection

    User should be able to select a language

    Background:
        Given User launches the application
        * User with admin role logs into the application using 'admin' and 'qwerty'
        * User should be successfully logged into the application
        * User navigates to language selector

    Scenario Outline: Select a language
        When Select <language> language
        Then Dismiss the language selection popup

        Examples:
            | language        |
            | Browser Default |
            | Spanish         |
            | English         |
