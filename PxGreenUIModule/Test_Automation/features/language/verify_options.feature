Feature: Verify a list of language options

    User should see a list of language options, including Browser Default and English

    Background:
        Given User launches the application
        * User with admin role logs into the application using 'admin' and 'qwerty'
        * User should be successfully logged into the application
        * User navigates to language selector

    Scenario Outline: User verifies the language options that are available.
        When Verify <language> is listed
        Then Dismiss the language selection combo
        * Dismiss the language selection popup

        Examples:
            | language        |
            | Browser Default |
            | English         |
            | French          |

    Scenario Outline: User verifies the language options that are not available.
        Then Verify <language> is not listed
        Then Dismiss the language selection combo
        * Dismiss the language selection popup

        Examples:
            | language |
            | Spanish  |
            | Arabic   |
