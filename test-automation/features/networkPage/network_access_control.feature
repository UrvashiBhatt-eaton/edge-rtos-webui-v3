Feature: Validate Access Control in Network Page

     User should be able set Modbus TCP, Bacnet IP, HTTP and CORS Origin Type

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Network Tab
          And User expands the AccessControl section

     Scenario: Verify Modbus TCP - Disable
          When User clicks on dropdown option for Modbus TCP
          And the User selects the Disable option from the dropdown
          Then User should get Disable alert pop up and text on the pop up should not be blank
          And  User clicks on Yes button
          And User should see Disable under Modbus TCP field

     Scenario: Verify Modbus TCP - Enable
          When User clicks on dropdown option for Modbus TCP
          And the User selects the Enable option from the dropdown
          Then User should get Enable alert pop up and text on the pop up should not be blank
          And  User clicks on Yes button
          Then User should see Enable under Modbus TCP field

     Scenario: Verify Bacnet IP - Disable
          When User clicks on dropdown option for Bacnet IP
          And the User selects the Disable option from the dropdown
          Then User should get Disable alert pop up and text on the pop up should not be blank
          And  User clicks on Yes button
          And User should see Disable under Bacnet IP field

     Scenario: Verify Bacnet IP - Enable
          When User clicks on dropdown option for Bacnet IP
          And the User selects the Enable option from the dropdown
          Then User should get Enable alert pop up and text on the pop up should not be blank
          And  User clicks on Yes button
          And User should see Enable under Bacnet IP field

# Scenario: Verify HTTP - Disable
#      When User clicks on dropdown option for HTTP
#      And the User selects the Disable option from the dropdown
#      Then User should get Disable alert pop up and text on the pop up should not be blank
#      And  User clicks on Yes button
#      And User should see another pop up with HTTP disabled message to reload the app

# Scenario: Verify CORS Origin Type - (Active device IP)- allows Origin with device IP
#      When User clicks on dropdown option for CORS Origin Type
#      And the User selects the (Active device IP) - allows Origin with device IP option from the dropdown
#      Then User should get allows Origin with device IP alert pop up and text on the pop up should not be blank
#      And  User clicks on Yes button
#      And User should see allows Origin with device IP under CORS Origin Type field

#    Scenario: Verify CORS Origin Type - (*)- allows all Origin
#         When User clicks on dropdown option for CORS Origin Type
#          And the User selects the (*) - allows all Origin option from the dropdown
#         Then User should get allows Origin alert pop up and text on the pop up should not be blank
#          And  User clicks on Yes button
#          And User should see allows all Origin under CORS Origin Type field