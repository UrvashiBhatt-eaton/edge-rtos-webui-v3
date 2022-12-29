import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoginLayout from "./LoginLayout";
import { Utilities } from "@brightlayer-ui/utilities";

const mapStateToProps = ({ auth, i18n }) => {
  return {
    isLoggedIn: auth.isLoggedIn,
    failedLogins: auth.failedLogins,
    rememberMe: auth.remember,
    errorMsg: auth.errorMsg,
    i18n
  };
};

function LoginContainer(props) {
  const {
    dispatch,
    isLoggedIn,
    loginAction,
    failedLogins,
    userLabel,
    validateUsername,
    errorMsg,
    showRememberMe,
    rememberMe,
    registerURL,
    forgotPasswordURL,
    termsURL,
    privacyURL,
    location,
    productLogo,
    cybersecurityLogo,
    i18n
  } = props;
  const { from } = location && location.state ? location.state : { from: { pathname: "/" } };

  return (
    <LoginLayout
      isLoggedIn={isLoggedIn}
      onLogin={(user, pass) => dispatch(loginAction(user, pass, i18n))}
      loginError={errorMsg}
      failedLogins={failedLogins}
      userLabel={userLabel}
      validateUsername={validateUsername}
      redirectFrom={from}
      showRememberMe={showRememberMe}
      rememberMe={rememberMe}
      registerURL={registerURL}
      forgotPasswordURL={forgotPasswordURL}
      termsURL={termsURL}
      privacyURL={privacyURL}
      productLogo={productLogo}
      cybersecurityLogo={cybersecurityLogo}
    />
  );
}

LoginContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loginAction: PropTypes.func.isRequired,
  failedLogins: PropTypes.number.isRequired,
  userLabel: PropTypes.string,
  validateUsername: PropTypes.func,
  showRememberMe: PropTypes.bool,
  registerURL: PropTypes.string,
  forgotPasswordURL: PropTypes.string,
  termsURL: PropTypes.string,
  privacyURL: PropTypes.string,
  errorMsg: PropTypes.string,
  productLogo: PropTypes.string,
  cybersecurityLogo: PropTypes.string
};
LoginContainer.defaultProps = {};

export default connect(mapStateToProps, Utilities.mapDispatchToProps)(LoginContainer);
