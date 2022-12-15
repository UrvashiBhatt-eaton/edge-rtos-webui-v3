import { legacy_createStore as createStore, applyMiddleware } from "redux";
import AppReducer from "./rootReducer";
import thunk from "redux-thunk";
import { i18n, t, getFixedT } from "../translator/i18nFake";

// The initial state of the store
export const initialStore = {
  paramMeta: {},
  loadingLanguageFile: false,
  auth: {
    isLoggedIn: false,
    failedLogins: 0,
    errorMsg: "",
    userName: "",
    user_id: "",
    fullName: "",
    lastLoginTime: "",
    roleLevel: 0,
    dataURL: "",
    isConLost: false,
    mustChangePwd: false,
    usernamePasswordSame: false,
    isDeviceRestart: false,
    isSessionExpired: false,
    isHttpDisabled: false
  },
  channelData: {},
  channelValues: {},
  realtime: {
    subscription: [],
    subscribers: new Map()
  },
  editSettings: {
    visible: true,
    setting: null,
    startValue: null,
    message: ""
  },
  activeChannelList: [],
  /*
  alarms: { list: [] },
  */
  i18n: i18n,
  t: t,
  getFixedT: getFixedT,
  // https://confluence-prod.tcc.etn.com/display/LTK/Firmware+Design
  languageList: { setting: 3 /*browser default*/, code: null, languages: [] },
  language: {
    code: "",
    name: "",
    path: ""
  },
  userMenuOptionDialog: {
    visible: false,
    passwordChange: false,
    loginHistory: false,
    importExport: false,
    languageChange: false
  },
  fusSessionTimeoutSec: null,
  pageDetailView: null
};

export const store = (customInitial, customReducers, pb) =>
  createStore(
    AppReducer(customReducers),
    Object.assign(initialStore, customInitial),
    applyMiddleware(thunk.withExtraArgument({ pb }))
  );
