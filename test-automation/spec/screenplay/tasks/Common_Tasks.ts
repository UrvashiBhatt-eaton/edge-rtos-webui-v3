import { Click, isClickable, Pick, Wait, Text } from "@serenity-js/protractor";
import { ElementArrayFinder, ElementFinder } from "protractor";
import { Duration, Question, Task } from "@serenity-js/core";
import { OverviewPage } from "../ui/OverviewPage";
import { LicenseInformationPage } from "../ui/LicenseInformationPage";
import { GeneralPage } from "../ui/GeneralPage";
import { LogsPage } from "../ui/LogsPage";
import { CommonLocators } from "../ui/CommonLocators";

const path = require("path");
const fs = require("fs");

export class Common_Tasks {
  static addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  static getHours = () => {
    return Common_Tasks.addZero(new Date().getHours());
  };

  static getHoursIn12hrsFormat = () => {
    let hourValue = new Date().getHours();
    if (hourValue > 12) {
      hourValue -= 12;
    }
    return Common_Tasks.addZero(hourValue);
  };

  static getTimeZone = () => {
    var offset = new Date().getTimezoneOffset(),
      absvalue = Math.abs(offset);
    return (
      "GMT" +
      (offset < 0 ? "+" : "-") +
      ("00" + Math.floor(absvalue / 60)).slice(-2) +
      ":" +
      ("00" + (absvalue % 60)).slice(-2)
    );
  };

  static getCurrentTime = () => {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  };

  static getDateAndTimeDifference = () => {
    return Text.of(GeneralPage.dateAndTimeDisplayAtBottom).map(
      () => (value) => new Date().valueOf() - new Date(value).valueOf()
    );
  };

  static getFormatedDate = (format) => {
    let d = new Date();
    let formatedDate;

    switch (format) {
      case "mm/dd/yyyy":
        formatedDate =
          Common_Tasks.addZero(d.getMonth() + 1) + "/" + Common_Tasks.addZero(d.getDate()) + "/" + d.getFullYear();
        break;
      case "dd/mm/yyyy":
        formatedDate =
          Common_Tasks.addZero(d.getDate()) + "/" + Common_Tasks.addZero(d.getMonth() + 1) + "/" + d.getFullYear();
        break;
      case "yyyy-mm-dd":
        formatedDate =
          d.getFullYear() + "-" + Common_Tasks.addZero(d.getMonth() + 1) + "-" + Common_Tasks.addZero(d.getDate());
        break;
      case "dd mm yyyy":
        formatedDate =
          Common_Tasks.addZero(d.getDate()) + " " + Common_Tasks.addZero(d.getMonth() + 1) + " " + d.getFullYear();
        break;
    }
    return formatedDate;
  };

  static getTimeFormat = (format) => {
    let formatedTime;

    switch (format) {
      case "12Hrs (AM/PM)":
        formatedTime = Common_Tasks.getHoursIn12hrsFormat().toString();
        break;
      case "24Hrs":
        formatedTime = Common_Tasks.getHours().toString();
        break;
    }
    return formatedTime;
  };

  static validWebImageFilePathForNonPRBuilds = "../../../Build_Output/Code_Pack/web2.427.l.signed.pack.xml";

  static validWebImageFilePathForPRBuilds =
    "../../../../../RTK_Example/Build_Output/Code_Pack/web2.427.l.signed.pack.xml";

  static uploadWebImageFile = () => {
    if (!fs.existsSync(path.resolve(Common_Tasks.validWebImageFilePathForPRBuilds))) {
      // if it doesn't exist
      return path.resolve(Common_Tasks.validWebImageFilePathForNonPRBuilds);
    }
    return path.resolve(Common_Tasks.validWebImageFilePathForPRBuilds);
  };

  static validLanguageImageFilePathForNonPRBuilds = "../../../Build_Output/Code_Pack/Language.l.signed.pack.xml";

  static validLanguageImageFilePathForPRBuilds =
    "../../../../../RTK_Example/Build_Output/Code_Pack/Language.l.signed.pack.xml";

  static uploadLanguageImageFile = () => {
    if (!fs.existsSync(path.resolve(Common_Tasks.validLanguageImageFilePathForPRBuilds))) {
      // if it doesn't exist
      return path.resolve(Common_Tasks.validLanguageImageFilePathForNonPRBuilds);
    }
    return path.resolve(Common_Tasks.validLanguageImageFilePathForPRBuilds);
  };

  static validAppImageFilePathForNonPRBuilds = "../../../Build_Output/Code_Pack/RTK_Example.427.l.signed.pack.xml";

  static validAppImageFilePathForPRBuilds =
    "../../../../../RTK_Example/Build_Output/Code_Pack/RTK_Example.427.l.signed.pack.xml";

  static uploadAppImageFile = () => {
    if (!fs.existsSync(path.resolve(Common_Tasks.validAppImageFilePathForPRBuilds))) {
      // if it doesn't exist
      return path.resolve(Common_Tasks.validAppImageFilePathForNonPRBuilds);
    }
    return path.resolve(Common_Tasks.validAppImageFilePathForPRBuilds);
  };

  static fileToUpload2 = "../../screenplay/inputcodepackfiles/web2.l.signed.pack_invalid_product_guid.xml";

  static absolutePath2 = path.resolve(__dirname, Common_Tasks.fileToUpload2);

  static fileToUpload3 = "../../screenplay/inputcodepackfiles/web2.l.signed.pack_invalid_web_image_guid.xml";

  static absolutePath3 = path.resolve(__dirname, Common_Tasks.fileToUpload3);

  static fileToUpload4 = "../../screenplay/inputcodepackfiles/sampletxtfile.txt";

  static absolutePath4 = path.resolve(__dirname, Common_Tasks.fileToUpload4);

  static fileToUpload5 = "../../screenplay/inputcodepackfiles/web2.l.signed.pack_ui_crc_fail_1.xml";

  static absolutePath5 = path.resolve(__dirname, Common_Tasks.fileToUpload5);

  static fileToUpload6 = "../../screenplay/inputcodepackfiles/web2.l.signed.pack_server_crc_fail.xml";

  static absolutePath6 = path.resolve(__dirname, Common_Tasks.fileToUpload6);

  static generalPageTimezones = Pick.from<ElementFinder, ElementArrayFinder>(GeneralPage.getAllTimeZones);

  static overviewPageCards = Pick.from<ElementFinder, ElementArrayFinder>(OverviewPage.cards);

  static typeOfLogs = Pick.from<ElementFinder, ElementArrayFinder>(LogsPage.getTypeOfLogsItems);

  static getNoOfRows = Pick.from<ElementFinder, ElementArrayFinder>(LogsPage.getNoOfRowsLogs);

  static pickedlinks = Pick.from<ElementFinder, ElementArrayFinder>(LicenseInformationPage.getlink());

  static SizeOf = (target) =>
    Question.about(`size of ${target}`, (actor) =>
      target
        .answeredBy(actor)
        .getSize()
        .then((e) => e.width)
    );

  static SizeOfElemPlusWidth = (target) =>
    Question.about(`size of ${target}`, (actor) =>
      target
        .answeredBy(actor)
        .getSize()
        .then((e) => e.width + 3)
    );

  static SizeOfElemMinusWidth = (target) =>
    Question.about(`size of ${target}`, (actor) =>
      target
        .answeredBy(actor)
        .getSize()
        .then((e) => e.width - 3)
    );

  static clickDropdownItem = (item) =>
    Task.where(
      `#user clicks on ${item} in the dropdown menu`,
      Wait.upTo(Duration.ofSeconds(9)).until(CommonLocators.dropdownItem(item), isClickable()),
      Click.on(CommonLocators.dropdownItem(item))
    );

  static validConfigPath = "../../screenplay/configs/config.json";

  static uploadValidConfigFile = path.resolve(__dirname, Common_Tasks.validConfigPath);

  static validConfigNonWritableParametersPath = "../../screenplay/configs/config_non_writable_paramters.json";

  static uploadValidConfigNonWritableParametersFile = path.resolve(
    __dirname,
    Common_Tasks.validConfigNonWritableParametersPath
  );

  static uploadIncorrectConfigFile = path.resolve(__dirname, Common_Tasks.fileToUpload4);

  static incorrectFormattedConfigFilePath = "../../screenplay/configs/config_incorrect_formatted.json";

  static uploadIncorrectFormattedConfigFile = path.resolve(__dirname, Common_Tasks.incorrectFormattedConfigFilePath);
}
