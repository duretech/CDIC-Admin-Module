import React, { Component } from "react";
//import { Button } from "reactstrap";
//import { withRouter, Link } from "react-router-dom";

import { appName, appLogo } from "../config/appConfig";
// const handleLogout = () => {
//   console.log(":inside logout");
//   window.location.reload();
//   // this.props.history.push("/Home");
// };

class Header extends Component {
  render() {
    return (
      <header>
        <nav className="navbar  navbar-fixed-top login_navbar">
          <div className="container">
            <div className="navbar-header">
              <a href="/home" className="navbar-brand">
                <img src={appLogo} className="logoCss" alt="logo" />
                <span>{appName}</span>
              </a>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
