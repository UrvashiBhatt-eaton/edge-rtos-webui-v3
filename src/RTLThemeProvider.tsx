import React, { useEffect, PropsWithChildren, ReactNode } from "react";
import { create } from "jss";
import rtl from "jss-rtl";
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles"; /* StyledEngineProvider added*/
import { StylesProvider, jssPreset } from "@mui/styles";
import * as BLUIThemes from "@brightlayer-ui/react-themes";
import { useSelector } from "react-redux";
import * as locale from "@mui/material/locale";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
export const RTLThemeProvider: React.FC<PropsWithChildren<ReactNode>> = (props) => {
  const //code: any = useSelector((state: any) => state.i18n.langauge || ""),
    language: any = useSelector((state: any) => state.language),
    code: string = language.code,
    firstTwoLower: string = code.substring(0, 2).toLowerCase(),
    langCode: string =
      firstTwoLower +
      (code.length === 4 || code.length === 5
        ? (code[code.length - 2] + code[code.length - 1]).toUpperCase()
        : firstTwoLower === "zh" /* Special handling for zh => zhCN */
        ? "CN"
        : firstTwoLower === "he" /* Special handling for he => heIL */
        ? "IL"
        : firstTwoLower),
    dir: any = firstTwoLower === "he" || firstTwoLower === "ar" ? "rtl" : "ltr",
    cacheRtl = createCache({
      key: dir === "rtl" ? "cssrtl" : "cssltr",
      prepend: true,
      stylisPlugins: dir === "rtl" ? [rtlPlugin] : []
    });

  useEffect(() => {
    document.body.dir = dir;
  }, [dir]);

  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cacheRtl}>
        <StylesProvider jss={jss}>
          <ThemeProvider
            theme={createTheme(
              {
                ...BLUIThemes.blue,
                direction: dir
              },
              // @ts-ignore
              locale[langCode]
            )}
          >
            {props.children}
          </ThemeProvider>
        </StylesProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
};
