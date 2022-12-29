import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MuiDialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Spacer } from "@brightlayer-ui/react-components/core/Utility";
import LocaleChange from "./localeChange";

function LocalizationModal(props) {
  const {
      writeSettingValue,
      t,
      mode,
      addRealtimeAction,
      removeRealtimeAction,
      languageFileDownloadAction,
      id,
      className
    } = props,
    title = t(props.title);
  return (
    <div>
      {mode === "Normal" ? (
        <div>
          <AppBar position="static" color="primary" style={{ flex: "0 0 auto" }}>
            <Toolbar>
              <Typography variant="h6" color="inherit">
                {title}
              </Typography>
              <Spacer flex={1} />
              {props.children}
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        ""
      )}
      <Dialog open={props.visible}>
        <LocaleChange
          id={id}
          className={className}
          addRealtimeAction={addRealtimeAction}
          removeRealtimeAction={removeRealtimeAction}
          languageFileDownloadAction={languageFileDownloadAction}
          mode={mode}
          writeSettingValue={writeSettingValue}
          onClose={props.onClose}
        />
      </Dialog>
    </div>
  );
}
LocalizationModal.propTypes = {
  writeSettingValue: PropTypes.func.isRequired
};

const styles = () => ({
  dialogPaper: {
    minWidth: "360px"
  }
});

const Dialog = withStyles(styles)((props) => {
  const { classes, ...other } = props;
  return <MuiDialog classes={{ paperScrollPaper: classes.dialogPaper }} {...other}></MuiDialog>;
});

const mapStateToProps = (state) => {
  return {
    t: state.t
  };
};

export default connect(mapStateToProps)(withStyles(styles)(LocalizationModal));
