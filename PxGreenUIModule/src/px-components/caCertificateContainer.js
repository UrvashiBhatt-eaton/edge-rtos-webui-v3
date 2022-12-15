import React, { useState } from "react";
import Button from "@mui/material/Button";
import ConfirmModal from "@brightlayer-ui/layouts/dist/px-components/modal/confirmModal";
import { connect } from "react-redux";
import * as PXBColors from "@brightlayer-ui/colors";
import Skeleton from "@mui/material/Skeleton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

function CaCertificateContainer(props) {
  const [state, setState] = useState({
    error: false,
    modalDescription: ""
  });

  const downloadCertificate = () => {
    const t = props.t;
    let filename, certificate, blob, link, url;
    let promiseCertificateInfo = props.dispatch(props.fetchCertificateAction("GET", "/rs/certstore/cacert"));
    promiseCertificateInfo
      .then((response) => {
        filename = "cert.cer";
        certificate = response;
        blob = new Blob([certificate], {
          type: "application/x-x509-ca-cert"
        });
        if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, filename);
        } else {
          link = document.createElement("a");
          url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((err) => {
        if (err.status == 404) {
          setState({
            ...state,
            modalDescription: t("Certificate is not currently available.", { keySeparator: false /* ignore .*/ })
          });
        } else if (err.status === 422 && err.statusText === "SFU Session in Progress") {
          setState({
            ...state,
            modalDescription: t("Firmware update session in progress, please retry after some time.", {
              keySeparator: false /* ignore .*/
            })
          });
        } else {
          setState({ ...state, modalDescription: err.statusText });
        }
        setState({ ...state, error: true });
      });
  };

  const closeErrModal = () => {
    setState({ ...state, error: false });
  };

  const t = props.t;
  return (
    <ListItem title={t(props.title)}>
      <ListItemText
        primary={
          props.isLoading ? (
            <Skeleton variant="text" width={300} style={{ backgroundColor: PXBColors.gray[50] }} />
          ) : (
            t(props.title)
          )
        }
      />
      {props.isLoading ? (
        ""
      ) : (
        <div>
          <Button variant="outlined" color="primary" component="span" onClick={() => downloadCertificate()}>
            {t("Download Certificate")}
          </Button>
          {state.error && (
            <ConfirmModal
              visible={state.error}
              title={t("Alert")}
              description={state.modalDescription}
              onOk={() => closeErrModal()}
            />
          )}
        </div>
      )}
    </ListItem>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      return dispatch(action);
    }
  };
};

const mapStateToProps = ({ t, loadingLanguageFile }) => {
  return {
    t,
    isLoading: loadingLanguageFile
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CaCertificateContainer);
