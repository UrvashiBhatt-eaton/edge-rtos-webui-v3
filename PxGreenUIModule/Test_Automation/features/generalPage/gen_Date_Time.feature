Feature: Validate Date and Time in General Tab

     User should be able to set time and SNTP Operation Enable/Disable

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the General Tab
          And User expands the DateandTime section

     # Scenario Outline: Enable the SNTP feature and set all Server address
     #      When User clicks on dropdown option for Set SNTP Operation Enable
     #      And the User selects the Manual IP Entry option from the dropdown
     #      Then Edit Time button should be hidden
     #      And User enters the <server1address> to SNTP Server 1 input field
     #      Then User should see <server1address> under SNTP Server 1
     #      And User enters the <server2address> to SNTP Server 2 input field
     #      Then User should see <server2address> under SNTP Server 2
     #      And User enters the <server3address> to SNTP Server 3 input field
     #      Then User should see <server3address> under SNTP Server 3
     #      Examples:
     #           | server1address       | server2address    | server3address      |
     #           | america.pool.ntp.org | asia.pool.ntp.org | europe.pool.ntp.org |
     #           | 151.110.232.100      | 151.110.232.100   | 151.110.232.100     |

     # Scenario Outline: Verify if error text is displayed for setting incorrect Server address
     #      When User clicks on dropdown option for Set SNTP Operation Enable
     #      And the User selects the Manual IP Entry option from the dropdown
     #      Then Edit Time button should be hidden
     #      And User enters the <server1address> to SNTP Server 1 input field
     #      Then User should see error text for SNTP Server 1
     #      And User enters the <server2address> to SNTP Server 2 input field
     #      Then User should see error text for SNTP Server 2
     #      And User enters the <server3address> to SNTP Server 3 input field
     #      Then User should see error text for SNTP Server 3
     #      Examples:
     #           | server1address    | server2address  | server3address |
     #           | @#in.pool.ntp.org | in.+ert.ntp.org | 192.145.12     |

     Scenario: Disable SNTP feature
          When User clicks on dropdown option for Set SNTP Operation Enable
          And the User selects the Disable option from the dropdown
          Then Disable should be displayed under SNTP Operation Enable
          Then Three SNTP server fields are hidden and the ability to edit the time is shown

     Scenario: Set the system's date and time
          When User expands the Locale section
          And User clicks on dropdown for Timezone
          And User sets the Time Zone
          And User clicks on dropdown for Date Format
          And User selects Date Format option - mm/dd/yyyy
          When User clicks on Edit time button
          And User select Use System time Radio Button and click on Save
          Then Current system date and time should be displayed

     Scenario: Verify Cancel button on Edit date and time pop up
          When User clicks on Edit time button
          And User selects the option Select Manual Time
          And User clicks on the Cancel button on the pop up
          Then User should be able to close the pop up

     Scenario: Set the date and time using the calendar widget
          When User clicks on Edit time button
          And User selects the option Select Manual Time
          And User sets the date and time using widget
          And the User clicks on the Save to apply the time
          Then User should see Manual time displayed