import { setDefaultTimeout } from "cucumber";
import { Actors } from "../../spec/screenplay/Actors";
import { engage } from "@serenity-js/core";

setDefaultTimeout(500000);
engage(new Actors());
