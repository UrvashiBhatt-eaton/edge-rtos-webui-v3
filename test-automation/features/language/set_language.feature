Feature: Language Selection

    User should be able to select a language

    Background:
        Given User launches the application
        * User with admin role logs into the application using 'admin' and 'qwerty'
        * User should be successfully logged into the application
        * User navigates to language selector

    Scenario Outline: Set a language
        When Select <language> language
        * Save the language selection
        * User navigates to language selector
        Then Verify the language selection is <language>

        Examples:
            | language        |
            | English         |
            | Browser Default |
