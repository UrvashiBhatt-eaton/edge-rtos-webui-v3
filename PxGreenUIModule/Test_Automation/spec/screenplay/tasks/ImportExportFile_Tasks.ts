import { Ensure, equals, isGreaterThan } from "@serenity-js/assertions";
import { Duration, Task } from "@serenity-js/core";
import { Enter, isClickable, Navigate, Wait } from "@serenity-js/protractor";
import { AvatarMenu } from "../ui/AvatarMenu";

const path = require("path");
const fs = require("fs");
let filePath = path.resolve(__dirname, "../../../tempDownload/config.json");

export class ImportExportFile_Tasks {
  static checkFileDownload = () => {
    return Task.where(
      `Check the downloaded file and its content exists`,
      Ensure.that(fs.existsSync(filePath), equals(true)),
      Navigate.to(filePath),
      Ensure.that(AvatarMenu.checkFileContent(), isGreaterThan(0))
    );
  };

  static uploadConfigFile = (filepath: any) =>
    Task.where(
      `#User uploads config file`,
      Wait.upTo(Duration.ofSeconds(9)).until(AvatarMenu.importBtn, isClickable()),
      Enter.theValue(filepath).into(AvatarMenu.uploadConfigFileBtn),
      Wait.for(Duration.ofSeconds(5))
    );
}
