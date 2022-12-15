import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@brightlayer-ui/green-core/dist/redux/store";
import { appPages } from "./configuration/appPages";
import { /*CHANNEL_COUNT,*/ REFRESH_MS, CHANNEL_URI_MAX_SIZE } from "./constants/constants";
import GreenSeed from "@brightlayer-ui/green-core";
import PB from "@brightlayer-ui/green-core/dist/communication/pb";
import raw_to_readable from "./format_handling/raw_to_readable";
import readable_to_raw from "./format_handling/readable_to_raw";
import Custom from "./layouts/Custom";
import EulaContent from "./layouts/eulaContent";
import { RTLThemeProvider } from "./RTLThemeProvider.tsx";
import "./index.css";
//import productLogo from "./assets/images/product_logo.jpg";

const customTemplates = {
    custom: (page) => () => <Custom circles={page.data} />
  },
  dataURL = "http://192.168.1.254", // Used only during development
  pb = new PB();

let paramMeta = {};

//Initializing URL, Constants and Format handlers
pb.init(dataURL, true, REFRESH_MS, CHANNEL_URI_MAX_SIZE, raw_to_readable, readable_to_raw);

//Check to include Localization settings
if (process.env.REACT_APP_LOCALIZE === "true") {
  paramMeta = appPages.meta.dciMetaData;
} else {
  delete appPages.meta.dciMetaData.COMMON_LANG_PREF;
  delete appPages.meta.dciMetaData.LANG_PREF_SETTING;
  paramMeta = appPages.meta.dciMetaData;
}

//Initializing the Redux Store
const initialStore = store({ paramMeta: paramMeta }, {}, pb);

// Used to translate the strings provided by the adoptor
// const t = initialStore.getState().t

function Wrap(WrapComponent) {
  return class extends React.Component {
    render() {
      return <WrapComponent />;
    }
  };
}

//Passing the EULA content as a Prop
const pageProps = {
  productEulaContent: Wrap(EulaContent)
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Suspense fallback="loading">
    <Provider store={initialStore}>
      <RTLThemeProvider>
        <GreenSeed
          reducers={{}}
          appPages={appPages}
          //productLogo={productLogo}
          //registerURL={"/register"}
          //forgotPasswordURL={"/forgot-password"}
          //termsURL={"/terms"}
          //privacyURL={"/privacy"}
          //productName={t("Adopter")}
          //productVersion="2.9"
          templateMap={customTemplates}
          dataURL={dataURL}
          pb={pb}
          pageProps={pageProps}
        />
      </RTLThemeProvider>
    </Provider>
  </Suspense>
);
