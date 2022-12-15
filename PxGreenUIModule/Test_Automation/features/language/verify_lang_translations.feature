Feature: Verify language translations

    User should see the web application translated as per the selected language

    Background:
        Given User launches the application
        * User with admin role logs into the application using 'admin' and 'qwerty'
        * User should be successfully logged into the application
        * User navigates to language selector


    Scenario Outline: Verify the labels in the User Avatar menu are translated
        When Select <Language> language
        * Save the language selection
        * User navigates to user menu
        Then Verify the Language string in User menu is translated to <Translation>

        Examples:
            | Language        | Translation |
            | French          | Langue      |
            | Browser Default | Language    |
            | German          | Sprache     |
            | English         | Language    |


# Scenario Outline: Verify the labels in the Page Navigation menu are translated
#     When Select <Language> language
#     * Save the language selection
#     * User navigates to page navigation menu
#     Then Verify the Copyright disclaimer in the drawer is translated to <Copyright>

#     Examples:
#         | Language        | Copyright                                      |
#         | Browser Default | @ Copyright 2020 EATON All Rights Reserved     |
#         | French          | @ Copyright 2020 EATON Tous Droits Réservés    |
#         | German          | @ Copyright 2020 EATON Alle Rechte Vorbehalten |
#         | English         | @ Copyright 2020 EATON All Rights Reserved     |


# Scenario Outline: Verify the labels in the Login page are translated
#     When Select <Language> language
#     * Save the language selection
#     * User launches the application
#     Then Verify the login label is translated to <Login>

#     Examples:
#         | Language        | Login        |
#         | Browser Default | Log In       |
#         | French          | S'identifier |
#         | German          | Anmeldung    |
#         | English         | Log In       |


# Scenario Outline: Verify the labels in the General page are translated
#     When Select <Language> language
#     * Save the language selection
#     * User navigates to general page
#     Then Verify the Locale is translated to <Locale>

#     Examples:
#         | Language        | Locale     |
#         | Browser Default | Locale     |
#         | French          | Lieu       |
#         | German          | Schauplatz |
#         | English         | Locale     |


# Scenario Outline: Verify the labels in the Firmware page are translated
#     When Select <Language> language
#     * Save the language selection
#     * User navigates to firmware page
#     Then Verify the Open Codepack is translated to <Open_Codepack>

#     Examples:
#         | Language        | Open_Codepack           |
#         | Browser Default | Open Codepack           |
#         | French          | Ouvrir Codepack         |
#         | German          | Öffnen Sie das Codepack |
#         | English         | Open Codepack           |


# Scenario Outline: Verify the labels in the User Management page are translated
#     When Select <Language> language
#     * Save the language selection
#     * User navigates to user management page
#     Then Verify the Fullname is translated to <Fullname>

#     Examples:
#         | Language        | Fullname           |
#         | Browser Default | Full Name          |
#         | French          | Nom Complet        |
#         | German          | Vollständiger Name |
#         | English         | Full Name          |