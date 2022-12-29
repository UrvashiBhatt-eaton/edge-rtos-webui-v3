Feature: Validate Licence Information - Licence Links
     User should be able to click on Licence links

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User click on Licence Information Tab
          And User expands the LicenseLinks section

     Scenario: Verify Licence Links
          Then User should see Icon and License Links is at the top of the page
          Then User should see at least one link
          Then User click on each link and verify it works
