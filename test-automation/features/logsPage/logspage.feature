Feature: Validate Logs Page

      User should be able see List of Logs, Clear Logs, Export Logs

      Background:
            Given User launches the application
            And User logs into the application using admin and qwerty
            And User clicks on the Logs Tab

      Scenario: Verify Logs Page
            Then User should see List Of Logs button and Disabled Export Logs button
            And User should see text message Select a log to display

      Scenario: Verify At least one Log type Item displayed and Text is not blank
            Then User clicks on List of logs button and Verify at leaset one type log item and Each Log type should not be blank

      Scenario: Verify Different types of logs
            Then User clicks on List of logs button and verify each type of logs

      Scenario: Verify Total Logs count for Different types of logs
            Then Total Logs count should be displyed if logs are present

      Scenario: Verify Cancel Clear logs for Different types of logs
            Then Verify Cancel button for clear Logs if logs are present

      Scenario: Verify Export logs for Different types of logs
            Then Verify Export Logs button if logs are present

      Scenario: Verify Clear logs for Different types of logs
            Then Verify Clear button for Clear Logs if logs are present
