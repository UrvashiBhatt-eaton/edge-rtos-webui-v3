# Project Structure

Applications built using the Seed Modules are scaffolded using create-react-app and incorporate Redux for one-directional data-flow. These applications should also follow the PX Blue standard approach by using the Material-UI component library and PX Blue themes/interaction patterns. These are used in the core modules and any custom work should also follow these guidelines.

## Folder Structure

```
|── db.js                                   // dynamically creates mock data for use with Local Core
└── /src
    |── index.js                            // the root file that renders the application
    |── /configuration
    │   |── appPages.js                     // Defines the various pages (tabs) for the application
    │   └── pageConfig.js                   // Defines the data (e.g., channels) to show on each page
    |
    |── /constants
    │   └── constants.js                    // Defines channel count and refresh rate for load tests
    |
    └── /layouts                            // Layout templates for various page types
        └── Custom.js                       // A custom layout template to inject into the Core
```

> **NOTE:** This demo currently has more dependencies in package.json than are actually required. Because of the manual linking process to connect to the Seed Modules, dependencies don't get properly flattened. As such, we must install all of the modules dependencies in this repository as well to get them into the node_modules directory. When this package is available through NPM, this will no longer be necessary and these unnecessary dependencies can be cleaned up.

### Getting Started

You will need to pull the GreenCore and PxBlue sub modules and this repository and link them together. Once the PxBlueModule is published to NPM and/or Artifactory, this manual linking will no longer be required.

Install the dependencies for the application and link the core modules to the application node_modules:

```
npm run-script link:win
```

> **NOTE**: the linking command for windows requires that you have Git Bash installed on your machine, in the default location (PROGRAM_FILES/Git).

Once the links are in place, you can run the application:

```
npm run-script start
```

After an initial setup has already been done, to quickly build new code from the main directory and sub-modules and run the application:

```
npm run-script linkstart:win
```

### Localization Support

Localization is off by default to save code space.

To enable localization, edit PxGreenUIModule\src\translator\translator.js to toggle between using the fake translator and the real one by commenting out one and uncommenting the other.

There are 4 categories of strings to be localized:

- the REST API parameter meta data in the DCI workbook
- seed UI 2.0 titles in the DCI workbook
- the UI strings in the web UI code except the ones for the login prompt (in the locales folder)
- the UI strings in the web UI code used in the login prompt (in the public\locales folder)

The DCI workbook has macros to merge the first 3 sources into one file per language that is fetched over the REST API by the web UI code. The strings for the login prompt are built directly into the UI code since the one served over REST requires a login. The DCI macro doesn't reference the login strings.

The strings in the web UI code can be extracted using the i18next-parser utility. After installing that dev package, to extract all the strings from the web UI you can run the following:

```
npm run-script getstrings
```

It'll put the strings in the locales\{code}\common.json files for each language code. If the file already exists, it'll only add the missing strings. These files should then be translated - the English string is the key (and default translation) and other language is the value.
