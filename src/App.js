// Framework imports
import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Material-UI
import { useTheme } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Assets
import productLogo from "./assets/images/pxgreen.svg";
import cybersecurityLogo from "./assets/images/cyber_logo.jpg";
import eatonLogo from "./assets/images/eatonlogo.svg";

// Translator
import Translator from "./translator/translator";

import { connect } from "react-redux";

// Routing components
import SeedRouter from "@brightlayer-ui/seed-router";
import { CardLayout, ListLayout } from "@brightlayer-ui/layouts";
import EditSettingsMessage from "@brightlayer-ui/layouts/dist/px-components/settings/editSettingsMessage";
import DateDisplayContainer from "@brightlayer-ui/layouts/dist/px-components/dateDisplayContainer";
import IotDisplayContainer from "@brightlayer-ui/layouts/dist/px-components/iotDisplayContainer";
import CaCertificateContainer from "./components/caCertificateContainer";
import DeviceConnectionLostModal from "@brightlayer-ui/layouts/dist/px-components/modal/conLostModal";
import MustChangePassword from "@brightlayer-ui/layouts/dist/px-components/MustChangePassword";
import DeviceRestartAlertModal from "@brightlayer-ui/layouts/dist/px-components/modal/deviceRestartModal";
import SessionExpiredContainer from "@brightlayer-ui/layouts/dist/px-components/sessionExpiredContainer";
import BackdropScreen from "@brightlayer-ui/layouts/dist/px-components/backdropScreen";

// Brightlayer imports
import * as PXBColors from "@brightlayer-ui/colors";

import LoginLayout from "./components/layouts/LoginLayoutContainer";
import EulaCard from "./components/EulaCard";
import Logs from "./components/Logs";
import Table from "./components/CustomTableContainer";
import UserMenu from "./components/UserMenuContainer";
import FirmwareUpdateContainer from "./components/firmware/FirmwareUpdateContainer";
import UserManagement from "./components/layouts/UserManagement";
import HttpDisabledModal from "./components/HttpDisabledModal";
import PasswordChange from "./components/PasswordChange";

import {
  login,
  addChannelRealtimeSubscription,
  removeChannelRealtimeSubscription,
  loadChannelMeta,
  startEditSetting,
  finishEditSetting,
  writeSettingValue,
  appLogout,
  markTimeChannel,
  setUserInactivityTime,
  markFwUpgradeModeChannel,
  appRefresh,
  closeSessionExpiredModalAction,
  getUserDetails,
  getRoles,
  createNewUserAction,
  pwdComplexityDetails,
  resetDefaultPwdAction,
  deleteUser,
  updateUser,
  loadLanguageList,
  loadLanguage,
  changePasswordAction,
  clearPasswordWarning,
  fetchCertificateAction,
  fetchAction,
  parseXML,
  fetchAuthHeadersAction,
  getFwUpgradeMode,
  setSystemTimeChannel,
  setFwUpdateProgressFlag,
  setFwUpdateAbortFlag,
  initiateLanguageFileDownload,
  openUserMenuOptionAction,
  closeUserMenuOptionAction,
  setFusSessionTimeoutSec,
  setPageDetailView
} from "./redux/actions/greenActions";

import worker_chunks_script from "./communication/worker-chunks";

const defaultTemplates = {
  card: (page, pageProps) => {
    return (
      <CardLayout
        title={page.name}
        cards={page.data}
        addRealtimeAction={addChannelRealtimeSubscription}
        removeRealtimeAction={removeChannelRealtimeSubscription}
        loadMetaAction={loadChannelMeta}
        customChannelCard={pageProps.customChannelCard}
      />
    );
  },
  "user-management": (page) => (
    <UserManagement
      title={page.name}
      getUserDetails={getUserDetails}
      getRoles={getRoles}
      createNewUserAction={createNewUserAction}
      resetDefaultPwdAction={resetDefaultPwdAction}
      deleteUser={deleteUser}
      updateUser={updateUser}
      pwdComplexityDetails={pwdComplexityDetails}
    />
  ),
  "settings-log": (page, pageProps) => (
    <Logs
      title={page.name}
      customProps={pageProps.logsData}
      loadMetaAction={loadChannelMeta}
      fetchAction={fetchAction}
    />
  ),
  "settings-list": (page, pageProps) => {
    return (
      <ListLayout
        title={page.name}
        sections={page.data}
        addRealtimeAction={addChannelRealtimeSubscription}
        removeRealtimeAction={removeChannelRealtimeSubscription}
        loadMetaAction={loadChannelMeta}
        startEditSetting={startEditSetting}
        finishEditSetting={finishEditSetting}
        writeSettingValue={writeSettingValue}
        editInline={true}
      >
        {getNestedComponents(page, pageProps)}
      </ListLayout>
    );
  }
};

function getNestedComponents(page, pageProps) {
  const ProductEulaContent = pageProps.productEulaContent;
  let components = [];
  page.data.forEach((section, index) => {
    if (section.layout) {
      switch (section.layout) {
        case "settings-firmware":
          components.push(
            <FirmwareUpdateContainer
              key={`section-${index}`}
              title={page.name}
              fetchAction={fetchAction}
              parseXML={parseXML}
              fetchAuthHeadersAction={fetchAuthHeadersAction}
              getFwUpgradeMode={getFwUpgradeMode}
              worker_chunks_script={worker_chunks_script}
              setFwUpdateProgressFlag={setFwUpdateProgressFlag}
              setFwUpdateAbortFlag={setFwUpdateAbortFlag}
            >
              {!pageProps.productEulaContent ? <EulaCard /> : <ProductEulaContent />}
            </FirmwareUpdateContainer>
          );
          break;
        case "settings-certificate":
          components.push(
            <CaCertificateContainer
              title={page.name}
              key={`section-${index}`}
              fetchCertificateAction={fetchCertificateAction}
            />
          );
          break;
        case "settings-table":
          components.push(
            <Table
              key={`section-${index}`}
              tableConfig={section.data}
              delimiter={section.delimiter}
              addRealtimeAction={addChannelRealtimeSubscription}
              removeRealtimeAction={removeChannelRealtimeSubscription}
              loadMetaAction={loadChannelMeta}
            />
          );
          break;
      }
    } else {
      // To make the children prop null for groups that do not have layout defined
      components.push(null);
    }
  });
  return components;
}

//class GreenCore extends React.Component {
function App(props) {
  const {
      productLogo,
      productName,
      productVersion,
      cybersecurityLogo,
      registerURL,
      forgotPasswordURL,
      termsURL,
      privacyURL,
      authEnabled,
      appPages,
      sidebarTheme,
      eatonLogo,
      templateMap,
      dataURL,
      t,
      paramMeta,
      pageProps
    } = props,
    theme = useTheme(),
    isRTL = theme && theme.direction === "rtl",
    authPage = (
      <LoginLayout
        loginAction={login}
        productLogo={productLogo}
        cybersecurityLogo={cybersecurityLogo}
        registerURL={registerURL}
        forgotPasswordURL={forgotPasswordURL}
        termsURL={termsURL}
        privacyURL={privacyURL}
      />
    ),
    templates = Object.assign(defaultTemplates, templateMap);

  useEffect(() => {
    markTimeChannel(paramMeta.UNIX_EPOCH_TIME.id);
    setUserInactivityTime(paramMeta.USER_INACTIVITY_TIMEOUT.id);
    markFwUpgradeModeChannel(paramMeta.FW_UPGRADE_MODE.id);
    setSystemTimeChannel(
      paramMeta.UNIX_EPOCH_TIME.id,
      paramMeta.AUTO_UPDATE_TIME_DIFF_SEC != undefined ? paramMeta.AUTO_UPDATE_TIME_DIFF_SEC.id : undefined
    );
    setFusSessionTimeoutSec(
      paramMeta.UI_FUS_SESSION_TIMEOUT_SEC != undefined ? paramMeta.UI_FUS_SESSION_TIMEOUT_SEC.id : undefined
    );
    return function cleanup() {
      this.props.pb && this.props.pb.close();
    };
  }, [
    paramMeta.AUTO_UPDATE_TIME_DIFF_SEC,
    paramMeta.FW_UPGRADE_MODE,
    paramMeta.UNIX_EPOCH_TIME,
    paramMeta.USER_INACTIVITY_TIMEOUT,
    paramMeta.UI_FUS_SESSION_TIMEOUT_SEC
  ]);

  return (
    <>
      <Translator
        dataURL={dataURL}
        loadLanguageList={loadLanguageList}
        fetchAuthHeadersAction={fetchAuthHeadersAction}
        addRealtimeAction={addChannelRealtimeSubscription}
        removeRealtimeAction={removeChannelRealtimeSubscription}
        loadLanguage={loadLanguage}
      />
      <React.Fragment>
        <SeedRouter
          productName={productName ? productName : t("Seed UI")}
          productVersion={productVersion}
          authEnabled={authEnabled}
          authTemplate={authPage}
          appPages={appPages}
          templateMap={templates}
          theme={theme}
          sidebarTheme={sidebarTheme}
          logoutAction={appLogout}
          eatonLogo={eatonLogo}
          pageProps={pageProps}
          setPageDetailViewAction={setPageDetailView}
        >
          <UserMenu
            addRealtimeAction={addChannelRealtimeSubscription}
            removeRealtimeAction={removeChannelRealtimeSubscription}
            changePassword={changePasswordAction}
            languageFileDownloadAction={initiateLanguageFileDownload}
            appLogout={appLogout}
            writeSettingValue={writeSettingValue}
            loadMetaAction={loadChannelMeta}
            fetchAction={fetchAction}
            openUserMenuOptionAction={openUserMenuOptionAction}
            closeUserMenuOptionAction={closeUserMenuOptionAction}
          />
          <AppBar
            style={{
              top: "auto",
              zIndex: 1,
              bottom: 0,
              backgroundColor: PXBColors.black[500],
              color: PXBColors.white[50]
            }}
          >
            <MustChangePassword
              changePassword={changePasswordAction}
              appLogout={appLogout}
              clearPasswordWarning={clearPasswordWarning}
              template={PasswordChange}
            />
            {
              <Toolbar variant="dense">
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{
                    fontSize: 13,
                    marginRight: isRTL ? 60 : "auto",
                    marginLeft: isRTL ? "auto" : 60 // Include width of the menu bar that overlays us
                  }}
                >
                  <EditSettingsMessage></EditSettingsMessage>
                </Typography>
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{
                    fontSize: 13,
                    marginLeft: isRTL ? -12 : "auto",
                    marginRight: isRTL ? "auto" : -12
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {
                      <DateDisplayContainer
                        addRealtimeAction={addChannelRealtimeSubscription}
                        removeRealtimeAction={removeChannelRealtimeSubscription}
                        loadMetaAction={loadChannelMeta}
                      />
                    }
                    <div>
                      {
                        <IotDisplayContainer
                          style={{ marginLeft: "20px" }}
                          addRealtimeAction={addChannelRealtimeSubscription}
                          removeRealtimeAction={removeChannelRealtimeSubscription}
                          loadMetaAction={loadChannelMeta}
                        />
                      }
                    </div>
                  </div>
                </Typography>
              </Toolbar>
            }
            <DeviceConnectionLostModal refreshAction={appRefresh} />
            <DeviceRestartAlertModal refreshAction={appRefresh} />
            <SessionExpiredContainer
              refreshAction={appRefresh}
              loginAction={login}
              closeModalAction={closeSessionExpiredModalAction}
            />
            <HttpDisabledModal refreshAction={appRefresh} />
          </AppBar>
          <BackdropScreen />
        </SeedRouter>
      </React.Fragment>
    </>
  );
}
App.propTypes = {
  authEnabled: PropTypes.bool.isRequired,
  reducers: PropTypes.object,
  dataURL: PropTypes.string,
  pageProps: PropTypes.object
};
App.defaultProps = {
  authEnabled: true,
  productVersion: "2.9",
  productLogo: productLogo,
  cybersecurityLogo: cybersecurityLogo,
  eatonLogo: eatonLogo,
  reducers: {}
};
const mapStateToProps = (state) => {
  return {
    t: state.t,
    paramMeta: state.paramMeta
  };
};
export default connect(mapStateToProps, null)(App);
