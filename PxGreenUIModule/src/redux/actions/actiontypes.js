const prefix = "GREEN";
const createAction = (action, prefix = "COMMON") => ({
  REQUEST: `@SEED/${prefix}/${action}.REQUEST`,
  SUCCESS: `@SEED/${prefix}/${action}.SUCCESS`,
  FAILURE: `@SEED/${prefix}/${action}.FAILURE`
});

export const LOGIN = createAction("LOGIN", prefix);
export const DEVICE_CONNECTION = createAction("DEVICE_CONNECTION", prefix);
export const DEVICE_RESTART = createAction("DEVICE_RESTART", prefix);
export const SESSION_EXPIRED = createAction("SESSION_EXPIRED", prefix);
export const URL_REDIRECTION = createAction("URL_REDIRECTION", prefix);
export const LOAD_CHANNEL_META_RESET = createAction("LOAD_CHANNEL_META_RESET", prefix);
export const LOAD_CHANNEL_META = createAction("LOAD_CHANNEL_META", prefix);
export const LOAD_CHANNEL_VALUE = createAction("LOAD_CHANNEL_VALUE", prefix);
export const SET_RT_SUBSCRIPTION = createAction("SET_RT_SUBSCRIPTION", prefix);
export const ADD_RT_SUBSCRIPTION = createAction("ADD_RT_SUBSCRIPTION", prefix);
export const REMOVE_RT_SUBSCRIPTION = createAction("REMOVE_RT_SUBSCRIPTION", prefix);
export const LOCALIZATION = createAction("LOCALIZATION", prefix);
export const LOAD_LANGUAGE_LIST = createAction("LOAD_LANGUAGE_LIST", prefix);
export const LOAD_LANGUAGE = createAction("LOAD_LANGUAGE", prefix);
export const LOAD_ACTIVE_CHANNELS = createAction("LOAD_ACTIVE_CHANNELS", prefix);
export const OPEN_USER_MENU_OPTION = createAction("OPEN_USER_MENU_OPTION", prefix);
export const CLOSE_USER_MENU_OPTION = createAction("CLOSE_USER_MENU_OPTION", prefix);
export const SET_FUS_SESSION_TIMEOUT = createAction("SET_FUS_SESSION_TIMEOUT ", prefix);

export const EDIT_SETTING = {
  START: "@EDIT_SETTING/START",
  STOP: "@EDIT_SETTING/STOP",
  WRITE: "@EDIT_SETTING/WRITE",
  WRITING: "@EDIT_SETTING/WRITING",
  FAILURE: "@EDIT_SETTING/FAILURE"
};

export const SET_PAGE_DETAIL_VIEW = createAction("SET_PAGE_DETAIL_VIEW", prefix);
