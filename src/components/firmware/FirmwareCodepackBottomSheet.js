import React from "react";
import { withStyles } from "@mui/styles";
import { connect } from "react-redux";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MuiTableCell from "@mui/material/TableCell";
import * as PXBColors from "@brightlayer-ui/colors";

function FirmwareCodepackBottomSheet(props) {
  const t = props.t;
  const [state, setState] = React.useState({
    bottom: false,
    data: props.data
  });

  const [objs, setObjects] = React.useState(props.data);

  const [fwImgUpdateList, setFwImgUpdateList] = React.useState();

  const fwList = [];

  const TableCell = withStyles({
    root: {
      borderBottom: "none"
    }
  })(MuiTableCell);

  const toggleDrawer = (side, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const handleCheckboxChange = (e, obj, index) => {
    const value = e.target.checked;
    setObjects((prevObjs) =>
      prevObjs.map((o) => {
        if (o === obj) return { ...obj, isUpdateRequired: value };
        return o;
      })
    );
  };

  const updateFwList = (list, side, open) => (event) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].isUpdateRequired) {
        fwList.push(list[i]);
      }
    }

    setFwImgUpdateList(fwList);
    setState({ ...state, [side]: open });
    props.parentImageNumUpdate(fwList.length);
  };
  const handleKeyEvent = (e) => {
    if (e.key === "Escape") {
      props.handleCancel();
    }
  };

  return (
    <div>
      <DialogActions onKeyDown={handleKeyEvent}>
        <Button onClick={toggleDrawer("bottom", true)}>{t("Select Component")}</Button>
        <Button onClick={props.handleCancel}>{t("Cancel")}</Button>
        <Button
          variant="contained"
          onClick={() => props.handleRunUpdates(fwImgUpdateList)}
          disabled={props.imageNum == 0}
          color="primary"
          autoFocus
        >
          {t("Install Updates")}
        </Button>
      </DialogActions>

      <Drawer anchor="bottom" open={state.bottom}>
        {/* {fullList('bottom')} */}

        <AppBar position="static">
          <Toolbar style={{ backgroundColor: PXBColors.black[700] }}>
            <Typography variant="h6" style={{ color: PXBColors.white[50] }}>
              {t("Firmware / Code Pack Evaluation")}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent style={{ padding: 0 }}>
          <Table>
            <TableHead>
              <TableRow style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <TableCell>{/* dummy space */}</TableCell>
                <TableCell padding="none">{t("Component")}</TableCell>
                <TableCell>{t("Image")}</TableCell>
                <TableCell>{t("File Ver")}</TableCell>
                <TableCell>{t("Device Ver")}</TableCell>
                <TableCell>{t("Hardware Ver")}</TableCell>
                <TableCell>{t("Compatibility")}</TableCell>
                <TableCell>{t("Status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objs.map((image, index) => (
                <TableRow key={image.imageName} className="codepackRow">
                  <TableCell style={{ width: "4%", padding: "0 0 0 10px" }}>
                    <Checkbox
                      name={image.imageName}
                      checked={image.isUpdateRequired}
                      disabled={image.isfwUpdateCheckBoxDisabled}
                      onChange={(e) => handleCheckboxChange(e, image, index)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {image.processorName}
                  </TableCell>
                  <TableCell>{image.imageName}</TableCell>
                  <TableCell>{image.filever}</TableCell>
                  <TableCell>{image.imageVer}</TableCell>
                  <TableCell>{image.deviceHardwareVer}</TableCell>
                  <TableCell>{image.compatibility}</TableCell>
                  <TableCell>{image.statusMsg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>

        <Divider />
        <DialogActions>
          <Button variant="contained" onClick={updateFwList(objs, "bottom", false)} color="primary">
            {t("OK")}
          </Button>
        </DialogActions>
      </Drawer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    t: state.t
  };
};
export default connect(mapStateToProps)(FirmwareCodepackBottomSheet);
