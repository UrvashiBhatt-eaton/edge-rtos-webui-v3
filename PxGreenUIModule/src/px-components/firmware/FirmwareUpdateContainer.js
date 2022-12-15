import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import EulaModal from "@brightlayer-ui/layouts/dist/px-components/modal/eulaModal";
import FwUpdateModal from "./FirmwareUpdateModal";
import * as PXBColors from "@brightlayer-ui/colors";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

//html-react-parser library is required for parsing the Eula (HTML tag) content from Codepack XML file
let parse = undefined;
if (process.env.REACT_APP_EULA_FROM_XML_FILE === "true") {
  parse = require("html-react-parser").default;
}

class FirmwareUpdateContainer extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {
      visible: false,
      btnFwUpdate: true,
      isEulaOpen: false,
      isFwUpdateOpen: false,
      openSnackbar: false,
      imageNum: 0,
      updateArray: [],
      isFileLoading: false,
      isFwUpdateComplete: false,
      isUpdateRunning: false,
      enableAbort: true,
      abortStatusCommitRequest: false,
      eulaFromCodepack: null
    };
    this.state = initialState;
    this.myWorker = "";
    this.combinedDataForUI = [];
    this.modalDescription = "";
    this.totalImgCount = 0;
    this.currentImgNum = 0;

    this.handleClose = this.handleClose.bind(this);
    this.processTableRows = this.processTableRows.bind(this);
    this.asArray = this.asArray.bind(this);
    this.getProcessorImageListFromDevice = this.getProcessorImageListFromDevice.bind(this);
    this.sendChunksWorker = this.sendChunksWorker.bind(this);
    this.filterFirmwareUpdate = this.filterFirmwareUpdate.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.handleEulaCancel = this.handleEulaCancel.bind(this);
    this.handleEulaAccept = this.handleEulaAccept.bind(this);
    this.handleFwUpdateCancel = this.handleFwUpdateCancel.bind(this);
    this.handleFwRunUpdates = this.handleFwRunUpdates.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.runUpdates = this.runUpdates.bind(this);
    this.updateImageNum = this.updateImageNum.bind(this);
    this.cancelFirmwareUpdate = this.cancelFirmwareUpdate.bind(this);
  }

  handleClose() {
    this.setState({ visible: false });
  }

  handleEulaCancel() {
    this.setState({ isEulaOpen: false });
  }

  handleEulaAccept() {
    //Show the list of image to start FW update
    this.setState({
      isEulaOpen: false,
      isFwUpdateOpen: true
    });
  }

  handleFwUpdateCancel() {
    this.setState({ isFwUpdateOpen: false });
  }

  cancelFirmwareUpdate() {
    const { dispatchFwUpdateRequest, setFwUpdateAbortFlag } = this.props;
    this.setState({
      enableAbort: true
    });
    if (this.state.abortStatusCommitRequest) {
      // To abort validate, commit and status request in pb.js
      dispatchFwUpdateRequest(setFwUpdateAbortFlag(true));
    } else {
      // To abort bin request in worker-chunks.js
      this.myWorker.postMessage("cancelFirmwareUpdate");
    }
  }

  handleFwRunUpdates(imgList) {
    if (imgList) {
      this.setState({ updateArray: imgList }, () => {
        this.runUpdates(this.state.updateArray);
      });
    } else {
      this.runUpdates(this.state.updateArray);
    }
  }

  updateImageNum(len) {
    this.setState({ imageNum: len });
  }

  handleSnackbarClose() {
    this.setState({ openSnackbar: false });
  }

  openFile(event) {
    const { dispatch, fetchAction, parseXML, getFwUpgradeMode, t } = this.props;
    let file = event.target.files[0];
    event.target.value = ""; //Setting empty value to re-select the same file

    this.setState({ isUpdateRunning: false });

    if (file && file.type != "text/xml") {
      this.modalDescription = t("Please select the correct file type and try again.", {
        keySeparator: false /* ignore .*/
      });
      this.setState({ visible: true });
      return;
    } else {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ isFileLoading: true });
        let xmlCodepack = e.target.result;
        const parser = new DOMParser();
        var uploadedFileData = parseXML(e.target.result);

        if (uploadedFileData.FWPackage) {
          let promiseFirmwareInfo = dispatch(fetchAction("GET", "/rs/fw"));
          promiseFirmwareInfo
            .then((rawDeviceData) => {
              var fileProductData = [];
              var matchedProductCodepack;
              var productOrder;

              if (Array.isArray(uploadedFileData.FWPackage.Product)) {
                fileProductData = uploadedFileData.FWPackage.Product;
              } else {
                fileProductData.push(uploadedFileData.FWPackage.Product);
              }

              for (let x = 0; x < fileProductData.length; x++) {
                if (fileProductData[x].ProductGuid === rawDeviceData.Product.ProductGuid) {
                  matchedProductCodepack = fileProductData[x];
                  productOrder = x;
                  break;
                }
              }

              if (matchedProductCodepack) {
                //Check if EULA is present in the Codepack file either globally or for a product
                if (matchedProductCodepack.Eula || uploadedFileData.FWPackage.Eula) {
                  const dom = parser.parseFromString(xmlCodepack, "application/xml");
                  let eulaContent = dom.getElementsByTagName("Eula")[productOrder].innerHTML;
                  this.setState({
                    eulaFromCodepack: eulaContent
                  });
                } else {
                  this.setState({
                    eulaFromCodepack: null
                  });
                }

                //matchedProductCodepack needs to be send to another firmware update component.
                this.firmwareImageData = matchedProductCodepack.Processor.Image;

                var devicePromise = this.getProcessorImageListFromDevice(rawDeviceData);

                var fwUpgradeModePromise = dispatch(getFwUpgradeMode());

                Promise.all([devicePromise, fwUpgradeModePromise])
                  .then((promiseData) => {
                    var fwUpgradeModeValue = promiseData[1];
                    var data = [promiseData[0], this.asArray(matchedProductCodepack)];

                    this.combinedDataForUI = this.processTableRows(data);

                    this.combinedDataForUI.forEach((image) => {
                      image.statusMsg = this.getStatusMessage(image, fwUpgradeModeValue);
                      image.isfwUpdateCheckBoxDisabled = this.getFwUpdateCheckBoxStatus(image, fwUpgradeModeValue);
                    });

                    this.filterFirmwareUpdate(this.combinedDataForUI, fwUpgradeModeValue);
                    this.setState({
                      btnFwUpdate: false,
                      isEulaOpen: true,
                      isFileLoading: false,
                      isFwUpdateComplete: false
                    });
                  })
                  .catch((err) => {
                    if (err.status == 422 && err.statusText == "SFU Session in Progress") {
                      this.modalDescription = t("Firmware update session in progress, please retry after some time.", {
                        keySeparator: false /* ignore .*/
                      });
                    } else {
                      this.modalDescription = t("Failed to retrieve device info. Please try again.", {
                        keySeparator: false /* ignore .*/
                      });
                    }

                    this.setState({
                      isFileLoading: false,
                      visible: true
                    });
                  });
              } else {
                this.modalDescription = t("Invalid Product");
                this.setState({
                  isFileLoading: false,
                  visible: true
                });
              }
            })
            .catch((err) => {
              // handle 422: Please try after some time.
              // handle other error: Failed to validate Firmware Information, please retry.
              console.warn(err);
              if (err.status == 422 && err.statusText == "SFU Session in Progress") {
                this.modalDescription = t("Firmware update session in progress, please retry after some time.", {
                  keySeparator: false /* ignore .*/
                });
              } else {
                this.modalDescription = t("Failed to validate Firmware Information, please retry.", {
                  keySeparator: false /* ignore .*/
                });
              }

              this.setState({
                visible: true,
                isFileLoading: false
              });
            });
        } else {
          //try a snack bar here
          this.modalDescription = t("Invalid File");
          this.setState({
            openSnackbar: true,
            isFileLoading: false
          });
        }
      };
      reader.readAsText(file);
    }
  }

  asArray(obj) {
    return Array.isArray(obj) ? obj : [obj];
  }

  versionCompare(left, right) {
    if (typeof left + typeof right != "stringstring") return false;

    var a = left.split("."),
      b = right.split("."),
      i = 0,
      len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || parseInt(a[i]) > parseInt(b[i])) {
        return 1;
      } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || parseInt(a[i]) < parseInt(b[i])) {
        return -1;
      }
    }
    return 0;
  }

  getStatusMessage(image, fwUpgradeMode) {
    const { t } = this.props;
    let message = "";
    if (fwUpgradeMode == 2) {
      message = t("Upgrade Not Allowed.", {
        keySeparator: false /* ignore .*/
      });
    } else if (image.filever) {
      var v = this.versionCompare(image.filever, image.imageVer);
      if (v > 0) {
        if (image.isDisabled) {
          message = t("Upgrade Disabled.", {
            keySeparator: false /* ignore .*/
          });
        } else {
          message = t("Update Recommended.", {
            keySeparator: false /* ignore .*/
          });
        }
      } else if (v < 0) {
        if (image.isDisabled) {
          message = t("Rollback Disabled.", {
            keySeparator: false /* ignore .*/
          });
        } else {
          message = t("Rollback Not Recommended.", {
            keySeparator: false /* ignore .*/
          });
        }
      } else if (v === 0) {
        message = t("Version Is Same.", { keySeparator: false /* ignore .*/ });
      }
    } else {
      message = t("Not in file.", { keySeparator: false /* ignore .*/ });
    }
    return message;
  }

  getFwUpdateCheckBoxStatus(image, fwUpgradeMode) {
    var isDisabled = true;
    var v = this.versionCompare(image.filever, image.imageVer);

    // 0, Upgrade to any version allowed
    // 1, Upgrade to same or higher version allowed
    // 2, Upgrade not allowed
    if (!(image.filever === undefined || image.filever === "") && image.bindata.Data != undefined) {
      if (fwUpgradeMode == 0) {
        isDisabled = false;
      } else if (fwUpgradeMode == 1 && v < 0) {
        isDisabled = true;
      } else if (fwUpgradeMode == 1 && v >= 0) {
        isDisabled = false;
      }
    }
    return isDisabled;
  }

  filterFirmwareUpdate(firmwareImageData, fwUpgradeMode) {
    this.setState({ updateArray: [] });
    var tmpArry = [];
    for (let i = 0; i < firmwareImageData.length; i++) {
      if (this.versionCompare(firmwareImageData[i].filever, firmwareImageData[i].imageVer) == 1 && fwUpgradeMode != 2) {
        tmpArry.push(firmwareImageData[i]);
        this.combinedDataForUI[i].isUpdateRequired = true;
      }
    }

    // Count of Images to be updated and total images present in device.
    var imgCount = tmpArry.length;
    this.setState({
      updateArray: tmpArry,
      imageNum: imgCount
    });
    this.totalImgCount = firmwareImageData.length;
  }

  runUpdates(list) {
    const { t, dispatchFwUpdateRequest, setFwUpdateProgressFlag } = this.props;
    this.currentImgNum = 0;
    var updateArray = list;
    if (updateArray.length > 0) {
      this.setState({ isUpdateRunning: true });
      this.processChunkValidation(updateArray).then((response) => {
        let validImages = [];
        let inValidImages = [];

        response.forEach((item, index) => {
          if (item.isCRCValid) {
            validImages[index] = item.proccesedImage;
          } else {
            inValidImages.push(item.proccesedImage);
          }
        });

        // Display the error message for the invalid images
        if (inValidImages.length > 0) {
          for (let x = 0; x < updateArray.length; x++) {
            for (let y = 0; y < inValidImages.length; y++) {
              if (updateArray[x].imageGuid == inValidImages[y].imageGuid) {
                this.setState((prevState) => {
                  const newItems = [...prevState.updateArray];
                  newItems[x].isImageUploadError = true;
                  newItems[x].progressMsg = undefined;
                  newItems[x].isImageUpdateErrorMsg = t("Codepack integrity check has failed.", {
                    keySeparator: false /* ignore .*/
                  });
                  return { updateArray: newItems };
                });
              }
            }
          }
        }

        //Continue FUS for valid images
        if (validImages.length > 0) {
          this.imageUpload(validImages, 0)
            .then(() => {
              dispatchFwUpdateRequest(setFwUpdateProgressFlag(false));
              this.setState({
                enableAbort: false,
                abortStatusCommitRequest: false,
                isFwUpdateComplete: true
              });
            })
            .catch((error) => {
              dispatchFwUpdateRequest(setFwUpdateProgressFlag(false));
              this.setState({
                enableAbort: false,
                abortStatusCommitRequest: false,
                isFwUpdateComplete: true
              });
            });
        } else {
          this.setState({ isFwUpdateComplete: true, enableAbort: false });
        }
      });
    }
  }

  imageUpload(updateArray, counter) {
    const { dispatch, t, fetchAction, dispatchFwUpdateRequest, setFwUpdateAbortFlag } = this.props;
    return new Promise((resolve, reject) => {
      if (updateArray.length > counter) {
        if (updateArray[counter]) {
          this.currentImgNum += 1;
          this.startSession(updateArray, counter)
            .then((res) => {
              this.sessionId = res.SessionResp.SessionID;
              let binaryData = updateArray[counter].bindata.Data;
              let url = updateArray[counter].binXLink; //rs/fw/0/0/bin

              this.sendChunksWorker(updateArray, binaryData, this.sessionId, counter)
                .then(() => {
                  //Validating the image
                  this.validateBin(updateArray, counter)
                    .then((validationResponse) => {
                      return new Promise((resolveBin, rejectBin) => {
                        // here we will get response of validate - as valid or Invalid.
                        if (validationResponse.Validate.Integrity == "Valid") {
                          // Need to call commit here
                          this.setState((prevState) => {
                            const newItems = [...prevState.updateArray];
                            newItems[counter].progressMsg = t("Copying image to the destination");
                            return { updateArray: newItems };
                          });
                          let commitApiData = "<Commit><SessionID>" + this.sessionId + "</SessionID></Commit>";
                          let commitUrl = url.replace("bin", "commit");

                          let commitApiResponse = dispatch(fetchAction("POST", commitUrl, commitApiData, 4));
                          commitApiResponse
                            .then((commitResponse) => {
                              let newWaitTime = commitResponse.CommitResp.Wait;
                              let statusUrl = url.replace("bin", "status");
                              const retryStatusRequestCount = 13;
                              let repeatStatusRequestCounter = 0;

                              let repeatStatusApi = (time) => {
                                setTimeout(() => {
                                  let statusPromise = dispatch(fetchAction("GET", statusUrl, null, 4));
                                  statusPromise
                                    .then((statusResponse) => {
                                      if (statusResponse.Status.State == "Busy") {
                                        if (repeatStatusRequestCounter == retryStatusRequestCount) {
                                          this.setState((prevState) => {
                                            const newItems = [...prevState.updateArray];
                                            newItems[counter].isImageUploadError = true;
                                            newItems[counter].progressMsg = undefined;
                                            newItems[counter].isImageUpdateErrorMsg = t("Image Copying failed.", {
                                              keySeparator: false /* ignore .*/
                                            });
                                            return { updateArray: newItems };
                                          });
                                          this.deleteSession(this.sessionId).then((res) => {
                                            resolveBin(res);
                                          });
                                        } else {
                                          repeatStatusRequestCounter += 1;
                                          repeatStatusApi(statusResponse.Status.Wait);
                                        }
                                      } else if (statusResponse.Status.State == "Idle") {
                                        this.setState((prevState) => {
                                          const newItems = [...prevState.updateArray];
                                          newItems[counter].progressMsg = undefined;
                                          newItems[counter].isImageUploadSuccess = true;
                                          newItems[counter].isImageUpdateErrorMsg = t("Image updated successfully.", {
                                            keySeparator: false /* ignore .*/
                                          }); // to be changed
                                          return { updateArray: newItems };
                                        });
                                        this.setState({
                                          enableAbort: true
                                        });
                                        this.deleteSession(this.sessionId).then((res) => {
                                          resolveBin(res);
                                        });
                                      } else {
                                        this.setState((prevState) => {
                                          const newItems = [...prevState.updateArray];
                                          newItems[counter].isImageUploadError = true;
                                          newItems[counter].progressMsg = undefined;
                                          newItems[counter].isImageUpdateErrorMsg = t("Image update failed.", {
                                            keySeparator: false /* ignore .*/
                                          });
                                          return { updateArray: newItems };
                                        });
                                        this.deleteSession(this.sessionId).then((res) => {
                                          resolveBin(res);
                                        });
                                      }
                                    })
                                    .catch((err) => {
                                      //Status api failed.
                                      rejectBin(err);
                                    });
                                }, time);
                              };

                              repeatStatusApi(newWaitTime);
                            })
                            .catch((err) => {
                              //Commit api failed.
                              rejectBin(err);
                            });
                        } else {
                          this.setState((prevState) => {
                            const newItems = [...prevState.updateArray];
                            newItems[counter].progressMsg = undefined;
                            newItems[counter].isImageUploadError = true;
                            newItems[counter].isImageUpdateErrorMsg = t("Final integrity check is Invalid.", {
                              keySeparator: false /* ignore .*/
                            }); //Integrity check is invalid
                            return { updateArray: newItems };
                          });
                          this.deleteSession(this.sessionId).then((res) => {
                            resolveBin(res);
                          });
                        }
                      });
                    })
                    .then((responseDeleteSession) => {
                      var waitTime = parseInt(responseDeleteSession.Session.Wait);
                      //Fixing for DELETE SESSION call. When it is "0" sometime device is not able to delete quickly.
                      //When waitTime is zero, we are waiting for 2 sec before we start new session (next request)
                      if (waitTime === 0) {
                        waitTime = 2000;
                      }
                      counter += 1;
                      setTimeout(() => {
                        this.imageUpload(updateArray, counter)
                          .then((data) => {
                            resolve("Completed" + counter);
                          })
                          .catch((err) => {
                            reject("Error in uploading firmware.");
                          });
                      }, waitTime);
                    })
                    .catch((err) => {
                      let errMsg;
                      if (err == "device_connection_lost") {
                        errMsg = t("Device communication failure, please retry.", {
                          keySeparator: false /* ignore .*/
                        });
                      } else if (err == "image_integrity_fail") {
                        errMsg = t("Invalid image");
                      } else if (err == "session_aborted") {
                        errMsg = t("Firmware upgrade is aborted.", {
                          keySeparator: false /* ignore .*/
                        });
                      } else {
                        errMsg = t(err.statusText);
                      }
                      dispatchFwUpdateRequest(setFwUpdateAbortFlag(false));
                      this.setState((prevState) => {
                        const newItems = [...prevState.updateArray];
                        newItems[counter].progressMsg = undefined;
                        newItems[counter].isImageUploadError = true;
                        newItems[counter].isImageUpdateErrorMsg = errMsg;
                        return { updateArray: newItems };
                      });
                      for (let b = 0; b < updateArray.length; b++) {
                        if (!updateArray[b].isImageUploadSuccess && !updateArray[b].isImageUploadError) {
                          this.setState((prevState) => {
                            const newItems = [...prevState.updateArray];
                            newItems[b].isImageUploadError = true;
                            newItems[counter].progressMsg = undefined;
                            newItems[b].isImageUpdateErrorMsg = t("Firmware upgrade is aborted.", {
                              keySeparator: false /* ignore .*/
                            });
                            return { updateArray: newItems };
                          });
                        }
                      }
                      this.deleteSession(this.sessionId);
                      reject("Error in validating.");
                    });
                })
                .catch((err) => {
                  this.deleteSession(this.sessionId);
                  reject("Error in uploading firmware.");
                });
            })
            .catch((fwSessionFailureResponse) => {
              let fwSessionFailureResponseMsg = "";
              if (fwSessionFailureResponse.status == 430) {
                fwSessionFailureResponseMsg = t(
                  "Firmware update session already in progress, please retry after some time.",
                  { keySeparator: false /* ignore .*/ }
                );
              } else if (fwSessionFailureResponse == "device_connection_lost") {
                fwSessionFailureResponseMsg = t("Device communication failure, please retry.", {
                  keySeparator: false /* ignore .*/
                });
              } else if (fwSessionFailureResponse == "start_sesssion_failed") {
                fwSessionFailureResponseMsg = t("Processor is busy to do firmware upgrade.", {
                  keySeparator: false /* ignore .*/
                });
              } else {
                fwSessionFailureResponseMsg = t(fwSessionFailureResponse.statusText);
              }
              for (let m = 0; m < updateArray.length; m++) {
                this.setState((prevState) => {
                  const newItems = [...prevState.updateArray];
                  newItems[m].isImageUploadError = true;
                  newItems[m].isImageUpdateErrorMsg = fwSessionFailureResponseMsg;
                  newItems[m].progressMsg = undefined;
                  return { updateArray: newItems };
                });
              }
              reject("FW session failed to start.");
            });
        } else {
          counter += 1;
          this.imageUpload(updateArray, counter)
            .then(() => {
              resolve("Completed" + counter);
            })
            .catch(() => {
              reject("Error in uploading firmware.");
            });
        }
      } else {
        //fw update completed
        resolve();
      }
    });
  }

  processChunkValidation(updateArray) {
    const { t } = this.props;
    this.setState({
      enableAbort: true
    });
    return new Promise((resolve, reject) => {
      var chunkCounter = 0;
      var crcResult = [];

      updateArray.forEach((proccesedImage, index) => {
        let imageData = proccesedImage.bindata.Data;
        let encodingType = proccesedImage.bindata.encoding_type;
        let totalChunkCount = imageData.length;
        var repeat_loop = (imageData, totalChunkCount, chunkCounter) => {
          this.setState((prevState) => {
            const newItems = [...prevState.updateArray];
            newItems[index].progressMsg = t("Validating codepack...", {
              keySeparator: false /* ignore .*/
            });
            return { updateArray: newItems };
          });
          if (chunkCounter >= totalChunkCount) {
            this.setState((prevState) => {
              const newItems = [...prevState.updateArray];
              newItems[index].progressMsg = undefined;
              return { updateArray: newItems };
            });
            crcResult.push({ isCRCValid: true, proccesedImage });
          } else {
            var stringRequired = imageData[chunkCounter].value;
            var chunckCRC = imageData[chunkCounter].packet_crc;
            var buffer;
            if (encodingType == "Base64") {
              var newString = this.asciiToHex(stringRequired);
              buffer = this.hexToBytes(newString);
            } else {
              buffer = this.hexToBytes(stringRequired);
            }
            var crcValue = this.crcValidator(buffer, buffer.length);
            if (crcValue != chunckCRC) {
              crcResult.push({ isCRCValid: false, proccesedImage });
              return;
            } else {
              chunkCounter += 1;
              repeat_loop(imageData, totalChunkCount, chunkCounter);
            }
          }
        };
        repeat_loop(imageData, totalChunkCount, chunkCounter);
      });
      resolve(crcResult);
    });
  }

  validateBin(updateArray, counter) {
    const { dispatch, t, fetchAction } = this.props;
    this.setState({
      abortStatusCommitRequest: true
    });
    return new Promise((resolve, reject) => {
      let url = updateArray[counter].binXLink; //rs/fw/0/0/bin
      url = url.replace("bin", "validate");
      const retryValidateRequestCount = 13;
      let repeatValidateRequestCounter = 0;
      this.setState((prevState) => {
        const newItems = [...prevState.updateArray];
        newItems[counter].progressMsg = t("Validating...", {
          keySeparator: false /* ignore .*/
        });
        return { updateArray: newItems };
      });
      let repeatValidateBinRequest = () => {
        let validateBinPromise = dispatch(fetchAction("GET", url, null, 4));
        validateBinPromise
          .then((validateBinData) => {
            if (validateBinData.Validate.Integrity && validateBinData.Validate.Integrity == "Checking") {
              if (repeatValidateRequestCounter == retryValidateRequestCount) {
                reject("image_integrity_fail");
              } else {
                repeatValidateRequestCounter += 1;
                let waitTime = parseInt(validateBinData.Validate.Wait);
                setTimeout(() => {
                  repeatValidateBinRequest();
                }, waitTime);
              }
            } else {
              resolve(validateBinData); // returns integrity value "Valid" or "Invalid"
            }
          })
          .catch((err) => {
            reject(err);
          });
      };
      repeatValidateBinRequest();
    });
  }

  asciiToHex(str) {
    var stringHexFormat = "";
    for (let n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      stringHexFormat += hex;
    }
    return stringHexFormat;
  }

  hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  crcValidator(data, datalength) {
    var temp;
    var temp_crc = 0xffff;
    var temp_crc_ptr = [];
    var dataIndex = 0;

    var str = temp_crc.toString(16);
    var byte0 = str.charAt(str.length - 2) + str.charAt(str.length - 1);
    var byte1 = str.charAt(0) + str.charAt(1);
    temp_crc_ptr[0] = parseInt(byte0, 16);
    temp_crc_ptr[1] = parseInt(byte1, 16);

    while (datalength-- > 0) {
      temp = data[dataIndex] ^ temp_crc_ptr[0];
      dataIndex++;
      var val1 = this.leftShiftOperation(temp, 4);
      temp ^= parseInt(val1, 16);
      var val2 = this.leftShiftOperation(temp, 3);
      temp_crc_ptr[0] = temp_crc_ptr[1] ^ parseInt(val2, 16) ^ (temp >> 4);
      temp_crc_ptr[1] = temp ^ (temp >> 5);
    }
    byte0 = temp_crc_ptr[0].toString(16).toUpperCase();
    byte1 = temp_crc_ptr[1].toString(16).toUpperCase();
    if (byte0.length == 1) {
      byte0 = "0" + byte0;
    }
    var str_crc = byte1 + byte0;
    var dec_crc = parseInt(str_crc, 16);

    var bin = (~dec_crc >>> 0).toString(2);
    var dec = parseInt(bin, 2);
    var hex = dec.toString(16).toUpperCase();
    return "0x" + hex.substring(hex.length, hex.length - 4);
  }

  leftShiftOperation(temp, val) {
    var dec = temp << val;
    var hex = dec.toString(16).toUpperCase();
    return hex.charAt(hex.length - 2) + hex.charAt(hex.length - 1);
  }

  startSession(updateArray, counter) {
    const {
      dispatch,
      t,
      fetchAction,
      dispatchFwUpdateRequest,
      setFwUpdateProgressFlag,
      worker_chunks_script,
      fusSessionTimeoutSec
    } = this.props;
    //Worker instance creation
    this.myWorker = new Worker(worker_chunks_script);
    this.setState({
      abortStatusCommitRequest: false
    });
    var sec = fusSessionTimeoutSec != null ? fusSessionTimeoutSec : 60;
    var encoding_type = updateArray[counter].bindata.encoding_type;
    encoding_type = encoding_type.match(/base64/i) ? 1 : 0;
    var data =
      "<SessionDef><TimeoutSec>" + sec + "</TimeoutSec><EncodingType>" + encoding_type + "</EncodingType></SessionDef>";
    var url = "/rs/fw/session";
    dispatchFwUpdateRequest(setFwUpdateProgressFlag(true));
    return new Promise((resolve, reject) => {
      const retryStartSessionCount = 14;
      let repeatStartSessionCounter = 0;
      this.setState((prevState) => {
        const newItems = [...prevState.updateArray];
        newItems[counter].progressMsg = t("Starting Session...", {
          keySeparator: false /* ignore .*/
        });
        return { updateArray: newItems };
      });
      let repeatStartSessionApi = () => {
        if (repeatStartSessionCounter < retryStartSessionCount) {
          let startSessionPromise = dispatch(fetchAction("POST", url, data, 4));
          startSessionPromise
            .then((startSessionResponse) => {
              let waitTime = parseInt(startSessionResponse.SessionResp.Wait);
              if (waitTime == 0) {
                resolve(startSessionResponse);
              } else {
                repeatStartSessionCounter += 1;
                setTimeout(() => {
                  repeatStartSessionApi();
                }, waitTime);
              }
            })
            .catch((err) => reject(err));
        } else {
          reject("start_sesssion_failed");
        }
      };
      repeatStartSessionApi();
    });
  }

  deleteSession(id) {
    const { dispatch, fetchAction } = this.props;
    var sessionString = '<Session SessionID="' + id + '"/>';
    var sessionUrl = "/rs/fw/session";
    return dispatch(fetchAction("DELETE", sessionUrl, sessionString, 4));
  }

  getProcessorImageListFromDevice(deviceData) {
    const { dispatch, fetchAction } = this.props;
    var list = [];
    var procs = this.asArray(deviceData.Product.ProcessorList.Processor);
    var procsCounter = 0;
    return new Promise((resolve, reject) => {
      var repeat_procs = () => {
        if (procsCounter >= procs.length) {
          resolve(list);
        } else {
          var procUrl = procs[procsCounter]["xlink:href"];
          // Get each processor from device
          let procPromise = dispatch(fetchAction("GET", procUrl));
          procPromise
            .then((processorObj) => {
              var processor = processorObj.Processor;
              var images = this.asArray(processor.ImageList.Image);
              var imageCounter = 0;

              var repeat_images = () => {
                if (imageCounter >= images.length) {
                  procsCounter += 1;
                  repeat_procs();
                } else {
                  var imageUrl = images[imageCounter]["xlink:href"];
                  // Get each image from processor
                  let imagePromise = dispatch(fetchAction("GET", imageUrl));
                  imagePromise
                    .then((imageXhr) => {
                      var image = imageXhr.Image;
                      var imageObj = {
                        processorName: processor.Name,
                        processorGuid: processor.Guid,
                        imageName: image.Name,
                        imageGuid: image.Guid,
                        deviceHardwareVer: processor.HardwareVer,
                        imageVer: image.Ver,
                        binXLink: image.Bin["xlink:href"],
                        updateHistory: image.UpdateHistory,
                        compatibility: image.Compatibility
                      };
                      list.push(imageObj);
                      imageCounter += 1;
                      repeat_images();
                    })
                    .catch(() => {
                      reject();
                    });
                }
              };
              repeat_images();
            })
            .catch(() => {
              reject();
            });
        }
      };
      repeat_procs();
    });
  }

  processTableRows(data) {
    var deviceData = data[0],
      codePackProducts = data[1];

    for (let i = 0; i < deviceData.length; i++) {
      var currentDeviceData = deviceData[i];
      for (let j = 0; j < codePackProducts.length; j++) {
        var currentCodePackProduct = codePackProducts[j];
        if (Array.isArray(currentCodePackProduct.Processor)) {
          for (let l = 0; l < currentCodePackProduct.Processor.length; l++) {
            if (currentDeviceData["processorGuid"] === currentCodePackProduct.Processor[l].Guid) {
              if (currentCodePackProduct.Processor[l].Image.length != undefined) {
                currentCodePackProduct.Processor[l].Image.forEach(function (img, index) {
                  var imageId = img["Guid"];
                  if (currentDeviceData["imageGuid"] === imageId) {
                    currentDeviceData["filever"] = img["Ver"];
                    currentDeviceData["bindata"] = img["BinData"];
                    currentDeviceData.order = index;
                    currentDeviceData.isUpdateRequired = false;
                    currentDeviceData.progress = 0;
                    currentDeviceData.isImageUploadSuccess = false;
                    currentDeviceData.isImageUploadError = false;
                    currentDeviceData.isImageUpdateErrorMsg = "";
                  }
                });
              } else {
                if (currentDeviceData["imageGuid"] === currentCodePackProduct.Processor[l].Image["Guid"]) {
                  currentDeviceData["filever"] = currentCodePackProduct.Processor[l].Image["Ver"];
                  currentDeviceData["bindata"] = currentCodePackProduct.Processor[l].Image["BinData"];
                  currentDeviceData.order = 0;
                  currentDeviceData.isUpdateRequired = false;
                  currentDeviceData.progress = 0;
                  currentDeviceData.isImageUploadSuccess = false;
                  currentDeviceData.isImageUploadError = false;
                  currentDeviceData.isImageUpdateErrorMsg = "";
                }
              }
            }
          }
        } else {
          if (currentDeviceData["processorGuid"] === currentCodePackProduct.Processor.Guid) {
            if (currentCodePackProduct.Processor.Image.length != undefined) {
              currentCodePackProduct.Processor.Image.forEach(function (img, index) {
                var imageId = img["Guid"];
                if (currentDeviceData["imageGuid"] === imageId) {
                  currentDeviceData["filever"] = img["Ver"];
                  currentDeviceData["bindata"] = img["BinData"];
                  currentDeviceData.order = index;
                  currentDeviceData.isUpdateRequired = false;
                  currentDeviceData.progress = 0;
                  currentDeviceData.isImageUploadSuccess = false;
                  currentDeviceData.isImageUploadError = false;
                  currentDeviceData.isImageUpdateErrorMsg = "";
                }
              });
            } else {
              if (currentDeviceData["imageGuid"] === currentCodePackProduct.Processor.Image["Guid"]) {
                currentDeviceData["filever"] = currentCodePackProduct.Processor.Image["Ver"];
                currentDeviceData["bindata"] = currentCodePackProduct.Processor.Image["BinData"];
                currentDeviceData.order = 0;
                currentDeviceData.isUpdateRequired = false;
                currentDeviceData.progress = 0;
                currentDeviceData.isImageUploadSuccess = false;
                currentDeviceData.isImageUploadError = false;
                currentDeviceData.isImageUpdateErrorMsg = "";
              }
            }
          }
        }
      }
    }
    deviceData.sort(function (a, b) {
      if (a.order === undefined) {
        a.order = 99;
      }
      if (b.order === undefined) {
        b.order = 99;
      }
      return a.order - b.order;
    });
    return deviceData;
  }

  sendChunksWorker(firmwareImageData, binaryData, sid, counter) {
    const { dispatch, dataURL, fetchAuthHeadersAction, t } = this.props;

    return new Promise((resolve, reject) => {
      // Header for Authentication
      var url = firmwareImageData[counter].binXLink;
      var authHeader = dispatch(fetchAuthHeadersAction("PUT", url));

      this.myWorker.onmessage = (m) => {
        var progressVal = m.data.percentage;

        if (m.data.isWorkerError) {
          let errMsg = "";
          if (m.data.workerErrMsg == "device_connection_lost") {
            errMsg = t("Device communication failure, please retry.", {
              keySeparator: false /* ignore .*/
            });
          } else if (m.data.workerErrMsg == "session_aborted") {
            errMsg = t("Firmware upgrade is aborted.", {
              keySeparator: false /* ignore .*/
            });
            this.setState({ enableAbort: false });
          } else {
            errMsg = m.data.workerErrMsg;
          }

          this.setState((prevState) => {
            const newItems = [...prevState.updateArray];
            newItems[counter].isImageUploadError = true;
            newItems[counter].isImageUpdateErrorMsg = t(errMsg);
            return { updateArray: newItems };
          });

          for (let n = 0; n < firmwareImageData.length; n++) {
            if (!firmwareImageData[n].isImageUploadSuccess && !firmwareImageData[n].isImageUploadError) {
              this.setState((prevState) => {
                const newItems = [...prevState.updateArray];
                newItems[n].isImageUploadError = true;
                newItems[n].isImageUpdateErrorMsg = t("Firmware upgrade is aborted.", {
                  keySeparator: false /* ignore .*/
                });
                return { updateArray: newItems };
              });
            }
          }
          this.myWorker.terminate();
          reject(m.data.workerErrMsg);
        } else {
          this.setState({ enableAbort: false });
          this.setState((prevState) => {
            const newItems = [...prevState.updateArray];
            newItems[counter].progress = progressVal;
            newItems[counter].progressMsg =
              progressVal == 0
                ? t("Session Started...", {
                    keySeparator: false /* ignore .*/
                  })
                : progressVal + "%";
            return { updateArray: newItems };
          });
        }

        if (m.data.isComplete && !m.data.isWorkerError) {
          this.myWorker.terminate();
          resolve();
        }
      };

      //All info to be provided to worker
      this.myWorker.postMessage({
        authHeader: authHeader,
        firmwareImageData: firmwareImageData[counter],
        binaryData: binaryData,
        sid: sid,
        counter: 0,
        dataURL
      });
    });
  }

  render() {
    const { title, classes, roleLevel, children, isLoading, t } = this.props;

    let {
      visible,
      isEulaOpen,
      isFwUpdateOpen,
      openSnackbar,
      imageNum,
      updateArray,
      isFileLoading,
      isFwUpdateComplete,
      enableAbort,
      isUpdateRunning,
      eulaFromCodepack
    } = this.state;

    return (
      <ListItem title={t(title)}>
        <ListItemText
          primary={
            isLoading ? (
              <Skeleton variant="text" width={300} style={{ backgroundColor: PXBColors.gray[50] }} />
            ) : (
              t(title)
            )
          }
        />
        {isLoading ? (
          ""
        ) : (
          <div className={classes.main}>
            <div>
              <input
                accept="text/xml"
                className={classes.input}
                id="fileChooser"
                multiple
                type="file"
                onChange={(e) => this.openFile(e)}
                disabled={roleLevel == 99 ? isFileLoading : true}
              />
              <label htmlFor="fileChooser">
                <Button
                  id="fwOpenCodepackBtn"
                  variant="outlined"
                  color="primary"
                  component="span"
                  disabled={roleLevel == 99 ? isFileLoading : true}
                >
                  {t("Open Codepack")}
                  {isFileLoading && <CircularProgress size={20} style={{ marginLeft: "10px" }} />}
                </Button>
              </label>
            </div>

            <ConfirmModal
              visible={visible}
              title={t("Alert")}
              description={t(this.modalDescription)}
              onOk={this.handleClose}
            />
            <EulaModal
              open={isEulaOpen}
              value="disagree"
              handleCancel={this.handleEulaCancel}
              handleAccept={this.handleEulaAccept}
            >
              {eulaFromCodepack != null && parse != undefined ? (
                <div style={{ padding: "0px 10px 0px 10px" }}>{parse(eulaFromCodepack)}</div>
              ) : (
                children
              )}
            </EulaModal>
            <FwUpdateModal
              open={isFwUpdateOpen}
              handleCancel={this.handleFwUpdateCancel}
              handleRunUpdates={this.handleFwRunUpdates}
              imageNum={imageNum}
              totalImgCount={this.totalImgCount}
              isUpdateRunning={isUpdateRunning}
              currentImgNum={this.currentImgNum}
              imageData={this.combinedDataForUI}
              parentImageNumUpdate={this.updateImageNum}
              fwImgUploadList={updateArray}
              isFwUpdateComplete={isFwUpdateComplete}
              enableAbort={enableAbort}
              cancelFirmwareUpdate={this.cancelFirmwareUpdate}
            />

            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={this.handleSnackbarClose}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={<span id="message-id">{t("Invalid file selected")}</span>}
              action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                  <Close />
                </IconButton>
              ]}
            />
          </div>
        )}
      </ListItem>
    );
  }
}
FirmwareUpdateContainer.propTypes = {
  title: PropTypes.string.isRequired,
  dataURL: PropTypes.string
};

FirmwareUpdateContainer.defaultProps = {
  //Default values for props here
};

const styles = (theme) => ({
  main: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  body: {
    padding: theme.spacing(3),
    //margin: '0px auto',
    //maxWidth: '600px',
    //backgroundColor: PXBColors.white[50],
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  },
  wrapper: {
    maxWidth: 600,
    margin: "0px auto",
    backgroundColor: PXBColors.white[50]
  },
  input: {
    display: "none"
  },
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: PXBColors.gray[500] //theme.palette.grey[500]
  }
});

const mapStateToProps = ({ auth, t, loadingLanguageFile, fusSessionTimeoutSec }) => {
  return {
    dataURL: auth.dataURL,
    t: t,
    roleLevel: auth.roleLevel,
    isLoading: loadingLanguageFile,
    fusSessionTimeoutSec
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    dispatch: (action) => {
      return dispatch(action);
    },
    dispatchFwUpdateRequest: (action) => {
      dispatch(action);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FirmwareUpdateContainer));
