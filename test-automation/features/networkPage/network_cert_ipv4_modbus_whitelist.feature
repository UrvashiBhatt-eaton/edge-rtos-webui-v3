Feature: Validate Certificate in Network Page

     User should be able to download Certificate, set Value for Method of IP Allocation,
     Modbus TCP Com Timeout and IP Whitelist

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the Network Tab

     Scenario: Verify download Certificate
          When User expands the Certificate section
          And User clicks on Download Certificate button
          Then User should be able to download certificate

     Scenario Outline: Verify Method of IP Allocation
          When User expands the IPv4 section
          And User selects <ip_allocation_type> option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the <ip_allocation_type>
          Then <ip_allocation_type> should be displayed under Method of IP Allocation
          Examples:
               | ip_allocation_type    |
               | DHCP Allocated        |
               | Statically Hardcoded  |
               | DIP Switch Configured |
               | Taken From NV         |

     Scenario: Set Method of IP Allocation - DHCP Allocated
          When User expands the IPv4 section
          And User selects DHCP Allocated option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the DHCP Allocated
          Then User should see 192.168.137.254 under Present Ethernet IP Address
          Then User should see 255.255.255.0 under Present Ethernet Subnet Mask
          Then User should see 192.168.1.1 under Present Ethernet Default Gateway

     Scenario: Set Method of IP Allocation to Taken from NV, Ethernet IP address, Subnet Mash and Default Gateway
          When User expands the IPv4 section
          And User selects Taken From NV option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the Taken From NV
          And User enters the 192.168.1.255 to Stored Ethernet IP Address Input field
          Then User should see alert popup for Stored Ethernet IP Address on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet IP Address
          Then User should see 192.168.1.255 under Stored Ethernet IP Address
          And User enters the 255.255.255.1 to Stored Ethernet Subnet Mask Input field
          Then User should see alert popup for Stored Ethernet Subnet Mask on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet Subnet Mask
          Then User should see 255.255.255.1 under Stored Ethernet Subnet Mask
          And User enters the 192.168.1.0 to Stored Ethernet Default Gateway Input field
          Then User should see alert popup for Stored Ethernet Default Gateway on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet Default Gateway
          Then User should see 192.168.1.0 under Stored Ethernet Default Gateway

     Scenario: Verify when No is clicked on the critical alert popup for IPV4 setting set to DIP Switch Configured
          When User expands the IPv4 section
          And User selects DIP Switch Configured option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the DIP Switch Configured
          And User enters the 192.168.1.254 to Stored Ethernet IP Address Input field
          Then User should see alert popup for Stored Ethernet IP Address on mouse out
          And User clicks No on the alert popup
          Then User should not see 192.168.1.254 under Stored Ethernet IP Address
          And User enters the 255.255.255.0 to Stored Ethernet Subnet Mask Input field
          Then User should see alert popup for Stored Ethernet Subnet Mask on mouse out
          And User clicks No on the alert popup
          Then User should not see 255.255.255.0 under Stored Ethernet Subnet Mask
          And User enters the 192.168.1.1 to Stored Ethernet Default Gateway Input field
          Then User should see alert popup for Stored Ethernet Default Gateway on mouse out
          And User clicks No on the alert popup
          Then User should not see 192.168.1.1 under Stored Ethernet Default Gateway

     Scenario: Verify when No is clicked on the critical alert popup for IPV4 setting set to Taken from NV
          When User expands the IPv4 section
          And User selects Taken From NV option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the Taken From NV
          And User enters the 192.168.1.254 to Stored Ethernet IP Address Input field
          Then User should see alert popup for Stored Ethernet IP Address on mouse out
          And User clicks No on the alert popup
          Then User should not see 192.168.1.254 under Stored Ethernet IP Address
          And User enters the 255.255.255.0 to Stored Ethernet Subnet Mask Input field
          Then User should see alert popup for Stored Ethernet Subnet Mask on mouse out
          And User clicks No on the alert popup
          Then User should not see 255.255.255.0 under Stored Ethernet Subnet Mask
          And User enters the 192.168.1.1 to Stored Ethernet Default Gateway Input field
          Then User should see alert popup for Stored Ethernet Default Gateway on mouse out
          And User clicks No on the alert popup
          Then User should not see 192.168.1.1 under Stored Ethernet Default Gateway

     Scenario: Set Method of IP Allocation to DIP Switch Configured, Ethernet IP address, Subnet Mash and Default Gateway
          When User expands the IPv4 section
          And User selects DIP Switch Configured option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the DIP Switch Configured
          And User enters the 192.168.1.254 to Stored Ethernet IP Address Input field
          Then User should see alert popup for Stored Ethernet IP Address on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet IP Address
          Then User should see 192.168.1.254 under Stored Ethernet IP Address
          And User enters the 255.255.255.0 to Stored Ethernet Subnet Mask Input field
          Then User should see alert popup for Stored Ethernet Subnet Mask on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet Subnet Mask
          Then User should see 255.255.255.0 under Stored Ethernet Subnet Mask
          And User enters the 192.168.1.1 to Stored Ethernet Default Gateway Input field
          Then User should see alert popup for Stored Ethernet Default Gateway on mouse out
          And User clicks Yes on the Alert popup to apply the Stored Ethernet Default Gateway
          Then User should see 192.168.1.1 under Stored Ethernet Default Gateway

     Scenario: Set Method of IP Allocation - Statically Hardcoded
          When User expands the IPv4 section
          And User selects Statically Hardcoded option from Method of IP Allocation dropdown
          And User clicks Yes on the Alert popup to apply the Statically Hardcoded
          Then User should see 192.168.137.254 under Present Ethernet IP Address
          Then User should see 255.255.255.0 under Present Ethernet Subnet Mask
          Then User should see 192.168.1.1 under Present Ethernet Default Gateway

     Scenario Outline: Set Modbus TCP Com Timeout Value in Milliseconds
          When User expands the ModbusTCP section
          And User enters <modbusTCPComTimeout> for Modbus TCP Com Timeout
          Then <modbusTCPComTimeout> Milliseconds should be displayed under Modbus TCP Com Timeout field
          Examples:
               | modbusTCPComTimeout |
               | 0                   |
               | 30000               |
               | 65535               |

     Scenario Outline: Set Modbus TCP Com Timeout Value out of Range in Milliseconds
          When User expands the ModbusTCP section
          And User enters <modbusTCPComTimeout> for Modbus TCP Com Timeout
          Then User should get Error for Modbus TCP Com Timeout
          Examples:
               | modbusTCPComTimeout |
               | -1                  |
               | 65536               |

     Scenario: Verify critical alert popup on Trusted IP Whitelist
          When User expands the IPWhitelist section
          And User enters 255.255.255.255,192.168.1.255,255.255.255.254 for Trusted IP Address Filter white list
          Then User should see alert popup for Trusted IP Address filter white list on mouse out
          And User clicks No on the alert popup
          Then User should not see 255.255.255.255,192.168.1.255,255.255.255.254 under Trusted IP Address filter white list

     Scenario: Verify IP Whitelist  - Invalid IP Address
          When User expands the IPWhitelist section
          And User enters ntp.etn.com! for Trusted IP Address Filter white list
          Then User should see Error Message for IP Whitelist
