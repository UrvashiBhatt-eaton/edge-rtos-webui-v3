export const t = (str, options) => {
  if (typeof options === "string") {
    return options;
  } else if (
    typeof options === "object" &&
    typeof options.defaultValue === "string"
  ) {
    return options.defaultValue;
  }
  return str;
};
export const i18n = {
  // Always english
  language: "en",
  languages: ["en"],
  t,
  // We could also add any other needed API calls from https://www.i18next.com/overview/api
};
// Don't really change the lang/namespace
export const getFixedT = () => t;
export default { i18n, t, getFixedT };
