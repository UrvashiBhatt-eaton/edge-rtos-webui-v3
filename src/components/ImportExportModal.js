import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import PublishIcon from "@mui/icons-material/Publish";
import GetApp from "@mui/icons-material/GetApp";
import * as PXBColors from "@brightlayer-ui/colors";
import { connect } from "react-redux";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import { InfoListItem } from "@brightlayer-ui/react-components/core/InfoListItem";

function ImportExportModal(props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalDescription, setModalDescription] = useState();
  const [errorTableContent, setErrorTableContent] = useState();
  const {
    classes,
    visible,
    title,
    onClose,
    id,
    className,
    paramMeta,
    loadMetaAction,
    fetchAction,
    writeSettingValue,
    dispatch,
    t
  } = props;

  let settingsParmMeta = {};

  const formatParamMetaList = (list) => {
    if (list) {
      list.forEach((param) => {
        settingsParmMeta[param.id] = param;
      });
    }
  };

  const parseJSONSafely = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  };

  const handleKeyEvent = (e) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  const handleClose = () => {
    setIsError(false);
  };

  const handleExport = () => {
    let exportList = [];
    let paramIdList = [];
    let channelsValueList = [];
    setIsDownloading(true);

    paramIdList = Object.values(paramMeta)
      .filter((param) => param.export && param.export == 1)
      .map((param) => {
        return param.id;
      });

    if (fetchAction && loadMetaAction) {
      let fetchChannelValueCounter = 0;

      let repeatChannelValueFetch = () => {
        if (fetchChannelValueCounter < paramIdList.length) {
          let url = "/rs/param/" + paramIdList[fetchChannelValueCounter] + "/value";
          let fetchPromise = dispatch(fetchAction("GET", url, null, 0));
          fetchPromise
            .then((data) => {
              channelsValueList[data.pid] = data.value;
              fetchChannelValueCounter += 1;
              repeatChannelValueFetch();
            })
            .catch((err) => {
              if (err.status === 422 && err.statusText === "SFU Session in Progress") {
                setModalDescription(
                  t("Firmware update session in progress, please retry after some time.", {
                    keySeparator: false /* ignore .*/
                  })
                );
                setErrorTableContent([]);
                setIsDownloading(false);
                setIsError(true);
              } else {
                fetchChannelValueCounter += 1;
                repeatChannelValueFetch();
              }
            });
        } else {
          let channelMetaDataPromise = dispatch(loadMetaAction(paramIdList, t));
          channelMetaDataPromise
            .then((response) => {
              if (response) {
                response.forEach((param) => {
                  if (channelsValueList[param.id] != undefined) {
                    exportList.push({
                      name: param.name,
                      pid: param.id,
                      value: channelsValueList[param.id]
                    });
                  }
                });
                if (exportList.length > 0) {
                  saveFile(exportList, "config.json", "application/json");
                } else {
                  setModalDescription(
                    t("Nothing to Export!", {
                      keySeparator: false /* ignore .*/
                    })
                  );
                  setErrorTableContent([]);
                  setIsError(true);
                }
              }
              setIsDownloading(false);
            })
            .catch((err) => {
              if (err.status === 422 && err.statusText === "SFU Session in Progress") {
                setModalDescription(
                  t("Firmware update session in progress, please retry after some time.", {
                    keySeparator: false /* ignore .*/
                  })
                );
                setErrorTableContent([]);
                setIsError(true);
              }
              setIsDownloading(false);
            });
        }
      };
      repeatChannelValueFetch();
    }
  };

  // Saves an object as a file
  // Takes option filename and object type, which default to "file.json" and "application/json" respectively.
  const saveFile = (obj, name, type) => {
    if (!name) {
      name = "file.json";
    }
    if (!type) {
      type = "application/json";
    }
    var blob = new window.Blob([JSON.stringify(obj, null, 4)], {
      name: name,
      type: type
    });
    //This hack creates a link to the blob, and then clicks on it.
    //  Only works in modern browsers (IE10+)
    var a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.parentNode.removeChild(a);
  };

  const openFile = (event) => {
    let file = event.target.files[0];
    event.target.value = ""; //Setting empty value to re-select the same file

    if (file && file.type != "application/json") {
      setModalDescription(
        t("Please select the correct file type and try again.", {
          keySeparator: false /* ignore .*/
        })
      );
      setErrorTableContent([]);
      setIsError(true);
      return;
    } else {
      setIsUploading(true);
      var reader = new FileReader();
      reader.onload = (e) => {
        let fileData = parseJSONSafely(e.target.result);
        updateDeviceSettings(fileData);
      };
      reader.readAsText(file);
    }
  };

  const updateDeviceSettings = (settings) => {
    let channelsFailedToImport = [];
    if (settings.length > 0) {
      let counter = -1;
      let validJsonFormat = settings.every((setting) => {
        return setting.pid != undefined && setting.name != undefined && setting.value != undefined;
      });

      let repeatWriteSettingValue = () => {
        counter += 1;
        if (settings.length <= counter) {
          setIsUploading(false);
          if (channelsFailedToImport.length > 0) {
            setModalDescription(
              t(
                "The following parameters were not imported. The likely cause is invalid or out of range data values or write permission.",
                {
                  keySeparator: false /* ignore .*/
                }
              )
            );

            let errorTableHeaders = ["Name", "Pid"];
            let errorList = [errorTableHeaders, channelsFailedToImport];

            setErrorTableContent(errorList);
            setIsError(true);
          }
        } else {
          if (settingsParmMeta[settings[counter].pid] && settingsParmMeta[settings[counter].pid].pImport) {
            let prom = dispatch(
              writeSettingValue(
                settings[counter].pid,
                settings[counter].value,
                settingsParmMeta[settings[counter].pid],
                t
              )
            );
            prom
              .then((resp) => {
                repeatWriteSettingValue();
              })
              .catch((err) => {
                channelsFailedToImport.push([settings[counter].name, settings[counter].pid]);
                repeatWriteSettingValue();
              });
          } else {
            channelsFailedToImport.push([settings[counter].name, settings[counter].pid]);
            repeatWriteSettingValue();
          }
        }
      };

      if (validJsonFormat) {
        let settingIdList = settings.map((setting) => setting.pid);
        let settingMetaDataPromise = dispatch(loadMetaAction(settingIdList, t));
        settingMetaDataPromise.then((response) => {
          formatParamMetaList(response);
          repeatWriteSettingValue();
        });
      } else {
        setModalDescription(
          t("Invalid file format.", {
            keySeparator: false /* ignore .*/
          })
        );
        setErrorTableContent([]);
        setIsUploading(false);
        setIsError(true);
      }
    } else {
      setModalDescription(
        t("Invalid file format or empty.", {
          keySeparator: false /* ignore .*/
        })
      );
      setErrorTableContent([]);
      setIsUploading(false);
      setIsError(true);
    }
  };

  return (
    <div id={id} className={className}>
      <Dialog open={visible} onKeyDown={(e) => handleKeyEvent(e)}>
        <DialogTitle style={{ padding: "16px 24px 16px 24px" }} disableTypography>
          <Typography
            variant="h6"
            style={{
              color: "#007BC1",
              fontWeight: "600"
            }}
          >
            {t(title)}
            <IconButton aria-label="close" onClick={onClose} className={classes.icon}>
              <CloseIcon style={{ color: PXBColors.gray[500] }} />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: "16px 24px 24px 24px" }}>
          <List style={{ padding: 0 }}>
            <InfoListItem
              id="importItem"
              title={t("Import JSON file to update configuration parameters into the Device.")}
              hidePadding
              wrapTitle
              style={{ padding: 0 }}
              rightComponent={
                <div>
                  <input
                    style={{ display: "none" }}
                    accept="application/json"
                    id="fileChooser"
                    multiple
                    type="file"
                    onChange={(e) => openFile(e)}
                  />
                  <label htmlFor="fileChooser">
                    <Button
                      id="importBtn"
                      variant="outlined"
                      color="primary"
                      component="span"
                      disabled={isUploading}
                      startIcon={<PublishIcon />}
                      title={t("Update parameters to device")}
                    >
                      {t("Import")}
                      {isUploading && <CircularProgress size={20} style={{ marginLeft: "10px" }} />}
                    </Button>
                  </label>
                </div>
              }
            />
            <InfoListItem
              id="exportItem"
              title={t("Export configuration parameters from the Device into a JSON file.")}
              hidePadding
              wrapTitle
              style={{ padding: "0 0 24px 0" }}
              rightComponent={
                <Button
                  id="exportBtn"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleExport()}
                  component="span"
                  disabled={isDownloading}
                  startIcon={<GetApp />}
                  title={t("Save parameters to file")}
                >
                  {t("Export")}
                  {isDownloading && <CircularProgress size={20} style={{ marginLeft: "10px" }} />}
                </Button>
              }
            />
          </List>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        visible={isError}
        title={t("Alert")}
        description={t(modalDescription)}
        tabularContent={errorTableContent}
        onOk={handleClose}
      />
    </div>
  );
}

const styles = () => ({
  icon: { float: "right", padding: "4px" },
  dialogPaper: {
    minWidth: "360px"
  }
});

const Dialog = withStyles(styles)((props) => {
  const { classes, ...other } = props;
  return <MuiDialog classes={{ paperScrollPaper: classes.dialogPaper }} {...other}></MuiDialog>;
});

function mapStateToProps({ paramMeta, t }) {
  return {
    paramMeta,
    t
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: (action) => {
      return dispatch(action);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ImportExportModal));
