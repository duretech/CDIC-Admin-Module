import React, { useEffect, useState, useRef } from "react";
// import KeyNumber from '../../components/KeyNumber'
import { faCalendar, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import { Card, Col, Form, Row } from "react-bootstrap";
import API, { multipartPostCall } from "../../services";
import { Translation, useTranslation } from "react-i18next";
import Moment from "react-moment";

import { saveAs } from "file-saver";


import { Breadcrumb, Button, Container, InputGroup } from "react-bootstrap";
import swal from "sweetalert";
import Loader from "../../components/loaders/loader";
const colors = [
  "#1d6996",
  "#ff8080",
  "#67cb60",
  "#8866a5",
  "#09a799",
  "#f5d63d",
  "#79ff4d",
  "#f35b5a",
  "#79c267",
  "#bf62a6",
  "#c5d647",
  "#6cc9dd",
  "#e868a2",
  "#fb5e19",
  "#66ffff",
  "#ff1a8c",
  "#cccc00",
  "#000080",
];

const AppLabelTranslations = ({ props }) => {
  const fileInputRef = useRef(null)
  const { t, i18n } = useTranslation();

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

  const applyFilter = (org, period, periodname, periodType) => {
    setFilterFlag(true);
    setBreadcrumbOrg(org);
    setOrgID();

    setPeriodName(periodname);
    setPeriodType(periodType);
    //setTimeout(function () {

    setOrgID(org[org.length - 1].id);
    // console.log(org);
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
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = [".xlsx", ".csv"];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setFileName("No file chosen");
        setSelectedFile(null);
        swal({
          title: "",
          text: "Invalid file type. Please upload a .xlsx file.",
          icon: "warning",
          button: "Close",
        })
        e.target.value = ""; // Reset the file input
        return;
      }

      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const clearFile = () => {
    setFileName(""); // Clear file name
    setSelectedFile("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const downloadTemplate = () => {
    setLoading(true);

    API.post("rtmpro/template/getAppLables", {}, { responseType: "arraybuffer" })
      .then((res) => {
        setLoading(false);

        if (!res || !res.data) {
          console.error("❌ No valid response from API.");
          return;
        }

        // ✅ Convert response data into a Blob
        const excelBlob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // ✅ Trigger file download
        saveAs(excelBlob, "AppLabelTranslations.xlsx");

        console.log("✅ Excel file downloaded successfully!");
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Error downloading Excel:", error.message);
      });
  };
  const uploadXML = () => {

    var frmData = new FormData();
    frmData.append("file", selectedFile)
    var reqObj = {
      "programid": JSON.parse(sessionStorage.getItem("userData")).programuid
    }
    // frmData.append("inputjson",JSON.stringify(reqObj))
    multipartPostCall('rtmpro/template/updateAppLables', frmData).then(res => {
      // multipartPostCall('uploadfile/uploadexceldata',frmData).then(res =>{
      console.log(res)
    }).catch(err => {
      console.log(err)
      setSelectedFile("")
      setFileName("No file chosen")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input field
      }
      swal({
        title: "",
        text: "Something went wrong on our end. If the issue persists, ensure that you have uploaded a valid .xlsx file.",
        icon: "error",
        button: "Close",
      })
    })
    setSelectedFile("")
    setFileName("No file chosen")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
    swal({
      title: "",
      text: "File sent for processing, Please check in few minutes!",
      icon: "success",
      button: "Close",
    })
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
  return (
    <>
      <Loader isLoading={loading}></Loader>
      {/* <Sidebar
        sidebar={
          <SidebarContent
            closeSidebar={closeSidebar}
            defaultOrg={defaultOrg}
            latestPeriod={currentPeriod}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
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
      </Sidebar> */}
      <div className="mainContainer overflow-hidden">
        <div className="headerfixedcontainer subnavheaderfixedcontainer">
          <Container fluid>
            <div className="headerbarcontainer">
              {/* <div className="mr-2">
                <Button
                  variant="primary"
                  className="selectfilterbtn"
                  onClick={() => onSetSidebarOpen()}
                >
                  {t("Select Filter")} <i className="fa fa-caret-down"></i>
                </Button>
              </div> */}
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
                    {t("App Label Translations")}
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
            </div>
          </Container>
        </div>
        <div class="container-fluid pl-1 pr-1 mt-110px" style={{ "margin-top": "160px" }}>
          <Card className="fixHeight data-uploadSection" id="dataSection">
            <Card.Header className="pt-3">{t("Upload App Label Translations")}</Card.Header>
            <Card.Body>
              <Card.Text>
                <Row>
                  <Col lg={12}>
                    <Row>
                      <Col>
                        {/* <Form.Group controlId="formFileSm" className="mb-3">
                          <Form.Control
                            data-title={fileName}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={(e) => changeHandler(e)}
                            type="file"
                            size="sm"
                          />
                        </Form.Group> */}
                        <Form.Group controlId="formFileSm" className="mb-3">
                          <InputGroup size="sm">
                            <Form.Control
                              ref={fileInputRef}
                              data-title={fileName}
                              accept=".xlsx, .csv"

                              // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              onChange={(e) => changeHandler(e)}
                              type="file"
                            />
                            {fileName && selectedFile && (
                              <Button
                                variant="outline-secondary"
                                onClick={clearFile}
                                className="position-absolute end-0 top-0"
                                style={{
                                  border: "none",
                                  marginTop: '7px',
                                  background: "#e5e5e5",
                                  fontSize: "1rem",
                                  padding: "0.375rem",
                                  lineHeight: "1",
                                  cursor: "pointer",
                                }}
                              >
                                ✖
                              </Button>
                            )}
                          </InputGroup>
                          {fileName && selectedFile && <small className="text-muted mt-2">Selected: {fileName}</small>}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Button onClick={() => downloadTemplate()}
                  // href={appBaseUrl  + "exceldownload/CDIC_Template.xlsx"} 
                  // target="_blank"
                  className="nextbtn ml-2">
                  {t("Download Template")}
                </Button>
                <Button disabled={selectedFile ? false : true} onClick={() => uploadXML()} className="nextbtn ml-2 ">
                  {t("Upload")}
                </Button>
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
};

export default AppLabelTranslations;
