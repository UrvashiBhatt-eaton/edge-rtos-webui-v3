import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class LogsPage {
  static logsNavTab = Target.the("Logs Navigation Tab").located(by.xpath("//*[@id='LogsItem']/div"));

  static listofLogsBtn = Target.the("List of Logs button").located(
    by.xpath("//button[@tabindex='0'][text()='List of Logs']")
  );

  static selectALogToDisplayText = Target.the("Select a log to display text").located(
    by.xpath("//p[text()='Select a log to display']")
  );

  static clearLogsBtn = Target.the("Clear Logs button").located(by.xpath("//button[text()='Clear Logs']"));

  static areYouSureToClearTheLogsText = Target.the("Are you sure to clear the logs? Text on Alert").located(
    by.xpath("//p[text()='Are you sure to clear the logs?']")
  );

  static cancelBtn = Target.the("Cancel on Alert").located(by.xpath("//button[text()='Cancel']"));

  static clearBtn = Target.the("Clear on Alert").located(by.xpath("//button[text()='Clear']"));

  static exportLogsBtn = Target.the("Export Logs button").located(by.xpath("//button[text()='Export Logs']"));

  static getTypeOfLogsItems = Target.all("Available Type of Log Items").located(by.xpath("//ul[@role='menu']/li"));

  static noLogEntriesToDisplayText = Target.the("No log entries to display text").located(
    by.xpath("//p[text()='No log entries to display']")
  );

  static getTotalLogCount = Target.the("Total Logs Count").located(
    by.xpath("//p[contains(text(),'Total Logs Count:')]")
  );

  static typeOfLogHeader = Target.the("Log type Header in the Logs Table").located(by.id("logName"));

  static getNoOfRowsLogs = Target.all("Get number of Rows Logs displayed in the Logs Table").located(
    by.xpath("//tr[contains(@class,'MuiTableRow-root logRow')]")
  );

  static getTextOfEachField = Target.all("Get text of each field in the Logs Table").located(by.xpath("//td"));

  static getTextOfEachHeaderOnLogsTable = Target.all("Get text of each header field in the Logs Table").located(
    by.xpath("//th")
  );
}
