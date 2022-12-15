import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

export class OverviewPage {
  static cards = Target.all("cards").located(by.css(".card"));
  static cardTitles = Target.all("Title of the card").located(
    by.xpath("//hr[@style='background-color: rgb(213, 216, 218);']/../header/div")
  );
  static paramNames = Target.all("Param Names").located(by.css(".cardRow>div>span"));
  static paramValues = Target.all("Values for each param").located(by.css(".cardRowValue"));

  static paramDescriptions = Target.all("Descriptions for each param").located(
    by.css("ul[class='MuiList-root MuiList-padding']>span")
  );
}
