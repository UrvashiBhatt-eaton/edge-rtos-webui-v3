import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CustomTable from "./CustomTable";
import Skeleton from "@mui/material/Skeleton";

class CustomTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };

    this.subscriber_id = "TableContainer_" + new Date().getTime();
    if (props.addRealtimeAction) {
      props.dispatch(props.addRealtimeAction(props.tableConfig, this.subscriber_id));
    }

    var missingMeta = props.tableConfig.some((channel) => {
      if (!props.channelData || !props.channelData[channel]) {
        return true;
      }
    });

    if (props.loadMetaAction && missingMeta && !props.isLoading) {
      props.dispatch(props.loadMetaAction(props.tableConfig, props.t));
    }
  }

  componentWillUnmount() {
    let { props, subscriber_id } = this;
    if (props.removeRealtimeAction) {
      props.dispatch(props.removeRealtimeAction(props.tableConfig, subscriber_id));
    }
  }

  componentDidUpdate(prevProps) {
    let { tableConfig, channelData, channelValues } = this.props;

    let isChannelData = tableConfig.every((id) => {
      return channelData[id] != undefined;
    });

    let isChannelDataUpdated = tableConfig.some((id) => {
      return prevProps.channelData[id] != channelData[id];
    });

    let isChannelValues = tableConfig.every((id) => {
      return channelValues[id] != undefined;
    });

    let isChannelValuesUpdated = tableConfig.some((id) => {
      return prevProps.channelValues[id] != channelValues[id];
    });

    if (isChannelData && isChannelValues && (isChannelValuesUpdated || isChannelDataUpdated)) {
      this.getTableData();
    }
  }

  getTableData() {
    let { tableConfig, delimiter, channelData, channelValues } = this.props;
    let newList = [];
    let maxRowCount = 0;
    let headerData = [];
    let rowData = [];

    if (tableConfig.length > 0 && channelValues && channelData) {
      for (let i = 0; i < tableConfig.length; i++) {
        let paramCellData = channelValues[tableConfig[i]].split(delimiter);
        let paramUnit = channelData[tableConfig[i]].units ? " (" + channelData[tableConfig[i]].units + ")" : "";
        let headerName = channelData[tableConfig[i]].name + paramUnit;
        newList.push({
          paramCellData,
          enumData: channelData[tableConfig[i]].multistate_maps ? channelData[tableConfig[i]].multistate_maps : null
        });
        headerData.push(headerName);
        if (paramCellData.length > maxRowCount) {
          maxRowCount = paramCellData.length;
        }
      }

      for (let x = 0; x < maxRowCount; x++) {
        let arry = [];
        for (let y = 0; y < newList.length; y++) {
          if (newList[y].enumData) {
            let val = newList[y].enumData[newList[y].paramCellData[x]];
            arry.push(val);
          } else {
            arry.push(newList[y].paramCellData[x]);
          }
        }
        rowData.push(arry);
      }
      this.setState({ tableData: [headerData, rowData] });
    }
  }

  render() {
    let { tableData } = this.state;

    return tableData.length > 0 ? (
      <CustomTable data={tableData} />
    ) : (
      <div style={{ padding: "8px 16px 8px 16px" }}>
        <Skeleton animation="wave" variant="rect" height={20} style={{ marginBottom: 2 }} />
        <Skeleton animation="wave" variant="rect" height={20} style={{ marginBottom: 2 }} />
        <Skeleton animation="wave" variant="rect" height={20} style={{ marginBottom: 2 }} />
      </div>
    );
  }
}

CustomTableContainer.propTypes = {
  tableConfig: PropTypes.array,
  loadMetaAction: PropTypes.func,
  addRealtimeAction: PropTypes.func,
  removeRealtimeAction: PropTypes.func
};

const mapStateToProps = ({ channelData, channelValues, loadingLanguageFile, t }) => {
  return {
    channelData,
    channelValues,
    t,
    isLoading: loadingLanguageFile
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    dispatch: (action) => {
      dispatch(action);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTableContainer);
