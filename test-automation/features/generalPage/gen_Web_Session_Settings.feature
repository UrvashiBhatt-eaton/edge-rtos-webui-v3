Feature: Validate Web Session Settings in General Tab

     User should be able to Set User Account Inactivity Timeout, Maximum concurrent Sessions
     User Absolute Timeout, User Lock Time and Maximum Failed Login Attempts

     Background:
          Given User launches the application
          And User logs into the application using admin and qwerty
          And User clicks on the General Tab
          And User expands the WebSessionSettings section

     Scenario Outline: Verify User Account Inactivity Timeout setting
          When User Set <timeoutvalue> in User Account Inactivity Timeout input
          Then User should see <timeoutvalue> Seconds under User Account Inactivity Timeout
          Examples:
               | timeoutvalue |
               | 900          |
               | 1300         |
               | 1800         |

     # Scenario Outline: Verify User Account Inactivity Timeout setting - Inactivity
     #      When User Set <timeoutvalue> in User Account Inactivity Timeout input
     #      Then User should see <timeoutvalue> Seconds under User Account Inactivity Timeout
     #      And User allow Inactivity for <timeoutvalue> Seconds
     #      Then User should be logged out from the application
     #      Examples:
     #           | timeoutvalue |
     #           | 900          |

     Scenario Outline: Verify Wrong input for User Account Inactivity Timeout setting
          When  When User Set <timeoutvalue> in User Account Inactivity Timeout input
          Then User should see Error Message for User Account Inactivity Timeout input
          Examples:
               | timeoutvalue |
               | 800          |
               | 1900         |

     Scenario Outline: Verify Maximum Concurrent Sessions
          When User Set <numberofconcurrentsessions> in Maximum Concurrent Sessions input
          Then User should see <numberofconcurrentsessions> under Maximum Concurrent Sessions
          Examples:
               | numberofconcurrentsessions |
               | 2                          |
               | 3                          |

     Scenario Outline: Verify Wrong input for Maximum Concurrent Sessions
          When User Set <concurrentsessionsvalue> in Maximum Concurrent Sessions input
          Then User should see Error Message for Maximum Concurrent Sessions input
          Examples:
               | concurrentsessionsvalue |
               | 0                       |
               | 4                       |

     Scenario Outline: Verify User Absolute Timeout setting
          When User Set <timeoutvalue> in User Absolute Timeout input
          Then User should see <timeoutvalue> Seconds under User Absolute Timeout
          Examples:
               | timeoutvalue |
               | 1800         |
               | 43200        |
               | 21600        |

     # Scenario Outline: Verify User Absolute Timeout setting- Inactivity
     #      When User Set <timeoutvalue> in User Absolute Timeout input
     #      Then User should see <timeoutvalue> Seconds under User Absolute Timeout
     #      And User allow Absolute time out for <timeoutvalue> Seconds
     #      Then User should be logged out from the application
     #      Examples:
     #           | timeoutvalue |
     #           | 1800         |

     Scenario Outline: Verify Wrong input for User Absolute Timeout setting
          When User Set <timeoutvalue> in User Absolute Timeout input
          Then User should see Error Message for User Absolute Timeout input
          Examples:
               | timeoutvalue |
               | 1700         |
               | 43201        |

     Scenario Outline: Verify User Lock Time setting
          When User Set <locktimevalue> in User User Lock Time input
          Then User should see <locktimevalue> Seconds under User Lock Time
          Examples:
               | locktimevalue |
               | 300           |
               | 1800          |
               | 1000          |

     Scenario Outline: Verify Wrong input for User Lock Time setting
          When User Set <locktimevalue> in User User Lock Time input
          Then User should see Error Message for User Lock Time input
          Examples:
               | locktimevalue |
               | 200           |
               | 1801          |

     Scenario Outline: Verify Maximum Failed Login Attempts
          When User Set <numoffailedattempts> in Maximum Failed Login Attempts input
          Then User should see <numoffailedattempts> under Maximum Failed Login Attempts
          Examples:
               | numoffailedattempts |
               | 5                   |
               | 10                  |

     Scenario Outline: Verify Wrong input for Maximum Failed Login Attempts
          When User Set <numoffailedattempts> in Maximum Failed Login Attempts input
          Then User should see Error Message for Maximum Failed Login Attempts input
          Examples:
               | numoffailedattempts |
               | 1                   |
               | 11                  |