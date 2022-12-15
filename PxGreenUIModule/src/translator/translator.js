import React from "react";

class Translator extends React.Component {
  constructor(props) {
    super(props);
    this.selectComponent = this.selectComponent.bind(this);
  }

  selectComponent() {
    const {
      dataURL,
      loadLanguage,
      loadLanguageList,
      fetchAuthHeadersAction,
      addRealtimeAction,
      removeRealtimeAction,
    } = this.props;
    if (process.env.REACT_APP_LOCALIZE === "true") {
      const TranslatorEnabled = require("./enableTranslator").default;
      return (
        <TranslatorEnabled
          dataURL={dataURL}
          loadLanguage={loadLanguage}
          loadLanguageList={loadLanguageList}
          fetchAuthHeadersAction={fetchAuthHeadersAction}
          addRealtimeAction={addRealtimeAction}
          removeRealtimeAction={removeRealtimeAction}
        />
      );
    } else {
      const TranslatorDisabled = require("./disableTranslator").default;
      return <TranslatorDisabled />;
    }
  }
  render() {
    return <>{this.selectComponent()}</>;
  }
}

export default Translator;
