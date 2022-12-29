import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Navigate, Link } from "react-router-dom";
import { connect } from "react-redux";

// Material-UI components
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";
import * as Colors from "@brightlayer-ui/colors";

const styles = (theme) => ({
  brandingPanel: {
    height: "100%",
    background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='89.75' height='51.78' viewBox='0 0 89.75 51.78'><path d='M46.88,24.17V0h-2V24.17L3,0H0V1.74H0V50.08H0v1.71H3.06L44.88,27.64V51.78h2V27.64L88.69,51.78h1.06V0h-1ZM2,50.08V1.73L43.88,25.91Zm87.74,0L47.88,25.91,89.75,1.73Z' fill='white' opacity='0.08'/></svg>"), 
            linear-gradient(135deg, #127cbf 0%,#094d9c 100%), 
            #007bc1`
  },
  buttonRow: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    flexWrap: "nowrap",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      flexDirection: "column-reverse",
      justifyContent: "center"
    }
  },
  card: {
    width: "600px",
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  first: {
    marginRight: theme.spacing(2)
  },
  flexrow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginBottom: theme.spacing(4)
  },
  form: {
    maxWidth: "70%",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%"
    }
  },
  formFields: {
    marginTop: theme.spacing(2)
  },
  link: {
    fontWeight: 600,
    color: theme.palette.primary["300"],
    "&:visited": {
      color: theme.palette.primary["300"]
    }
  },
  loginButton: {
    padding: "6px 16px",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  placeholderCyberSecurityLogo: {
    marginBottom: theme.spacing(2),
    height: "60px",
    width: "60px"
  },
  placeholderProductLogo: {
    height: "80px",
    width: "auto"
  },
  wrapper: {
    textAlign: "center"
  }
});

function Login(props) {
  const [state, setState] = useState({
    user: props.user || "",
    password: "",
    remember: props.rememberMe !== undefined ? props.rememberMe : true,
    error: ""
  });

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const oldfailedLogins = usePrevious(props.failedLogins);

  const _handleKeyPress = (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      _handleLogin();
    }
  };
  const _handleLogin = () => {
    if (canLogIn()) {
      props.onLogin(state.user, state.password);
    }
  };
  const canLogIn = () => {
    return validUser(state.user) && state.password.length > 0;
  };
  const validUser = (username) => {
    if (props.validateUsername) {
      return props.validateUsername(username);
    } else {
      return username.length > 0;
    }
  };
  useEffect(() => {
    if (oldfailedLogins !== props.failedLogins && props.failedLogins > 0) {
      setState((currentState) => ({ ...currentState, password: "", error: props.loginError }));
    }
  }, [oldfailedLogins, props.failedLogins, props.loginError]);

  const {
    classes,
    isLoggedIn,
    userLabel,
    redirectFrom,
    showRememberMe,
    registerURL,
    forgotPasswordURL,
    termsURL,
    privacyURL,
    getFixedT
  } = props;
  console.info("before getFixed(null,'login') " + props.t("Company or Product Logo"));
  const t = typeof getFixedT === "function" ? getFixedT(null, "login") : props.t;
  console.info("after  getFixed(null,'login') " + t("Company or Product Logo"));

  return isLoggedIn ? (
    <Navigate to={redirectFrom} />
  ) : (
    <Grid container alignItems="center" justifyContent="center" className={classes.brandingPanel}>
      <Paper className={classes.card}>
        {/* PLACEHOLDER IMAGE: please use the correct company or product logo here */}
        <img
          className={classes.placeholderProductLogo}
          src={props.productLogo}
          alt={t("Company or Product Logo")}
          border="0"
        />
        <div className={classes.form}>
          <Grid container direction="column" justifyContent="space-between">
            <TextField
              error={state.user && !validUser(state.user) ? true : false}
              id="email"
              label={t(userLabel)}
              className={classes.formFields}
              value={state.user}
              onChange={(evt) => setState({ ...state, user: evt.target.value })}
              margin="none"
              required
              inputProps={{ maxLength: 256 }}
              variant="standard"
            />
            <TextField
              // error={(state.password && loginError)}
              id="password"
              type="password"
              label={t("Password")}
              className={classes.formFields}
              value={state.password}
              onChange={(evt) => setState({ ...state, password: evt.target.value, error: "" })}
              onKeyPress={(evt) => _handleKeyPress(evt)}
              margin="none"
              required
              inputProps={{ maxLength: 256 }}
              variant="standard"
            />
            {state.error && (
              <Typography style={{ color: Colors.red[500] }} id="loginError">
                {t(state.error)}
              </Typography>
            )}
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className={classes.buttonRow}
            >
              {showRememberMe && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.remember}
                      onChange={(evt) => setState({ ...state, remember: evt.target.checked })}
                    />
                  }
                  label={t("Remember me")}
                />
              )}
              <Button
                id="loginButton"
                className={classes.loginButton}
                variant={canLogIn() ? "contained" : "text"}
                disabled={!canLogIn()}
                color="primary"
                style={showRememberMe ? {} : { width: "100%" }}
                onClick={() => _handleLogin()}
              >
                {t("Log In")}
              </Button>
            </Grid>
            {(registerURL || forgotPasswordURL) && (
              <Grid container className={classes.flexrow}>
                {registerURL && (
                  <Typography variant="body2">
                    <Link to={registerURL} className={classes.link + " " + classes.first}>
                      {t("Sign Up")}
                    </Link>
                  </Typography>
                )}
                {forgotPasswordURL && (
                  <Typography variant="body2">
                    <Link to={forgotPasswordURL} className={classes.link + " " + (registerURL ? "" : classes.first)}>
                      {t("Forgot Password?")}
                    </Link>
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </div>
        <div className={classes.wrapper}>
          {/* TODO PLACEHOLDER IMAGE: please use the correct cybersecurity certification logo here */}
          <img
            className={classes.placeholderCyberSecurityLogo}
            src={props.cybersecurityLogo}
            alt={t("Cybersecurity Badge")}
            border="0"
          />
          <Typography variant="body2" color={"inherit"}>
            {t("By logging in, you agree to the following:", {
              nsSeparator: "^" /* Ignore ':' */
            })}
            <br />
            {termsURL ? (
              <a className={classes.link} target="_blank" href={termsURL}>
                {t("Terms and Conditions.", {
                  keySeparator: "^" /* Ignore '.' */
                })}
              </a>
            ) : (
              t("Terms and Conditions.", {
                keySeparator: "^" /* Ignore '.' */
              })
            )}
            <span>
              &nbsp;&nbsp;
              {privacyURL ? (
                <a className={classes.link} target="_blank" href={privacyURL}>
                  {t("Privacy Policy.", {
                    keySeparator: "^" /* Ignore '.' */
                  })}
                </a>
              ) : (
                t("Privacy Policy.", {
                  keySeparator: "^" /* Ignore '.' */
                })
              )}
            </span>
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
}
Login.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  failedLogins: PropTypes.number.isRequired,
  loginError: PropTypes.string,
  userLabel: PropTypes.string,
  validateUsername: PropTypes.func,
  redirectFrom: PropTypes.object.isRequired,
  showRememberMe: PropTypes.bool,
  rememberMe: PropTypes.bool,
  registerURL: PropTypes.string,
  forgotPasswordURL: PropTypes.string,
  termsURL: PropTypes.string,
  privacyURL: PropTypes.string,
  cybersecurityLogo: PropTypes.string,
  productLogo: PropTypes.string
};
Login.defaultProps = {
  userLabel: "Username",
  validateUsername: (name) => name.length > 0,
  showRemember: false,
  loginError: "",
  cybersecurityLogo: "https://image.ibb.co/kzkCme/Logo_Samples2_91_min.jpg",
  productLogo: "https://image.ibb.co/nuN8Re/12.jpg"
};

const mapStateToProps = ({ i18n, t, getFixedT, auth }) => {
  return {
    i18n,
    t,
    getFixedT,
    user: auth.userName
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Login));
