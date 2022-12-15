import { Task } from "@serenity-js/core";
import { Click, Target } from "@serenity-js/protractor";
import { by } from "protractor";
export const ClickBody = () =>
  Task.where(`#Send escape`, Click.on(Target.the("Browser").located(by.xpath("//html/body"))));
