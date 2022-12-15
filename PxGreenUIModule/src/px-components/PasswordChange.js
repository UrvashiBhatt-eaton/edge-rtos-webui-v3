import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import * as Colors from "@brightlayer-ui/colors";
import PasswordStrengthIndicator from "@brightlayer-ui/layouts/dist/px-components/PasswordStrengthIndicator";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";

function PasswordChange(props) {
  const [state, setState] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: false,
    errMsg: "",
    errTitle: "",
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
    }
  });

  useEffect(() => {
    if (
      state.passwordValidity.minChar ||
      state.passwordValidity.userName ||
      state.passwordValidity.number ||
      state.passwordValidity.letter ||
      state.passwordValidity.upperCase ||
      state.passwordValidity.specialCharacter ||
      state.passwordValidity.lowerCase
    ) {
      if (state.passwordValidity.minChar && state.passwordValidity.userName) {
        setState({
          ...state,
          passwordInvalid: false
        });
      } else if (
        state.passwordValidity.minChar &&
        state.passwordValidity.number &&
        state.passwordValidity.letter &&
        state.passwordValidity.userName
      ) {
        setState({
          ...state,
          passwordInvalid: false
        });
      } else if (
        state.passwordValidity.minChar &&
        state.passwordValidity.userName &&
        state.passwordValidity.number &&
        state.passwordValidity.letter &&
        state.passwordValidity.upperCase &&
        state.passwordValidity.specialCharacter
      ) {
        setState({
          ...state,
          passwordInvalid: false
        });
      } else if (
        state.passwordValidity.minChar &&
        state.passwordValidity.userName &&
        state.passwordValidity.number &&
        state.passwordValidity.letter &&
        state.passwordValidity.upperCase &&
        state.passwordValidity.specialCharacter &&
        state.passwordValidity.lowerCase
      ) {
        setState({
          ...state,
          passwordInvalid: false
        });
      } else {
        setState({
          ...state,
          passwordInvalid: true
        });
      }
    }
  }, [
    state.passwordValidity.minChar,
    state.passwordValidity.userName,
    state.passwordValidity.number,
    state.passwordValidity.letter,
    state.passwordValidity.upperCase,
    state.passwordValidity.specialCharacter,
    state.passwordValidity.lowerCase
  ]);

  const onChangePassword = (password, pwdComplexity) => {
    let pwdComplexitySwitch = pwdComplexity.toString();
    switch (pwdComplexitySwitch) {
      case "0":
        if (password != null) {
          setState({
            ...state,
            newPassword: password,
            passwordValidity: {
              minChar: /^.{6,}$/.test(password) ? true : false,
              number: null,
              letter: null,
              upperCase: null,
              lowerCase: null,
              specialCharacter: null,
              userName: props.userName != password && props.fullName != password
            }
          });
        }
        break;
      case "1":
        if (password != null) {
          setState({
            ...state,
            newPassword: password,
            passwordValidity: {
              minChar: /^.{8,}$/.test(password) ? true : false,
              number: /\d/.test(password) ? true : false,
              letter: /[a-zA-Z]/.test(password) ? true : false,
              upperCase: null,
              lowerCase: null,
              specialCharacter: null,
              userName: props.userName != password && props.fullName != password
            }
          });
        }
        break;
      case "2":
        if (password != null) {
          setState({
            ...state,
            newPassword: password,
            passwordValidity: {
              minChar: /^.{12,}$/.test(password) ? true : false,
              number: /\d/.test(password) ? true : false,
              letter: /[a-zA-Z]/.test(password) ? true : false,
              upperCase: /[A-Z]/.test(password) ? true : false,
              lowerCase: null,
              specialCharacter: /[^a-zA-Z\d\s]/.test(password) ? true : false,
              userName: props.userName != password && props.fullName != password
            }
          });
        }
        break;
      case "3":
        if (password != null) {
          setState({
            ...state,
            newPassword: password,
            passwordValidity: {
              minChar: /^.{16,}$/.test(password) ? true : false,
              number: /\d/.test(password) ? true : false,
              letter: /(?=(.*[A-Za-z]){2})/.test(password) ? true : false,
              upperCase: /[A-Z]/.test(password) ? true : false,
              lowerCase: /[a-z]/.test(password) ? true : false,
              specialCharacter: /(?=(.*[^a-zA-Z\d\s]){2})/.test(password) ? true : false,
              userName: props.userName != password && props.fullName != password
            }
          });
        }
        break;
    }
  };

  const handleKeyEvent = (e) => {
    if (e.key === "Escape") {
      props.onClose();
    } else if (e.key === "Enter" && !OKDisable) {
      dispatchData(e);
    }
  };

  const loggedInUserPwd = () => {
    return window.btoa(state.currPassword);
  };

  const newPwd = () => {
    return window.btoa(state.newPassword);
  };

  const theDate = () => {
    return Math.floor(new Date().getTime() / 1000.0);
  };

  const handleInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const dispatchData = (event) => {
    event.preventDefault();
    const settings = {
        currentPwd: loggedInUserPwd(),
        newPwd: newPwd(),
        date: theDate()
      },
      t = props.t;
    props.dispatch(props.changePassword(settings, props.user_id, t)).catch((msg) => {
      typeof msg === "string"
        ? setState({ ...state, error: true, errTitle: t("Error"), errMsg: t(msg) })
        : setState({
            ...state,
            error: true,
            errTitle: t(msg[0]),
            errMsg: t(msg[1])
          });
    });
  };

  const closeErrModal = () => {
    setState({ ...state, error: false });
  };

  const { classes, t, id, className } = props;
  let passwordMismatch;
  let OKDisable;
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
      <Dialog open={props.visible} onKeyDown={(e) => handleKeyEvent(e)}>
        <DialogTitle style={{ padding: "16px 24px 16px 24px" }} disableTypography>
          <Typography
            variant="h6"
            style={{
              color: "#007BC1",
              fontWeight: "600"
            }}
          >
            {t(props.title)}
            <IconButton aria-label="close" onClick={props.onClose} className={classes.icon}>
              <CloseIcon style={{ color: Colors.gray[500] }} />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: "0 0 0 0" }} dividers>
          <Grid
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", flexWrap: "nowrap", width: "360px" }}
          >
            <TextField
              label={t("User Name")}
              margin="dense"
              value={props.userName}
              InputProps={{ style: { color: "black" } }}
              variant="filled"
              style={{ margin: "16px 24px 0px 24px" }}
            ></TextField>
            <TextField
              margin="dense"
              InputProps={{ style: { color: "black" } }}
              variant="filled"
              style={{ margin: "16px 24px 0px 24px" }}
              required
              type="password"
              name="currPassword"
              label={t("Current Password")}
              onChange={(e) => handleInputChange(e)}
            ></TextField>
            <TextField
              required
              margin="dense"
              InputProps={{ style: { color: "black" } }}
              variant="filled"
              style={{ margin: "16px 24px 0px 24px" }}
              type="password"
              name="newPassword"
              label={t("New Password")}
              onFocus={() => {
                setState({
                  ...state,
                  passwordFocused: true
                });
              }}
              error={state.passwordInvalid}
              onChange={(e) => onChangePassword(e.target.value, props.passwordComplexity)}
            ></TextField>
            {state.passwordFocused ? (
              <PasswordStrengthIndicator
                t={t}
                validity={state.passwordValidity}
                PwdComplexity={props.passwordComplexity}
              />
            ) : (
              ""
            )}
            <TextField
              margin="dense"
              InputProps={{ style: { color: "black" } }}
              variant="filled"
              style={{ margin: "16px 24px 0px 24px" }}
              required
              error={
                state.newPassword !== state.confirmPassword && state.newPassword !== ""
                  ? (passwordMismatch = true)
                  : (passwordMismatch = false)
              }
              type="password"
              name="confirmPassword"
              label={t("Confirm Password")}
              onChange={(e) => handleInputChange(e)}
              placeholder={t("Re-enter new password")}
            ></TextField>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: "24px 24px 24px 24px", justifyContent: "space-between" }}>
          <Button variant="outlined" color="primary" style={{ width: "40%" }} type="button" onClick={props.onClose}>
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "40%" }}
            type="submit"
            disabled={
              passwordMismatch == true ||
              state.currPassword === "" ||
              state.confirmPassword === "" ||
              state.newPassword === "" ||
              state.passwordInvalid
                ? (OKDisable = true)
                : (OKDisable = false)
            }
            onClick={dispatchData}
          >
            {t("OK")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

PasswordChange.propTypes = {
  changePassword: PropTypes.func.isRequired,
  appLogout: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired
};

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

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      return dispatch(action);
    }
  };
};
function mapStateToProps(state) {
  return {
    userName: state.auth.userName,
    fullName: state.auth.fullName,
    user_id: state.auth.user_id,
    passwordComplexity: state.auth.passwordComplexity,
    t: state.t
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PasswordChange));
