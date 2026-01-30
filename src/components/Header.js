import React, { useState, useEffect } from "react";
import { Button, DropdownItem } from "reactstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import Tooltip from '@material-ui/core/Tooltip';
import API from "../services";
import swal from 'sweetalert';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "bootstrap/js/src/collapse.js";
import { Row, Col, InputGroup } from "react-bootstrap"

import { appName, appLogo, app_locale } from "../config/appConfig";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage, faSignOut, faCog, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { navbarMenuOptions } from "../config/appConfig";
// import { generatePrescriptionPDF } from "./pdfutils"

import { appBaseUrl } from "../config/appConfig";
import { DropdownButton } from "react-bootstrap";
import { Modal, Form, Dropdown } from "react-bootstrap";


import i18n from "../i18n";
import i18next from 'i18next'

import { useTranslation } from 'react-i18next';
import imgurl from "../assets/images/imgurl";
import Loader from "./loaders/loader";

const Header = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [anchorElDropdown, setAnchorElDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState("Data Management");
  const [activeObject, setActiveObject] = useState({
    home: "active",
    dashboard: "",
    linelist: "",
    alerts: "",
    pathway: "",
    qrcode: "",
    adherance: "",
  });
  const formData = {
    patientName: "John Doe",
    age: 35,
    diagnosis: "Mild Fever and Cold",
    medications: ["Paracetamol 500mg - Twice daily", "Vitamin C 500mg - Once daily"],
    doctorName: "Dr. Smith",
  };
  const isDataManagementActive = ["/datamanagement", "/dataexport", "/upload", "/uploadlogs"].includes(location.pathname);
  const isTranslationsActive = ["/translations", "/applabels"].includes(location.pathname);

  //Reset Password
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [showExistingPassword, setShowExistingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const userObject = JSON.parse(sessionStorage.getItem("userData"))
  const adminFlag = true
  const navigate = useNavigate();
  useEffect(() => {
    // if(adminFlag)
    if (true) {
      let activeStateHolder = {
        home: "",
        dashboard: "",
        linelist: "",
        alerts: "",
        pathway: "",
        qrcode: "",
        adherance: "",
        datamanagement: "active"
      }
      let currentPath = window.location.pathname.split('/').pop()
      // activeStateHolder[currentPath] = "active"
      setActiveObject(activeStateHolder)
      navigate("/datamanagement");
    }

    //Runs on every render
  }, []);


  //Reset Password 
  const handleSubmit = () => {
    if (!existingPassword || !newPassword) {
      setError("Both fields are mandatory.");
      return;
    }
    setLoading(true)
    let values = {
      "oldPassword": existingPassword,
      "newPassword": newPassword
    }
    API.put('31/me/changePassword', values).then(res => {

      if (res.status == 200 || res.status == 202) {
        swal({
          title: "Password Changed!",
          text: 'You can now login with your new password',
          icon: "success",
          button: "Close",
        })
        setLoading(false)
      }
      else {
        swal({
          title: "Reset password",
          text: res.data.message,
          icon: "error",
          button: "Close",
        });
        setLoading(false)
      }
      // .then(res=>{
      //     apiServices.getAPIWithDomain('dhis-web-commons-security/logout.action').then((result) => {

      //     }).catch((err) => {

      //     });
      //     OfflineDb.deleteDatabse().then(res=>{
      //         // window.location.reload();
      //         setLoginUser(false)
      //         localStorage.clear();
      //         sessionStorage.clear();
      //         const redirectLink = document.createElement('a');

      //         redirectLink.href = Configuration.baseUrl + "cdicv2/";
      //         redirectLink.click();

      //         // window.location.href = "cdicss"
      //         // history.replace("/login");
      //         // history.go(0)
      //         // window.location.reload();
      //     }).catch(err=>{

      //         setLoginUser(false)
      //         localStorage.clear();
      //         sessionStorage.clear();
      //         const redirectLink = document.createElement('a');
      //         redirectLink.href = Configuration.baseUrl + "cdicv2/";
      //         redirectLink.click();

      //         // window.location.replace = "/cdicss"
      //         // window.location.href = "cdicss"
      //         // window.location.reload();
      //         // history.replace("/login");
      //         // history.go(0)
      //         // window.location.reload();
      //     })
      // });


    }).catch(error => {
      if (error.response) {

        swal({
          title: "Reset password",
          text: error.response.data.message,
          icon: "error",
          button: "Close",
        });
      } else {
        swal({
          title: "Reset password",
          text: "",
          icon: "error",
          button: "Close",
        });
      }
      setLoading(false)
    })

    // Reset Form
    setExistingPassword("");
    setNewPassword("");
    setError("");

    // Close Modal
    handleClose();
  };

  const setActiveTab = () => {
    let activeStateHolder = {
      home: "",
      dashboard: "",
      linelist: "",
      alerts: "",
      pathway: "",
      qrcode: "",
      adherance: "",
    }
    let currentPath = window.location.pathname.split('/').pop()
    activeStateHolder[currentPath] = "active"
    setActiveObject(activeStateHolder)
  }


  const handleLogout = () => {
    // console.log(":inside logout");
    sessionStorage.clear()
    sessionStorage.clear()
    onSuccess()
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  //Reset Password Modal
  const handleClose = () => {
    setResetPasswordModal(false); // Close the modal on cancel
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal on cancel
  };

  const handleConfirmLogout = () => {
    setShowModal(false); // Close the modal
    handleLogout(); // Proceed with logout
  };

  return (
    <>
      <Loader isLoading={loading}></Loader>

      <Navbar bg="light" className="login_navbar align-items-center" expand="lg">
        {/* <Container> */}
        <Navbar.Collapse href="#">
          {/* <img src={appLogo} className="logoCss" alt="logo" /> */}

          {/* <h4 className="p-1" style={{ color : '#a51c30c' }} >{sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")).appname : ""}</h4> */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Row className="d-flex justify-content-center align-items-center w-fit-content">
            <Col lg="3"><h4 className="navTitle mr-3 mb-0" style={{ color: '#fff' }} >
              <img src={imgurl.cdiclogo} className="logo-main"></img>
            </h4></Col>

            <Col lg="9"><h5 className="main-heading mb-0">CDIC T1D E-REGISTRY</h5></Col>
          </Row>
          <div className="collapse navbar-collapse w-25" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">


              {adminFlag && (
                <>
                  {/* ✅ Main Level Navbar */}
                  <li className={`nav-item ${isDataManagementActive ? "active" : ""}`}>
                    <Link to="/datamanagement" className="nav-link">{t("Data Management")}</Link>
                  </li>
                  { app_locale !== "ETHIOPIA"  ? <li className={`nav-item ${isTranslationsActive ? "active" : ""}`}>
                    <Link to="/translations" className="nav-link">{t("Translations")}</Link>
                  </li> : null}
                  <li className={`nav-item ${location.pathname === "/usermanagement" ? "active" : ""}`}>
                    <Link to="/usermanagement" className="nav-link">{t("User Management")}</Link>
                  </li>
                  <li className={`nav-item ${location.pathname === "/facilitymanagement" ? "active" : ""}`}>
                    <Link to="/facilitymanagement" className="nav-link">{t("Organization Management")}</Link>
                  </li>
                  <li className={`nav-item ${location.pathname === "/audittrailmanagement" ? "active" : ""}`}>
                    <Link to="/audittrailmanagement" className="nav-link">{t("Audit Trail")}</Link>
                  </li>
                </>
              )}

              {isDataManagementActive && (
                <div className="sub-navbar">
                  <ul className="navbar-nav sub-nav">
                    <li className={`sub-item ${location.pathname === "/datamanagement" ? "active" : ""}`}>
                      <Link to="/datamanagement">{t("Data Management")}</Link>
                    </li>
                    <li className={`sub-item ${location.pathname === "/dataexport" ? "active" : ""}`}>
                      <Link to="/dataexport">{t("Data Export")}</Link>
                    </li>
                    <li className={`sub-item ${location.pathname === "/upload" ? "active" : ""}`}>
                      <Link to="/upload">{t("Data Upload")}</Link>
                    </li>
                    <li className={`sub-item ${location.pathname === "/uploadlogs" ? "active" : ""}`}>
                      <Link to="/uploadlogs">{t("Data Upload Logs")}</Link>
                    </li>
                  </ul>
                </div>
              )}

              {isTranslationsActive && (
                <div className="sub-navbar">
                  <ul className="navbar-nav sub-nav">
                    <li className={`sub-item ${location.pathname === "/translations" ? "active" : ""}`}>
                      <Link to="/translations">{t("Form Labels")}</Link>
                    </li>
                    <li className={`sub-item ${location.pathname === "/applabels" ? "active" : ""}`}>
                      <Link to="/applabels">{t("App Labels")}</Link>
                    </li>
                  </ul>
                </div>
              )}


              {
                userObject.username == "dureLogin" ? <>
                  <li onClick={() => setActiveTab()} className={`nav-item ${activeObject.variabledownload}`}>
                    <Link
                      to="variabledownload"
                      className="nav-link"
                    // onClick={() => this.clearIndicator()}
                    >
                      {t("Variable Download")}
                    </Link>
                  </li>
                </> : <></>
              }
              {/* {
                <li className={`nav-item ${activeObject.variabledownload}`}>
                  <button onClick={() => generatePrescriptionPDF(formData)} >DownloadPdf</button> 
             
              </li>
                    
              } */}
              {/* <li onClick={() => setActiveTab()} className={`nav-item ${activeObject.qrcode}`}>
                <Link
                  to="qrcode"
                  className="nav-link"
                >
                  QR Code Generation
                </Link>
              </li> */}
              <>
                {/* <li className={`nav-item`}>
                    <a
                      className="nav-link"
                      href="/smartsetup/"
                      //onClick={() => this.menuActive("linelist")}
                      target="_blank"
                    >
                      Smart Setup
                    </a>
                  </li> */}
                {/* <li className={`nav-item`}>
                    <a
                      className="nav-link"
                      href="/indexupload/"
                      //onClick={() => this.menuActive("linelist")}
                      target="_blank"
                    >
                      Index Upload
                    </a>
                  </li> */}

              </>
            </ul>
          </div>

          <div className="d-flex ml-3">
            <Dropdown className="langSelector" title={`Switch Language`} align="end">
              <Dropdown.Toggle variant="outline-light logout" id="dropdown-basic">
                <FontAwesomeIcon icon={faLanguage} />
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: '120px', right: '0', left: 'auto' }}>
                {userObject?.selectedlanguage &&
                  userObject.selectedlanguage.map((lang) => (
                    <Dropdown.Item
                      key={lang.value}
                      onClick={(e) => changeLanguage(lang.value)}
                      value={lang.value}
                    >
                      {lang.label}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="langSelector" title={`Switch Language`} align="end">
              <Dropdown.Toggle variant="outline-light logout" id="dropdown-basic">
                <FontAwesomeIcon icon={faUserCircle} size="lg" />
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: '120px', right: '0', left: 'auto' }}>
                <Dropdown.Item
                  onClick={() => setResetPasswordModal(true)}
                >
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: "8px" }} />
                  Settings
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setShowModal(true)}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "8px" }} />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <Button
              outline
              title={`logout`}
              color="light"
              className="logout d-flex ml-0"
              onClick={() => handleLogout()}
              style={{ "alignItems": "center" }}
            > */}
            {" "}
            {/* <Link to="/"> */}
            {/* <span>{t("Logout")}</span> */}
            {/* <FontAwesomeIcon className="p-2 m-auto logout btn-outline-light " icon={faSignOut} /> */}
            {/* </Link> */}
            {/* </Button> */}
            {/* 
            <Button
              outline
              title="Logout"
              color="light"
              className="logout d-flex ml-0"
              onClick={() => setShowModal(true)}
              style={{ alignItems: "center" }}
            >
              <FontAwesomeIcon
                className="p-2 m-auto logout btn-outline-light"
                icon={faSignOut}
              />
            </Button> */}


            <Modal show={showModal} onHide={handleCancel} centered>
              <Modal.Header style={{ color: "#fff" }} closeButton closeVariant="white" >
                <Modal.Title style={{ background: "none" }}>Confirm Logout</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ padding: "20px", color: "#000", background: "none" }}>
                Are you sure you want to log out?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="danger" className="btn btn-danger" onClick={handleConfirmLogout}>
                  Logout
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={resetPasswordModal} onHide={handleClose} centered>
              <Modal.Header style={{ color: "#fff" }} closeButton closeVariant="white" >
                <Modal.Title style={{ background: "none" }}>Reset Password</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ padding: "20px", color: "#000", background: "none" }}>
                <Form>
                  {/* Existing Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Existing Password *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showExistingPassword ? "text" : "password"}
                        placeholder="Enter Existing Password"
                        value={existingPassword}
                        onChange={(e) => setExistingPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-group-text visibility-icon-container"
                        onClick={() =>  setShowExistingPassword(!showExistingPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={showExistingPassword ? faEye : faEyeSlash} />
                      </span>
                    </InputGroup>
                  </Form.Group>

                  {/* New Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>New Password *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-group-text visibility-icon-container"
                        onClick={() =>  setShowNewPassword(!showNewPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                      </span>
                    </InputGroup>
                  </Form.Group>

                  {/* Error Message */}
                  {error && (
                    <p style={{ color: "red", fontSize: "14px", marginTop: "-10px" }}>
                      {error}
                    </p>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>


          </div>

        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  );
}

export default Header;
