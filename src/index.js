import React from "react";
// import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./assets/css/font.css";
import "./assets/css/coreui_whole.css"
// import "react-leaflet-fullscreen/dist/styles.css";
import "./index.css";
import "./assets/css/theme-blue.css";
import "./assets/css/newtheme.css";
// import "./assets/css/custom.css"

// import "../node_modules/react-grid-layout/css/styles.css";
// /node_modules/react-grid-layout/css/styles.css
// /node_modules/react-resizable/css/styles.css
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration.ts';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import configureStore from "./redux/store/configureStore";

import { createRoot } from "react-dom/client";

const store = configureStore();
// for pwa serive worker

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);


root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

