import React from "react";
import { connect } from "react-redux";

// Material Components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function HttpDisabledModal(props) {
  const { isHttpDisabled, refreshAction, dispatch, t } = props;

  return (
    <Dialog open={isHttpDisabled}>
      <DialogTitle style={{ paddingBottom: 8 }}>{t("Alert")}</DialogTitle>
      <DialogContent style={{ paddingBottom: 0 }}>
        <Typography id="httpDisabledText" variant="body1">
          {t("Http is disabled, please reload the app to use Https mode.", {
            keySeparator: "^" /* Ignore '.' */
          })}
        </Typography>
      </DialogContent>
      <DialogActions style={{ margin: "20px 16px" }}>
        <Button id="reloadBtn" variant={"outlined"} color="primary" onClick={() => dispatch(refreshAction())}>
          {t("Reload")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = ({ paramMeta, channelValues, auth, t }) => {
  return {
    paramMeta,
    channelValues,
    isHttpDisabled: auth.isHttpDisabled,
    t
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HttpDisabledModal);
