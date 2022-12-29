import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { LOCALIZATION, LOAD_LANGUAGE } from "../redux/actions/actiontypes";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const DEBUG = new URLSearchParams(window.location.search).get("debug") !== null,
  LOCALSTORAGE_CODE_KEY = "lang",
  LOCALSTORAGE_SETTING_KEY = "langSetting",
  //LANG = new URLSearchParams(window.location.search).get(LOCALSTORAGE_CODE_KEY),
  DEFAULT_NS = "common",
  LOGIN_NS = "login",
  ENGLISH_CODE = "en",
  NOT_AVAILABLE = "NA";
let _lastCodeRequested,
  _initIniProgress = false;

function two(str) {
  return (str || "").substr(0, 2);
}

class EnableTranslator extends React.Component {
  constructor(props) {
    super(props);
    this.subscriber_id = "Translator_" + new Date().getTime();
    const t = props.t,
      localStorageLanguageCode = two(localStorage.getItem(LOCALSTORAGE_CODE_KEY)),
      browserDefaultCode = two(navigator.language),
      newCode = two(localStorageLanguageCode || props.languageList.code);

    // Getting the list doesn't require security so we can load immediately
    if (typeof props.loadLanguageList == "function") {
      console.info("Requesting the language list");
      props.dispatch(props.loadLanguageList());
    }
    // Note the loadLanguageList is async so we can't use props.languageList won't be available
    // TODO make it synchronous so it is and use props.languageList.setting
    // Although that's only needed until you make your first local save of the language, after that you'll have a localStorageLanguageCode

    // Don't need to use i18n for English
    if ((!newCode && browserDefaultCode != ENGLISH_CODE) || (newCode && newCode != ENGLISH_CODE)) {
      console.info("i18n.init login starting");
      i18n
        .use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init(
          getInitCfg(
            "/if/locales/{{lng}}/{{ns}}.json", // login translations read from public/locales in the web UI repo
            [LOGIN_NS],
            newCode
            //browserDefaultCode
            //LANG || localStorage.getItem(LOCALSTORAGE_CODE_KEY) || ENGLISH_CODE
            //localStorage.getItem(LOCALSTORAGE_CODE_KEY) || ENGLISH_CODE
          )
        )
        .then((t) => {
          console.info("i18n.init login complete");
          try {
            let resultingCode = two(i18n.language);
            // Make the localization functionality available to the web UI (login ns)
            console.info("Publishing the initial i18n: " + i18n.language);
            this.publish(props, i18n, t, {
              code: resultingCode,
              path: "/if/locales/" + resultingCode + "/login.json",
              name: resultingCode,
            });
          } catch (err) {
            console.error("props.dispatch(props.loadLanguageList()) failed");
            console.error(err);
          }
        })
        .catch((err) => {
          if (err) {
            console.error("i18n.init login failed: " + err);
          }
        })
        .finally(() => {
          if (!newCode) {
            // i18next persists the new code, but we don't want it to if it's the default
            localStorage.removeItem(LOCALSTORAGE_CODE_KEY);
          }
        });
    }
    console.info("i18n.init login requested...");
  }

  componentWillUnmount() {
    const { removeRealtimeAction, dispatch, ids } = this.props;
    if (removeRealtimeAction) {
      dispatch(removeRealtimeAction(ids, this.subscriber_id));
    }
  }

  render() {
    const me = this,
      browserDefaultCode = two(navigator.language),
      localStorageLanguageCode = two(localStorage.getItem(LOCALSTORAGE_CODE_KEY)),
      localStorageLanguageSetting = localStorage.getItem(LOCALSTORAGE_SETTING_KEY),
      {
        dispatch,
        isLoading,
        DEVICE_SAVED = 0,
        DEVICE_SAVED_PER_USER = 1,
        BROWSER_DEFAULT = 2,
        BROWSER_STORED = 3,
        settingParam,
        codeParam,
        languageList,
        addRealtimeAction,
        ids,
        dataURL,
        fetchAuthHeadersAction,
      } = me.props,
      codeInUse = two(i18n.language),
      setting = localStorageLanguageSetting
        ? localStorageLanguageSetting
        : settingParam >= 0
        ? settingParam
        : languageList.setting,
      newCode =
        setting == BROWSER_DEFAULT
          ? ""
          : two(localStorageLanguageCode || (codeParam != NOT_AVAILABLE ? codeParam : languageList.code));

    let newLanguage = { code: _lastCodeRequested, path: "", name: "" },
      needToUpdateI18n = false;

    // Handle English special since we don't need to load English since we use English by default
    if ((newCode && newCode == ENGLISH_CODE) || (!newCode && browserDefaultCode == ENGLISH_CODE)) {
      if (codeInUse && codeInUse != ENGLISH_CODE) {
        needToUpdateI18n = true;
      } else if (browserDefaultCode == ENGLISH_CODE) {
        // To remove the skeleton
        dispatch({ type: LOAD_LANGUAGE.FAILURE });
      }
    } else if (
      //(newCode || _lastCodeRequested) &&
      newCode != _lastCodeRequested
    ) {
      needToUpdateI18n = true;
    }

    if (!_initIniProgress && isLoading && (me.subscribed === undefined || needToUpdateI18n)) {
      _initIniProgress = true;
      if (languageList && languageList.languages) {
        languageList.languages.some((lang) => {
          if (newCode == lang.code) {
            newLanguage = Object.assign({}, lang);
            return true;
          }
        });
      }

      if (me.subscribed === undefined) {
        me.subscribed = false;
      } else {
        newLanguage.code = newCode;
      }

      setTimeout(() => {
        if (!me.subscribed) {
          if (addRealtimeAction) {
            dispatch(addRealtimeAction(ids, me.subscriber_id));
          }
          me.subscribed = true;
          // End since the setting won't have been read yet
          _initIniProgress = false;
          return;
        }

        /*  https://confluence-prod.tcc.etn.com/display/LTK/Firmware+Design
        0 DEVICE_SAVED          = Use device stored language setting          // not supported by UI
        1 DEVICE_SAVED_PER_USER = Use device stored language setting per user // not supported by REST
        2 BROWSER_DEFAULT       = Use browser stored language setting
        3 BROWSER_STORED        = Use browser default language settings       // Erase the localStorage.lang and ignore the device language
        */
        switch (setting) {
          // Unimplemented - treat like DEVICE_SAVED
          case DEVICE_SAVED_PER_USER:
          // Fall through
          case DEVICE_SAVED:
            // Save off locally too for the login screen
            // TODO we can remove this if we start reading the languageList before the login screen
            if (newLanguage.code != localStorage.getItem(LOCALSTORAGE_CODE_KEY)) {
              localStorage.setItem(LOCALSTORAGE_CODE_KEY, newLanguage.code);
            }
            break;
          case BROWSER_STORED:
            break;
          case BROWSER_DEFAULT:
            if (localStorage.getItem(LOCALSTORAGE_CODE_KEY)) {
              localStorage.removeItem(LOCALSTORAGE_CODE_KEY);
            }
            newLanguage = { code: null, path: "", name: "" }; // ask i18n to get from the browser
            break;
          default:
            break;
        }

        // Get the path from the language list
        let loadPath = newLanguage && newLanguage.path ? newLanguage.path : "/rs/lang/{{lng}}/file";
        // Handle the localhost CORS case
        if (location.href.indexOf("localhost") != -1) {
          // Trim any trailing / in dataURL
          loadPath = (dataURL || "").replace(/\/$/, "") + "/rs/lang/{{lng}}/file"; // REST interface populated by language codepack
        }
        _lastCodeRequested = newLanguage.code;
        // Make the localization functionality available to the rest of the web UI (common ns)
        console.info("Changing language to " + newLanguage.code);

        i18n
          .use(Backend)
          .use(LanguageDetector)
          .use(initReactI18next)
          .init(
            getInitCfg(
              loadPath, // Common translations read from the REST interface (populated by the language codepack uploaded)
              [DEFAULT_NS],
              newLanguage.code,
              typeof fetchAuthHeadersAction === "function"
                ? dispatch(fetchAuthHeadersAction("GET", loadPath))
                : undefined
            )
          )
          .then((t) => {
            console.info("Changed language to '" + newLanguage.code + "' resulted in " + i18n.language);
            setTimeout(function () {
              console.info("Publishing the new i18n: " + i18n.language);
              me.publish(me.props, i18n, t, newLanguage);
            }, 1);
          })
          .catch((err) => {
            if (err) {
              console.error("Failed to change language to " + newLanguage.code + ": " + err);
            }
            setTimeout(function () {
              dispatch({ type: LOAD_LANGUAGE.FAILURE });
            }, 1);
          })
          .finally(() => {
            _initIniProgress = false;
            if (setting == BROWSER_DEFAULT) {
              // i18next persists the new code, but we don't want it to if it's the default
              localStorage.removeItem(LOCALSTORAGE_CODE_KEY);
            }
          });
      }, 1);
      console.info("Changed language to " + newLanguage.code + " requested...");
    }
    return <div></div>;
  }

  publish(props, i18n, t, language) {
    props.dispatch({
      type: LOCALIZATION.SUCCESS,
      data: {
        i18n: i18n,
        t: t,
        getFixedT: i18n.getFixedT.bind(i18n),
      },
    });
    props.dispatch(props.loadLanguage(language ? language : i18n ? { code: i18n.language } : undefined, t));
  }
}

function getInitCfg(loadPath, namespaces = [DEFAULT_NS], lng, authHeader) {
  let cfg = {
    //saveMissing: true,
    //saveMissingTo: "translation",
    //updateMissing: true,
    backend: {
      loadPath: loadPath,
      //addPath: "/if/locales/{{lng}}/{{ns}}.json",
      crossDomain: true,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
      lookupQuerystring: LOCALSTORAGE_CODE_KEY,
      lookupLocalStorage: LOCALSTORAGE_CODE_KEY,
    },
    // If you leave fallbackLng out it tries to query "dev" as a code
    fallbackLng: {
      //de: ["fr", ENGLISH_CODE],
      //es: ["fr", ENGLISH_CODE],
      //fr: ["es", ENGLISH_CODE],
      //zh: [ENGLISH_CODE],
      //ar: [ENGLISH_CODE],
      //he: [ENGLISH_CODE],
      //"en-US": [ENGLISH_CODE],
      //default: [ENGLISH_CODE],
    },
    lng: lng,
    debug: DEBUG,
    ns: namespaces,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  };

  if (authHeader) {
    // custom request headers sets request.setRequestHeader(LOCALSTORAGE_CODE_KEY, value)
    //cfg.backend.withCredentials=true;
    cfg.backend.customHeaders = {
      authorization: authHeader,
    };
  }
  return cfg;
}

function mapStateToProps({ paramMeta, channelValues, language, languageList, loadingLanguageFile }) {
  return {
    // https://confluence-prod.tcc.etn.com/display/LTK/Firmware+Design
    ids: [paramMeta.LANG_PREF_SETTING.id, paramMeta.COMMON_LANG_PREF.id],
    settingParam: Number(channelValues[paramMeta.LANG_PREF_SETTING.id]),
    // Strip of any quotes
    codeParam: (channelValues[paramMeta.COMMON_LANG_PREF.id] || NOT_AVAILABLE).replace(/['"]+/g, ""),
    language,
    languageList,
    isLoading: loadingLanguageFile,
  };
}

export default withTranslation()(connect(mapStateToProps)(EnableTranslator));
