import { combineReducers } from "redux";

import {
  LOAD_CHANNEL_META_RESET,
  LOAD_CHANNEL_META,
  LOAD_CHANNEL_VALUE,
  SET_RT_SUBSCRIPTION,
  ADD_RT_SUBSCRIPTION,
  REMOVE_RT_SUBSCRIPTION,
  EDIT_SETTING,
  LOGIN,
  DEVICE_CONNECTION,
  DEVICE_RESTART,
  SESSION_EXPIRED,
  URL_REDIRECTION,
  LOCALIZATION,
  LOAD_LANGUAGE_LIST,
  LOAD_LANGUAGE,
  LOAD_ACTIVE_CHANNELS,
  OPEN_USER_MENU_OPTION,
  CLOSE_USER_MENU_OPTION,
  SET_FUS_SESSION_TIMEOUT,
  SET_PAGE_DETAIL_VIEW
} from "./actions/actiontypes";

const loadingLanguageFileReducer = (state = false, action) => {
  let t = state.t;
  if (!t) {
    t = (str) => str;
  }
  switch (action.type) {
    case LOAD_LANGUAGE.REQUEST:
      return true;
    case LOAD_LANGUAGE.SUCCESS:
    // Fall through
    case LOAD_LANGUAGE.FAILURE:
      return false;
    default:
      return state;
  }
};

const authReducer = (state = [], action) => {
  let t = state.t;
  if (!t) {
    t = (str) => str;
  }
  switch (action.type) {
    case LOGIN.FAILURE:
      let errMsg;
      if (action.error == "device_connection_lost") {
        errMsg = t("Device Communication Failed");
      } else if (action.error.statusText != "Invalid User Credentials" && action.error.status == 401) {
        errMsg = t("Login Failed");
      } else if (action.error.status == 422 && action.error.statusText == "SFU Session in Progress") {
        errMsg = t("Firmware update session in progress, please retry after some time.");
      } else {
        errMsg = t(action.error.statusText);
      }
      return {
        ...state,
        isLoggedIn: false,
        failedLogins: state.failedLogins + 1,
        errorMsg: errMsg
      };
    case LOGIN.SUCCESS:
      const lastLoginEpoch = new Date(action.data.lastLoginTime * 1000);
      const lastLoginTimeCurrent = lastLoginEpoch.toLocaleString();
      if (Object.keys(action.data).length === 1 && !action.data.usernamePasswordSame) {
        return {
          ...state,
          usernamePasswordSame: action.data.usernamePasswordSame
        };
      } else {
        return {
          ...state,
          isLoggedIn: true,
          userName: action.data.userName,
          user_id: action.data.user_id,
          fullName: action.data.fullName,
          passwordComplexity: action.data.pwdComplexity,
          mustChangePwd: action.data.changePwd,
          lastLoginTime: lastLoginTimeCurrent,
          failedLogins: action.data.failedLogins,
          roleLevel: parseInt(action.data.role.level),
          dataURL: action.data.dataURL,
          usernamePasswordSame: action.data.usernamePasswordSame,
          isSessionExpired: false
        };
      }
    case DEVICE_CONNECTION.FAILURE:
      return {
        ...state,
        isConLost: true
      };
    case DEVICE_CONNECTION.SUCCESS:
      return {
        ...state,
        isConLost: false
      };
    case DEVICE_RESTART.SUCCESS:
      return {
        ...state,
        isDeviceRestart: true,
        isConLost: false
      };
    case SESSION_EXPIRED.SUCCESS:
      return {
        ...state,
        isSessionExpired: true
      };
    case SESSION_EXPIRED.REQUEST:
      return {
        ...state,
        isSessionExpired: false
      };
    case URL_REDIRECTION.SUCCESS:
      return {
        ...state,
        isHttpDisabled: true
      };
    default:
      return state;
  }
};

const channelDataReducer = (state = [], action) => {
  let chans = {};
  switch (action.type) {
    case LOAD_CHANNEL_META_RESET.REQUEST:
      return {};
      break;
    case LOAD_CHANNEL_META.SUCCESS:
      action.data.forEach((channel) => {
        chans[channel.id] = channel;
      });
      return { ...state, ...chans };
    default:
      return state;
  }
};

const channelValuesReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_CHANNEL_VALUE.SUCCESS:
      return { ...state, [action.data.id]: action.data.value };
    default:
      return state;
  }
};

const channelRealtimeReducer = (state = [], action) => {
  switch (action.type) {
    case SET_RT_SUBSCRIPTION.REQUEST: {
      let subscribers = state.subscribers;
      // Replace all the subscriptions with this new one
      subscribers.clear();
      subscribers.set(action.subscriber_id, action.data);
      return { ...state, subscription: action.data, subscribers: subscribers };
    }
    case ADD_RT_SUBSCRIPTION.REQUEST: {
      let subscribers = state.subscribers;
      let subs = [...state.subscription];
      let mySub = subscribers.get(action.subscriber_id) || [];
      for (let i = 0; i < action.data.length; i++) {
        // Add to the global list
        if (!subs.includes(action.data[i])) {
          subs.push(action.data[i]);
        }
        // Add to this subscriber's list
        if (!mySub.includes(action.data[i])) {
          mySub.push(action.data[i]);
        }
      }
      subscribers.set(action.subscriber_id, mySub); // Necessary?
      return { ...state, subscription: subs, subscribers: subscribers };
    }
    case REMOVE_RT_SUBSCRIPTION.REQUEST: {
      let subscribers = state.subscribers;
      let mySub = subscribers.get(action.subscriber_id);
      if (mySub) {
        // Remove these from my subscription
        mySub = mySub.filter((id) => !action.data.includes(id));
        if (mySub.length) {
          subscribers.set(action.subscriber_id, mySub);
        } else {
          subscribers.delete(action.subscriber_id);
        }
      }
      // Remove these from all subscriptions if no other subscriber is using them
      let subs = state.subscription.filter((id) => {
        // Loop through the subscriptions
        for (var [key, ids] of subscribers) {
          // Loop through the ids for this subscription
          for (let i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
              return true;
            }
          }
        }
        return false;
      });
      return { ...state, subscription: subs, subscribers: subscribers };
    }
    default:
      return state;
  }
};

const editSettingsReducer = (state = [], action) => {
  switch (action.type) {
    case EDIT_SETTING.START:
      return { ...state, ...action.data, visible: true };
    case EDIT_SETTING.FAILURE:
      return { ...state, message: action.message };
    case EDIT_SETTING.WRITING:
      return { ...state, ...action.data, message: "Saving..." };
    case EDIT_SETTING.WRITE:
    case EDIT_SETTING.STOP:
      return {
        ...state,
        setting: null,
        startValue: null,
        visible: false,
        message: ""
      };
    default:
      return state;
  }
};

const tReducer = (state = [], action) => {
  switch (action.type) {
    // Triggered by i18n initialization
    case LOCALIZATION.SUCCESS:
    // Fall through
    case LOCALIZATION.FAILURE:
      return action.data.t;
    default:
      return state;
  }
};

const i18nReducer = (state = [], action) => {
  switch (action.type) {
    // Triggered by i18n initialization
    case LOCALIZATION.SUCCESS:
    // Fall through
    case LOCALIZATION.FAILURE:
      return action.data.i18n;
    default:
      return state;
  }
};

const getFixedTReducer = (state = [], action) => {
  switch (action.type) {
    // Triggered by i18n initialization
    case LOCALIZATION.SUCCESS:
    // Fall through
    case LOCALIZATION.FAILURE:
      return action.data.getFixedT;
    default:
      return state;
  }
};

const getLanguageListReducer = (state = [], action) => {
  let languages = [];
  switch (action.type) {
    // Triggered by /rs/lang or /rs/param/[setting] reading
    // This will populate the list of languages to choose from
    case LOAD_LANGUAGE_LIST.SUCCESS:
      let json = {
        ...state,
        ...action.data
      };
      return json;
    default:
      return state;
  }
};

const getLanguageReducer = (state = [], action) => {
  switch (action.type) {
    // Triggered by REST read (could be done by our code or the i18n code via the loadPath)
    case LOAD_LANGUAGE.SUCCESS:
      if (action.data && action.data.code) {
        action.data.code = action.data.code.replace(/['"]+/g, ""); // Strip quotes
      }
      return action.data;
  }
  return state;
};

const paramMetaReducer = (state = [], action) => {
  return state;
};

const getActiveChannelListReducer = (state = [], action) => {
  if (action.type === LOAD_ACTIVE_CHANNELS) {
    return action.data;
  } else {
    return state;
  }
};

const userMenuOptionReducer = (state = [], action) => {
  if (action.type === OPEN_USER_MENU_OPTION) {
    return {
      ...state,
      ...action.data
    };
  } else if (action.type === CLOSE_USER_MENU_OPTION) {
    let obj = { ...state };
    Object.keys(obj).forEach((key) => {
      obj[key] = false;
    });
    return obj;
  } else {
    return state;
  }
};

const fusSessionTimeoutSecReducer = (state = [], action) => {
  if (action.type === SET_FUS_SESSION_TIMEOUT) {
    return action.data;
  } else {
    return state;
  }
};

const pageDetailViewReducer = (state = [], action) => {
  switch (action.type) {
    case SET_PAGE_DETAIL_VIEW:
      return action.data;
  }
  return state;
};

export default (customReducers) => {
  return combineReducers(
    Object.assign(
      {
        paramMeta: paramMetaReducer,
        loadingLanguageFile: loadingLanguageFileReducer,
        auth: authReducer,
        channelData: channelDataReducer,
        channelValues: channelValuesReducer,
        realtime: channelRealtimeReducer,
        editSettings: editSettingsReducer,
        activeChannelList: getActiveChannelListReducer,
        i18n: i18nReducer,
        t: tReducer,
        getFixedT: getFixedTReducer,
        languageList: getLanguageListReducer, // {setting, languages}
        language: getLanguageReducer,
        userMenuOptionDialog: userMenuOptionReducer,
        fusSessionTimeoutSec: fusSessionTimeoutSecReducer,
        pageDetailView: pageDetailViewReducer
      },
      customReducers
    )
  );
};
