# PX Green Core

This module forms the basis for a PX Green seed application. It contains a communication component that establishes a connection to a PX Green device REST API as well as curating a default set of page template components, which it passes to the [px-seed-router](../px-seed-router/READEME.md).

## Installation

This package is currently not published to a package repository. As such, it must be manually linked into a project that needs to use it. This has been handled through an automated script in the [seed-demo](https://github.com/pxblue/seed-demo).

Clone the repository and build the module

```
git clone https://github.com/pxblue/seed-core
cd seed-core/px-green-core
npm run-script build
```

You must then copy the package.json file and the /dist directory into a folder in your project's node_modules folder and import the component appropriately:

```
import GreenSeed from 'path-to-your/node_modules/folder'
```

## Usage

This component should be the root component of any application. Any extension/customization of the core functionality can be handled by passing props.

```
render(
    <GreenSeed
        appPages={appPages}
        templateMap={customTemplates}
        dataURL={'http://255.255.255.255:9999'}
        initialStore={{}}
        reducers={{}}
    />
  , document.getElementById('root')
);
```

## Available properties

- `appPages` (Object, required): route definitions for the app.
- `templateMap` (Object): mapping from strings to custom layout templates.
- `dataURL` (String, required): the url of the REST API to connect to.
- `initialStore` (Object): custom fields to add to the redux store.
- `reducers` (Object): custom redux reducers.

appPages should be in the format:

```
export const appPages = {
  primary:[
    {
      id: 0,
      name: "name",
      route: "/route",
      layout: "layout-type",
      icon: "icon",
      data: {}
    },...
  ],
  secondary:[],
  settings:[]
};
```

templateMap is in the format:

```
{
    "layout-type": (page) => () => <Layout />,
    "layout-type-2": (page) => () => <LayoutTwo prop={page.something} />,
    ...
}
```

initialStore is in the format:

```
{
    key: value,
    ...
}
```

reducers is in the format:

```
{
    storeKey: reducerFunction,
    ...
}
```

To enable localization make the following changes to the translator folder:

- edit src/translator/translator.js to comment out the fake translator and uncomment the real translator
- make sure your translations are in the top level public/locales folders
- use ?lang="<lang>", e.g. ?lang="es" at the of the URL to view the page in a language

To disable localization make the following changes to the translator folder:

- edit src/translator/translator.js to comment out the real translator and uncomment the fake translator
- to save size, remove any translations in the top level public/locales folders
