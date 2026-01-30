import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import LoginHeader from "./components/LoginHeader";
//import RouteWithSubRoutes from "./router/RouteWithSubRoutes";
import LoginRoutes from "./router/LoginRoutes";
import indexRoutes from "./router/IndexRoutes";
import DashboardRoutes from "./router/DashboardRoutes";
import Protected from "./router/Protected";

import { withTranslation } from 'react-i18next';
import './i18n';

const loading = <div className="loading"></div>;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("Authorization") ? true : false
  );

  const updateLoggedInStatus = () => {
    setLoggedIn(true);
  };

  const updateLogOutStatus = () => {
    setLoggedIn(false);
  };

  //console.log(indexRoutes);

  const aIndexRoutes = DashboardRoutes.map((prop, key) => {
    return <Route
      exact
      path={prop.path}
      element={
        <Protected isLoggedIn={loggedIn}>
          <prop.component />
        </Protected>
      } key={key} />;
  });
  //console.log(aIndexRoutes);

  const aLoginRoutes = LoginRoutes.map((prop, key) => {
    return (
      <Route
        path={prop.path}
        key={key}
        element={<prop.element onSuccess={updateLoggedInStatus} />}
      />
    );
  });

  return (
    <BrowserRouter basename="/cdicdashboardv2">
      {loggedIn ? <Header onSuccess={updateLogOutStatus} /> : null}
      <React.Suspense fallback={loading}>
        <Routes>
          {
            /* {LoginRoutes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
            ))} */
            //console.log(aIndexRoutes)
          }
          {loggedIn ? aIndexRoutes : aLoginRoutes}
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default (withTranslation()(App));
