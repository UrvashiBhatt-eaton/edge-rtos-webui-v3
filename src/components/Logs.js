import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { LogsLayout } from "@brightlayer-ui/layouts";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import * as PXBColors from "@brightlayer-ui/colors";

const DEBUG_LOGGING = new URLSearchParams(window.location.search).get("debug_logging") !== null;
class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logTypeList: [],
      logTableData: [],
      error: false,
      errMsg: "",
      loggingSupported: false,
      componentWait: true,
      isLogLoading: false
    };

    this.selectLogType = this.selectLogType.bind(this);
    this.handleClearLogs = this.handleClearLogs.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.closeErrModal = this.closeErrModal.bind(this);
  }

  componentDidMount() {
    let logInfoPromise = this.getLogList();
    logInfoPromise
      .then((data) => {
        this.setState({
          logTypeList: data,
          loggingSupported: true,
          componentWait: false
        });
      })
      .catch(() => {
        this.setState({ componentWait: false });
      });
  }

  getLogList() {
    return new Promise((resolve, reject) => {
      const { dispatch, fetchAction, loadMetaAction, t } = this.props;

      let logInfoPromise = dispatch(fetchAction("GET", "/rs/log", null, 5));
      logInfoPromise
        .then((data) => {
          let logNameList = [];
          let logPidList = data.logList.map((log) => log.pid.toString());

          let logMetaPromise = dispatch(loadMetaAction(logPidList, t));
          logMetaPromise.then((logChannels) => {
            logChannels.forEach((logChannel) => {
              let index = logPidList.indexOf(logChannel.id);
              logNameList[index] = logChannel.name;
            });
            resolve(logNameList);
          });
        })
        .catch(() => reject());
    });
  }

  convertDataToCSV(tableData) {
    let csv = tableData[0] ? tableData[0].join(",") : "";
    tableData[1].forEach((row) => {
      csv += "\r\n";
      // To handle cell data having array type and avoiding spliting them into separate columns in excel
      for (let r = 0; r < row.length; r++) {
        if (Array.isArray(row[r])) {
          csv += '"' + row[r] + '"';
        } else {
          csv += row[r];
        }
        if (r != row.length - 1) {
          csv += ",";
        }
      }
    });
    return csv;
  }

  handleExport(selectedItem) {
    var csv = this.convertDataToCSV(this.state.logTableData);
    var exportedFilename = selectedItem + ".csv" || "export.csv";
    // "\uFEFF" fixes it for Chinese
    var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  selectLogType(index, item) {
    const { dispatch, fetchAction, customProps, t } = this.props;
    let headerData = [],
      paramPidList = [],
      isCustomLog = false;
    this.setState({ logTableData: [], isLogLoading: true });

    if (
      customProps &&
      customProps.customLogsList &&
      customProps.customLogsList.includes(item.trim()) // Check if customLogs are present besides standard logs
    ) {
      isCustomLog = true;
    }

    this.setState({
      isCustomLog: isCustomLog
    });

    let logUrl = "/rs/log/" + index;
    const singleLogDataPromise = dispatch(fetchAction("GET", logUrl, null, 2));
    singleLogDataPromise
      .then((data) => {
        let currentLogEntryData = data.currentEntries;

        if (currentLogEntryData !== "0") {
          let paramsInLog = data.paramList;
          paramsInLog.forEach((param) => {
            headerData.push(param.name);
            paramPidList.push(param.pid.toString());
          });

          let logEntryDataPromise;
          if (!isCustomLog) {
            logEntryDataPromise = this.getLogEntryData(index);
          } else {
            logEntryDataPromise = dispatch(customProps.getCustomLogData(item));
            headerData = customProps.customLogsDesc;
          }

          logEntryDataPromise
            .then((logData) => {
              if (!isCustomLog && Object.keys(logData).length !== 0) {
                this.mapEnumOrBitfieldDescIntoTable(logData, paramPidList, headerData);
              } else {
                this.updateTableData(headerData, logData);
              }
            })
            .catch((error) => error);
        } else {
          this.setState({ isLogLoading: false });
        }
      })
      .catch((e) => {
        console.error(e);
        let errMsg,
          isError = false;
        if (e.status === 422 && e.statusText === "SFU Session in Progress") {
          errMsg = t("Firmware update session in progress, please retry after some time.");
          isError = true;
        } else if (e == "device_connection_lost" || e == "No entries found") {
          isError = false;
        } else {
          errMsg = t(e.statusText);
          isError = true;
        }
        this.setState({ error: isError, errMsg: errMsg });
      });
  }

  getLogEntryData(logTypeId) {
    return new Promise((resolve, reject) => {
      const { dispatch, fetchAction } = this.props;
      let logData = {},
        firstEid = 0,
        entries = [];

      let repeatLogEntryDataFetching = (eid) => {
        let logEntryDataPromise = dispatch(fetchAction("GET", "/rs/log/" + logTypeId + "/" + eid));

        logEntryDataPromise.then((data) => {
          let nextId = data.logTail.nextEID;
          let remEntries = data.logTail.remEntries;
          let entryObtained = data.logTail.Entry;
          if (Array.isArray(entryObtained)) {
            entries = entries.concat(entryObtained);
          } else {
            if (entryObtained !== undefined) {
              entries.push(entryObtained);
            } else {
              entries = entryObtained;
            }
          }
          if (remEntries === 0 && entries === undefined) {
            resolve(logData);
          } else if (remEntries !== 0 && entries === undefined) {
            console.error("No <Entry> tags found for this log, but <RemEntries> not 0");
            reject("No entries found");
          } else if (remEntries === 0 && entries !== undefined) {
            for (var j = 0; j < entries.length; j++) {
              logData["data_" + j] = entries[j]["e"];
            }
            DEBUG_LOGGING && console.log("Fetched all data!");
            logData = this.logsTimeConversion(logData);
            resolve(logData);
          } else {
            repeatLogEntryDataFetching(nextId);
          }
        });
      };

      repeatLogEntryDataFetching(firstEid);
    });
  }

  logsTimeConversion(data) {
    if (data !== undefined) {
      for (var key of Object.keys(data)) {
        let obtained_time = new Date(data[key][0] * 1000);
        data[key][0] = obtained_time.toLocaleString().replace(",", " ");
      }
    }
    return data;
  }

  updateTableData(hData, lData) {
    this.setState({ isLogLoading: false });
    if (Object.keys(lData).length !== 0) {
      this.setState({
        logTableData: [hData, lData]
      });
    }
  }

  mapEnumOrBitfieldDescIntoTable(logEntryData, pidData, tableHeaderData) {
    const { channelDataFromStore, dispatch, loadMetaAction, t } = this.props;

    if (pidData && pidData.length > 0) {
      let pidInStore = [];
      let pidNotInStore = [];
      let finalData;

      for (let p = 0; p < pidData.length; p++) {
        //Check if the PID data is available in store
        if (channelDataFromStore[pidData[p]]) {
          //Check if enum data is available for the available PID in store
          tableHeaderData[p] = channelDataFromStore[pidData[p]].name; //This takes the translated string from store
          if (channelDataFromStore[pidData[p]].multistate_maps) {
            pidInStore.push({
              pid: pidData[p],
              enumData: Object.entries(channelDataFromStore[pidData[p]].multistate_maps)
            });
          } else if (channelDataFromStore[pidData[p]].bitfields) {
            pidInStore.push({
              pid: pidData[p],
              bitfieldData: Object.entries(channelDataFromStore[pidData[p]].bitfields),
              dataType: channelDataFromStore[pidData[p]].value_type
            });
          } else {
            //Parameter is not an enum or bitfield
            pidInStore.push({ pid: pidData[p] });
          }
        } else {
          //Parameter meta is not in redux store
          pidInStore.push({ pid: pidData[p] }); //Used later to iterate and update if meta is available in redux store
          pidNotInStore.push(pidData[p]);
        }
      }

      let tmpData = this.deepCopyFunction(logEntryData);
      let tempLogEntryData = Object.values(tmpData);

      if (pidNotInStore.length > 0) {
        let metaPromise = dispatch(loadMetaAction(pidNotInStore, t));
        metaPromise.then((data) => {
          data.forEach((channel) => {
            pidInStore.forEach((entry, index) => {
              if (entry.pid == channel.id) {
                tableHeaderData[index] = channel.name; //This takes the translated string from store
                if (channel.multistate_maps) {
                  entry.enumData = Object.entries(channel.multistate_maps);
                } else if (channel.bitfields) {
                  entry.bitfieldData = Object.entries(channel.bitfields);
                  entry.dataType = channel.value_type;
                }
              }
            });
          });

          finalData = this.updateEnumOrBitfieldDescInLogData(tempLogEntryData, pidInStore);
          this.updateTableData(tableHeaderData, finalData);
        });
      } else {
        finalData = this.updateEnumOrBitfieldDescInLogData(tempLogEntryData, pidInStore);
        this.updateTableData(tableHeaderData, finalData);
      }
    }
  }

  updateEnumOrBitfieldDescInLogData(logEntryData, pidMetaData) {
    for (let x = 0; x < logEntryData.length; x++) {
      for (let y = 0; y < pidMetaData.length; y++) {
        if (pidMetaData[y].enumData) {
          pidMetaData[y].enumData.forEach(([key, value]) => {
            if (logEntryData[x][y] == key) {
              logEntryData[x][y] = value;
            }
          });
        } else if (pidMetaData[y].bitfieldData) {
          let hexVal = logEntryData[x][y],
            bitList = pidMetaData[y].bitfieldData,
            finalCellData = [],
            binaryOnePositions = [],
            binValue;

          if (pidMetaData[y].dataType.toUpperCase() === "BYTE") {
            binValue = this.pad(parseInt(hexVal).toString(2), 8);
          } else if (pidMetaData[y].dataType.toUpperCase() === "WORD") {
            binValue = this.pad(parseInt(hexVal).toString(2), 16);
          } else if (pidMetaData[y].dataType.toUpperCase() === "DWORD") {
            binValue = this.pad(parseInt(hexVal).toString(2), 32);
          }

          //Identify the bit position(s) having binary value 1
          if (binValue) {
            binValue
              .split("")
              .reverse()
              .map((item, index) => {
                if (item === "1") {
                  binaryOnePositions.push(index);
                }
              });
          }

          //Map the bitfield description(s) for the bit(s) having binary value 1 and display them in the MSB first order
          binaryOnePositions.reverse().forEach((p) => {
            for (let i = 0; i < bitList.length; i++) {
              if (bitList[i][0] == p) {
                finalCellData.push(bitList[i][1]);
                break;
              }
            }
          });

          logEntryData[x][y] = finalCellData;
        }
      }
    }
    return logEntryData;
  }

  pad(n, size, z) {
    z = z || "0";
    n = n + "";
    return n.length >= size ? n : new Array(size - n.length + 1).join(z) + n;
  }

  // Utility for deep copy for nested Objects or Arrays
  deepCopyFunction(inObject) {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopyFunction(value);
    }

    return outObject;
  }

  handleClearLogs(selectedIndex, selectedItem) {
    const { dispatch, fetchAction, customProps, t } = this.props;
    const { isCustomLog } = this.state;
    let clearLogPromise;

    if (!isCustomLog) {
      clearLogPromise = dispatch(fetchAction("DELETE", "/rs/log/" + selectedIndex + "/tail"));
    } else {
      clearLogPromise = dispatch(customProps.deleteCustomLogs(selectedItem, t));
    }
    clearLogPromise
      .then(() => {
        this.setState({
          logTableData: []
        });
      })
      .catch((e) => {
        let errMsg,
          isError = false;
        if (e.status === 422 && e.statusText === "SFU Session in Progress") {
          errMsg = t("Firmware update session in progress, please retry after some time.");
          isError = true;
        } else if (e == "device_connection_lost") {
          isError = false;
        } else {
          errMsg = t("Failed to clear the logs!");
          isError = true;
        }
        this.setState({
          error: isError,
          errMsg: errMsg
        });
      });
  }

  closeErrModal() {
    this.setState({ error: false });
  }

  render() {
    const { t, isLangLoading } = this.props,
      { componentWait, loggingSupported, error, errMsg, logTableData, logTypeList, isLogLoading } = this.state;
    return (
      <div>
        {!componentWait && !isLangLoading ? (
          <div>
            {!loggingSupported ? (
              <Typography variant="body1" style={{ padding: "15px", color: PXBColors.red[500] }}>
                {t("Logging Not Supported!")}
              </Typography>
            ) : (
              <>
                <LogsLayout
                  logTableData={logTableData}
                  handleExport={this.handleExport}
                  handleClearLogs={this.handleClearLogs}
                  selectLogType={this.selectLogType}
                  menuList={logTypeList}
                  loading={isLogLoading}
                />
                {error ? (
                  <ConfirmModal
                    visible={error}
                    title={t("Error")}
                    description={t(errMsg)}
                    onOk={this.closeErrModal}
                  ></ConfirmModal>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <span style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", marginBottom: "20px" }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <Skeleton animation="wave" variant="rect" height={35} width={165} style={{ marginLeft: "15px" }} />
              </span>
              <span style={{ display: "flex" }}>
                <Skeleton animation="wave" variant="rect" height={35} width={165} />
                <Skeleton
                  animation="wave"
                  variant="rect"
                  height={35}
                  width={165}
                  style={{ marginRight: "15px", marginLeft: "15px" }}
                />
              </span>
            </span>
            <Skeleton animation="wave" variant="rect" height={58} style={{ marginBottom: 4 }} />
            <Skeleton animation="wave" variant="rect" height={53} style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" variant="rect" height={50} style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" variant="rect" height={50} style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" variant="rect" height={50} style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" variant="rect" height={50} style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" variant="rect" height={50} style={{ marginBottom: 1 }} />
          </>
        )}
      </div>
    );
  }
}

Logs.propTypes = {
  loadMetaAction: PropTypes.func.isRequired,
  fetchAction: PropTypes.func.isRequired,
  customProps: PropTypes.object
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      return dispatch(action);
    }
  };
};

const mapStateToProps = ({ t, channelData, loadingLanguageFile }) => {
  return {
    channelDataFromStore: channelData,
    t: t,
    isLangLoading: loadingLanguageFile
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
