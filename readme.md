# Sustainable Finance Hub Dashboard

This project aims to provide interactive visualizations for exploring and analyzing Sustainable Finance Hub data. [Click here to see the interface](https://lemon-tree-0968b0103.5.azurestaticapps.net/).

## Table of Contents

- [Link for the visualization](#section-01)
- [Deployment](#deployment)
- [Steps to integrate the vis in static page](#section-02)
- [Pages on DFx where This Viz is Used](#section-03)
- [Related Repos](#section-04)
- [Global CSS Files and Repo](#section-05)
- [Build With](#section-06)
- [Installation](#section-07)
- [Local Deployment](#section-08)
- [Available Scripts](#section-09)
- [Tooling Setup](#section-10)

## Link for the visualization<a name="section-01"></a>

[https://lemon-tree-0968b0103.5.azurestaticapps.net/](https://lemon-tree-0968b0103.5.azurestaticapps.net/)

## Deployment<a name="deployment"></a>

The Production site deployed using Azure Static Web App and work flow can be found [here](https://github.com/UNDP-Data/dv-sustainable-finance-hub/blob/main/.github/workflows/azure-static-web-apps-lemon-tree-0968b0103.yml)

## Steps to Integrating the Visualization in the Data Future Platform or Any Other Page<a name="section-02"></a>

Add the following div in the page

```
<div data-viz></div>
```

Apart from the mentioned `div` above the following `script` and `link` needs to be added to the `head` or in the embed code

```
<script defer="defer" type="module" src="https://lemon-tree-0968b0103.5.azurestaticapps.net/index.js"></script>
<link rel="stylesheet" href="https://undp-data.github.io/stylesheets-for-viz/style/mainStyleSheet.css" />
<link rel="stylesheet" href="https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraphingInterface.css" />
<link rel="stylesheet" href="https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraph.css" />
```

## Pages Where the Visualization is Used<a name="section-03"></a>

_In progress_

## Related Repos<a name="section-04"></a>

- [**dv-sustainable-finance-hub-data-repository**](https://github.com/UNDP-Data/dv-sustainable-finance-hub-data-repository): This is the data sheet for visualization
- [**stylesheet-for-viz**](https://github.com/UNDP-Data/stylesheets-for-viz): Repo which defines the css settings for the project

## Global CSS for UI and Graphs<a name="section-05"></a>

**Git Repo**: https://github.com/UNDP-Data/stylesheets-for-viz

**Link for stylesheets**

- https://undp-data.github.io/stylesheets-for-viz/style/mainStyleSheet.css
- https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraphingInterface.css
- https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraph.css

## Build with<a name="section-06"></a>

- **React**: Used as MVC framework.
- [**UNDP Visualization Library**](https://github.com/UNDP-Data/undp-visualization-library): Used for visualizations, adding interaction and reading the csv data file.
- **lucide-react**: For icons.

## Installation<a name="section-07"></a>

This project uses `npm`. For installation you will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

To install the project, simply clone the the repo and them run `npm install` in the project folder. You can use terminal on Mac and Command Prompt on Windows.

This project is bootstrapped with [`Vite`](https://vitejs.dev/) and was created using `npm create vite@latest` command.

Run the terminal or command prompt and then run the following

```
git clone https://github.com/UNDP-Data/{{projectName}}.git
cd {{projectName}}
npm install
```

## Local Development<a name="section-08"></a>

To start the project locally, you can run `npm run dev` in the project folder in terminal or command prompt.

This is run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Available Scripts<a name="section-09"></a>

- `npm run dev`: Executes `vite` and start the local server for local deployment.
- `npm run build`: Executes `tsc && vite build` and builds the app for production and deployment.

## Tooling Setup<a name="section-10"></a>

This project uses ESLint integrated with prettier, which verifies and formats your code so you don't have to do it manually. You should have your editor set up to display lint errors and automatically fix those which it is possible to fix. See [http://eslint.org/docs/user-guide/integrations](http://eslint.org/docs/user-guide/integrations).

This project is build in Visual Studio Code, therefore the project is already set up to work with. Install it from [here](https://code.visualstudio.com/) and then install this [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and you should be good to go.
