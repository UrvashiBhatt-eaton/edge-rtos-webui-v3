Feature: Validate Firmware Information in Firmware Page

     User should be able verify Serial Number, Product Code,
     ProductName, Model Name, Set Assigned Name
     and Firmware Upgrade Mode

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Firmware Tab
          And User expands the FirmwareInformation section

     Scenario: Verify Static fields under Firmware Version
          Then User should see Serial Number value and should not be blank
          And User should see Product Code and should not be blank
          And User should see ProductName and should not be blank
          And User should see Model Name and should not be blank

     Scenario Outline: Verify Set Assigned Name
          When User enters the <assigned_name> in Assigned Name input
          Then User should see <assigned_name> under Assigned Name

          Examples:
               | assigned_name      |
               | RTOS TOOL KIT Test |
               | RTOS TOOL KIT      |

     Scenario Outline: Set Firmware Upgrade Mode
          When User selects the <upgrade_mode> option from the Firmware Upgrade Mode dropdown
          Then User clicks Yes on the Alert popup to apply the <upgrade_mode>
          And <upgrade_mode> should be displayed under Firmware Upgrade Mode

          Examples:
               | upgrade_mode                      |
               | Upgrade to same or higher version |
               | Upgrade not allowed               |
               | Upgrade to any version            |