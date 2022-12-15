Feature: Validate Device Actions in General Tab

    User should be able to Reboot or Reset Device

    Background:
        Given User launches the application
        And User logs into the application using admin and qwerty
        And User clicks on the General Tab
        And User expands the DeviceActions section

    Scenario: Verify Reboot device - Close pop up using Close button
        When User clicks on dropdown for Reboot or Reset Device
        And the User selects the Reboot Device option from the dropdown
        Then User should see Reboot Device Alert Pop up and text on the pop up should not be blank
        And User Clicks on Close Button on Reboot Device Alert Popup
        And User should be able to close Reboot Device pop up

    Scenario: Verify Factory Reset - Close pop up using Close button
        When User clicks on dropdown for Reboot or Reset Device
        And the User selects the Factory Reset option from the dropdown
        Then User should see Factory Reset Alert Pop up and text on the pop up should not be blank
        And User Clicks on Close Button on Factory Reset Alert Popup
        And User should be able to close Factory Reset Alert pop up