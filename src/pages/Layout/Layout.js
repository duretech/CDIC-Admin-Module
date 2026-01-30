import React, { Component } from "react";
import { BrowserRouter as Router,Routes, Switch, Route } from "react-router-dom";

import DashboardRoutes from "../../router/DashboardRoutes";


const Layout = ({}) => {
// class Layout extends Component {
  // constructor(props) {
  //   super(props);
  // }

    return (
      // <Router basename="/caredashboard">
        <Routes>
          {DashboardRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      // </Router>
    );
}

export default Layout;
