// Load the libraries we need for path/filesystem manipulation
const path = require("path");
const fs = require("fs");
const rmdir = require("./rmdir");

// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, "tempDownload");

const { ConsoleReporter } = require("@serenity-js/console-reporter"),
  { ArtifactArchiver } = require("@serenity-js/core"),
  { Photographer, TakePhotosOfInteractions } = require("@serenity-js/protractor"),
  { SerenityBDDReporter } = require("@serenity-js/serenity-bdd"),
  isCI = require("is-ci");

// usage: protractor protractor.conf.js --params.browser=firefox
// process command line arguments and initialize run configuration file
const init = function (config) {
  for (let i = 3; i < process.argv.length; i++) {
    let match = process.argv[i].match(/^--params\.([^=]+)=(.*)$/);
    if (match)
      switch (match[1]) {
        case "browser":
          config.capabilities.browserName = match[2];
          if (match[2] == "edge") {
            config.directConnect = false;
            config.seleniumAddress = "http://127.0.0.1:4444/wd/hub";
            config.capabilities.edgeOptions = {
              w3c: false,
              args: [
                "--silent",
                "--no-sandbox",
                "--test-type=browser",
                "--lang=US",
                "--start-maximized",
                "--disable-gpu",
                "--window-size=1920,1080",
                "--window-size=#{DEFAULT_X_RES},#{DEFAULT_Y_RES}"
              ] //,'--headless',
            };
            config.serenity = {
              outputDirectory: `${process.cwd()}/test_reports_edge`,
              runner: "cucumber",
              crew: [
                ArtifactArchiver.storingArtifactsAt("./test_reports_edge"),
                ConsoleReporter.forDarkTerminals(),
                Photographer.whoWill(TakePhotosOfInteractions), // or Photographer.whoWill(TakePhotosOfFailures),
                new SerenityBDDReporter()
              ]
            };
          } else if (match[2] == "firefox") {
            config.directConnect = false;
            config.geckoDriver = require(`geckodriver/lib/geckodriver`).path;
            config.capabilities.firefoxOptions = {
              args: [
                "--no-sandbox",
                "--disable-infobars",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--log-level=3",
                "--disable-gpu",
                "--window-size=1920,1080"
              ].concat(isCI ? ["--headless"] : []) // run in headless mode on the CI server
            };
            config.serenity = {
              outputDirectory: `${process.cwd()}/test_reports_firefox`,
              runner: "cucumber",
              crew: [
                ArtifactArchiver.storingArtifactsAt("./test_reports_firefox"),
                ConsoleReporter.forDarkTerminals(),
                Photographer.whoWill(TakePhotosOfInteractions), // or Photographer.whoWill(TakePhotosOfFailures),
                new SerenityBDDReporter()
              ]
            };
          } else {
            //config.chromeDriver = require(`chromedriver/lib/chromedriver`).path;
            config.directConnect = false;
            config.seleniumAddress = "http://127.0.0.1:4444/wd/hub";
            config.capabilities.chromeOptions = {
              args: [
                "--no-sandbox",
                "--disable-infobars",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--log-level=3",
                "--disable-gpu",
                "--start-maximized",
                "--enable-logging",
                "--v=1",
                "--test-type=browser"
              ].concat(isCI ? ["--headless"] : []), // run in headless mode on the CI server
              prefs: {
                "download.default_directory": downloadDir
              }
            };
            config.serenity = {
              outputDirectory: `${process.cwd()}/test_reports_chrome`,
              runner: "cucumber",
              crew: [
                ArtifactArchiver.storingArtifactsAt("./test_reports_chrome"),
                ConsoleReporter.forDarkTerminals(),
                Photographer.whoWill(TakePhotosOfInteractions), // or Photographer.whoWill(TakePhotosOfFailures),
                new SerenityBDDReporter()
              ]
            };
          }
          break;
      }
  }
  return config;
};
exports.config = (function () {
  return init({
    baseUrl: "http://192.168.1.254", // Web Application URL or Localhost http://localhost:9001
    SELENIUM_PROMISE_MANAGER: false,
    directConnect: true,
    allScriptsTimeout: 11000,
    framework: "custom",
    frameworkPath: require.resolve("@serenity-js/protractor/adapter"),
    specs: [
      "features/login/login.feature",
      "features/userMenu/failed_login_attempts.feature",
      "features/userMenu/user_menu.feature",
      "features/overviewPage/overviewpage.feature",
      "features/generalPage/gen_Date_Time.feature",
      "features/generalPage/gen_Locale.feature",
      "features/generalPage/gen_Device_Actions.feature",
      "features/generalPage/gen_Web_Session_Settings.feature",
      //"features/networkPage/network_cert_ipv4_modbus_whitelist.feature",
      "features/networkPage/network_proxy_setings.feature",
      "features/networkPage/network_iot.feature",
      "features/logsPage/logspage.feature",
      //"features/licenceInfo/licence_info.feature",
      "features/userManagement/reset_user.feature",
      "features//userManagement/create_new_user.feature",
      "features/userManagement/edit_user.feature",
      "features//userManagement/delete_user.feature"
      // "features/firmwarePage/firmwareinformation.feature",
      // "features/firmwarePage/firmwareupgrade.feature",
      // "features/networkPage/network_access_control.feature"
      // // "features/language/select*.feature",
      // // "features/language/set*.feature",
      // // "features/language/verify*.feature",
    ],
    onPrepare: function () {
      browser.waitForAngularEnabled(false);
      if (!fs.existsSync(downloadDir)) {
        // if it doesn't exist, create it
        fs.mkdirSync(downloadDir);
      }
    },
    onComplete: function () {
      rmdir(downloadDir);
    },
    cucumberOpts: {
      require: ["features/**/*.ts"],
      "require-module": ["ts-node/register"],
      tags: ["~@wip"],
      strict: false,
      format: ["snippets:pending-steps.txt", `json:${process.cwd()}/test_report.json`],
      retry: 2
    },
    capabilities: {
      browserName: "chrome",
      // see https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities#loggingpreferences-json-object
      loggingPrefs: {
        browser: "WARNING" // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
      }
    }
  });
})();
