const cucumberJunitConvert = require("cucumber-junit-convert");

const options = {
  inputJsonFile: "test_report.json",
  outputXmlFile: "test_report.xml",
};

cucumberJunitConvert.convert(options);
