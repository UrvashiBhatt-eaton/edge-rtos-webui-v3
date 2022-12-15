import { Task, Duration } from "@serenity-js/core";
import { Click, Wait, isClickable, isVisible, Enter, Clear, Text, Hover, ExecuteScript } from "@serenity-js/protractor";
import { Ensure, equals } from "@serenity-js/assertions";
import { Key } from "protractor";
import { NetworkPage } from "../ui/NetworkPage";
import { Common_Tasks } from "./Common_Tasks";
import { AvatarMenu } from "../ui/AvatarMenu";

export class Network_Tasks {
  static clickInput = (target) =>
    Task.where(
      `#user click on dropdown`,
      Wait.upTo(Duration.ofSeconds(15)).until(target, isClickable()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(target),
      Click.on(target)
    );
  static getValue = (target, inputvalue: any) =>
    Task.where(
      `#get value`,
      Wait.upTo(Duration.ofSeconds(15)).until(target, isVisible()),
      Wait.for(Duration.ofMilliseconds(15000)),
      Ensure.that(Text.of(target), equals(inputvalue))
    );

  static getProxyPasswordValue = (target, inputvalue: any) =>
    Task.where(
      `#get value`,
      Wait.for(Duration.ofSeconds(10)),
      Ensure.that(Text.of(target), equals(Network_Tasks.maskValue(inputvalue)))
    );

  static maskValue = (val) => {
    let maskedValue = "";
    for (let x = 0; x < val.length; x++) {
      maskedValue += "•";
    }
    return maskedValue;
  };

  static setValue = (target, inputvalue: string) => {
    return Task.where(
      `#Set Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(target, isVisible()),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(target),
      Clear.theValueOf(target),
      Enter.theValue(inputvalue).into(target),
      Hover.over(target),
      Hover.over(AvatarMenu.avatarNav)
    );
  };

  static selectMethodOfIpAllocation = (ipAllocationType: string) => {
    return Task.where(
      `#Setting Method of IP Allocation`,
      Network_Tasks.clickInput(NetworkPage.methodofIPAllocationInput),
      Common_Tasks.clickDropdownItem(ipAllocationType)
    );
  };

  static getMethodOfIPUnderMethodofIPAllocationField = (methodofIP: string) =>
    Network_Tasks.getValue(NetworkPage.methodofIPAllocationValue, methodofIP);

  static getPresentEthernetIPAddressValue = (serverAddress: string) => {
    return Task.where(
      `#Get Present Ethernet IP Address Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.presentEthernetIPAddressValue, isVisible()),
      Ensure.that(Text.of(NetworkPage.presentEthernetIPAddressValue), equals(serverAddress + " IP"))
    );
  };

  static getPresentEthernetSubnetMaskValue = (serverAddress: string) => {
    return Task.where(
      `#Get Present Ethernet Subnet Mask Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.presentEthernetSubnetMaskValue, isVisible()),
      Ensure.that(Text.of(NetworkPage.presentEthernetSubnetMaskValue), equals(serverAddress + " IP"))
    );
  };

  static getPresentEthernetDefaultGatewayValue = (serverAddress: string) => {
    return Task.where(
      `#Get Present Ethernet Default Gateway Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.presentEthernetDefaultGatewayValue, isVisible()),
      Ensure.that(Text.of(NetworkPage.presentEthernetDefaultGatewayValue), equals(serverAddress + " IP"))
    );
  };
  static setStoredEthernetIPAddressInput = (serverAddress: string) => {
    return Task.where(
      `#Enter Stored Ethernet IP Address`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetIPAddressInput, isVisible()),
      Clear.theValueOf(NetworkPage.storedEthernetIPAddressInput),
      Enter.theValue("ntp.etn.com!").into(NetworkPage.storedEthernetIPAddressInput),
      Ensure.that(Text.of(NetworkPage.ErrorMsgForWrongInput), equals("Must be a valid IPv4 address")),
      Clear.theValueOf(NetworkPage.storedEthernetIPAddressInput),
      Enter.theValue(serverAddress).into(NetworkPage.storedEthernetIPAddressInput)
    );
  };

  static getStoredEthernetIPAddressValue = (serverAddress: string) => {
    return Task.where(
      `#Get Stored Ethernet IP Address`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetIPAddressValue, isVisible()),
      Wait.for(Duration.ofSeconds(10)),
      Ensure.that(Text.of(NetworkPage.storedEthernetIPAddressValue), equals(serverAddress + " IP"))
    );
  };

  static setStoredEthernetSubnetMaskInput = (serverAddress: string) => {
    return Task.where(
      `#Enter Stored Ethernet Subnet Mask`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetSubnetMaskInput, isVisible()),
      Clear.theValueOf(NetworkPage.storedEthernetSubnetMaskInput),
      Enter.theValue("ntp.etn.com!").into(NetworkPage.storedEthernetSubnetMaskInput),
      Ensure.that(Text.of(NetworkPage.ErrorMsgForWrongInput), equals("Must be a valid IPv4 address")),
      Clear.theValueOf(NetworkPage.storedEthernetSubnetMaskInput),
      Enter.theValue(serverAddress).into(NetworkPage.storedEthernetSubnetMaskInput)
    );
  };

  static getStoredEthernetSubnetMaskValue = (serverAddress: string) => {
    return Task.where(
      `#Get Stored Ethernet Subnet Mask Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetSubnetMaskValue, isVisible()),
      Wait.for(Duration.ofSeconds(10)),
      Ensure.that(Text.of(NetworkPage.storedEthernetSubnetMaskValue), equals(serverAddress + " IP"))
    );
  };

  static setStoredEthernetDefaultGatewayInput = (serverAddress: string) => {
    return Task.where(
      `#Enter Stored Ethernet Default Gateway Input`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetDefaultGatewayInput, isVisible()),
      Clear.theValueOf(NetworkPage.storedEthernetDefaultGatewayInput),
      Enter.theValue("ntp.etn.com!").into(NetworkPage.storedEthernetDefaultGatewayInput),
      Ensure.that(Text.of(NetworkPage.ErrorMsgForWrongInput), equals("Must be a valid IPv4 address")),
      Clear.theValueOf(NetworkPage.storedEthernetDefaultGatewayInput),
      Enter.theValue(serverAddress).into(NetworkPage.storedEthernetDefaultGatewayInput)
    );
  };

  static getStoredEthernetDefaultGatewayValue = (serverAddress: string) => {
    return Task.where(
      `#Get Stored Ethernet Default Gateway Value`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.storedEthernetDefaultGatewayValue, isVisible()),
      Wait.for(Duration.ofSeconds(10)),
      Ensure.that(Text.of(NetworkPage.storedEthernetDefaultGatewayValue), equals(serverAddress + " IP"))
    );
  };

  static setModbusTCPComTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Set Modbus TCP Com Timeout`,
      Wait.for(Duration.ofMilliseconds(5000)),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(NetworkPage.modbusTCPComTimeoutInput),
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.modbusTCPComTimeoutInput, isVisible()),
      Clear.theValueOf(NetworkPage.modbusTCPComTimeoutInput),
      Enter.theValue(timeoutvalue + Key.TAB).into(NetworkPage.modbusTCPComTimeoutInput),
      Hover.over(NetworkPage.modbusTCPComTimeoutInputText),
      Hover.over(NetworkPage.modbusTCPComTimeoutInput)
    );
  };

  static getModbusTCPComTimeout = (timeoutvalue: number) => {
    return Task.where(
      `#Get Modbus TCP Com Timeout under Modbus TCP Com Timeout field`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.modbusTCPComTimeoutCurrentValue, isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(NetworkPage.modbusTCPComTimeoutCurrentValue), equals(timeoutvalue + " milliseconds"))
    );
  };

  static setIPWhitelistInput = (ipAddress: string) => Network_Tasks.setValue(NetworkPage.ipWhitelistInput, ipAddress);

  static getIPWhitelist = (ipAddress: string) => {
    return Task.where(
      `#Get Trusted IP Address under Trusted IP Address filter white list field`,
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.ipWhitelistCurrentValue, isVisible()),
      Wait.for(Duration.ofMilliseconds(12000)),
      Ensure.that(Text.of(NetworkPage.ipWhitelistCurrentValue), equals(ipAddress + " IP"))
    );
  };

  static clickDropdownProxyEnableInput = () => Network_Tasks.clickInput(NetworkPage.proxyEnableInput);

  static getValueUnderProxyEnableField = (proxyenable: string) =>
    Network_Tasks.getValue(NetworkPage.proxyEnableCurrentValue, proxyenable);

  static setProxyServerAddressInput = (validServerAddress: string) =>
    Network_Tasks.setValue(NetworkPage.proxyServerAddressInput, validServerAddress);

  static getProxyServerAddress = (validServerAddress: string) =>
    Network_Tasks.getValue(NetworkPage.proxyServerAddressCurrentValue, validServerAddress);

  static setProxyServerPortInput = (validServerPort: number) => {
    return Task.where(
      `#Set Proxy Server Port`,
      Wait.for(Duration.ofMilliseconds(5000)),
      ExecuteScript.sync(`arguments[0].scrollIntoView(false);`).withArguments(NetworkPage.proxyServerPortInput),
      Wait.upTo(Duration.ofSeconds(9)).until(NetworkPage.proxyServerPortInput, isVisible()),
      Clear.theValueOf(NetworkPage.proxyServerPortInput),
      Enter.theValue(validServerPort + Key.TAB).into(NetworkPage.proxyServerPortInput),
      Hover.over(NetworkPage.proxyServerPortInputText),
      Hover.over(NetworkPage.proxyServerPortInput)
    );
  };

  static getProxyServerPort = (validServerPort: number) =>
    Network_Tasks.getValue(NetworkPage.proxyServerPortCurrentValue, validServerPort.toString());

  static setProxyUsernameInput = (username: string) => Network_Tasks.setValue(NetworkPage.proxyUsernameInput, username);

  static getProxyUsername = (username: string) =>
    Network_Tasks.getValue(NetworkPage.proxyUsernameCurrentValue, username);

  static setProxyPasswordInput = (password: string) => Network_Tasks.setValue(NetworkPage.proxyPasswordInput, password);

  static getProxyPassword = (password: string) =>
    Network_Tasks.getProxyPasswordValue(NetworkPage.proxyPasswordCurrentValue, password);
  //IOT
  static clickDropdownIOTEnableOrDisableInput = () => Network_Tasks.clickInput(NetworkPage.iOTEnableOrDisableInput);

  static getValueUnderIOTEnableOrDisable = (iotenable: string) =>
    Network_Tasks.getValue(NetworkPage.iOTEnableOrDisableCurrentValue, iotenable);

  static setdeviceGUID = (guid: string) => Network_Tasks.setValue(NetworkPage.deviceGUIDInput, guid);

  static getDeviceGUID = (guid: string) => Network_Tasks.getValue(NetworkPage.deviceGUIDCurrentValue, guid);

  static setIOTHubServerConnectionString = (connectionString: string) =>
    Network_Tasks.setValue(NetworkPage.iOTHubServerConnectionStringInput, connectionString);

  static getIOTHubServerConnectionString = (connectionString: string) =>
    Network_Tasks.getValue(NetworkPage.iOTHubServerConnectionStringCurrentValue, connectionString);

  // Access Control
  static clickDropdownModbusTCPInput = () => Network_Tasks.clickInput(NetworkPage.modbusTCPInput);

  static getValueUnderModbusTCP = (optionselected: string) =>
    Network_Tasks.getValue(NetworkPage.modbusTCPCurrentValue, optionselected);

  static clickDropdownBacnetIPInput = () => Network_Tasks.clickInput(NetworkPage.bacnetIPInput);

  static getValueUnderBacnetIP = (optionselected: string) =>
    Network_Tasks.getValue(NetworkPage.bacnetIPCurrentValue, optionselected);

  static clickDropdownHTTPInput = () => Network_Tasks.clickInput(NetworkPage.hTTPInput);

  static getValueUnderHTTP = (optionselected: string) =>
    Network_Tasks.getValue(NetworkPage.hTTPCurrentValue, optionselected);

  static clickDropdownCORSOriginTypeInput = () => Network_Tasks.clickInput(NetworkPage.cORSOriginTypeInput);

  static getValueUnderCORSOriginType = (optionselected: string) =>
    Network_Tasks.getValue(NetworkPage.cORSOriginTypeCurrentValue, optionselected);
}
