import React, { useEffect, useState } from "react";
// import KeyNumber from '../../components/KeyNumber'
import { faCalendar, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import { Card, Col, Form, Row } from "react-bootstrap";
import API, { multipartPostCall } from "../../services";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import Sidebar from "react-sidebar";
import SidebarContent from "../../components/SidebarContent";

import ComponentLoader from "../../components/loaders/ComponentLoader";

import { Breadcrumb, Button, Container } from "react-bootstrap";
import { appBaseUrl } from "../../config/appConfig";
import swal from "sweetalert";
import { Modal } from "react-bootstrap";
import Loader from "../../components/loaders/loader";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {app_locale } from "../../config/appConfig";


function DataExport() {
    const { t, i18n } = useTranslation();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [existingPassword, setExistingPassword] = useState("");
    const [newChangedPassword, setNewChangedPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewEPassword, setShowNewEPassword] = useState(false);

    const [passwordDataExportType, setPasswordDataExportType] = useState("patient"); // 'patient' or 'deidentified'
    const [changePasswordDataExportType, setChangePasswordDataExportType] = useState("patient");


    const [count, setCount] = useState();
    const [loading, setLoading] = useState(false);
    const [orgID, setOrgID] = useState();
    const [loadingMap, setLoadingMap] = useState(false);
    const [loadingChart, setLoadingChart] = useState(false);
    //const [chartData, setchartData] = useState([]);
    const [indicatorData, setindicatorData] = useState([]);
    const [filterFlag, setFilterFlag] = useState(false);
    const [breadcrumbOrg, setBreadcrumbOrg] = useState();
    const [defaultOrg, setDefaultOrg] = useState(
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits
    );
    const [periodName, setPeriodName] = useState();
    const [periodType, setPeriodType] = useState("Yearly");
    const [isSidebarOpen, setSidebar] = useState(false);
    const date = new Date();
    const latestPeriod =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10 ? "0" : "") +
        (date.getMonth() + 1);

    const [indicatorObject, setIndicatorObject] = useState({});

    const [currentPeriod, setCurrentPeriod] = useState(
        date.getFullYear().toString()
    );

    const onSetSidebarOpen = () => {
        if (isSidebarOpen === true) {
            setSidebar(false);
        } else {
            setSidebar(true);
        }
    };

    const closeSidebar = () => {
        setSidebar(false);
    };

    const applyFilter = (period, periodname, periodType) => {
        setFilterFlag(true);


        setPeriodName(periodname);
        setPeriodType(periodType);
        //setTimeout(function () {


        setCurrentPeriod(period);
        // console.log(period);
        closeSidebar();
        //}, 800);

        //setCurrentMapKey(currentMapKey + 1);
    };

    const resetFilter = () => {
        setCurrentPeriod(date.getFullYear().toString());
        setPeriodName("");
        setOrgID(defaultOrg[0].id);
        setBreadcrumbOrg(defaultOrg);
        setFilterFlag(false);
        closeSidebar();
        //setCurrentMapKey(currentMapKey + 1);
    };

    const getDatePeriod = () => {
        //console.log(periodName);
        if (!periodName || periodName == "") {
            if (currentPeriod.includes("-")) {
                return <Moment date={new Date(currentPeriod)} format="MMM-YYYY" />;
            } else {
                return <Moment date={new Date(currentPeriod)} format="YYYY" />;
            }
        } else {
            return <>{periodName}</>;
        }
    };
    const maxnum = "";
    const minnum = "";
    const maxradius = 22;
    const minradius = 5;
    const minnumbeArr = [];

    const [fileName, setFileName] = useState(t("Select File"));
    const [selectedFile, setSelectedFile] = useState(null);

    const changeHandler = (e) => {
        setFileName(e.target.files[0].name);
        var file = e.target.files[0];

        setSelectedFile(file);

        return;
    };

    const downloadTemplate = (prop,ethFlag) => {
         const userData = JSON.parse(sessionStorage.getItem("userData"));
        // Check for 'education' key and if it's empty or undefined/null
        if (!userData.education || userData.education === "") {
            swal({
            title: "Password Is Missing",
            text: "Please set password for excel",
            icon: "warning",
            buttons: {
                confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        }).then((willProceed) => {
            if (willProceed) {
                setShowPasswordModal(true); // Show modal after user clicks OK
            }
        });
         return;
        }
        console.log(periodName, periodType, currentPeriod);
        setLoading(true);

        let instace = {
            programuid: JSON.parse(sessionStorage.getItem("userData")).programuid,
            orguid: JSON.parse(sessionStorage.getItem("userData")).orguid,
            fromdate: currentPeriod ? currentPeriod.split(';')[0] : "202408;202409;202410;",
            todate: periodType == "Date Range" ? currentPeriod.split(';')[1] : "",
            filtertype: periodType ? periodType : "Monthly",
            protected: prop ? "true" : "false",
            ethDate: ethFlag ? "true" : "",
            useruid: userData.id
        }


        API.post("dashboardIndicator/dataexport", instace).then((res) => {
            setLoading(false);
            var link = document.createElement("a");
            // link.target = "_blank";
            // link.download = "Download_Template_" + new Date() + ".xlsx";
            link.href = res.data.success;
            link.click();
        });
    };

    const uploadXML = () => {
        var frmData = new FormData();
        frmData.append("file", selectedFile);
        var reqObj = {
            programid: JSON.parse(sessionStorage.getItem("userData")).programuid,
        };
        frmData.append("inputjson", JSON.stringify(reqObj));
        multipartPostCall("uploadfiletest/uploadexceldata", frmData)
            .then((res) => {
                // multipartPostCall('uploadfile/uploadexceldata',frmData).then(res =>{
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        swal({
            title: "",
            text: "File sent for processing, Please check data upload logs",
            icon: "success",
            button: "Close",
        });
    };

    const downloadVariableTemplate = async () => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const programuid = userData?.programuid || "";

        if (!programuid) {
            console.warn("Program UID is missing");
            return;
        }

        try {
            const response = await API.post("rtmpro/template/generateVariableSheet",
                { programuid }
            );

            if (response.data?.url) {
                // Create a hidden <a> tag to trigger download
                const link = document.createElement("a");
                link.href = response.data.url;
                link.setAttribute("download", "Program_Data.xlsx"); // File name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error("Invalid response format:", response.data);
            }
        } catch (error) {
            console.error("Error downloading Excel file:", error);
        }
    };

    useEffect(() => {
        // setLoading(true);
        setLoadingChart(true);
        let mounted = true;
        let count = 0;

        if (!filterFlag) {
            setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
            setBreadcrumbOrg(defaultOrg);
        }
    }, [orgID, currentPeriod]);

            const handleSubmitPassword = async () => {
            if (!newPassword || !confirmPassword) {
                swal("Error", "Please fill both fields", "error");
                return;
            }

            if (newPassword !== confirmPassword) {
                swal("Mismatch", "Passwords do not match", "error");
                return;
            }

            const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(confirmPassword)) {
        swal(
            "Invalid Password",
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "error"
        );
        return;
    }

            const userData = JSON.parse(sessionStorage.getItem("userData"));

            const payload = {
                userid: userData?.id,
                password: newPassword
            };

            try {
                const response = await API.post("/common/updateDataPassword", payload);

                if (response?.data?.trim() === "success") {
                     const updatedUserData = {
                ...userData,
                education: newPassword
                };
                sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
                    swal("Success", "Password has been set", "success");
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    swal("Error", response?.data?.message || "Failed to set password", "error");
                }
            } catch (error) {
                console.error("Password update error:", error);
                swal("Error", "Something went wrong while updating password", "error");
            }
        };


        const handleChangePasswordSubmit = async () => {
            const userData = JSON.parse(sessionStorage.getItem("userData"));
          
    if (!existingPassword || !newChangedPassword) {
        swal("Error", "Both fields are required", "error");
        return;
    }
    if (existingPassword !== userData.education) {
    swal("Error", "Existing password does not match", "error");
    return;
    }

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
      if (!passwordPattern.test(newChangedPassword)) {
        swal(
            "Invalid Password",
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "error"
        );
        return;
    }

           
            const payload = {
                userid: userData?.id,
                password: newChangedPassword
            };

            try {
                const response = await API.post("/common/updateDataPassword", payload);

                if (response?.data?.trim() === "success") {
                     const updatedUserData = {
                ...userData,
                education: newChangedPassword
                };
                sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
                    swal("Success", "Password Changed Successfully", "success");
                    setShowChangePasswordModal(false);
                    setExistingPassword("");
                    setNewChangedPassword("");
                } else {
                    swal("Error", response?.data?.message || "Failed to change password", "error");
                }
            } catch (error) {
                console.error("Password update error:", error);
                swal("Error", "Something went wrong while updating password", "error");
            }

   
    };

    const userData_ = JSON.parse(sessionStorage.getItem("userData"));
    const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setExistingPassword("");       // Clear existing password field
    setNewChangedPassword("");    // Clear new password field
    setShowNewEPassword(false);   // Reset visibility toggles (optional)
    setShowNewPassword(false);
};

const handleCloseSetPasswordModal = () => {
  setShowPasswordModal(false);
  setNewPassword("");          // Clear password field
  setConfirmPassword("");      // Clear confirm password field
  setShowPassword(false);      // Reset eye toggle
  setShowCPassword(false);     // Reset confirm password eye toggle
};



    return (
        <>

                    <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ background: "none" }}>{t("Change Password")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style = {{ padding: "20px", color: "#000", background: "none" }}>
                            <Form>
                           
                            <Form.Group controlId="formExistingPassword">
                                <Form.Label>{t("Enter Existing Password")} *</Form.Label>
                                  <div className="position-relative">
                                <Form.Control
                                type={showNewEPassword ? "text" : "password"}
                                value={existingPassword}
                                onChange={(e) => setExistingPassword(e.target.value)}
                                placeholder="Existing Password"
                                />
                                 <FontAwesomeIcon
                                    icon={showNewEPassword ? faEye : faEyeSlash}
                                    onClick={() => setShowNewEPassword(!showNewEPassword)}
                                    style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d"
                                    }}
                                />
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formNewChangedPassword" className="mt-3">
                                <Form.Label>{t("Enter New Password")} *</Form.Label>
                                <div className="position-relative">
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    value={newChangedPassword}
                                    onChange={(e) => setNewChangedPassword(e.target.value)}
                                    placeholder="New Password"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={showNewPassword ? faEye : faEyeSlash}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d"
                                    }}
                                />
                                </div>
                            </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseChangePasswordModal}>
                            {t("Cancel")}
                            </Button>
                            <Button variant="primary" onClick={handleChangePasswordSubmit}>
                            {t("Submit")}
                            </Button>
                        </Modal.Footer>
                        </Modal>


                    <Modal show={showPasswordModal} onHide={handleCloseSetPasswordModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ background: "none" }}>{t("Set Password")}</Modal.Title>
                </Modal.Header>
                <Modal.Body style = {{ padding: "20px", color: "#000", background: "none" }}>
                    <Form>
                       
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>{t("Enter Password")} *</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter Password"
                                    
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#6c757d"
                                }}
                            />
                            </div>

                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>{t("Confirm Password")} *</Form.Label>
                             <div className="position-relative">
                            <Form.Control
                                type={showCPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                            />
                            <FontAwesomeIcon
                                icon={showCPassword ? faEye : faEyeSlash}
                                onClick={() => setShowCPassword(!showCPassword)}
                                style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#6c757d"
                                }}
                            />
                            </div>
                        </Form.Group>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSetPasswordModal}>
                        {t("Cancel")}
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitPassword()}>
                        {t("Submit")}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Loader isLoading={loading}></Loader>
            <Sidebar
                sidebar={
                    <SidebarContent
                        closeSidebar={closeSidebar}
                        defaultOrg={defaultOrg}
                        latestPeriod={currentPeriod}
                        applyFilter={applyFilter}
                        resetFilter={resetFilter}
                        tab="dataExport"
                    ></SidebarContent>
                }
                open={isSidebarOpen}
                onSetOpen={() => onSetSidebarOpen()}
                styles={{ sidebar: { background: "white", zIndex: 99999 } }}
                //docked="true"
                sidebarClassName="custom-sidebar-class"
                //contentId= "custom-sidebar-content-id"
                //open="false"
                touch={true}
                shadow={true}
                //pullRight="false"
                //touchHandleWidth="1000"
                //dragToggleDistance="30"
                transitions={true}
            >
                <b>Main content</b>
            </Sidebar>
            <div className="mainContainer">
                <div className="headerfixedcontainer subnavheaderfixedcontainer">
                    <Container fluid>
                        <div className="headerbarcontainer">
                            <div className="mr-2">
                                <Button
                                    variant="primary"
                                    className="selectfilterbtn"
                                    onClick={() => onSetSidebarOpen()}
                                >
                                    {t("Select Filter")} <i className="fa fa-caret-down"></i>
                                </Button>
                            </div>
                            {/* <div className="daterangeholder mr-2">
                          <p className="mb-0 daterangeholder">
                          <i className="fa fa-chart-bar color-white fs-12px"></i>
                          <span className="daterange color-white">Cumulative</span>
                          </p>
                      </div> */}
                            <div className="mr-2">
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">
                                        {/* <FontAwesomeIcon className="color-white" icon={faHome} />{" "} */}
                                        {t("Data Export")}
                                    </Breadcrumb.Item>
                                    {breadcrumbOrg
                                        ? breadcrumbOrg.map((org) => (
                                            <Breadcrumb.Item href="#" key={org.id}>
                                                {org.displayName}
                                            </Breadcrumb.Item>
                                        ))
                                        : ""}
                                    {/* {/* <Breadcrumb.Item href="#">Library</Breadcrumb.Item> */}
                                    {/* <Breadcrumb.Item>World</Breadcrumb.Item> */}
                                </Breadcrumb>
                            </div>
                            <div className="ml-auto d-flex gap-2">
                                 {userData_ && ( (!("education" in userData_) || userData_.education == "") && (
                                <Button variant="primary" className="selectfilterbtn" onClick={() => setShowPasswordModal(true)}>
                                    {t("Set Password")}
                                </Button>
                                 )
                                 )}
                                {userData_ && userData_.education && userData_.education !== "" && (
                                <Button variant="primary" className="selectfilterbtn" onClick={() => setShowChangePasswordModal(true)}>
                                    {t("Change Password")}
                                </Button>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
                <div class="container-fluid pl-1 pr-1 mt-110px d-flex justify-content-around" style={{"margin-top": "150px"}}>
                    <Card className="fixHeight m-2" id="dataSection">
                        <Card.Header className="pt-3">{t("Variable List Export")}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Button
                                    onClick={() => downloadVariableTemplate(false)}
                                    // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"}
                                    // target="_blank"
                                    className="nextbtn ml-2"
                                >
                                    {t("Download")}
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="fixHeight m-2" id="dataSection">
                        <Card.Header className="pt-3">{t("Patient Data Export")}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Button
                                    onClick={() => downloadTemplate(false,false)}
                                    // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"}
                                    // target="_blank"
                                    className="nextbtn ml-2"
                                >
                                    {app_locale == "ETHIOPIA" ? t("Download (Gregorian Date)") : t("Download")}
                                    {/* {t("Download")} */}
                                </Button>
                                {app_locale == "ETHIOPIA" &&
                                    <Button
                                        onClick={() => downloadTemplate(false,true)}
                                        // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"}
                                        // target="_blank"
                                        className="nextbtn ml-2"
                                    >
                                        {t("Download (Ethiopian Date)")}
                                    </Button>
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="fixHeight m-2" id="dataSection">
                        <Card.Header className="pt-3">{t("De-Identified data export")}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Button
                                    onClick={() => downloadTemplate(true,false)}
                                    // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"}
                                    // target="_blank"
                                    className="nextbtn ml-2"
                                >
                                    {app_locale == "ETHIOPIA" ?  t("Download (Gregorian Date)") : t("Download")}
                                    {/* {t("Download")} */}
                                </Button>
                                {app_locale == "ETHIOPIA" &&
                                <Button
                                    onClick={() => downloadTemplate(true,true)}
                                    // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"}
                                    // target="_blank"
                                    className="nextbtn ml-2"
                                >
                                    {t("Download (Ethiopian Date)")}
                                </Button>
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <footer className="footer">
                    <p>Powered By</p>
                    <img
                        src={require("../../assets/images/durelogowhite.png")}
                        alt="gallary"
                        className="ml-2"
                    />
                </footer>
            </div>
        </>
    );
}

export default DataExport
