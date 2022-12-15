Feature: Validate Locale in General Tab

      User should be able to set Timezone, Date Format and Time Format

      Background:
            Given User launches the application
            And User logs into the application using admin and qwerty
            And User clicks on the General Tab
            And User expands the DateandTime section
            And User clicks on dropdown option for Set SNTP Operation Enable
            And the User selects the Disable option from the dropdown
            And User expands the Locale section

      Scenario Outline: Set Timezone in Locale sections
            And User clicks on dropdown for Timezone
            And User selects the Time Zone option - <timezone>
            Then Selected <timezone> should be displayed under Timezone
            And Selected <timezone> should also be displayed right side corner
            Examples:
                  | timezone  |
                  | GMT-01:00 |
                  | GMT-02:00 |
                  | GMT/UTC   |
                  | GMT+05:30 |

      Scenario Outline: Verify setting of the date formats in Locale section
            And User clicks on Edit time button
            And User select Use System time Radio Button and click on Save
            And User clicks on dropdown for Date Format
            And User selects Date Format option - <dateFormat>
            Then Selected <dateFormat> should be displayed under Date Format
            And User should see Date displayed in the format <dateFormat> on right side corner
            Examples:
                  | dateFormat |
                  | mm/dd/yyyy |
                  | dd/mm/yyyy |
                  | yyyy-mm-dd |
                  | dd mm yyyy |

      Scenario Outline: Verify setting of the time formats in Locale section
            And User clicks on dropdown for Timezone
            And User sets the Time Zone
            And User clicks on dropdown for Date Format
            And User selects Date Format option - mm/dd/yyyy
            When User clicks on Edit time button
            And User select Use System time Radio Button and click on Save
            And User clicks on dropdown for Time Format
            And User selects Time Format option - <timeFormat>
            Then Selected <timeFormat> should be displayed under Time Format
            And User should see time displayed in <timeFormat> right side corner
            Examples:
                  | timeFormat    |
                  | 12Hrs (AM/PM) |
                  | 24Hrs         |

