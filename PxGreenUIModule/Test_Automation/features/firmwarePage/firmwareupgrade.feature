Feature: Validate Firmware Upgrade in Firmware Page

     User should be able to Upgrade Firmware by uploading firmware code pack

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Firmware Tab
          And User expands the FirmwareUpgrade section

     Scenario: Verify Firmware Upgrade with valid Web image codepack
          When User upload valid web image codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          And User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select web image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User clicks on continue button on successful update

     Scenario: Verify Cancel Firmware Upgrade on End User Licence Agreement Popup
          When User upload valid web image codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          And User clicks on Cancel button
          Then User should go back to firmware upgrade page

     Scenario: Verify Cancel Firmware Upgrade on Firmware Update pop up
          When User upload valid web image codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Cancel button
          And User should go back to firmware upgrade page

     Scenario: Verify Abort Firmware Upgrade on Firmware Update pop up
          When User upload valid web image codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select web image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User clicks on Abort button and clicks on continue
          And User should go back to firmware upgrade page

     Scenario: Verify Firmware Upgrade when Product GUID is not matched in codepack
          When User upload Product GUID is not matched codepack using Open Codepack button
          Then User should get pop up saying Invalid Product and Clicks Ok
          And User should go back to firmware upgrade page

     Scenario: Verify Firmware Upgrade when Image GUID is not matched in codepack
          When User upload Image GUID is not matched codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          Then User should see Processor Check box is Disabled

     Scenario: Verify Firmware Upgrade when Main Processor GUID is not matched in codepack
          When User upload Image GUID is not matched codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          Then User should see Processor Check box is Disabled

     Scenario: Verify Firmware Upgrade when upload wrong input type file
          When User upload invalid file using Open Codepack button
          Then User should get pop up saying Please select the correct file type and Try Again and clicks Ok
          And User should go back to firmware upgrade page

     Scenario: Verify Firmware Upgrade when Data Address is Modified in codepack
          When User upload Data Address is Modified codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select web image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User get error message like Codepack integrity check has failed

     Scenario: Verify Firmware Upgrade when Data Address is Deleted in codepack
          When User upload Data Address is Deleted codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          When User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select web image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User get error message like Final integrity check has failed

     Scenario: Verify Firmware Upgrade with valid language image codepack
          When User upload valid language image codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          And User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select language image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User clicks on continue button on successful update

     Scenario: Verify Firmware Upgrade with valid App image codepack
          When User upload valid App firmware codepack using Open Codepack button
          Then User should get End User Licence Agreement Popup
          And User accepts the eula to continue
          Then User should get Firmware Update pop up
          And User clicks on Select Processor
          And User should get Firmware / Code Pack Evaluation pop up
          And User select application image Check box and clicks on OK
          And User clicks on Install Updates button
          Then User verifies app firmware upgrade is successful