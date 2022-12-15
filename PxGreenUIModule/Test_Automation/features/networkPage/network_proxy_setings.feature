Feature: Validate Proxy Settings in Network Page

     User should be able Set Proxy Enable, Proxy Server Address, Proxy Server Port,
     Proxy Username and Proxy Password

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Network Tab
          And User expands the ProxySettings section

     Scenario: Verify Proxy settings - Proxy Enable - False
          When User clicks on dropdown option for Proxy Enable
          And User should see True and False are available choices
          And the User selects the False option from the dropdown
          Then User should see False under Proxy Enable field
          And User should not see other options like Proxy server Address, Port, Username and Password

     Scenario: Verify Proxy settings - Proxy Enable - True
          When User clicks on dropdown option for Proxy Enable
          And User should see True and False are available choices
          And the User selects the True option from the dropdown
          Then User should see True under Proxy Enable field

     Scenario Outline: Verify Proxy settings - Proxy Server Address - Wrong Input
          When User updates the <invalidServerAddress> for Proxy Server Address
          Then User should get error message for invalid Proxy Server Address

          Examples:
               | invalidServerAddress |
               | <script></script>    |

     Scenario Outline: Verify Proxy settings - Proxy Server Address
          When User enters <validServerAddress> for Proxy Server Address
          Then User should see <validServerAddress> under Proxy Server Address field
          Examples:
               | validServerAddress |
               | proxy.apac.etn.com |

     Scenario Outline: Verify Proxy settings - Proxy Server Port- Valid Port Number
          When User enters <validServerPort> for Proxy Server Port
          Then User should see <validServerPort> under Proxy Server Port field
          Examples:
               | validServerPort |
               | 8080            |

     Scenario Outline: Verify Proxy settings - Proxy Server Port- Invalid Port Number
          When User enters <invalidServerPort> for Proxy Server Port
          Then User should see Error Message for Proxy Server Port
          Examples:
               | invalidServerPort |
               | 88888             |

     Scenario Outline: Verify Proxy settings - Proxy Username
          When User enters <username> for Proxy Username
          And User clicks Yes on the Alert popup to apply the Proxy Username
          Then User should see <username> under Proxy Username field
          Examples:
               | username         |
               | EatonProxyUser   |
               | EatonProxyPerson |

     Scenario Outline: Verify Proxy settings - Proxy Password
          When User enters <password> for Proxy Password
          And User clicks Yes on the Alert popup to apply the Proxy Password
          Then User should see <password> under Proxy Password field
          Examples:
               | password |
               | qwerty1  |
               | qazwsx   |