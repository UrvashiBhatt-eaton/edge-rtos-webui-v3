import React from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import PasswordStrengthIndicator from "@brightlayer-ui/layouts/dist/px-components/PasswordStrengthIndicator";
import * as Colors from "@brightlayer-ui/colors";
import { withStyles } from "@mui/styles";
import Skeleton from "@mui/material/Skeleton";
import { Utilities } from "@brightlayer-ui/utilities";

const styles = () => ({
  dialogPaper: {
    maxHeight: "100%",
    minWidth: "360px"
  },
  closeIcon: { float: "right", padding: "4px" },
  buttonIcon: { marginRight: "5px" },
  deleteButton: { marginLeft: "16px" },
  skeletonIcon: { marginTop: 15, marginLeft: 15, marginBottom: 15 },
  skeletonTable: { marginBottom: 1 }
});

const Dialog = withStyles(styles)((props) => {
  const { classes, ...other } = props;
  return <MuiDialog classes={{ paperScrollPaper: classes.dialogPaper }} {...other}></MuiDialog>;
});

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.defaultUserState = {
      passwordFocused: false,
      passwordInvalid: false,
      passwordValidity: {
        minChar: null,
        number: null,
        letter: null,
        upperCase: null,
        lowerCase: null,
        specialCharacter: null,
        userName: null
      },
      userNameInvalidReason: "",
      userNameValidity: {
        minChar: null
      },
      passwordComplexity: 0,
      userRole: 0,
      resetAction: "1"
    };
    this.state = {
      users: [],
      drawerElementsmapping: {
        fullName: "",
        userName: "",
        pwdComplexity: "",
        pwdTimeoutDays: "",
        role: "",
        pwd: ""
      },
      editUserData: [],
      drawerStatus: false,
      dialogStatus: false,
      selectedButton: "",
      userRolesList: [],
      error: false,
      errTitle: "",
      errMsg: "",
      ...this.defaultUserState
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.selectUserRole = this.selectUserRole.bind(this);
    this.selectPasswordComplexity = this.selectPasswordComplexity.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.closeErrModal = this.closeErrModal.bind(this);
    this.resetDefaultAdminPwd = this.resetDefaultAdminPwd.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.editDrawerPopulate = this.editDrawerPopulate.bind(this);
    this.selectedResetAction = this.selectedResetAction.bind(this);
    this.getIdSuffix = this.getIdSuffix.bind(this);
  }

  async componentDidMount() {
    const payload = await this.props.dispatch(this.props.getUserDetails(this.props.t));
    this.setState({ users: payload[0], editUserData: payload[1] });
    const rolesList = this.props.dispatch(this.props.getRoles());
    rolesList.then((data) => this.setState({ userRolesList: data }));
  }

  openDrawer(e) {
    this.editDrawerPopulate(e);
    this.setState({
      drawerStatus: true,
      selectedButton: "editUser"
    });
  }

  openDialog(e) {
    this.setState({
      dialogStatus: true,
      selectedButton: e.currentTarget.value
    });
  }

  closeDrawer() {
    this.setState({
      drawerStatus: false,
      ...this.defaultUserState,
      drawerElementsmapping: {
        fullName: "",
        userName: "",
        pwdComplexity: "",
        pwdTimeoutDays: "",
        role: "",
        pwd: ""
      }
    });
  }

  closeDialog() {
    this.setState({
      dialogStatus: false,
      ...this.defaultUserState,
      drawerElementsmapping: {
        fullName: "",
        userName: "",
        pwdComplexity: "",
        pwdTimeoutDays: "",
        role: "",
        pwd: ""
      }
    });
  }

  handleKeyEvent(e) {
    if (e.key === "Escape") {
      this.state.selectedButton === "addUser" || this.state.selectedButton === "resetDefaultPassword"
        ? this.closeDialog()
        : this.closeDrawer();
    } else if (e.key === "Enter" && !this.disableSave) {
      if (this.state.selectedButton === "addUser") {
        this.createNewUser();
      } else if (this.state.selectedButton === "editUser") {
        this.editUser();
      } else if (this.state.selectedButton === "resetDefaultPassword") {
        this.resetDefaultAdminPwd();
      }
    }
  }
  selectedResetAction(event) {
    this.setState({ resetAction: event.target.value });
  }

  selectUserRole(event) {
    this.setState({
      userRole: event.target.value,
      drawerElementsmapping: {
        ...this.state.drawerElementsmapping,
        role: this.state.userRolesList[event.target.value]
      }
    });
  }

  selectPasswordComplexity(event) {
    this.setState({
      passwordComplexity: event.target.value,
      drawerElementsmapping: {
        ...this.state.drawerElementsmapping,
        pwdComplexity: event.target.value,
        pwd: ""
      },
      passwordValidity: {
        minChar: null,
        number: null,
        letter: null,
        upperCase: null,
        lowerCase: null,
        specialCharacter: null,
        userName: null
      }
    });
  }

  handleInputChange(e) {
    this.setState({
      drawerElementsmapping: {
        ...this.state.drawerElementsmapping,
        [e.target.name]: e.target.value
      }
    });
  }

  onChangePassword(password, pwdComplexity) {
    pwdComplexity = pwdComplexity.toString();
    this.setState({
      drawerElementsmapping: {
        ...this.state.drawerElementsmapping,
        pwd: password
      }
    });

    switch (pwdComplexity) {
      case "0":
        if (password) {
          this.setState(
            {
              passwordValidity: {
                minChar: /^.{6,}$/.test(password) ? true : false,
                number: null,
                letter: null,
                upperCase: null,
                lowerCase: null,
                specialCharacter: null,
                userName:
                  this.state.drawerElementsmapping.fullName != password &&
                  this.state.drawerElementsmapping.userName != password
              }
            },
            () => {
              if (this.state.passwordValidity.userName && this.state.passwordValidity.minChar) {
                this.setState({
                  passwordInvalid: false
                });
              } else {
                this.setState({
                  passwordInvalid: true
                });
              }
            }
          );
        }
        break;
      case "1":
        if (password != null) {
          this.setState(
            {
              passwordValidity: {
                minChar: /^.{8,}$/.test(password) ? true : false,
                number: /\d/.test(password) ? true : false,
                letter: /[a-zA-Z]/.test(password) ? true : false,
                upperCase: null,
                lowerCase: null,
                specialCharacter: null,
                userName:
                  this.state.drawerElementsmapping.fullName != password &&
                  this.state.drawerElementsmapping.userName != password
              }
            },
            () => {
              if (
                this.state.passwordValidity.userName &&
                this.state.passwordValidity.minChar &&
                this.state.passwordValidity.number &&
                this.state.passwordValidity.letter
              ) {
                this.setState({
                  passwordInvalid: false
                });
              } else {
                this.setState({
                  passwordInvalid: true
                });
              }
            }
          );
        }
        break;
      case "2":
        if (password != null) {
          this.setState(
            {
              passwordValidity: {
                minChar: /^.{12,}$/.test(password) ? true : false,
                number: /\d/.test(password) ? true : false,
                letter: /[a-zA-Z]/.test(password) ? true : false,
                upperCase: /[A-Z]/.test(password) ? true : false,
                lowerCase: null,
                specialCharacter: /[^a-zA-Z\d\s]/.test(password) ? true : false,
                userName:
                  this.state.drawerElementsmapping.fullName != password &&
                  this.state.drawerElementsmapping.userName != password
              }
            },
            () => {
              if (
                this.state.passwordValidity.userName &&
                this.state.passwordValidity.minChar &&
                this.state.passwordValidity.number &&
                this.state.passwordValidity.letter &&
                this.state.passwordValidity.upperCase &&
                this.state.passwordValidity.specialCharacter
              ) {
                this.setState({
                  passwordInvalid: false
                });
              } else {
                this.setState({
                  passwordInvalid: true
                });
              }
            }
          );
        }
        break;
      case "3":
        if (password != null) {
          this.setState(
            {
              passwordValidity: {
                minChar: /^.{16,}$/.test(password) ? true : false,
                number: /\d/.test(password) ? true : false,
                letter: /(?=(.*[A-Za-z]){2})/.test(password) ? true : false,
                upperCase: /[A-Z]/.test(password) ? true : false,
                lowerCase: /[a-z]/.test(password) ? true : false,
                specialCharacter: /(?=(.*[^a-zA-Z\d\s]){2})/.test(password) ? true : false,
                userName:
                  this.state.drawerElementsmapping.fullName != password &&
                  this.state.drawerElementsmapping.userName != password
              }
            },
            () => {
              if (
                this.state.passwordValidity.userName &&
                this.state.passwordValidity.minChar &&
                this.state.passwordValidity.number &&
                this.state.passwordValidity.letter &&
                this.state.passwordValidity.upperCase &&
                this.state.passwordValidity.specialCharacter &&
                this.state.passwordValidity.lowerCase
              ) {
                this.setState({
                  passwordInvalid: false
                });
              } else {
                this.setState({
                  passwordInvalid: true
                });
              }
            }
          );
        }
        break;
    }
  }

  onChangeUserName(userName) {
    if (userName) {
      const t = this.props.t;
      this.setState(
        {
          drawerElementsmapping: {
            ...this.state.drawerElementsmapping,
            userName: userName
          },
          userValidity: {
            minChar: /^.{5,}$/.test(userName) ? true : false
          }
        },
        () => {
          if (this.state.drawerElementsmapping.pwd != userName && this.state.userValidity.minChar) {
            this.setState({
              userNameInvalidReason: ""
            });
          } else {
            this.setState({
              userNameInvalidReason:
                this.state.drawerElementsmapping.pwd == userName
                  ? t("Must be different than the password")
                  : t("Too short")
            });
          }
        }
      );
    }
  }

  async createNewUser() {
    const t = this.props.t;
    this.state.drawerElementsmapping["pwdComplexity"] = this.state.passwordComplexity;
    this.state.drawerElementsmapping["role"] = this.state.userRole;

    const settings = {
      fullName: window.btoa(this.state.drawerElementsmapping.fullName),
      userName: window.btoa(this.state.drawerElementsmapping.userName),
      pwdComplexity: this.state.drawerElementsmapping.pwdComplexity,
      pwdTimeoutDays: this.state.drawerElementsmapping.pwdTimeoutDays,
      pwd: window.btoa(this.state.drawerElementsmapping.pwd),
      role: this.state.userRolesList[this.state.drawerElementsmapping.role],
      pwdSetEpochTime: Math.ceil(Date.now() / 1000)
    };

    await this.props
      .dispatch(this.props.createNewUserAction(settings, this.state.passwordComplexity, t))
      .then(() => {
        this.closeDialog();
      })
      .catch((msg) => {
        typeof msg === "string"
          ? this.setState({ error: true, errTitle: t("Error"), errMsg: t(msg) })
          : this.setState({
              error: true,
              errTitle: t(msg[0]),
              errMsg: t(msg[1])
            });
      });
    const payload = this.props.dispatch(this.props.getUserDetails(this.props.t));
    payload.then((data) => {
      this.setState({ users: data[0], editUserData: data[1] });
    });
  }

  editDrawerPopulate(e) {
    this.updateUserId = e.currentTarget.value;
    const a = this.state.drawerElementsmapping;
    const b = this.state.editUserData[e.currentTarget.value];
    Object.keys(a).forEach((i, index) => (a[i] = b[index]));
    this.setState({
      drawerElementsmapping: a,
      passwordComplexity: a["pwdComplexity"],
      userRole: this.state.userRolesList.indexOf(a["role"])
    });
    this.prevDrawerElements = this.state.drawerElementsmapping;
  }

  payloadForUpdateUser() {
    const t = this.props.t;
    const prevDrawerElements = Object.keys(this.prevDrawerElements);
    const currDrawerElements = Object.keys(this.state.drawerElementsmapping);
    let modifiedElements = [];

    prevDrawerElements.forEach((item) => {
      if (this.prevDrawerElements[item] !== this.state.drawerElementsmapping[item]) {
        modifiedElements.push(item);
      }
    });

    modifiedElements = modifiedElements.concat(currDrawerElements.filter((x) => !prevDrawerElements.includes(x)));
    modifiedElements = modifiedElements.filter((x) => x != "confirmPwd");
    modifiedElements = modifiedElements.filter((x) => x != "loggedInUserPwd");

    let payload = {};
    if (modifiedElements.length === 0) {
      this.setState({
        error: true,
        errTitle: t("Error"),
        errMsg: t("No changes to be saved")
      });
    } else {
      return Promise.all(
        modifiedElements.map((tag) => {
          return new Promise((resolve, _reject) => {
            if (tag === "fullName") {
              payload.fullName = window.btoa(this.state.drawerElementsmapping[tag]);
              resolve(payload);
            } else if (tag === "pwd") {
              if (
                this.state.drawerElementsmapping.loggedInUserPwd === "" ||
                this.state.drawerElementsmapping.loggedInUserPwd === undefined
              ) {
                this.setState({
                  error: true,
                  errTitle: t("Error"),
                  errMsg: t("Please enter the logged in user password")
                });
              } else {
                payload.loggedInUserPwd = window.btoa(this.state.drawerElementsmapping.loggedInUserPwd);
                payload.pwd = window.btoa(this.state.drawerElementsmapping.pwd);
                payload.pwdSetEpochTime = Math.ceil(Date.now() / 1000);
                resolve(payload);
              }
            } else if (tag === "pwdComplexity") {
              if (this.state.drawerElementsmapping.pwd === "" || this.state.drawerElementsmapping.pwd === undefined) {
                this.setState({
                  error: true,
                  errTitle: t("Error"),
                  errMsg: t("Please enter new password")
                });
              } else {
                payload.pwdComplexity = Number(this.state.drawerElementsmapping[tag]);
                resolve(payload);
              }
            } else if (tag === "pwdTimeoutDays") {
              payload.pwdTimeoutDays = Number(this.state.drawerElementsmapping[tag]);
              resolve(payload);
            } else {
              payload[tag] = this.state.drawerElementsmapping[tag];
              resolve(payload);
            }
          });
        })
      ).then(() => {
        return payload;
      });
    }
  }

  async editUser() {
    const t = this.props.t;
    let payload = await this.payloadForUpdateUser();
    if (payload !== undefined) {
      const loggedInUser = this.props.userName;
      const editUserName = this.state.drawerElementsmapping.userName;
      const refreshApp = loggedInUser === editUserName && payload.pwd ? true : false;
      await this.props
        .dispatch(
          this.props.updateUser(
            payload,
            this.updateUserId,
            this.state.passwordComplexity,
            this.props.t,
            refreshApp,
            editUserName
          )
        )
        .then(() => {
          this.closeDrawer();
        })
        .catch((msg) => {
          typeof msg === "string"
            ? this.setState({
                error: true,
                errTitle: t("Error"),
                errMsg: t(msg)
              })
            : this.setState({
                error: true,
                errTitle: msg[0],
                errMsg: t(msg[1])
              });
        });

      const userdisplay = this.props.dispatch(this.props.getUserDetails(this.props.t));
      userdisplay
        .then((data) => {
          this.setState({ users: data[0], editUserData: data[1] });
        })
        .catch((err) => {
          // Catching Exception!
          console.warn("user display: ", err);
        });
    }
  }

  resetDefaultAdminPwd() {
    const t = this.props.t;
    const resetActionArg = this.state.resetAction;
    this.props
      .dispatch(
        this.props.resetDefaultPwdAction(
          window.btoa(this.state.drawerElementsmapping.loggedInUserPwd),
          resetActionArg,
          t
        )
      )
      .then(() => {
        this.closeDialog();
      })
      .catch((msg) => this.setState({ error: true, errTitle: t("Error"), errMsg: t(msg) }));

    const payload = this.props.dispatch(this.props.getUserDetails(this.props.t));
    payload
      .then((data) => {
        this.setState({ users: data[0], editUserData: data[1] });
      })
      .catch((err) => {
        // Catching Exception!
        console.warn("user display: ", err);
      });
  }

  deleteUser(e) {
    const deleteId = e.currentTarget.value;
    const t = this.props.t;
    this.props
      .dispatch(this.props.deleteUser(deleteId, t))
      .catch((msg) => this.setState({ error: true, errTitle: t("Error"), errMsg: t(msg) }));
    const payload = this.props.dispatch(this.props.getUserDetails(this.props.t));
    payload.then((data) => {
      this.setState({ users: data[0], editUserData: data[1] });
    });
  }

  closeErrModal() {
    this.setState({ error: false });
  }

  getIdSuffix(index) {
    let suffix = "";
    switch (index) {
      case 0:
        suffix = "_fn";
        break;
      case 1:
        suffix = "_ro";
        break;
      case 2:
        suffix = "_un";
        break;
      case 3:
        suffix = "_ll";
        break;
      case 4:
        suffix = "_pd";
        break;
      default:
        break;
    }
    return suffix;
  }

  render() {
    const t = this.props.t,
      classes = this.props.classes,
      oCP = () => this.onChangePassword(this.state.drawerElementsmapping.pwd, this.state.passwordComplexity);
    const userForm = (
      <>
        <DialogTitle style={{ padding: "16px 24px 16px 24px" }}>
          <Typography
            variant="h6"
            style={{
              color: "#007BC1",
              fontWeight: "600"
            }}
          >
            {this.state.selectedButton === "resetDefaultPassword"
              ? t("Reset Default")
              : this.state.selectedButton === "editUser"
              ? t(this.state.drawerElementsmapping.fullName)
              : t("Add New User")}
            <IconButton
              onClick={
                this.state.selectedButton === "addUser" || this.state.selectedButton === "resetDefaultPassword"
                  ? this.closeDialog
                  : this.closeDrawer
              }
              className={classes.closeIcon}
            >
              <CloseIcon style={{ color: Colors.gray[500] }} />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: "0 0 0 0" }} dividers>
          <Grid container direction="column" style={{ height: "100%", flexWrap: "nowrap", width: "360px" }}>
            {(this.state.selectedButton === "editUser" && this.props.roleLevel === 99) ||
            this.state.selectedButton === "addUser" ? (
              <TextField
                margin="dense"
                required
                name="fullName"
                id="fullname"
                label={t("Full Name")}
                defaultValue={
                  this.state.selectedButton === "resetDefaultPassword"
                    ? this.props.fullName
                    : this.state.selectedButton === "editUser"
                    ? this.state.drawerElementsmapping.fullName
                    : ""
                }
                disabled={this.state.selectedButton === "resetDefaultPassword" ? true : false}
                InputProps={{ style: { color: "black" } }}
                variant="filled"
                style={{ margin: "16px 24px 0px 24px" }}
                onChange={(e) => {
                  setTimeout(oCP, 1);
                  return this.handleInputChange(e);
                }}
              />
            ) : (
              ""
            )}
            <TextField
              required
              margin="dense"
              name="userName"
              id="userName"
              label={t("User Name")}
              variant="filled"
              defaultValue={
                this.state.selectedButton === "resetDefaultPassword"
                  ? this.props.userName
                  : this.state.selectedButton === "editUser"
                  ? this.state.drawerElementsmapping.userName
                  : ""
              }
              disabled={
                this.state.selectedButton === "resetDefaultPassword" || this.state.selectedButton === "editUser"
                  ? true
                  : false
              }
              InputProps={{ style: { color: "black" } }}
              style={{ margin: "16px 24px 0px 24px" }}
              error={!!this.state.userNameInvalidReason}
              helperText={this.state.userNameInvalidReason}
              onChange={(e) => {
                setTimeout(oCP, 1);
                return this.onChangeUserName(e.target.value);
              }}
            />
            {this.state.selectedButton !== "resetDefaultPassword" ? (
              (this.state.selectedButton === "editUser" && this.props.roleLevel === 99) ||
              this.state.selectedButton === "addUser" ? (
                <FormControl variant="filled" margin="dense" style={{ margin: "16px 24px 0px 24px" }}>
                  <InputLabel>{t("Password Complexity")}</InputLabel>
                  <Select
                    id="passwordComplexity"
                    value={this.state.passwordComplexity}
                    onChange={this.selectPasswordComplexity}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {this.state.selectedButton !== "resetDefaultPassword" ? (
              <TextField
                required
                margin="dense"
                name="pwdTimeoutDays"
                type="number"
                id="pwdTimeout"
                label={t("Password Timeout Days")}
                variant="filled"
                style={{ margin: "16px 24px 0px 24px" }}
                defaultValue={
                  this.state.selectedButton === "editUser" ? this.state.drawerElementsmapping.pwdTimeoutDays : ""
                }
                onChange={this.handleInputChange}
                error={
                  this.state.drawerElementsmapping.pwdTimeoutDays < 0 ||
                  this.state.drawerElementsmapping.pwdTimeoutDays > 65535
                    ? (this.pwdTimeoutDaysExceed = true)
                    : (this.pwdTimeoutDaysExceed = false)
                }
                helperText={
                  this.pwdTimeoutDaysExceed
                    ? " " +
                      t("Range: min - max", {
                        defaultValue: "Range: 0 - 65535",
                        min: 0,
                        max: 65535,
                        nsSeparator: "^" /*ignore the ':' in the key */
                      })
                    : ""
                }
              />
            ) : (
              ""
            )}
            {this.state.selectedButton === "resetDefaultPassword" || this.state.selectedButton === "editUser" ? (
              <TextField
                margin="dense"
                required
                name="loggedInUserPwd"
                id="loggedInUserPwd"
                type="password"
                label={t("Current Logged-In Password")}
                variant="filled"
                style={{ margin: "16px 24px 0px 24px" }}
                onChange={this.handleInputChange}
              />
            ) : (
              " "
            )}
            {this.state.selectedButton !== "resetDefaultPassword" ? (
              <TextField
                required
                margin="dense"
                name="pwd"
                id="pwd"
                type="password"
                value={this.state.drawerElementsmapping.pwd}
                label={t("New Password")}
                variant="filled"
                style={{ margin: "16px 24px 0px 24px" }}
                onFocus={() => {
                  this.setState({
                    passwordFocused: true
                  });
                }}
                error={this.state.passwordInvalid}
                onChange={(e) => {
                  setTimeout(() => this.onChangeUserName(this.state.drawerElementsmapping.userName), 1);
                  return this.onChangePassword(e.target.value, this.state.passwordComplexity);
                }}
              />
            ) : (
              " "
            )}
            {this.state.passwordFocused ? (
              <PasswordStrengthIndicator
                t={t}
                validity={this.state.passwordValidity}
                PwdComplexity={this.state.passwordComplexity}
              />
            ) : (
              ""
            )}
            {this.state.selectedButton !== "resetDefaultPassword" ? (
              <TextField
                required
                margin="dense"
                name="confirmPwd"
                id="confirmPwd"
                type="password"
                label={t("Confirm Password")}
                variant="filled"
                style={{ margin: "16px 24px 0px 24px" }}
                error={
                  this.state.drawerElementsmapping.pwd !== this.state.drawerElementsmapping.confirmPwd &&
                  this.state.drawerElementsmapping.pwd !== ""
                    ? (this.passwordMismatch = true)
                    : (this.passwordMismatch = false)
                }
                onChange={this.handleInputChange}
              />
            ) : (
              ""
            )}
            {this.state.selectedButton !== "resetDefaultPassword" ? (
              (this.state.selectedButton === "editUser" && this.props.roleLevel === 99) ||
              this.state.selectedButton === "addUser" ? (
                <FormControl variant="filled" margin="dense" style={{ margin: "16px 24px 16px 24px" }}>
                  <InputLabel>{t("User Role")}</InputLabel>
                  <Select id="userRole" value={this.state.userRole} onChange={this.selectUserRole}>
                    {this.state.userRolesList.map((role, index) => (
                      <MenuItem key={index} value={index}>
                        {t(role)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {this.state.selectedButton === "resetDefaultPassword" ? (
              <FormControl variant="filled" margin="dense" style={{ margin: "16px 24px 16px 24px" }}>
                <InputLabel>{t("Reset Action")}</InputLabel>
                <Select id="resetActionDropdownBtn" value={this.state.resetAction} onChange={this.selectedResetAction}>
                  <MenuItem id="defaultAdminAccountMenuItem" value="1">
                    {t("Default Admin Account")}
                  </MenuItem>
                  <MenuItem id="allUserAccountsMenuItem" value="2">
                    {t("All User Accounts")}
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              ""
            )}
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: "24px 24px 24px 24px", justifyContent: "space-between" }}>
          <Button
            id="cancelDialogBtn"
            variant="outlined"
            color="primary"
            style={{ width: "40%" }}
            onClick={
              this.state.selectedButton === "addUser" || this.state.selectedButton === "resetDefaultPassword"
                ? this.closeDialog
                : this.closeDrawer
            }
          >
            {t("Cancel")}
          </Button>
          <Button
            id={this.state.selectedButton !== "resetDefaultPassword" ? "saveDialogBtn" : "resetDialogBtn"}
            autoFocus
            variant="contained"
            color="primary"
            style={{ width: "40%" }}
            disabled={
              (this.disableSave =
                this.state.selectedButton === "addUser" &&
                [
                  this.state.drawerElementsmapping.loggedInUserPwd,
                  this.state.drawerElementsmapping.userName,
                  this.state.drawerElementsmapping.fullName,
                  this.state.drawerElementsmapping.pwdTimeoutDays,
                  this.state.drawerElementsmapping.pwd
                ].indexOf("", undefined) > -1
                  ? true
                  : this.state.selectedButton === "editUser" && !this.state.drawerElementsmapping.fullName
                  ? true
                  : this.state.selectedButton === "resetDefaultPassword" &&
                    !this.state.drawerElementsmapping.loggedInUserPwd
                  ? true
                  : this.passwordMismatch ||
                    this.pwdTimeoutDaysExceed ||
                    this.state.passwordInvalid ||
                    !!this.state.userNameInvalidReason
                  ? true
                  : false)
            }
            onClick={() => {
              if (this.state.selectedButton === "addUser") {
                this.createNewUser();
              } else if (this.state.selectedButton === "editUser") {
                this.editUser();
              } else if (this.state.selectedButton === "resetDefaultPassword") {
                this.resetDefaultAdminPwd();
              }
            }}
          >
            {this.state.selectedButton !== "resetDefaultPassword" ? t("Save") : t("Reset")}
          </Button>
        </DialogActions>
      </>
    );

    return (
      <div style={{ background: "#ffffff" }}>
        {this.state.error ? (
          <ConfirmModal
            visible={this.state.error}
            title={t(this.state.errTitle)}
            description={t(this.state.errMsg)}
            onOk={this.closeErrModal}
          ></ConfirmModal>
        ) : (
          ""
        )}

        {Object.values(this.state.users).length !== 0 && !this.props.isLoading ? (
          <div>
            {this.props.roleLevel === 99 ? (
              <div>
                <Button
                  style={{ margin: "16px" }}
                  variant="contained"
                  color="primary"
                  id="addUserBtn"
                  value="addUser"
                  onClick={(e) => this.openDialog(e)}
                >
                  <AddCircleOutlineIcon fontSize="small" className={classes.buttonIcon} />
                  {t("Add")}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  id="resetBtn"
                  value="resetDefaultPassword"
                  onClick={(e) => this.openDialog(e)}
                >
                  <RotateLeftIcon fontSize="small" className={classes.buttonIcon} />
                  {t("Reset")}
                </Button>
              </div>
            ) : (
              ""
            )}
            <Drawer anchor="right" open={this.state.drawerStatus} onKeyDown={this.handleKeyEvent}>
              {userForm}
            </Drawer>
            <Dialog open={this.state.dialogStatus} onKeyDown={this.handleKeyEvent}>
              {userForm}
            </Dialog>
            <Paper variant="outlined">
              <TableContainer style={{ maxHeight: window.innerHeight - 260 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell id="umFullname">{t("Full Name")}</TableCell>
                      <TableCell id="umRole">{t("Role")}</TableCell>
                      <TableCell id="umUsername">{t("User Name")}</TableCell>
                      <TableCell id="umLastLogin">{t("Last Login")}</TableCell>
                      <TableCell id="umPwdChangeDue">{t("Password Change Due")}</TableCell>
                      <TableCell> </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(this.state.users).map((row, index1) => (
                      <TableRow key={index1} className="userManagementRow">
                        {row.map((item, index2) => {
                          return (
                            <TableCell
                              id={Object.values(this.state.users)[index1][2] + this.getIdSuffix(index2)}
                              key={index2}
                              component="th"
                              scope="row"
                            >
                              {t(item)}
                            </TableCell>
                          );
                        })}
                        <TableCell component="th" scope="row">
                          <Button
                            id={Object.values(this.state.users)[index1][2] + "_edit"}
                            variant="outlined"
                            color="primary"
                            onClick={this.openDrawer}
                            value={Object.keys(this.state.editUserData)[index1]}
                          >
                            <EditIcon fontSize="small" className={classes.buttonIcon} />
                            {t("Edit")}
                          </Button>
                          {this.props.roleLevel === 99 ? (
                            <Tooltip title={row[2] === this.props.userName ? t("Cannot delete yourself") : ""}>
                              <span>
                                <Button
                                  id={Object.values(this.state.users)[index1][2] + "_delete"}
                                  className={classes.deleteButton}
                                  variant="outlined"
                                  color="primary"
                                  value={Object.keys(this.state.users)[index1]}
                                  disabled={row[2] === this.props.userName ? true : false}
                                  onClick={this.deleteUser}
                                >
                                  <DeleteIcon fontSize="small" className={classes.buttonIcon} />
                                  {t("Delete")}
                                </Button>
                              </span>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        ) : (
          <>
            <span style={{ display: "flex" }}>
              <Skeleton animation="wave" variant="rect" height={32} width={100} className={classes.skeletonIcon} />
              <Skeleton animation="wave" variant="rect" height={32} width={120} className={classes.skeletonIcon} />
            </span>
            <Skeleton animation="wave" variant="rect" height={60} className={classes.skeletonTable} />
            <Skeleton animation="wave" variant="rect" height={60} className={classes.skeletonTable} />
          </>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.auth.user_id,
    userName: state.auth.userName,
    fullName: state.auth.fullName,
    roleLevel: state.auth.roleLevel,
    t: state.t,
    isLoading: state.loadingLanguageFile
  };
}
export default connect(mapStateToProps, Utilities.mapDispatchToProps)(withStyles(styles)(UserManagement));
