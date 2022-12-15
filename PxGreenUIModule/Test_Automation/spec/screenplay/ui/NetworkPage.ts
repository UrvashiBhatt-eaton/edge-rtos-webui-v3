import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class NetworkPage {
  static networkNavTab = Target.the("Network Navigation Tab").located(by.xpath("//*[@id='NetworkTab']"));

  //Certificate
  static downloadCertificateBtn = Target.the("Download Certificate button").located(
    by.xpath("//span[text()='Download Certificate']/../..")
  );

  // IPv4
  static methodofIPAllocationInput = Target.the("Input for Method of IP Allocation").located(
    by.xpath("//span[text()='Method of IP Allocation']/..//following-sibling::div/div")
  );

  static getAllMethodofIPAllocationItems = Target.all("Available Method of IP Allocation options").located(
    by.xpath("//ul[@class='MuiList-root MuiMenu-list MuiList-padding']/li")
  );

  static methodofIPAllocationItem = (methodofIP: string) =>
    Target.the("Click on " + methodofIP + " Option").located(by.xpath("//li[text()='" + methodofIP + "']"));

  static methodofIPAllocationValue = Target.the("Seleted Value for Method of IP Allocation").located(
    by.xpath(
      "//span[text()='Method of IP Allocation']/../p[contains(@class,'MuiTypography-root MuiTypography-body2 MuiListItemText-secondary')]"
    )
  );

  static presentEthernetIPAddressValue = Target.the("Value under Present Ethernet IP Address Field").located(
    by.xpath("//span[text()='Present Ethernet IP Address']/../p")
  );

  static presentEthernetSubnetMaskValue = Target.the("Value under Present Ethernet Subnet Mask Field").located(
    by.xpath("//span[text()='Present Ethernet Subnet Mask']/../p")
  );

  static presentEthernetDefaultGatewayValue = Target.the("Value under Present Ethernet Default Gateway Field").located(
    by.xpath("//span[text()='Present Ethernet Default Gateway']/../p")
  );

  static storedEthernetIPAddressInput = Target.the("Input for Stored Ethernet IP Address Field").located(
    by.xpath("//span[text()='Stored Ethernet IP Address']/../../div[2]/div/input")
  );

  static storedEthernetIPAddressValue = Target.the("Value under Stored Ethernet IP Address Field").located(
    by.xpath("//span[text()='Stored Ethernet IP Address']/../p")
  );

  static storedEthernetSubnetMaskInput = Target.the("Input for Stored Ethernet Subnet Mask Field").located(
    by.xpath("//span[text()='Stored Ethernet Subnet Mask']/../../div[2]/div/input")
  );

  static storedEthernetSubnetMaskValue = Target.the("Value under Stored Ethernet Subnet Mask Field").located(
    by.xpath("//span[text()='Stored Ethernet Subnet Mask']/../p")
  );

  static storedEthernetDefaultGatewayInput = Target.the("Input for Stored Ethernet Default Gateway Field").located(
    by.xpath("//span[text()='Stored Ethernet Default Gateway']/../../div[2]/div/input")
  );

  static storedEthernetDefaultGatewayValue = Target.the("Value under Stored Ethernet Default Gateway Field").located(
    by.xpath("//span[text()='Stored Ethernet Default Gateway']/../p")
  );

  static ErrorMsgForWrongInput = Target.the("Error Message").located(
    by.xpath("//p[text()='Must be a valid IPv4 address']")
  );

  // Modbus TCP Com Timeout
  static modbusTCPComTimeoutInput = Target.the("Input for Modbus TCP Com Timeout").located(
    by.xpath("(//span[text()='Modbus TCP Com Timeout']/../following::div/div/input)[1]")
  );
  static modbusTCPComTimeoutInputText = Target.the("Input for Modbus TCP Com Timeout").located(
    by.xpath("(//span[text()='Modbus TCP Com Timeout']/../following::div/div//div/p)[1]")
  );

  static modbusTCPComTimeoutCurrentValue = Target.the("Modbus TCP Com Timeout Value displayed").located(
    by.xpath("//span[text()='Modbus TCP Com Timeout']/../p")
  );

  static errorMsgModbusTCPComTimeout = Target.the("Error Message displayed").located(
    by.xpath("(//span[text()='Modbus TCP Com Timeout']/../following::div/p)[2]")
  );

  // Trusted IP Address filter white list
  static ipWhitelistInput = Target.the("Input for Trusted IP Address filter white list").located(
    by.xpath("//span[text()='Trusted IP Address filter white list']/../../div[2]/div/input")
  );

  static ipWhitelistCurrentValue = Target.the("Trusted IP Address filter white list Value displayed").located(
    by.xpath("//span[text()='Trusted IP Address filter white list']/../p")
  );

  static errorMsgIPWhitelist = Target.the("Error Message displayed").located(
    by.xpath("(//span[text()='Trusted IP Address filter white list']/../following::div/p)[2]")
  );

  // Proxy settings
  static proxyEnableInput = Target.the("Input for Proxy Enable").located(
    by.xpath("//span[text()='Proxy Enable']/..//following-sibling::div/div")
  );

  static getInputItems = Target.all("Available choices").located(
    by.xpath("//ul[contains(@class, 'MuiList-root MuiList-padding MuiMenu-list')]/li")
  );

  static proxyEnableItem = (proxyenableMethod: string) =>
    Target.the("Click on " + proxyenableMethod + " Option").located(
      by.xpath("//li[text()='" + proxyenableMethod + "']")
    );

  static proxyEnableCurrentValue = Target.the("Proxy Enable Option displayed").located(
    by.xpath("//span[text()='Proxy Enable']/../p")
  );

  static proxyServerAddressInput = Target.the("Input for Proxy Server Address").located(
    by.xpath("(//span[text()='Proxy Server Address']/../following::div/div/input)[1]")
  );

  static proxyServerAddressError = Target.the("Error for Proxy Server Address").located(
    by.xpath("//span[text()='Invalid value. Please enter correct value.']")
  );

  static proxyServerAddressCurrentValue = Target.the("Proxy Server Address Value displayed").located(
    by.xpath("//span[text()='Proxy Server Address']/../p")
  );

  static proxyServerPortInput = Target.the("Input for Proxy Server Port").located(
    by.xpath("(//span[text()='Proxy Server Port']/../following::div/div/input)[1]")
  );

  static proxyServerPortInputText = Target.the("Input for Proxy Server Port").located(
    by.xpath("(//span[text()='Proxy Server Port']/../following::div/div//div/p)[1]")
  );
  static errorMsgProxyServerPort = Target.the("Error Message displayed").located(
    by.xpath("(//span[text()='Proxy Server Port']/../following::div/p)[2]")
  );

  static proxyServerPortCurrentValue = Target.the("Proxy Server Port Value displayed").located(
    by.xpath("//span[text()='Proxy Server Port']/../p")
  );

  static proxyUsernameInput = Target.the("Input for Proxy Username").located(
    by.xpath("//span[text()='Proxy Username']/../../div[2]/div/input")
  );

  static proxyUsernameCurrentValue = Target.the("Proxy Username Value displayed").located(
    by.xpath("//span[text()='Proxy Username']/../p")
  );

  static proxyPasswordInput = Target.the("Input for Proxy Password").located(
    by.xpath("//span[text()='Proxy Password']/../../div[2]/div/input")
  );

  static proxyPasswordCurrentValue = Target.the("Proxy Password Value displayed").located(
    by.xpath("//span[text()='Proxy Password']/../p")
  );

  //IOT
  static iOTEnableOrDisableInput = Target.the("Input for IOT Enable or Disable").located(
    by.xpath("//span[text()='IOT Enable or Disable']/..//following-sibling::div/div")
  );

  static iOTEnableOrDisableCurrentValue = Target.the("IOT Enable or Disable Option displayed").located(
    by.xpath("//span[text()='IOT Enable or Disable']/../p")
  );

  static cloudIcon = Target.the("Cloud Icon in the right side corner").located(by.xpath("//h6//div/div/div"));

  static deviceGUIDInput = Target.the("Input for Device GUID").located(
    by.xpath("(//span[text()='Device GUID']/../following::div/div/input)[1]")
  );

  static deviceGUIDInputText = Target.the("Input for Device GUID").located(
    by.xpath("(//span[text()='Device GUID']/../following::div/div//div/p)[1]")
  );

  static deviceGUIDCurrentValue = Target.the("Device GUID Value displayed").located(
    by.xpath("//span[text()='Device GUID']/../p")
  );

  static iOTHubServerConnectionStringInput = Target.the("Input for IOT Hub Server Connection string").located(
    by.xpath("//span[text()='IOT Hub Server Connection string']/../../div[2]/div/input")
  );

  static iOTHubServerConnectionStringCurrentValue = Target.the(
    "IOT Hub Server Connection string Value displayed"
  ).located(by.xpath("//span[text()='IOT Hub Server Connection string']/../p"));

  //Access Control
  static modbusTCPInput = Target.the("Input for Modbus TCP").located(
    by.xpath("//span[text()='Modbus TCP']/..//following-sibling::div/div")
  );

  static modbusTCPCurrentValue = Target.the("Modbus TCP Option displayed").located(
    by.xpath("//span[text()='Modbus TCP']/../p")
  );

  static disableAlertHeader = Target.the("Disable Alert Header Text").located(by.xpath("//h2[text()='Disable Alert']"));

  static httpDisabledMessage = Target.the("HTTP disabled message").located(by.id("httpDisabledText"));

  static enableAlertHeader = Target.the("Enable Alert Header Text").located(by.xpath("//h2[text()='Enable Alert']"));

  static cancelPopupCrossMark = Target.the("Cancel Pop up Cross Mark").located(by.xpath("(//h2/button/span)[1]"));

  static textOnPopUp = Target.the(" text on the pop up").located(
    by.xpath("//p[text()='Are you sure you want to continue this operation?']")
  );

  static yesBtn = Target.the("Yes button on the pop up").located(by.xpath("//button[text()='Yes']"));

  static reloadBtn = Target.the("Reload button on the pop up").located(by.id("reloadBtn"));

  static bacnetIPInput = Target.the("Input for Bacnet IP").located(
    by.xpath("//span[text()='Bacnet IP']/..//following-sibling::div/div")
  );

  static bacnetIPCurrentValue = Target.the("Bacnet IP Option displayed").located(
    by.xpath("//span[text()='Bacnet IP']/../p")
  );

  static hTTPInput = Target.the("Input for HTTP").located(
    by.xpath("//span[text()='HTTP']/..//following-sibling::div/div")
  );

  static hTTPCurrentValue = Target.the("HTTP Option displayed").located(by.xpath("//span[text()='HTTP']/../p"));

  static cORSOriginTypeInput = Target.the("Input for CORS Origin Type").located(
    by.xpath("//span[text()='CORS Origin Type']/..//following-sibling::div/div")
  );

  static cORSOriginTypeCurrentValue = Target.the("CORS Origin Type Option displayed").located(
    by.xpath("//span[text()='CORS Origin Type']/../p")
  );

  static allowsallOriginHeader = Target.the("(*) - allows all Origin Alert Header Text").located(
    by.xpath("//h2[text()='(*) - allows all Origin Alert']")
  );

  static allowsOriginwithdeviceIPAlertHeader = Target.the(
    "(Active device IP) - allows Origin with device IP Alert Header Text"
  ).located(by.xpath("//h2[text()='(Active device IP) - allows Origin with device IP Alert']"));
}
