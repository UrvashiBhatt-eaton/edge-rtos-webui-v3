Feature: Validate Connect to Eaton Hosted services in Network Page

     User should be able set IOT Enable or Disable,Device GUID and
     IOT HUB Server Connectiong String

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Network Tab
          And User expands the ConnecttoEatonHostedServices section

     Scenario: Verify Connect to Eaton Hosted services - IOT Enable or Disable - False
          When User click on dropdown option for IOT Enable or Disable
          And User should see True and False are available choices
          And the User selects the False option from the dropdown
          Then User should see False under IOT Enable or Disable field
          And User should not see other options like Device GUID and IOT HUB Server Connectiong String

     Scenario: Verify Connect to Eaton Hosted services - IOT Enable or Disable - True
          When User click on dropdown option for IOT Enable or Disable
          And User should see True and False are available choices
          And the User selects the True option from the dropdown
          Then User should see True under IOT Enable or Disable field
          And User should see cloud symbol in the right side corner

     Scenario Outline: Verify Connect to Eaton Hosted services - Device GUID
          When User Enter <guid> for Device GUID
          Then User should see <guid> under Device GUID field
          Examples:
               | guid                                 |
               | 035c5af6-ebfb-44cd-8fe6-6fc0d0f5b4b3 |

     Scenario Outline: Verify when No is clicked on the critical alert popup for IOT HUB Server Connectiong String
          When User Enter <connectionstring> for IOT HUB Server Connectiong String
          Then User should see alert popup for IOT HUB Server Connectiong String on mouse out
          And User clicks No on the alert popup
          Then User should not see <connectionstring> under IOT HUB Server Connectiong String field
          Examples:
               | connectionstring |
               | SomeIOTString    |