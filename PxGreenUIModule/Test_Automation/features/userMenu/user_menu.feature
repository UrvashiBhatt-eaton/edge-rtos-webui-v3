Feature: Validate User Avatar Menu only available to RTOS

     The User Avatar Menu has below options:-
     - Import/Export
     - Change Password

     Background:
          Given User launches the application

     Scenario: Verify Export feature for downloading DCI parameters from Device into JSON file
          When User logs into the application using admin and qwerty
          And User navigates to user menu
          And User clicks on Import/Export option
          Then User should see the Import/Export Popup
          When User clicks on the export option
          Then User verifies the exported file and its contents

     Scenario: Verify Import feature by uploading incorrect file
          When User logs into the application using admin and qwerty
          And User navigates to user menu
          And User clicks on Import/Export option
          Then User should see the Import/Export Popup
          And User uploads the incorrect file by clicking the Import button
          Then User can see the Alert for selecting the incorrect file

     Scenario: Verify Import feature by uploading incorrect formatted JSON file
          When User logs into the application using admin and qwerty
          And User navigates to user menu
          And User clicks on Import/Export option
          Then User should see the Import/Export Popup
          And User uploads incorrect formatted JSON configuration file by clicking the Import button
          Then User can see the Alert for selecting the incorrect formatted file

     Scenario: Verify Import feature for uploading DCI parameters from JSON file into the Device
          When User logs into the application using admin and qwerty
          And User navigates to user menu
          And User clicks on Import/Export option
          Then User should see the Import/Export Popup
          And User uploads the JSON configuration file by clicking the Import button
          Then User verifies the configuration is updated to the device

     Scenario: Verify Import feature by uploading valid JSON file with non-writable DCI parameters
          When User logs into the application using admin and qwerty
          And User navigates to user menu
          And User clicks on Import/Export option
          Then User should see the Import/Export Popup
          And User uploads the JSON configuration file which contains non-writable paramters by clicking the Import button
          Then User can see the Alert Popup with error content

     Scenario Outline: Verify Change Password functionality
          When User logs into the application using admin and <currentpassword>
          And User navigates to user menu
          When User clicks on Change Password
          And User enter the <currentpassword> in Current Password field
          And User enter the <newpassword> in New Password field
          And User enter the <newpassword> in Confirm Password field
          And User clicks on the Ok button
          Then User should be logged out from the application
          And User logs into the application using admin and <newpassword>
          Examples:
               | currentpassword | newpassword |
               | qwerty          | qwerty1     |
               | qwerty1         | qwerty      |