import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as PXBColors from "@brightlayer-ui/colors";

class CustomLayout extends React.Component {
  render() {
    const { classes, circles, channelValues } = this.props;
    return (
      <div className={classes.main}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Custom
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.body}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            {circles.map((channel) => (
              <div
                key={channel}
                style={{
                  height: `${channelValues[channel] || 0}%`,
                  flex: "1 1 0px",
                  maxWidth: "50px",
                  borderRadius: "0px 0px 50px 50px",
                  background: PXBColors.blue["500"],
                  opacity: 0.2 + (channelValues[channel] / 100) * 0.8 || 0
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  main: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  body: {
    padding: theme.spacing(3),
    height: "100%",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  }
});

const mapStateToProps = ({ channelValues }) => {
  return {
    channelValues: channelValues || []
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    dispatch: (action) => {
      dispatch(action);
    }
  };
};

CustomLayout.propTypes = {
  classes: PropTypes.object,
  circles: PropTypes.array,
  channelValues: PropTypes.object
};
CustomLayout.defaultProps = {
  classes: {},
  circles: [],
  channelValues: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomLayout));
