import React from "react";
import { connect } from "react-redux";
import UserNameMenu from "@brightlayer-ui/layouts/dist/px-components/modal/userNameMenu";
import LockIcon from "@mui/icons-material/Lock";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import LanguageIcon from "@mui/icons-material/Language";
import ImportExportModal from "./ImportExportModal";
import PasswordChange from "./PasswordChange";
import LocalizationModal from "./localization/localizationModal";

//Functional component to update PxGreen specific User menu options and actions
function UserMenu(props) {
  const {
    addRealtimeAction,
    removeRealtimeAction,
    changePassword,
    languageFileDownloadAction,
    appLogout,
    writeSettingValue,
    loadMetaAction,
    fetchAction,
    openUserMenuOptionAction,
    closeUserMenuOptionAction,
    userMenuOptionDialog,
    dispatch,
    t
  } = props;

  let menuOptions = [];

  //Function to make the Password Change dialog visible
  const renderPasswordChange = () => {
    dispatch(openUserMenuOptionAction({ visible: true, passwordChange: true }));
  };

  //Function to make the Import/Export dialog visible
  const renderImportExport = () => {
    dispatch(openUserMenuOptionAction({ visible: true, importExport: true }));
  };

  //Function to make the Localization Change dialog visible
  const renderLocalization = () => {
    dispatch(openUserMenuOptionAction({ visible: true, languageChange: true }));
  };

  //Function to close the open dialog
  const handleChange = () => {
    dispatch(closeUserMenuOptionAction());
  };

  //Add Import/Export option in the Menu options (Optional feature)
  if (process.env.REACT_APP_IMPORT_EXPORT_ENABLE === "true") {
    let importExportMenuObj = {
      itemID: "3",
      InfoListItemProps: {
        id: "importExportItem"
      },
      title: t("Import/Export"),
      icon: <ImportExportIcon />,
      onClick: renderImportExport
    };
    menuOptions.push(importExportMenuObj);
  }

  //Add Localization in the Menu options (Optional feature)
  if (process.env.REACT_APP_LOCALIZE === "true") {
    const i18nMenuObj = {
      itemID: "0",
      InfoListItemProps: {
        id: "languageItem"
      },
      title: t("Language"),
      icon: <LanguageIcon />,
      onClick: renderLocalization
    };
    menuOptions.push(i18nMenuObj);
  }

  //Push Password Change Option
  menuOptions.push({
    itemID: "1",
    InfoListItemProps: {
      id: "changePasswordItem"
    },
    title: t("Change Password"),
    icon: <LockIcon />,
    onClick: renderPasswordChange
  });

  return (
    <UserNameMenu
      addRealtimeAction={addRealtimeAction}
      removeRealtimeAction={removeRealtimeAction}
      languageFileDownloadAction={languageFileDownloadAction}
      appLogout={appLogout}
      writeSettingValue={writeSettingValue}
      menuOptions={menuOptions}
      handleChange={handleChange}
      openUserMenuOptionAction={openUserMenuOptionAction}
    >
      {/* Add Menu Options which are not common to Linux UI */}
      {userMenuOptionDialog.passwordChange && (
        <PasswordChange
          id="changePassword"
          title={t("Change Password")}
          visible={userMenuOptionDialog.visible}
          onClose={handleChange}
          appLogout={appLogout}
          mode="Normal"
          changePassword={changePassword}
        ></PasswordChange>
      )}
      {userMenuOptionDialog.importExport && (
        <ImportExportModal
          id="importExportModal"
          title={t("Configuration Import/Export")}
          loadMetaAction={loadMetaAction}
          fetchAction={fetchAction}
          visible={userMenuOptionDialog.visible}
          onClose={handleChange}
          writeSettingValue={writeSettingValue}
        />
      )}
      {userMenuOptionDialog.languageChange && (
        <LocalizationModal
          id="localizationModal"
          addRealtimeAction={addRealtimeAction}
          removeRealtimeAction={removeRealtimeAction}
          languageFileDownloadAction={languageFileDownloadAction}
          title={t("Language")}
          visible={userMenuOptionDialog.visible}
          onClose={handleChange}
          writeSettingValue={writeSettingValue}
        />
      )}
    </UserNameMenu>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    }
  };
};

const mapStateToProps = ({ userMenuOptionDialog, t }) => {
  return {
    userMenuOptionDialog,
    t
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
