import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import * as Colors from "@brightlayer-ui/colors";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const //DEVICE_SAVED = 0, DEVICE_SAVED_PER_USER = 1,
  BROWSER_DEFAULT = 2,
  BROWSER_STORED = 3,
  BROWSER_DEFAULT_INDEX = 1000,
  ENGLISH_INDEX = 1001,
  ENGLISH_CODE = "en",
  LOCALSTORAGE_CODE_KEY = "lang",
  LOCALSTORAGE_SETTING_KEY = "langSetting",
  NOT_AVAILABLE = "NA";

function LocalizeChange(props) {
  let localStorageLanguageCode = localStorage.getItem(LOCALSTORAGE_CODE_KEY);
  let localStorageLanguageSetting = localStorage.getItem(LOCALSTORAGE_SETTING_KEY);
  const { languageList, settingParam, codeParam } = props,
    // Give preference to the localStorage, then to the param, then to the languageList
    code = localStorageLanguageCode || (codeParam != NOT_AVAILABLE ? codeParam : languageList.code) || "",
    setting = localStorageLanguageSetting
      ? localStorageLanguageSetting
      : settingParam >= 0
      ? settingParam
      : languageList.setting;
  let originalIndex = BROWSER_DEFAULT_INDEX;

  if (setting != BROWSER_DEFAULT) {
    // Local code takes preference over device stored code
    if (localStorageLanguageCode) {
      // English doesn't require a language pack so treat specially
      if (localStorageLanguageCode.substr(0, 2) == ENGLISH_CODE) {
        originalIndex = ENGLISH_INDEX;
      } else {
        languageList.languages.some((nextLanguage, index) => {
          if (nextLanguage.code == localStorageLanguageCode) {
            originalIndex = index;
            return true;
          }
        });
      }
      // English doesn't require a language pack so treat specially
    } else if (code.substr(0, 2) == ENGLISH_CODE) {
      originalIndex = ENGLISH_INDEX;
    } else {
      languageList.languages.some((nextLanguage, index) => {
        if (nextLanguage.code == code) {
          originalIndex = index;
          return true;
        }
      });
    }
  }
  let subscriber_id = "IotDisplayContainer_" + new Date().getTime();
  const [state, setState] = useState({
    originalIndex,
    selectedIndex: originalIndex,
    error: false,
    errMsg: "",
    errTitle: ""
  });

  useEffect(() => {
    if (props.addRealtimeAction) {
      // this.subscriber_id = "LocaleChange_" + new Date().getTime();
      props.dispatch(props.addRealtimeAction(props.ids, subscriber_id));
    }
    // returned function will be called on component unmount
    return () => {
      const { removeRealtimeAction, dispatch, ids } = props;
      if (removeRealtimeAction) {
        dispatch(removeRealtimeAction(ids, subscriber_id));
      }
    };
  }, []);

  const dispatchData = (event) => {
    // const props = props;
    const { paramMeta, t, dispatch } = props;
    const selectedIndex = state.selectedIndex;
    let setting, code, newLanguage;
    // Currently only supporting BROWSER_DEFAULT and BROWSER_STORED
    if (selectedIndex == BROWSER_DEFAULT_INDEX) {
      setting = BROWSER_DEFAULT;
      code = "";
      newLanguage = { code: "", name: "", path: "" };
      localStorage.removeItem(LOCALSTORAGE_CODE_KEY);
      localStorage.setItem(LOCALSTORAGE_SETTING_KEY, BROWSER_DEFAULT);
    } else {
      // English doesn't require a language pack so treat specially
      newLanguage =
        selectedIndex == ENGLISH_INDEX
          ? { code: ENGLISH_CODE, name: t("English"), path: "" }
          : languageList.languages[selectedIndex];
      setting = BROWSER_STORED;
      code = newLanguage.code;
      localStorage.setItem(LOCALSTORAGE_CODE_KEY, code);
      localStorage.setItem(LOCALSTORAGE_SETTING_KEY, BROWSER_STORED);
    }
    event.preventDefault();

    // https://confluence-prod.tcc.etn.com/display/LTK/Firmware+Design
    dispatch(props.writeSettingValue(paramMeta.LANG_PREF_SETTING.id, setting, null, t)).catch((msg) =>
      typeof msg === "string"
        ? setState({ ...state, error: true, errTitle: t("Error"), errMsg: t(msg) })
        : setState({
            ...state,
            error: true,
            errTitle: t(msg[0]),
            errMsg: t(msg[1])
          })
    );
    // Even though we don't use this value (we use localStorage.lang), we still set it to trigger updates to the UI
    dispatch(props.writeSettingValue(paramMeta.COMMON_LANG_PREF.id, '"' + code + '"', null, t)).catch((msg) =>
      typeof msg === "string"
        ? setState({ ...state, error: true, errTitle: t("Error"), errMsg: t(msg) })
        : setState({
            ...state,
            error: true,
            errTitle: t(msg[0]),
            errMsg: t(msg[1])
          })
    );
    dispatch(props.languageFileDownloadAction());
    props.onClose();
  };

  const closeErrModal = () => {
    setState({ ...state, error: false, errTitle: "", errMsg: "" });
  };

  // const props = props;
  const { classes, t, id, className } = props;
  return (
    <div id={id} className={className}>
      {state.error ? (
        <ConfirmModal
          visible={state.error}
          title={t(state.errTitle)}
          description={t(state.errMsg)}
          onOk={closeErrModal}
        ></ConfirmModal>
      ) : (
        ""
      )}
      <DialogTitle style={{ width: "360px", padding: "16px 24px 16px 24px" }} disableTypography>
        <Typography
          variant="h6"
          style={{
            color: "#007BC1",
            fontWeight: "600"
          }}
        >
          {t("Select Language")}
          <IconButton aria-label="close" onClick={props.onClose} className={classes.icon}>
            <Close style={{ color: Colors.gray[500] }} />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent style={{ padding: "0 0 0 0" }}>
        <Grid
          container
          direction="column"
          justify="space-between"
          style={{ height: "100%", flexWrap: "nowrap", width: "360px" }}
        >
          <FormControl variant="filled" margin="dense" style={{ margin: "16px 24px 16px 24px" }}>
            <Select
              value={state.selectedIndex}
              id="selectLanguage"
              onChange={(evt) => {
                setState({
                  ...state,
                  selectedIndex: evt.target.value
                });
              }}
              SelectDisplayProps={{ style: { padding: "12px 12px 12px 12px" } }}
            >
              <MenuItem key={`choice_browserDefault`} value={BROWSER_DEFAULT_INDEX} id={"langOptionBrowserDefault"}>
                {t("Browser Default")}
              </MenuItem>
              {languageList &&
                languageList.languages &&
                languageList.languages.map((value, index) => (
                  <MenuItem
                    key={`choice_${index}`}
                    value={index}
                    id={"langOption" + languageList.languages[index].name}
                  >
                    {t(languageList.languages[index].name)}
                  </MenuItem>
                ))}
              <MenuItem key={`choice_English`} value={ENGLISH_INDEX} id={"langOptionEnglish"}>
                {t("English")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: "24px 24px 24px 24px", justifyContent: "space-between" }}>
        <Button
          id="languageSelectionCancel"
          style={{ width: "40%" }}
          type="button"
          color="primary"
          variant="outlined"
          onClick={props.onClose}
        >
          {t("Cancel")}
        </Button>
        <Button
          id="languageSelectionOk"
          autoFocus
          style={{ width: "40%" }}
          type="submit"
          variant="contained"
          color="primary"
          onClick={dispatchData}
          disabled={state.selectedIndex == state.originalIndex}
          disableElevation
        >
          {t("OK")}
        </Button>
      </DialogActions>
    </div>
  );
}

LocalizeChange.propTypes = {
  writeSettingValue: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

LocalizeChange.defaultProps = {
  languageList: {
    setting: BROWSER_DEFAULT,
    languages: []
  }
};

const styles = () => ({
  icon: { float: "right", padding: "4px" }
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      return dispatch(action);
    }
  };
};
function mapStateToProps({ paramMeta, channelValues, languageList, t }) {
  return {
    paramMeta,
    ids: [paramMeta.LANG_PREF_SETTING.id, paramMeta.COMMON_LANG_PREF.id],
    settingParam: Number(channelValues[paramMeta.LANG_PREF_SETTING.id]),
    // Strip of any quotes
    codeParam: (channelValues[paramMeta.COMMON_LANG_PREF.id] || NOT_AVAILABLE).replace(/['"]+/g, ""),
    languageList,
    t
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LocalizeChange));
