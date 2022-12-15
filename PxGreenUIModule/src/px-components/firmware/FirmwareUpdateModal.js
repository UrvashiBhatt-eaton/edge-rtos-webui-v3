import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import HighlightOff from "@mui/icons-material/HighlightOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import MuiTableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";

import * as PXBColors from "@brightlayer-ui/colors";
import FirmwareBottomSheet from "./FirmwareCodepackBottomSheet";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: PXBColors.black[700],
    color: PXBColors.white[50]
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: PXBColors.gray[500] //theme.palette.grey[500]
  }
});

const TableCell = withStyles({
  root: {
    borderBottom: "none",
    padding: 0
  }
})(MuiTableCell);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      disabletypography
      className={classes.root}
      {...other}
      style={{ backgroundColor: PXBColors.black[700] }}
    >
      <Typography variant="h6" style={{ color: PXBColors.white[50] }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const FwUpdateLinearProgress = withStyles((theme) => ({
  root: {
    height: "8px",
    borderRadius: "4px",
    backgroundColor: PXBColors.gray[300]
  },
  bar: {
    borderRadius: "4px",
    backgroundColor: PXBColors.blue[500]
  }
}))(LinearProgress);

const ErrorLinearProgress = withStyles((theme) => ({
  root: {
    height: "8px",
    borderRadius: "4px",
    backgroundColor: PXBColors.gray[300]
  },
  bar: {
    borderRadius: "4px",
    backgroundColor: PXBColors.red[500]
  }
}))(LinearProgress);

function FirmwareUpdateModal(props) {
  const getImageUpdateInfo = () => {
    const { imageNum, totalImgCount, t } = props;

    return (
      <div>
        <Typography variant="body2" color={"inherit"}>
          {t("imageNum of totalImgCount images will be updated.", {
            defaultValue: `${imageNum} of ${totalImgCount} images will be updated.`,
            keySeparator: "^" /* ignore the '.' in the key */,
            imageNum: imageNum,
            totalImgCount: totalImgCount
          })}
        </Typography>
      </div>
    );
  };

  const getDialogActionsBeforeUpdate = () => {
    const { handleCancel, handleRunUpdates, imageNum, imageData, parentImageNumUpdate } = props;

    return (
      <DialogActions>
        <FirmwareBottomSheet
          data={imageData}
          handleCancel={handleCancel}
          handleRunUpdates={handleRunUpdates}
          imageNum={imageNum}
          parentImageNumUpdate={parentImageNumUpdate}
        />
      </DialogActions>
    );
  };

  const getDialogActionsDuringUpdate = () => {
    const { handleCancel, isFwUpdateComplete, t, enableAbort, cancelFirmwareUpdate } = props;
    return (
      <DialogActions>
        <Button
          onClick={() => {
            if (!isFwUpdateComplete) {
              cancelFirmwareUpdate();
            } else {
              handleCancel();
            }
          }}
          disabled={enableAbort}
          color="primary"
        >
          {!isFwUpdateComplete
            ? enableAbort
              ? t("Please wait...", { keySeparator: "^" /* Ignore '.' */ })
              : t("Abort")
            : t("Continue")}
        </Button>
      </DialogActions>
    );
  };

  const getProgressBar = () => {
    const { fwImgUploadList, t } = props;

    return fwImgUploadList.map((image) => (
      <div key={image.imageName} style={{ marginTop: "10px", marginBottom: "10px" }}>
        <div style={{ alignItems: "center", display: "flex" }}>
          <div style={{ width: "40%" }}>{image.imageName}</div>
          <div style={{ width: "50%", paddingLeft: "10px" }}>
            {image.isImageUploadError ? (
              <ErrorLinearProgress variant="determinate" value={image.progress} />
            ) : (
              <Tooltip
                title={
                  <span style={{ fontSize: "0.875rem" }}>
                    {image.progressMsg == undefined ? "" : image.progressMsg}
                  </span>
                }
                open={image.progressMsg != undefined}
                arrow
              >
                <FwUpdateLinearProgress variant="determinate" value={image.progress} />
              </Tooltip>
            )}
          </div>
          <div style={{ width: "10%", paddingLeft: "10px" }}>
            {image.isImageUploadSuccess && (
              <Tooltip title={t(image.isImageUpdateErrorMsg)}>
                <CheckCircle id="successTick" style={{ color: PXBColors.green["500"] }} />
              </Tooltip>
            )}
            {image.isImageUploadError && (
              <Tooltip title={t(image.isImageUpdateErrorMsg)}>
                <HighlightOff id="errorCross" color="error" />
              </Tooltip>
            )}
          </div>
        </div>
        {image.isImageUploadError && <div>{image.isImageUpdateErrorMsg}</div>}
      </div>
    ));
  };
  const { open, isUpdateRunning, t } = props;

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth="sm" style={{ zIndex: 1100 }}>
        <DialogTitle>{t("Firmware Update")}</DialogTitle>
        <DialogContent style={{ paddingTop: 20 }}>
          {isUpdateRunning ? getProgressBar() : getImageUpdateInfo()}
        </DialogContent>
        <Divider />
        {isUpdateRunning ? getDialogActionsDuringUpdate() : getDialogActionsBeforeUpdate()}
      </Dialog>
    </div>
  );
}

FirmwareUpdateModal.defaultProps = {
  open: false,
  imageNum: 0,
  totalImgCount: 0,
  currentImgNum: 0,
  isUpdateRunning: false,
  fwImgUploadList: [],
  isFwUpdateComplete: false,
  enableAbort: true
};
FirmwareUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  imageNum: PropTypes.number,
  totalImgCount: PropTypes.number,
  currentImgNum: PropTypes.number,
  isUpdateRunning: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleRunUpdates: PropTypes.func,
  imageData: PropTypes.array,
  parentImageNumUpdate: PropTypes.func,
  cancelFirmwareUpdate: PropTypes.func,
  fwImgUploadList: PropTypes.array,
  isFwUpdateComplete: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    t: state.t
  };
};
export default connect(mapStateToProps)(FirmwareUpdateModal);
