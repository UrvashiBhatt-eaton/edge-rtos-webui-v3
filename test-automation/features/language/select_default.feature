Feature: Browser default language

    User should be able to select the default browser language

    Background:
        Given User launches the application
        * User with admin role logs into the application using 'admin' and 'qwerty'
        * User should be successfully logged into the application
        * User navigates to language selector

    Scenario: Select the Browser Default language
        When Choose the Browser Default
        Then Dismiss the language selection popup
