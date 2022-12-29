import {
  LOAD_CHANNEL_META,
  LOAD_LANGUAGE_LIST,
  LOAD_LANGUAGE,
  LOAD_CHANNEL_META_RESET,
  LOGIN,
  LOAD_CHANNEL_VALUE,
  //SET_RT_SUBSCRIPTION,
  ADD_RT_SUBSCRIPTION,
  REMOVE_RT_SUBSCRIPTION,
  EDIT_SETTING,
  DEVICE_CONNECTION,
  DEVICE_RESTART,
  SESSION_EXPIRED,
  URL_REDIRECTION,
  LOAD_ACTIVE_CHANNELS,
  OPEN_USER_MENU_OPTION,
  CLOSE_USER_MENU_OPTION,
  SET_FUS_SESSION_TIMEOUT,
  SET_PAGE_DETAIL_VIEW
} from "./actiontypes";

const DEBUG_LOGGING = new URLSearchParams(window.location.search).get("debug_logging") !== null;
const TIME_CHANNELS = [];
let roleLevel = 0;
let userInactivityTimePid = 0;
let unixEpochChannel = null;
let autoUpdateTimeDifferenceChannel = null;
let fwUpgradeModeChannel = null;
let timerId = 0;
let isHttpDisabled = false;
let fusSessionTimeoutSecChannel = null;

export function markTimeChannel(channel) {
  TIME_CHANNELS.push(channel);
}

export function setUserInactivityTime(time) {
  userInactivityTimePid = time;
}

export function markFwUpgradeModeChannel(channel) {
  fwUpgradeModeChannel = channel;
}

export function setSystemTimeChannel(epochChannel, autoUpdateChannel) {
  unixEpochChannel = epochChannel;
  autoUpdateTimeDifferenceChannel = autoUpdateChannel;
}

export function setFusSessionTimeoutSec(channel) {
  fusSessionTimeoutSecChannel = channel;
}

export function login(username, password, i18n, t) {
  return (dispatch, getState, { pb }) => {
    let payload = {};
    pb.setLogin(username, password);
    pb.fetch("GET", "/rs/users/accounts/curruser")
      .then((response) => response.json())

      // Process the attributes
      .then((data) => {
        if (timerId) {
          dispatch(startStopRefreshTimer("stop"));
        }
        payload.userName = data.userName;
        payload.user_id = data.userID;
        payload.changePwd = data.changePwd === 2;
        // TODO: Remove the hardcoding and read from DCI
        payload.usernamePasswordSame = data.changePwd === 1;
        payload.lastLoginTime = data.lastLoginTime;
        payload.failedLogins = parseInt(data.failedAttemptCount);
        payload.fullName = data.fullName;
        payload.pwdComplexity = data.pwdComplexity.toString();
        payload.pwdSetEpochTime = data.pwdSetEpochTime;
        payload.pwdTimeoutDays = data.pwdTimeoutDays;
        payload.role = { name: data.roleDef.role };
        payload.id = data.roleDef.roleID;
        payload.dataURL = pb.dataURL;

        return pb.fetch("GET", data.roleDef["href"]);
      })
      // .then((response) => {
      //   if (response && response.status === 200) {
      //     return response.json();
      //   } else {
      //     dispatch({ type: LOGIN.FAILURE });
      //   }
      // })
      .then((response) => response.json())
      .then((roleResponse) => {
        if (process.env.REACT_APP_LOCALIZE === "true") {
          if (localStorage.getItem("lang") != "en") {
            dispatch(initiateLanguageFileDownload());
          }
        }

        // roleLevel corresponds to the Param r and w attributes for each parameter

        roleLevel = payload.role.level = parseInt(roleResponse.roleLevel);
        payload.role.id = roleResponse.roleID;
        let waitForParamsList = dispatch(getActiveChannels());
        waitForParamsList.then(() => {
          dispatch({ type: LOGIN.SUCCESS, data: payload });
          dispatch(idleLogout());
          dispatch(writeSystemTime());
          dispatch(getFusSessionTimeoutValue());
        });
      })
      .catch((err) => {
        console.error("error: ", err);
        dispatch({ type: LOGIN.FAILURE, error: err });
      });
  };
}

export function clearPasswordWarning() {
  return (dispatch, getState, { pb }) => {
    dispatch({ type: LOGIN.SUCCESS, data: { usernamePasswordSame: false } });
  };
}

export function idleLogout() {
  return (dispatch, getState, { pb }) => {
    let timeout, json, inactivityTimeValue;

    pb.fetch("GET", "/rs/param/" + userInactivityTimePid + "/value")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        inactivityTimeValue = json.value * 1000;

        window.onload = resetTimer;
        window.onmousemove = resetTimer;
        window.onmousedown = resetTimer;
        window.onclick = resetTimer;
        window.onscroll = resetTimer;
        window.onkeypress = resetTimer;
        resetTimer();

        function logout() {
          if (pb.firmwareUpgradeInProgress) {
            resetTimer();
          } else {
            dispatch(appLogout());
          }
        }

        function resetTimer() {
          clearTimeout(timeout);
          timeout = setTimeout(logout, inactivityTimeValue); // time is in milliseconds
        }
      });
  };
}

function getFusSessionTimeoutValue() {
  return (dispatch, getState, { pb }) => {
    if (fusSessionTimeoutSecChannel) {
      pb.fetch("GET", "/rs/param/" + fusSessionTimeoutSecChannel + "/value")
        .then((response) => {
          return response.json();
        })
        .then((dataObj) => {
          //let dataObj = parseXML(str);
          console.log("Session timeout value: ", dataObj);
          dispatch({ type: SET_FUS_SESSION_TIMEOUT, data: dataObj.value });
        });
    }
  };
}

export function getFwUpgradeMode() {
  return (dispatch, getState, { pb }) => {
    return pb
      .fetch("GET", "/rs/param/" + fwUpgradeModeChannel + "/value")
      .then((response) => response.json())
      .then((fwUpgradeRestObj) => {
        //let fwUpgradeRestObj = parseXML(str);
        let fwUpgradeModeValue = fwUpgradeRestObj.value;
        return fwUpgradeModeValue;
      });
  };
}

export function writeSystemTime() {
  return (dispatch, getState, { pb }) => {
    if (autoUpdateTimeDifferenceChannel !== undefined) {
      return pb
        .fetch("GET", "/rs/param/" + autoUpdateTimeDifferenceChannel + "/value")
        .then((response) => response.json())
        .then((timediffernceObj) => {
          //let timediffernceObj = parseXML(str);
          let timedifferencevalue = parseInt(timediffernceObj.value);
          if (timedifferencevalue > 0) {
            pb.fetch("GET", "/rs/param/" + unixEpochChannel + "/value")
              .then((response) => response.json())
              .then((unixEpochObj) => {
                //let unixEpochObj = parseXML(str);
                let deviceTime = parseInt(unixEpochObj.value);
                let systemTime = Math.floor(new Date() / 1000);
                //Checking the time difference.
                //To update the system time only when the device time is not correct.
                if (systemTime - deviceTime > timedifferencevalue) {
                  let currentEpoch = Math.floor(new Date().getTime() / 1000.0);
                  //let data = '<Value pid="' + unixEpochChannel + '">' + currentEpoch + "</Value>";
                  let data = {
                    pid: unixEpochChannel,
                    value: currentEpoch
                  };
                  pb.fetch("PUT", "/rs/param/" + unixEpochChannel + "/value", data).catch(() =>
                    console.warn("Failed to Write the system time")
                  );
                }
              });
          }
        })
        .catch(() => console.warn("Failed to fetch auto upadate time difference value"));
    }
  };
}

export function appLogout() {
  return (dispatch, getState, { pb }) => {
    pb.fetch("DELETE", "/rs/users/session").then((res) => {
      pb.deleteLocalStorage();
      window.location.href = "/";
    });
  };
}

export function pwdComplexityDetails(pwdComplexityLevel, t) {
  let message = "";
  if (!t) {
    t = (str) => str;
  }
  pwdComplexityLevel = pwdComplexityLevel.toString();
  switch (pwdComplexityLevel) {
    case "0":
      message = t(
        "Password must meet the following requirements:\n" +
          "- Be at least 6 characters\n" +
          "- Not same as User Name or Full Name\n" +
          "- Not same as existing password or default password",
        {
          keySeparator: "^" /* ignore the '.' in the key */,
          nsSeparator: "^" /*Ignore ':'*/
        }
      );
      break;
    case "1":
      message = t(
        "Password must meet the following requirements:\n" +
          "- Be at least 8 characters\n" +
          "- At least 1 letter\n" +
          "- At least 1 number\n" +
          "- Not same as User Name or Full Name\n" +
          "- Not same as existing password or default password",
        {
          keySeparator: "^" /* ignore the '.' in the key */,
          nsSeparator: "^" /*Ignore ':'*/
        }
      );
      break;
    case "2":
      message = t(
        "Password must meet the following requirements:\n" +
          "- Be at least 12 characters\n" +
          "- At least 1 letter\n" +
          "- At least 1 number\n" +
          "- At least 1 special character\n" +
          "- At least 1 capital letter\n" +
          "- Not same as User Name or Full Name\n" +
          "- Not same as existing password or default password",
        {
          keySeparator: "^" /* ignore the '.' in the key */,
          nsSeparator: "^" /*Ignore ':'*/
        }
      );
      break;
    case "3":
      message = t(
        "Password must meet the following requirements:\n" +
          "- Be at least 16 characters\n" +
          "- At least 2 letters\n" +
          "- At least 1 number\n" +
          "- At least 2 special characters\n" +
          "- At least 1 capital letter\n" +
          "- At least 1 lowercase letter\n" +
          "- Not same as User Name or Full Name\n" +
          "- Not same as existing password or default password",
        {
          keySeparator: "^" /* ignore the '.' in the key */,
          nsSeparator: "^" /*Ignore ':'*/
        }
      );
      break;
  }
  return message;
}

function validatePwdComplexity(pb, user_id, t) {
  return pb
    .fetch("GET", "/rs/users/accounts/" + user_id)
    .then((response) => response.json())
    .then((data) => {
      const pwdComplexity = data.pwdComplexity.toString();
      const pwdComplexityMessage = pwdComplexityDetails(pwdComplexity, t);
      return pwdComplexityMessage;
    });
}

export function appRefresh() {
  return (dispatch, getState, { pb }) => {
    pb.deleteLocalStorage();
    window.location.href = "/";
  };
}

export function changePasswordAction(settings, user_id, t) {
  const setData = {
    loggedInUserPwd: settings.currentPwd,
    pwd: settings.newPwd,
    pwdSetEpochTime: settings.date
  };
  if (!t) {
    t = (str) => str;
  }
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) =>
      pb
        .fetch("PUT", "/rs/users/accounts/" + user_id, setData)
        .then((res) => {
          DEBUG_LOGGING && console.log(res);
          if (res && res.status === 200) {
            dispatch(appRefresh());
          }
        })
        .catch(async (res) => {
          if (res.statusText === "Forbidden" && res.status === 403) {
            reject(t("Current password entered doesn't match the existing password!"));
          } else if (res.status === 422 && res.statusText === "Password Security Violation") {
            const helpMessage = await validatePwdComplexity(pb, user_id, t);
            reject([t(res.statusText), t(helpMessage)]);
          } else if (res.status === 422 && res.statusText === "SFU Session in Progress") {
            reject(t("Firmware update session in progress, please retry after some time."));
          } else {
            reject(t(res.statusText));
          }
        })
    );
  };
}

export function getRoles() {
  return (dispatch, getState, { pb }) => {
    return pb
      .fetch("GET", "/rs/users/roles")
      .then((response) => response.json())
      .then((data) => {
        const roles = data.roles.map((item, index) => item.role);
        return roles;
      });
  };
}

function fetchAllUsers(userList, { pb }, t) {
  let userDetails = {};
  let editUserDetails = {};
  return Promise.all(
    userList.map((user, index) => {
      return new Promise((resolve, reject) => {
        pb.fetch("GET", user["href"])
          .then((response) => response.json())
          .then((data) => {
            let perUser = [];
            let perUserEdit = [];

            perUserEdit.push(data.fullName);
            perUserEdit.push(data.userName);
            perUserEdit.push(data.pwdComplexity.toString());
            perUserEdit.push(data.pwdTimeoutDays);
            perUserEdit.push(data.roleDef.role);

            perUser.push(data.fullName);
            perUser.push(data.roleDef.role);
            perUser.push(data.userName);
            if (data.lastLoginTime === "0") {
              perUser.push(t("Never"));
            } else {
              perUser.push(new Date(data.lastLoginTime * 1000).toLocaleString());
            }
            const currTime = Date.now() / 1000;
            const pwdSetEpochTime = new Date(parseInt(data.pwdSetEpochTime)).getTime();
            const PwdTimeoutDays = data.pwdTimeoutDays;
            const pwdValidTill = pwdSetEpochTime + PwdTimeoutDays * 60 * 60 * 24;
            const daysLeft = Math.ceil((pwdValidTill - currTime) / (60 * 60 * 24));
            if (PwdTimeoutDays === "0") {
              perUser.push(t("Never"));
            } else if (currTime > pwdSetEpochTime + 86400 * PwdTimeoutDays) {
              perUser.push(t("Expired"));
            } else if (daysLeft > 1) {
              perUser.push(daysLeft + " Days");
            } else {
              perUser.push(daysLeft + " Day");
            }
            userDetails[data.userID] = perUser;
            editUserDetails[data.userID] = perUserEdit;
            resolve([userDetails, editUserDetails]);
          });
      });
    })
  ).then(() => {
    return [userDetails, editUserDetails];
  });
}

export function createNewUserAction(settings, pwdComplexity, t) {
  if (!t) {
    t = (str) => str;
  }

  const setData = {
    fullName: settings.fullName,
    userName: settings.userName,
    pwdComplexity: settings.pwdComplexity,
    pwdTimeoutDays: settings.pwdTimeoutDays,
    pwd: settings.pwd,
    role: settings.role,
    pwdSetEpochTime: settings.pwdSetEpochTime
  };
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) =>
      pb
        .fetch("POST", "/rs/users/accounts", setData)
        .then((response) => {
          if (response && response.status === 201) {
            DEBUG_LOGGING && console.log("Successfully created new User!");
            resolve();
          }
        })
        .catch(async (res) => {
          if (res.status === 422 && res.statusText === "Password Security Violation") {
            const helpMessage = pwdComplexityDetails(pwdComplexity, t);
            reject([t(res.statusText), t(helpMessage)]);
          } else if (res.status === 400 && res.statusText === "Bad Request") {
            reject(t("Invalid Inputs"));
          } else if (res.status === 422 && res.statusText === "SFU Session in Progress") {
            reject(t("Firmware update session in progress, please retry after some time."));
          } else {
            reject(t(res.statusText));
          }
        })
    );
  };
}

export function getUserDetails(t) {
  return (dispatch, getState, { pb }) => {
    let usersList = [];
    return pb
      .fetch("GET", "/rs/users/accounts/")
      .then((response) => response.json())
      .then(async (data) => {
        if (Array.isArray(data.userAccountList)) {
          //data.UserAccountList.User
          usersList = data.userAccountList;
        } else {
          usersList.push(data.userAccountList);
        }
        const final_list = await fetchAllUsers(usersList, { pb }, t);
        return final_list;
      });
  };
}

export function updateUser(payload, updateUserId, pwdComplexity, t, refresh = false, userName) {
  if (!t) {
    t = (str) => str;
  }
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) =>
      pb
        .fetch("PUT", "/rs/users/accounts/" + updateUserId, payload)
        .then((response) => {
          if (response && response.status === 200) {
            DEBUG_LOGGING && console.log("Successfully updated the User!");
            if (pb.connect.un == userName) {
              pb.deleteLocalStorage();
            }
            pb.resetFromUserManagementFlag = true;
            resolve();
          }
        })
        .catch(async (res) => {
          if (res.status === 422 && res.statusText === "Password Security Violation") {
            const helpMessage = pwdComplexityDetails(pwdComplexity, t);
            reject([t(res.statusText), t(helpMessage)]);
          } else if (res.status === 400) {
            reject(t("Invalid Inputs"));
          } else if (res.status === 403) {
            reject(t("Invalid logged in user password"));
          } else if (res.status === 422 && res.statusText === "SFU Session in Progress") {
            reject(t("Firmware update session in progress, please retry after some time."));
          } else {
            reject(t(res.statusText));
          }
        })
    );
  };
}

export function resetDefaultPwdAction(loggedInUserPwd, resetActionArg, t) {
  if (!t) {
    t = (str) => str;
  }
  const setData = {
    loggedInUserPwd: loggedInUserPwd
  };
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      pb.fetch("POST", "/rs/users/accounts/reset/" + resetActionArg, setData)
        .then((response) => {
          if (response && response.status === 200) {
            pb.deleteLocalStorage();
            pb.resetFromUserManagementFlag = true;
            resolve();
          }
        })
        .catch((response) => {
          if (response.status === 403) {
            reject(t("Invalid logged in user password"));
          } else if (response.status === 422 && response.statusText === "SFU Session in Progress") {
            reject(t("Firmware update session in progress, please retry after some time."));
          } else {
            reject(t(response.statusText));
          }
        });
    });
  };
}

export function deleteUser(deleteId, t) {
  if (!t) {
    t = (str) => str;
  }
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      pb.fetch("DELETE", "/rs/users/accounts/" + deleteId)
        .then((response) => {
          if (response && response.status === 200) resolve();
        })
        .catch((response) => {
          if (response.status === 422 && response.statusText === "SFU Session in Progress") {
            reject(t("Firmware update session in progress, please retry after some time."));
          } else {
            reject(t(response.statusText));
          }
        });
    });
  };
}

// Convert a Green Datatype to Blue value_type
function datatypeToValueType(dataType, dateTime) {
  dataType = (dataType || "").toLowerCase();
  if (dateTime) {
    return "TIME";
  } else if (dataType == "sint8") {
    return "INT8";
  } else if (dataType == "sint16") {
    return "INT16";
  } else if (dataType == "sint32") {
    return "INT32";
  } else if (dataType == "sint64") {
    return "INT64";
  } else if (dataType == "uint8") {
    return "UINT8";
  } else if (dataType == "uint16") {
    return "UINT16";
  } else if (dataType == "uint32") {
    return "UINT32";
  } else if (dataType == "uint64") {
    return "UINT64";
  } else if (dataType == "float") {
    return "FLOAT";
  } else if (dataType == "dfloat") {
    return "DOUBLE";
  } else if (dataType == "bool") {
    return "BOOL";
  } else if (dataType == "byte") {
    return "BYTE";
  } else if (dataType == "word") {
    return "WORD";
  } else if (dataType == "dword") {
    return "DWORD";
  } else if (dataType.indexOf("string") != -1) {
    return "STRING";
  }
  // No translation to "PASSWORD" or "BINARY" in Green
  return "";
}

function getRangePromise(pb, list, ourIndex, rangeHREF) {
  DEBUG_LOGGING && console.info("Getting {" + ourIndex + "} range " + rangeHREF);

  return (
    pb
      .fetch("GET", rangeHREF)
      // Process the range
      .then((response) => response.json())
      // Process the range attributes
      .then((data) => {
        if (!data) {
          // Normal if not an range
          return "";
        }
        let max = data.range.max,
          min = data.range.min;
        const listItem = list[ourIndex];
        if (process.env.REACT_APP_FORMAT_HANDLING_UI_ENABLE === "true") {
          if (listItem.format) {
            let formatParenthesisValue = listItem.format.split("(")[1];
            formatParenthesisValue = formatParenthesisValue.split(")")[0];
            max = pb.raw2readable(
              listItem.format.split("(")[0] + "()",
              max,
              formatParenthesisValue,
              "uint8" //listItem.dataType.toLowerCase() - fixing datatype as min and max are always integers
            );
            min = pb.raw2readable(
              listItem.format.split("(")[0] + "()",
              min,
              formatParenthesisValue,
              "uint8" //listItem.dataType.toLowerCase() - fixing datatype as min and max are always integers
            );
          }
        }

        if (!isNaN((max = Number(max)))) {
          if (listItem.maximum == undefined) {
            // Use the Max
            listItem.maximum = max;
          } else {
            // Use the Max if it's lower than our current max based on datatype
            listItem.maximum = Math.min(listItem.maximum, max);
          }
        }
        if (!isNaN((min = Number(min)))) {
          if (listItem.minimum == undefined) {
            // Use the Min
            listItem.minimum = min;
          } else {
            // Use the Min if it's lower than our current min based on datatype
            listItem.minimum = Math.max(listItem.minimum, min);
          }
        }
      })
  );
}

function getDescriptionPromise(t, pb, list, ourIndex, descriptionHREF) {
  DEBUG_LOGGING && console.info("Getting {" + ourIndex + "} description " + descriptionHREF);
  return (
    pb
      .fetch("GET", descriptionHREF)
      // Process the description value
      .then((response) => response.json())
      // Process the description value
      .then((data) => {
        if (!data) {
          // Normal if not an intital value
          return "";
        }
        const description = data.description.value || "";
        const listItem = list[ourIndex];
        if (description.length) {
          let desc = setParamDescription(listItem.id, description, t);
          listItem.description = desc;
        }
        // Note the t function ignores the defaultValue if it's still initializing so force a default where necessary
        if (listItem.description == `${listItem.id}.ld`) {
          listItem.description = description;
        }
      })
  );
}

function getEnumPromise(t, pb, list, ourIndex, channel, enumHREF, innerPromises) {
  list[ourIndex].multistate_maps = {};
  DEBUG_LOGGING && console.info("Getting {" + ourIndex + "} enum " + enumHREF);
  return (
    pb
      .fetch("GET", enumHREF)
      // Process the enums
      .then((response) => response.json())
      // Process the enum attributes
      .then((data) => {
        if (!data) {
          // Normal if not an enum
          return "";
        }
        //const enumValElements = data.enum.Val;
        const enumValElements = data.enum;
        // If we got some enum values, proceed to get their descriptions
        if (enumValElements && enumValElements.length) {
          // Loop through the enum values
          Array.prototype.forEach.call(
            enumValElements,
            function (element, index2 /*, item2, thisArg*/) {
              const value = element.value;
              if (value) {
                let enumValHREF = element["href"];
                // Fetch the description for this value
                if (enumValHREF) {
                  DEBUG_LOGGING && console.info("Getting " + index2 + " enum " + enumValHREF);
                  innerPromises.push(
                    pb
                      .fetch("GET", enumValHREF)
                      // Process the Values
                      .then((response) => response.json())
                      // Process the attributes
                      .then((data) => {
                        const listItem = list[ourIndex];
                        const desc = data.Val.Desc || "";
                        if (desc) {
                          listItem.multistate_maps[value] = setEnumOrBitDescription(listItem.id, value, desc, t, "e");
                          // Note the t function ignores the defaultValue if it's still initializing so force a default where necessary
                          if (listItem.multistate_maps[value] == `${listItem.id}.e.${value}`) {
                            listItem.multistate_maps[value] = desc;
                          }
                          DEBUG_LOGGING &&
                            console.info(
                              "Got " + index2 + " enum " + enumValHREF + " multistate_maps item " + value + ":" + desc
                            );
                        } else {
                          console.error("Missing enum Desc for /rs/param/" + channel);
                        }
                      })
                  );
                } else {
                  console.error("Missing enum val xlink for /rs/param/" + channel);
                }
              } // end if getElementContent
            } // end if (element)
          ); // end loop for each enum
        } else {
          console.error("Missing enum Values for /rs/param/" + channel);
        }
      })
  );
}

function getBitfieldPromise(t, pb, list, ourIndex, channel, bitfieldHREF, innerPromises) {
  list[ourIndex].bitfields = {};
  DEBUG_LOGGING && console.info("Getting {" + ourIndex + "} bitfield " + bitfieldHREF);
  return (
    pb
      .fetch("GET", bitfieldHREF)
      // Process the bitfields
      .then((response) => response.json())
      // Process the bitfield attributes
      .then((data) => {
        if (!data) {
          // Normal if not an bitfield
          return "";
        }
        const bitFieldValElements = data.Bitfield.Bit;
        // If we got some bitfield values, proceed to get their descriptions
        if (bitFieldValElements && bitFieldValElements.length) {
          // Loop through the bitfield values
          Array.prototype.forEach.call(
            bitFieldValElements,
            function (element, index2 /*, item2, thisArg*/) {
              const value = element.value;
              if (value) {
                let bitValHREF = element["href"];
                // Fetch the description for this value
                if (bitValHREF) {
                  DEBUG_LOGGING && console.info("Getting " + index2 + " bitfield " + bitValHREF);
                  innerPromises.push(
                    pb
                      .fetch("GET", bitValHREF)
                      // Process the Values
                      .then((response) => response.json())
                      // Process the attributes
                      .then((data) => {
                        const listItem = list[ourIndex];
                        const desc = data.Bit.Desc || "";
                        if (desc) {
                          listItem.bitfields[value] = setEnumOrBitDescription(listItem.id, value, desc, t, "b");
                          DEBUG_LOGGING &&
                            console.info(
                              "Got " + index2 + " bifield " + bitValHREF + " bit item " + value + ":" + desc
                            );
                        } else {
                          console.error("Missing bitfield Desc for /rs/param/" + channel);
                        }
                      })
                  );
                } else {
                  console.error("Missing bifield val xlink for /rs/param/" + channel);
                }
              } // end if getElementContent
            } // end if (element)
          ); // end loop for each bitfield
        } else {
          console.error("Missing bitfield Values for /rs/param/" + channel);
        }
      })
  );
}

export function getActiveChannels() {
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      let activeChannelList = [];
      pb.fetch("GET", "/rs/param/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.paramList.map((item) => {
            activeChannelList.push(item.pid.toString());
          });
          dispatch({ type: LOAD_ACTIVE_CHANNELS, data: activeChannelList });
          resolve();
        })
        .catch((err) => {
          console.error("HTTP PARAM LOAD FAILURE - NOT 200");
          console.error(err);
          console.info("Bad response to /rs/param " + err);
        });
    });
  };
}

//Extract the DCI meta data from the redux store which has a copy from appPages.js file
export function loadChannelMeta(channels, t) {
  if (!channels) {
    console.warn("loadChannelMeta not given valid channels");
    return;
  }
  if (!t) {
    t = (str) => str;
  }
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      let list = [];
      let isDynamicMetaPromise = false;
      let dynamicMetaChannels = [];
      let metaData = getState().paramMeta;
      metaData = Object.values(metaData);
      channels.forEach((channel) => {
        let paramArrayNameList = [];
        let paramArrayUnitList = [];
        let paramArrayDescriptionList = [];
        let paramId = channel.split("[")[0];
        metaData.forEach((dci) => {
          if (paramId == dci.id) {
            if (dci.isDynamicMeta == undefined) {
              if (dci.name.split(";")[1] != undefined) {
                let nameValue = t(`${paramId}.sd`, {
                  keySeparator: "^" /* ignore the '.' in the key */,
                  defaultValue: t(dci.name) || ""
                });
                let descriptionValue = t(`${paramId}.ld`, {
                  keySeparator: "^" /* ignore the '.' in the key */,
                  defaultValue: t(dci.description, {
                    keySeparator: "^" /* ignore the '.' in the key */,
                    nsSeparator: "^" /* ignore the ':' in the key */,
                    defaultValue: dci.description
                  })
                });
                let unitValue = t(`${paramId}.u`, {
                  keySeparator: "^" /* ignore the '.' in the key */,
                  defaultValue: t(dci.units) || ""
                });
                paramArrayNameList = nameValue.split(";");
                paramArrayUnitList = dci.units ? unitValue.split(";") : [];
                paramArrayDescriptionList = descriptionValue.split(";");
              }

              let channelObj = setParamMeta(paramId, dci, t),
                description = setParamDescription(paramId, dci.description, t),
                multistate_maps = {},
                bitfields = {};

              if (dci.enums) {
                let enums = dci.enums;
                Object.entries(enums).forEach(([key, value]) => {
                  multistate_maps[key] = setEnumOrBitDescription(dci.id, key, value, t, "e");
                });
              }

              if (dci.bitfields) {
                let bf = dci.bitfields;
                Object.entries(bf).forEach(([key, value]) => {
                  bitfields[key] = setEnumOrBitDescription(dci.id, key, value, t, "b");
                });
              }

              if (channelObj.name) {
                if (channelObj.format && !channelObj.pattern) {
                  let patternObj = setPatternAndPatternMsg(
                    channelObj.format.toUpperCase(),
                    channelObj.units,
                    channelObj.length
                  );
                  channelObj.pattern = t(patternObj.pattern);
                  channelObj.pattern_msg = t(patternObj.pattern_msg);
                }

                list.push({
                  ...channelObj,
                  description: description,
                  value_type: datatypeToValueType(channelObj.dataType, TIME_CHANNELS.includes(dci.id)) || "", // TODO come up with a better way to detect TIME channels over the REST interface
                  multistate_maps: dci.enums ? multistate_maps : undefined,
                  bitfields: dci.bitfields ? bitfields : undefined
                });

                // Create some broad min/max limits purely based on datatype and format
                const listItem = list[list.length - 1],
                  minMax = minMaxFromSize(listItem);
                if (minMax) {
                  if (minMax.minimum !== undefined) {
                    listItem.minimum = minMax.minimum;
                  }
                  if (minMax.maximum !== undefined) {
                    listItem.maximum = minMax.maximum;
                  }
                }

                if (dci.max && dci.min) {
                  if (!isNaN((dci.max = Number(dci.max))) && !isNaN((dci.min = Number(dci.min)))) {
                    if (dci.format) {
                      if (process.env.REACT_APP_FORMAT_HANDLING_UI_ENABLE === "true") {
                        let formatParenthesisValue = dci.format.split("(")[1];
                        formatParenthesisValue = formatParenthesisValue.split(")")[0];
                        dci.max = pb.raw2readable(
                          dci.format.split("(")[0] + "()",
                          dci.max,
                          formatParenthesisValue,
                          "uint8" //dci.datatype.toLowerCase() - fixing datatype as min and max are always integers
                        );
                        dci.min = pb.raw2readable(
                          dci.format.split("(")[0] + "()",
                          dci.min,
                          formatParenthesisValue,
                          "uint8" //dci.datatype.toLowerCase() - fixing datatype as min and max are always integers
                        );
                      }
                    }
                    if (listItem.maximum == undefined && listItem.minimum == undefined) {
                      // Use the Max
                      listItem.maximum = dci.max;
                      // Use the Min
                      listItem.minimum = dci.min;
                    } else {
                      // Use the Max if it's lower than our current max based on datatype
                      listItem.maximum = Math.min(listItem.maximum, dci.max);
                      // Use the Min if it's lower than our current min based on datatype
                      listItem.minimum = Math.max(listItem.minimum, dci.min);
                    }
                  }
                }

                if (paramArrayNameList.length > 0) {
                  let item = { ...listItem };
                  let newList = [];
                  paramArrayNameList.forEach((paramArrayName, index) => {
                    if (index > 0) {
                      let id = dci.id + "[" + (index - 1) + "]";
                      newList.push({
                        ...item,
                        name: paramArrayName,
                        id,
                        units: paramArrayUnitList[index],
                        description: paramArrayDescriptionList[index]
                      });
                    }
                  });
                  dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: newList });
                  listItem.name = paramArrayNameList[0];
                  listItem.units = paramArrayUnitList[0];
                  listItem.description = paramArrayDescriptionList[0];
                }

                // Fetch min and max values from REST if format is defined
                if (
                  dci.min != undefined &&
                  dci.max != undefined &&
                  dci.format &&
                  process.env.REACT_APP_FORMAT_HANDLING_UI_ENABLE === "false"
                ) {
                  pb.fetch("GET", "/rs/param/" + dci.id + "/range")
                    .then((response) => response.json())
                    // Process the range attributes
                    .then((data) => {
                      list[0].maximum = data.range.max;
                      list[0].minimum = data.range.min;
                      dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: list });
                    });
                } else {
                  // Update the channelData on redux store
                  dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: list });
                }
              }
            } else {
              isDynamicMetaPromise = true;
              if (!dynamicMetaChannels.includes(dci)) {
                dynamicMetaChannels.push(dci);
              }
            }
          }
        });
      });
      if (!isDynamicMetaPromise) {
        resolve(list);
      } else {
        // Need to use the old function to fetch data from REST response
        let dynamicMetaPromise = dispatch(loadChannelMetaDynamically(dynamicMetaChannels, t));
        dynamicMetaPromise.then((data) => {
          // Return static and dynamic meta information
          resolve(list.concat(data));
        });
      }
    });
  };
}

var _channelRetries = new Map(); // Key is the channel, value is the number of retry attempts.  After 5 we'll give up and delete the map entry
export function loadChannelMetaDynamically(channels, t) {
  if (!channels) {
    console.warn("loadChannelMetaDynamically not given valid channels");
    return;
  }
  if (!t) {
    t = (str) => str;
  }
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      let list = [],
        promises = [],
        middlePromises = [],
        innerPromises = [];
      channels.forEach((channel) => {
        let ourIndex = -1;
        let rangeHREF, descriptionHREF, enumHREF, initialHREF, bitfieldHREF, defaultHREF;
        let paramId = channel.id.split("[")[0];
        promises.push(
          pb
            // Request the channel param root
            .fetch("GET", "/rs/param/" + paramId)
            // Parse the response
            .then((response) => response.json())
            // Process the attributes
            .then((data) => {
              data.Param.import = channel.import;
              data.Param.export = channel.export;
              let channelObj = setParamMeta(paramId, data.Param, t);
              channelObj.format = channel.format;
              // Note the t function ignores the defaultValue if it's still initializing so force a default where necessary
              if (channelObj.name == `${channelObj.prefix}sd`) {
                channelObj.name = t(data.Param.Name) || "";
              }
              if (channelObj.units == `${channelObj.prefix}u`) {
                channelObj.units = t(data.Param.Units) || "";
              }

              // Note the t function ignores the defaultValue if it's still initializing so force a default where necessary
              if (channelObj.pattern == `${channelObj.prefix}p`) {
                channelObj.pattern = t(data.Param.Pattern) || "";
              }

              // An alternative to this retry (which is necessary when the server is overwhelmed) would be to do all these fetches synchronously vs. in parallel
              if (_channelRetries.has(paramId)) {
                console.info("retry for (" + paramId + ") succeeded - yay me!");
                _channelRetries.delete(paramId);
              }

              if (channelObj.name) {
                if (channelObj.format && !channelObj.pattern) {
                  let patternObj = setPatternAndPatternMsg(
                    channelObj.format.toUpperCase(),
                    channelObj.units,
                    channelObj.length
                  );
                  channelObj.pattern = t(patternObj.pattern);
                  channelObj.pattern_msg = t(patternObj.pattern_msg);
                }
                ourIndex =
                  list.push({
                    ...channelObj,
                    value_type: datatypeToValueType(channelObj.dataType, TIME_CHANNELS.includes(paramId)) || "" // TODO come up with a better way to detect TIME channels over the REST interface
                  }) - 1;

                // Create some broad min/max limits purely based on datatype and format
                const listItem = list[list.length - 1],
                  minMax = minMaxFromSize(listItem);
                if (minMax) {
                  if (minMax.minimum !== undefined) {
                    listItem.minimum = minMax.minimum;
                  }
                  if (minMax.maximum !== undefined) {
                    listItem.maximum = minMax.maximum;
                  }
                }

                DEBUG_LOGGING && console.info("Created list item:" + JSON.stringify(list[ourIndex]));
              } else {
                throw new Error("No Name for /rs/param/" + paramId);
              }
              rangeHREF = data.Param.Range ? data.Param.Range["xlink:href"] : "";
              descriptionHREF = data.Param.Description ? data.Param.Description["xlink:href"] : "";
              enumHREF = data.Param.Enum ? data.Param.Enum["xlink:href"] : "";
              initialHREF = data.Param.Initial ? data.Param.Initial["xlink:href"] : "";
              bitfieldHREF = data.Param.Bitfield ? data.Param.Bitfield["xlink:href"] : "";
              defaultHREF = data.Param.Default ? data.Param.Default["xlink:href"] : "";
            })

            // We have all the top level data now.  Now populate middlePromises with the data from the HREF's
            .then(() => {
              //
              // If available, fetch the range
              //
              if (rangeHREF) {
                middlePromises.push(getRangePromise(pb, list, ourIndex, rangeHREF));
              }

              //
              // If available, fetch the description
              //
              if (descriptionHREF) {
                middlePromises.push(getDescriptionPromise(t, pb, list, ourIndex, descriptionHREF));
              }

              //
              // If available, fetch the enums
              //
              if (enumHREF) {
                middlePromises.push(getEnumPromise(t, pb, list, ourIndex, paramId, enumHREF, innerPromises));
              }

              //
              // If available, fetch the initial value
              // Note this currently fails for some channels for the Crosby device
              //
              /* Disabled since not used
                  if (initialHREF) {
                    middlePromises.push(
                      getInitialPromise(pb, list, ourIndex, channel, initialHREF)
                    );
                  }
                  */

              //
              // If available, fetch the bitfields
              //
              //Disabled since not used
              if (bitfieldHREF) {
                middlePromises.push(getBitfieldPromise(t, pb, list, ourIndex, paramId, bitfieldHREF, innerPromises));
              }
              // If available, fetch the default
              // Note this currently fails for some channels in Green
              //
              /* Disabled since not used and many fail
                  if (defaultHREF) {
                    middlePromises.push(
                      getDefaultPromise(pb, list, ourIndex, channel, defaultHREF)
                    );
                  }
                  */
            })
            .catch((err) => {
              let cnt = _channelRetries.get(paramId) || 0;
              if (cnt < 5) {
                console.warn("PROMISE FAILURE - LOAD CHANNEL (" + paramId + ") META");
                console.warn(err);
                console.warn("retrying (" + paramId + ") ...");
                _channelRetries.set(paramId, cnt + 1);
                dispatch(loadChannelMetaDynamically([channel])); // Retry
              } else {
                // Stop retrying - subsequent calls to loadChannelMeta will try again from scratch though
                console.error("PROMISE FAILURE - LOAD CHANNEL (" + paramId + ") META");
                console.error(err);
                console.error("retries for (" + paramId + ") exhausted");
                _channelRetries.delete(paramId);
              }
            })
        ); // end promises.push
      });

      // Outer promises
      Promise.all(promises)
        .then(() => {
          // Middle promises
          Promise.all(middlePromises)
            .then(() => {
              // Innermost promisses
              Promise.all(innerPromises)
                .then(() => {
                  DEBUG_LOGGING && console.info("Dispatching " + list.length + " channel metas");
                  DEBUG_LOGGING && console.info(list);
                  // Need to handle DCI(s) having array. Eg: 10045[0]
                  let listCopy = [...list];
                  listCopy.forEach((param, listIndex) => {
                    if (param.name.split(";")[1] != undefined) {
                      let paramArrayNameList = param.name.split(";");
                      let paramArrayUnitList = param.units ? param.units.split(";") : [];
                      let paramArrayDescriptionList = param.description.split(";");

                      paramArrayNameList.forEach((paramArrayName, index) => {
                        if (index > 0) {
                          let id = param.id + "[" + (index - 1) + "]";
                          list.push({
                            ...param,
                            name: paramArrayName,
                            id,
                            units: paramArrayUnitList[index],
                            description: paramArrayDescriptionList[index]
                          });
                        }
                      });
                      list[listIndex].name = paramArrayNameList[0];
                      list[listIndex].units = paramArrayUnitList[0];
                      list[listIndex].description = paramArrayDescriptionList[0];
                    }
                  });
                  dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: list });
                  resolve(list);
                })
                .catch((err) => {
                  console.error("Inner Promise all failed");
                  console.error(err);
                  console.info("Despite inner promise failure, still Dispatching " + list.length + " channel metas");
                  dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: list });
                  if (err == "device_connection_lost") {
                    dispatch({ type: DEVICE_CONNECTION.FAILURE });
                  }
                });
            })
            .catch((err) => {
              console.error("Middle Promise all failed");
              console.error(err);
              console.info("Despite middle promise failure, still Dispatching " + list.length + " channel metas");
              dispatch({ type: LOAD_CHANNEL_META.SUCCESS, data: list });
              if (err == "device_connection_lost") {
                dispatch({ type: DEVICE_CONNECTION.FAILURE });
              }
            });
        })
        .catch((err) => {
          console.error("Promise all failed");
          console.error(err);
          if (err == "device_connection_lost") {
            dispatch({ type: DEVICE_CONNECTION.FAILURE });
          }
        });
    });
  };
}

export function initiateLanguageFileDownload() {
  return (dispatch /*, getState, { pb }*/) => {
    dispatch({ type: LOAD_LANGUAGE.REQUEST });
  };
}

export function loadLanguageList() {
  return (dispatch, getState, { pb }) => {
    pb
      // Request the language list root
      .fetch("GET", "/rs/lang/", null, null, true)
      // Parse the response
      .then((response) => response.json())
      // Process the attributes
      .then((data) => {
        let languages = [],
          setting = data.LangList.Lang_Select_Source,
          code = (data.LangList.Comm_Pref_Lang || "").replace(/['"]+/g, ""),
          total = data.LangList.Total,
          langListElement = data.LangList;
        if (langListElement) {
          // get Lang
          let langElements = langListElement.Lang;
          if (total != langElements.length) {
            console.warn(`total(${total}) != langElements.length(${langElements.length})`);
          }
          Array.prototype.forEach.call(langElements, function (element) {
            languages.push({
              name: element.Name,
              code: element.Code,
              path: element["xlink:href"] + "/file"
            });
          });
        } else {
          console.warn("/rs/lang Langlist empty in ");
        }
        dispatch({
          type: LOAD_LANGUAGE_LIST.SUCCESS,
          data: { setting, code, languages }
        });
      })
      .catch((err) => {
        console.error("loadLanguageList failed");
        console.error(err);
      });
  };
}

export function loadLanguage(language, t) {
  if (!language) {
    console.warn("loadLanguage not given valid language");
  }
  return (dispatch /*, getState, { pb }*/) => {
    // Erase the meta data so we translate
    dispatch({ type: LOAD_CHANNEL_META_RESET.REQUEST });
    dispatch({
      type: LOAD_LANGUAGE.SUCCESS,
      data: {
        ...language // {code,name,path}
      }
    });
  };
}

/* Not being used currently
export function setChannelRealtimeSubscription(values, subscriber_id) {
  return (dispatch, getState, { pb }) => {
    if (!pb.rt) {
      pb.initializeRealtimeSubscription(
        () => dispatch(loadChannelRealtimes()),
        pb.getRefreshRate()
      );
    }
    dispatch({
      type: SET_RT_SUBSCRIPTION.REQUEST,
      data: values,
      subscriber_id: subscriber_id,
    });
  };
}
*/

export function addChannelRealtimeSubscription(values, subscriber_id) {
  return (dispatch, getState, { pb }) => {
    if (!pb.rt) {
      pb.initializeRealtimeSubscription(() => dispatch(loadChannelRealtimes()), pb.getRefreshRate());
    }
    dispatch({
      type: ADD_RT_SUBSCRIPTION.REQUEST,
      data: values,
      subscriber_id: subscriber_id
    });
  };
}

export function removeChannelRealtimeSubscription(values, subscriber_id) {
  return (dispatch, getState, { pb }) => {
    dispatch({
      type: REMOVE_RT_SUBSCRIPTION.REQUEST,
      data: values,
      subscriber_id: subscriber_id
    });
  };
}

function loadChannelRealtime(pb, dispatch, channels, channelsMeta, channelsValue) {
  let channelList = "/";
  let uriList = [];
  let count = 0;
  let metaList = { ...channelsMeta }; //Required for formating Raw value to Readable value
  channels.forEach((channel, index) => {
    channel = channel.split("[")[0];
    if (!channelList.includes("/" + channel + "/")) {
      // To remove duplicates for Channels with index syntax. eg: 10045[0], 28[1]
      channelList += channel + "/";
    }
    if (channelList.length <= pb.channelUriMaxSize) {
      if (channels.length - 1 == index) {
        channelList = channelList.substring(0, channelList.lastIndexOf("/"));
      }
      uriList[count] = channelList;
    } else {
      uriList[count] = channelList.substring(0, channelList.lastIndexOf("/"));
      count += 1;
      if (channels.length - 1 > index) {
        channelList = "/";
        uriList[count] = channelList;
      }
    }
  });

  /*
  
  // When New REST URI Enable For V3 We need to enable below mention code
  // Current REST URI: rs/param/value/{x}/{y}/{z}
  // New URI: rs/param/values?pids={x},{y},{z} follows standard
  
  // let channelList = "";
  // let uriList = [];
  // let count = 0;
  // let metaList = { ...channelsMeta }; //Required for formating Raw value to Readable value
  // channels.forEach((channel, index) => {
  //   channel = channel.split("[")[0];
  //   if (!channelList.includes(channel + ",")) {
  //     // To remove duplicates for Channels with index syntax. eg: 10045[0], 28[1]
  //     channelList += channel + ",";
  //   }
  //   if (channelList.length <= pb.channelUriMaxSize) {
  //     if (channels.length - 1 == index) {
  //       channelList = channelList.substring(0, channelList.lastIndexOf(",")-1);
  //     }
  //     uriList[count] = channelList;
  //   } else {
  //     uriList[count] = channelList.substring(0, channelList.lastIndexOf(",")-1);
  //     count += 1;
  //     if (channels.length - 1 > index) {
  //       channelList = "";
  //       uriList[count] = channelList;
  //     }
  //   }
  // });

  */

  uriList.forEach((paramUri) => {
    pb.fetch("GET", "/rs/param/values" + paramUri)
      //When New REST URI Enable Comment above request URI and Enable Below menion URI
      //pb.fetch("GET", "/rs/param/values?pids=" + paramUri)
      // .then((response) => {
      //   if (response && response.status === 200) {
      //     return response.text();
      //   } else {
      //     console.error("FAILURE - LOAD CHANNEL RT");
      //     throw new Error("Bad response " + response && response.status);
      //   }
      // })
      .then((response) => response.json())
      .then((data) => {
        let params = data.values;
        let formatParenthesisValue = null; // Variable to store the paramter values defined in the format eg: SCALE_CONST_DEC_PT( -3 )
        if (!Array.isArray(params)) {
          params = [data.values];
        }
        params.forEach((param) => {
          if (param.value && param.value.split(",")[1] != undefined) {
            let paramArrayValueList = param.value.split(",");
            paramArrayValueList.forEach((paramArrayValue, index) => {
              dispatch({
                type: LOAD_CHANNEL_VALUE.SUCCESS,
                data: {
                  id: param.pid + "[" + index + "]",
                  value: paramArrayValue ? paramArrayValue : ""
                }
              });
            });
          }
          /* Logic below to handle Raw value read from the device to Readable value displayed on UI*/
          if (process.env.REACT_APP_FORMAT_HANDLING_UI_ENABLE === "true") {
            let chanMeta = Object.values(metaList).filter((obj) => obj.id == param.pid);
            if (chanMeta && chanMeta[0].format != undefined && param.value) {
              if (chanMeta[0].format.split("(")[1] != undefined) {
                formatParenthesisValue = chanMeta[0].format.split("(")[1];
                formatParenthesisValue = formatParenthesisValue.split(")")[0];

                if (formatParenthesisValue.indexOf("DCI_") >= 0) {
                  let dciName = [];
                  let tempParanthesisValue = formatParenthesisValue.split("_");
                  tempParanthesisValue.forEach((val, index, array) => {
                    if (index != 0 && index < array.length - 1) {
                      dciName.push(val);
                    }
                  });
                  formatParenthesisValue = dciName.join("_");
                }

                if (channelsMeta[formatParenthesisValue]) {
                  // Checking if the parameter value is a DCI
                  if (channelsValue[channelsMeta[formatParenthesisValue].id]) {
                    // Checking if the DCI value is available in the store
                    formatParenthesisValue = channelsValue[channelsMeta[formatParenthesisValue].id];
                  } else {
                    // Fetching DCI value since its not available in the store
                    pb.fetch("GET", "/rs/param/" + channelsMeta[formatParenthesisValue].id + "/value")
                      .then((response) => response.json())
                      .then((data) => {
                        formatParenthesisValue = data.values;
                        //Calling the formatter
                        param.value = pb.raw2readable(
                          chanMeta[0].format.split("(")[0] + "()",
                          param.value,
                          formatParenthesisValue,
                          chanMeta[0].dataType.toLowerCase()
                        );
                        //DCI value with proper format updated to the store
                        dispatch({
                          type: LOAD_CHANNEL_VALUE.SUCCESS,
                          data: {
                            id: param.pid,
                            value: param.value ? param.value : ""
                          }
                        });
                      });
                  }
                }
              }
              //Calling the formatter when format type don't have any parameter
              if (!channelsMeta[formatParenthesisValue]) {
                param.value = pb.raw2readable(
                  chanMeta[0].format.split("(")[0] + "()",
                  param.value,
                  formatParenthesisValue,
                  chanMeta[0].dataType.toLowerCase()
                );
              }
            }
          }

          //DCI value with proper format updated to the store
          if (!channelsMeta[formatParenthesisValue]) {
            dispatch({
              type: LOAD_CHANNEL_VALUE.SUCCESS,
              data: {
                id: param.pid,
                value: param.value ? param.value : ""
              }
            });
          }
        });
        if (!channelsMeta[formatParenthesisValue]) {
          dispatch({ type: DEVICE_CONNECTION.SUCCESS });
        }
      })
      .catch((err) => {
        if (err != "Firmware update in progress") {
          console.error("FAILURE - LOAD CHANNEL (" + paramUri + ") RT");
          console.error(err);
        }
        if (err == "device_connection_lost") {
          dispatch({ type: DEVICE_CONNECTION.FAILURE });
        } else if (err == "device_restarted") {
          dispatch({ type: DEVICE_RESTART.SUCCESS });
          dispatch(startStopRefreshTimer("start", 15000));
        } else if (err == "session_expired") {
          dispatch({ type: SESSION_EXPIRED.SUCCESS });
          dispatch(startStopRefreshTimer("start", 60000));
        } else if (err == "url_redirection") {
          if (isHttpDisabled) {
            dispatch({ type: URL_REDIRECTION.SUCCESS });
            dispatch(startStopRefreshTimer("start", 60000));
          }
        }
        //Remove connection loss popup for any response
        if (err.status && err.status > 0) {
          dispatch({ type: DEVICE_CONNECTION.SUCCESS });
        }
      });
  });
}

export function loadChannelRealtimes() {
  return (dispatch, getState, { pb }) => {
    let channels = getState().realtime.subscription.slice();
    let channelsMeta = getState().channelData;
    let channelsValue = getState().channelValues;

    if (channels.length < 1) {
      pb.clearRealtimeSubscription();
      return;
    }

    // Loops through many channels, but dispatch them one at a time
    loadChannelRealtime(pb, dispatch, channels, channelsMeta, channelsValue);
  };
}

export function startEditSetting(setting, startValue) {
  return (dispatch) => {
    dispatch({
      type: EDIT_SETTING.START,
      data: { setting: setting, startValue: startValue }
    });
  };
}

export function finishEditSetting(setting) {
  return (dispatch) => {
    dispatch({ type: EDIT_SETTING.STOP, setting });
  };
}

// Custom function to take Hexadecimal value as String and return float with 2 decimal points
function customParseFloat(str) {
  var float = 0,
    sign,
    mantiss,
    exp,
    int = 0,
    multi = 1;
  if ("0x00000000" == str) {
    return (0).toFixed(2).toString();
  } else {
    if (/^0x/.exec(str)) {
      int = parseInt(str, 16);
    } else {
      for (let i = str.length - 1; i >= 0; i -= 1) {
        if (str.charCodeAt(i) > 255) {
          DEBUG_LOGGING && console.warn("Wrong string parametr");
          return false;
        }
        int += str.charCodeAt(i) * multi;
        multi *= 256;
      }
    }
    sign = int >>> 31 ? -1 : 1;
    exp = ((int >>> 23) & 0xff) - 127;
    mantiss = ((int & 0x7fffff) + 0x800000).toString(2);
    for (let i = 0; i < mantiss.length; i += 1) {
      float += parseInt(mantiss[i]) ? Math.pow(2, exp) : 0;
      exp--;
    }
    return (float * sign).toFixed(2).toString();
  }
}

function minMaxFromSize({ value_type, format }) {
  let minMax = { minimum: undefined, maximum: undefined };
  if (format) {
    return minMax;
  }

  const minMaxLookup = {
    INT8: { minimum: -128, maximum: 127 },
    INT16: { minimum: -32768, maximum: 32767 },
    INT32: { minimum: -2147483648, maximum: 2147483647 },
    INT64: { minimum: -9223372036854775808, maximum: 9223372036854775807 },
    UINT8: { minimum: 0, maximum: 255 },
    UINT16: { minimum: 0, maximum: 65535 },
    UINT32: { minimum: 0, maximum: 4294967295 },
    UINT64: { minimum: 0, maximum: 18446744073709551615 },
    BYTE: { minimum: -128, maximum: 255 },
    WORD: { minimum: -32768, maximum: 65535 },
    DWORD: { minimum: -2147483648, maximum: 4294967295 }
  }[(value_type || "").toUpperCase()];

  // Update from value_type limits
  if (minMaxLookup) {
    minMax = minMaxLookup;
  }
  return minMax;
}

// Formats a value into a form used in LTK backend
//  Also handles an array of values
function toLTKValue(param, value) {
  var typeFunction;

  // Set the type function
  switch (param.value_type.toUpperCase()) {
    case "STRING":
      typeFunction = function (value) {
        if (value && param.count < value.length) {
          var oldValue = value;
          value = value.substr(0, param.count);
          DEBUG_LOGGING && console.warn(" String value was truncated from " + oldValue + " to " + value);
        }
        return value;
      };
      break;
    case "BOOL":
      typeFunction = function (value) {
        return value === true || value == "1" ? "1" : "0";
      };
      break;
    case "FLOAT":
      typeFunction = function (value) {
        var buffer = new ArrayBuffer(4);
        var intView = new Int32Array(buffer);
        var floatView = new Float32Array(buffer);
        floatView[0] = value;
        return "0x" + intView[0].toString(16);
      };
      break;
    case "DOUBLE":
      typeFunction = function (value) {
        var buffer = new ArrayBuffer(8);
        var intView = new Int32Array(buffer);
        var floatView = new Float64Array(buffer);
        floatView[0] = value;
        return "0x" + (intView[0] * 0x100000000 + intView[1]).toString(16);
      };
      break;
    case "BYTE":
    case "WORD":
    case "DWORD":
      typeFunction = function (value) {
        return value;
      };
      break;
    default:
      typeFunction = function (value) {
        const oldValue = parseInt(value);
        value = oldValue;

        // Update from custom param limits
        if (param.maximum !== undefined) {
          value = Math.min(value, param.maximum);
        }
        if (param.minimum !== undefined) {
          value = Math.max(value, param.minimum);
        }

        if (oldValue !== value) {
          DEBUG_LOGGING && console.warn("Out Of Bounds Warning: " + " changed from " + oldValue + " to " + value);
        }
        return value;
      };
      break;
  }

  // Apply the type function the array, if appropriate
  if (Array.isArray(value)) {
    return value.map(typeFunction).join(",");
  } else {
    return typeFunction(value);
  }
}

// Formats a value into a form used in the JS interface
function toJSValue(param, value) {
  var typeFunction;
  switch (param.value_type.toUpperCase()) {
    case "STRING":
      typeFunction = function (value) {
        // Strings will have \" surrounding them
        if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          return value.substr(1, value.length - 2);
        } else {
          return value;
        }
      };
      break;
    case "BOOL":
      typeFunction = function (value) {
        if (typeof value === "boolean") {
          return value;
        } else {
          return parseInt(value) ? true : false;
        }
      };
      break;
    case "FLOAT":
      typeFunction = function (value) {
        return customParseFloat(value);
      };
      break;
    case "DOUBLE":
      typeFunction = function (value) {
        return parseFloat(value);
      };
      break;
    case "BYTE":
    case "WORD":
    case "DWORD":
      typeFunction = function (value) {
        return value;
      };
      break;
    default:
      typeFunction = function (value) {
        return parseInt(value);
      };
      break;
  }

  // Handle arrays
  if (param.value_type === "STRING" || !param.count || param.count === 1) {
    return typeFunction(value);
  } else {
    if (Array.isArray(value)) {
      value = value.join(",");
    }
    var ret = value.split(",").map(typeFunction);
    if (ret.length !== param.count) {
      if (!param.unexpectedCount) {
        DEBUG_LOGGING &&
          console.warn("Unexpected count - expected %d received %d (value=%s)", param.count, ret.length, value);
        param.unexpectedCount = true;
      }
    }
    return ret;
  }
}

export function writeSettingValue(setting, writeValue, param, t) {
  if (!t) {
    t = (str) => str;
  }
  if (!setting) {
    console.error("writeSettingValue not given a valid setting");
    return;
  }
  return (dispatch, getState, { pb }) => {
    // What to write depends on the type and format
    let value;
    let channelValues = getState().channelValues;
    let channelsMeta = getState().paramMeta;

    //To trigger the HttpDisable Modal if Http is disabled
    if (setting == channelsMeta["HTTP_ENABLE"].id) {
      isHttpDisabled = writeValue == 0 ? true : false;
    }

    if (param && param.format) {
      //REACT_APP_FORMAT_HANDLING_UI_ENABLE property to let User decide to handle formatting on UI or Firmware
      if (process.env.REACT_APP_FORMAT_HANDLING_UI_ENABLE === "true") {
        let formatParenthesisValue = param.format.split("(")[1];
        formatParenthesisValue = formatParenthesisValue.split(")")[0];
        value = pb.readable2raw(
          param.format.split("(")[0] + "()",
          writeValue,
          formatParenthesisValue,
          param.dataType.toLowerCase()
        );
      } else {
        // All bets are off when setting a custom-format parameter
        switch (param.format) {
          case "CRED":
            // UserPass concatination handled by splitUserPass
            value = toLTKValue(param, writeValue);
            break;
          case "IPV4_BIG_ENDIAN":
          case "IPV4_BIG_ENDIAN_U8":
          case "MAC_ADDRESS":
          case "WAIVER":
          default:
            value = writeValue;
            DEBUG_LOGGING && console.warn("Warning: " + " format " + param.format + " not handled for write");
        }
      }
    } else if (param) {
      // Set .value if a value was passed in
      if (writeValue !== undefined) {
        param.value = toJSValue(param, writeValue);
      }

      // Convert writeValue to an LTK-formatted value, based on this parameter.
      value = toLTKValue(param, writeValue);
    } else {
      value = writeValue;
    }

    // Format the request and send it to the device
    setting = setting.split("["); // Splitting to check if a particular index is only edited for DCIs having array
    // Condition to format payload when only a certain index of a DCI array is edited
    if (setting[1] != undefined) {
      let paramArrayIndex = parseInt(setting[1].split("]")[0]);
      let paramArrayData = channelValues[setting[0]].split(",");
      paramArrayData[paramArrayIndex] = value;
      value = paramArrayData.join(",");
    }
    //var data = '<Value pid="' + setting[0] + '">' + value + "</Value>";
    var data = {
      pid: setting[0],
      value: value
    };
    dispatch({
      type: EDIT_SETTING.WRITING,
      data: { setting: setting[0], value: writeValue }
    });
    return new Promise((resolve, reject) => {
      pb.fetch("PUT", "/rs/param/" + setting[0] + "/value", data).then(
        function () {
          DEBUG_LOGGING && console.log("Wrote " + value);
          dispatch({
            type: EDIT_SETTING.WRITE,
            data: { setting: setting[0], value: writeValue }
          });
          resolve();
        },
        function (reason) {
          let message;
          console.error("Failed to write " + data + " - " + reason.statusText + " (" + reason.status + ")", reason);
          if (reason.status == 400) {
            message = t("Invalid value. Please enter correct value.", {
              keySeparator: "^" /* ignore the '.' in the key */
            });
          } else if (reason.status == 401) {
            message = t("Save not permitted. You may not have permission. Check your login.", {
              keySeparator: "^" /* ignore the '.' in the key */
            });
          } else if (reason.status == 405) {
            message = t("Save not permitted for this parameter.", {
              keySeparator: "^" /* ignore the '.' in the key */
            });
          } else {
            message = t("A save error occurred. Please try again.", {
              keySeparator: "^" /* ignore the '.' in the key */
            });
          }

          dispatch({
            type: EDIT_SETTING.FAILURE,
            message: message
          });
          reject(message);
        }
      );
    });
  };
}

export function fetchAction(method, url, data, retries) {
  return (dispatch, getState, { pb }) => {
    return new Promise((resolve, reject) => {
      pb.fetch(method, url, data, retries)
        .then((response) => resolve(response.json()))
        .catch((err) => reject(err));
    });
  };
}

export function fetchAuthHeadersAction(method, path) {
  return (dispatch, getState, { pb }) => {
    return pb.createAuthHeader(method, path);
  };
}

// Converts XML into a Javascript Object
//  - Creates a new object or appends data to an existing one
//  - Attributes are assigned as keys to the object
//  - If xml is only a value (not XML) it is assigned to parent.value
//    - If parent doesn't exist, xml is returned
export function parseXML(xml, parent) {
  // RegEx divides proper XML in to three parts:
  // $1 - The node name
  // $2 - Space-separated attributes, or a blank string
  // $3 - The contents of the node, or undefined if self-closing
  var regex = /<(\w+)\s*(.*?)(?:\/>|>([\S\s]*?)<\/\1>)/g;
  // Create the basic XML structure
  var ex = regex.exec(xml);
  if (ex === null) {
    // This occurs when "xml" is not XML-formatted.
    //  In this case, apply it to its parent and move on
    if (!parent) {
      parent = xml;
    } else if (xml) {
      parent.value = xml;
    }
    return parent;
  }
  var ret = parent || {};
  while (ex !== null) {
    // Assign each attribute as a property of the value
    var nodeName = ex[1];
    var attributes = ex[2];
    var contents = ex[3];
    var attr = undefined;
    if (attributes) {
      attr = {};
      var attributeList = attributes.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
      attributeList.forEach(function (n) {
        var i = n.indexOf("=");
        var k = n.substr(0, i);
        var v = n.substr(i + 1).replace(/^"(.*)"$/, "$1");
        attr[k] = v;
      });
    }
    // Assign the value to the key
    var value = parseXML(contents, attr);
    var old = ret[nodeName];
    if (old) {
      if (!Array.isArray(old)) {
        old = ret[nodeName] = [old];
      }
      old.push(value);
    } else {
      ret[nodeName] = value;
    }
    ex = regex.exec(xml);
  }
  return ret;
}

export function fetchCertificateAction(method, url) {
  return (dispatch, getState, { pb }) => {
    return pb
      .fetch(method, url)
      .then((response) => response.arrayBuffer())
      .catch((err) => err);
  };
}

export function startStopRefreshTimer(cmd, timeInMs) {
  return (dispatch, getState, { pb }) => {
    if (cmd == "start") {
      if (timerId == 0) {
        timerId = setTimeout(() => {
          dispatch(appRefresh());
        }, timeInMs);
      }
    } else {
      if (timerId) {
        clearTimeout(timerId);
        timerId = 0;
      }
    }
  };
}

export function closeSessionExpiredModalAction() {
  return (dispatch, getState, { pb }) => {
    var obj = pb.retrieveFromLocalStorage();
    if (pb.connect.props.nonce != obj.nonce) {
      if (timerId && pb.sessionExpired) {
        clearTimeout(timerId);
        timerId = 0;
        pb.sessionExpired = false;
      }
      dispatch({ type: SESSION_EXPIRED.REQUEST });
    }
  };
}

export function setFwUpdateProgressFlag(value) {
  return (dispatch, getState, { pb }) => {
    pb.firmwareUpgradeInProgress = value;
  };
}

export function setFwUpdateAbortFlag(value) {
  return (dispatch, getState, { pb }) => {
    pb.cancelClicked = value;
  };
}

//Common parameter meta object which gathers info from static meta file or dynamic values from device
function setParamMeta(channelId, channelMeta, t) {
  let prefix = channelId.split("[")[0] + ".",
    id = channelId,
    r = parseInt(channelMeta.r),
    w = parseInt(channelMeta.w),
    dataType = channelMeta.Datatype || channelMeta.datatype,
    format = channelMeta.format || channelMeta.Format,
    is_writable = w <= roleLevel && parseInt(channelMeta.PresentWR || channelMeta.presentWR) === 1,
    // init_writable = w <= roleLevel && parseInt(channelMeta.InitWR) === 1,
    // range_writable = w <= roleLevel && parseInt(channelMeta.RangeWR) === 1,
    length = parseInt(channelMeta.Length || channelMeta.length),
    name = t(`${prefix}sd`, {
      keySeparator: "^" /* ignore the '.' in the key */,
      defaultValue: t(channelMeta.Name || channelMeta.name) || ""
    }),
    units = t(`${prefix}u`, {
      keySeparator: "^" /* ignore the '.' in the key */,
      defaultValue: t(channelMeta.Units || channelMeta.units) || ""
    }),
    pattern = channelMeta.Pattern, // Not actually in the REST spec yet
    pattern_msg = t(`${prefix}p`, {
      keySeparator: "^" /* ignore the '.' in the key */,
      defaultValue:
        t(channelMeta.PatternMsg, {
          keySeparator: "^" /* ignore the '.' in the key */,
          nsSeparator: "^" /* ignore the ':' in the key */,
          defaultValue: channelMeta.PatternMsg || ""
        }) || ""
    }), // Not actually in the REST spec yet
    pImport = channelMeta.import,
    pExport = channelMeta.export;
  return {
    prefix,
    id,
    r,
    w,
    dataType,
    format,
    is_writable,
    //init_writable,
    //range_writable,
    length,
    name,
    units,
    pattern,
    pattern_msg,
    pImport,
    pExport
  };
}

//Common parameter short description value set using info from static meta file or dynamic value from device
function setParamDescription(id, desc, t) {
  let paramDescription = t(`${id}.ld`, {
    keySeparator: "^" /* ignore the '.' in the key */,
    defaultValue: t(desc, {
      keySeparator: "^" /* ignore the '.' in the key */,
      nsSeparator: "^" /* ignore the ':' in the key */,
      defaultValue: desc
    })
  });
  return paramDescription;
}

//Common parameter enum or bitfield description value set using info from static meta file or dynamic value from device
function setEnumOrBitDescription(id, val, desc, t, enumOrBit) {
  let description = t(`${id}.${enumOrBit}.${val}`, {
    keySeparator: "^" /* ignore the '.' in the key */,
    defaultValue: t(desc, {
      nsSeparator: "^" /* ignore the ':' in the key */,
      keySeparator: "^" /* ignore the '.' in the key */,
      defaultValue: desc
    })
  });
  return description;
}

//Common parameter pattern and pattern error message using the format value
function setPatternAndPatternMsg(format, units, length) {
  let pattern, pattern_msg;
  switch (format.split("(")[0]) {
    case "MAC_ADDRESS":
      pattern = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$";
      pattern_msg = "Must be a valid MAC address";
      break;
    case "HOST_ADDRESS":
      pattern =
        "^((?=[0-9.]+$)((25[0-5]|(2[0-4]|1[0-9])[0-9]|[1-9]?[0-9])\\.){3}(25[0-5]|(2[0-4]|1[0-9])[0-9]|[1-9]?[0-9])|([\\w]+[\\w.-]+[a-zA-Z\\d]))$";
      pattern_msg = "Must be a valid Hostname or IPv4 address";
      break;
    default:
      if (format.indexOf("IPV4") != -1 || units.match(/IP/i)) {
        if (length > 4) {
          pattern =
            "^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(,((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))*)$";
          pattern_msg = "Must be a valid comma separated IPv4 address list";
        } else {
          // Note the double \\ required in a string literal
          pattern = "^((?:(?:^|\\.)(?:2(?:5[0-5]|[0-4]\\d)|1?\\d?\\d)){4})$";
          pattern_msg = "Must be a valid IPv4 address";
        }
      }
  }
  return { pattern, pattern_msg };
}

export function openUserMenuOptionAction(menuOptionObj) {
  return (dispatch, getState, { pb }) => {
    dispatch({ type: OPEN_USER_MENU_OPTION, data: menuOptionObj });
  };
}

export function closeUserMenuOptionAction() {
  return (dispatch, getState, { pb }) => {
    dispatch({ type: CLOSE_USER_MENU_OPTION });
  };
}

export function setPageDetailView(title) {
  return (dispatch, getState, { pb }) => {
    dispatch({ type: SET_PAGE_DETAIL_VIEW, data: title });
  };
}
