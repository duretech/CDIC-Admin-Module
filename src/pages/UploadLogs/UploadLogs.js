import React, { useEffect, useState } from "react";
// import KeyNumber from '../../components/KeyNumber'
import { faCalendar, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import { Card, Col, Form, Row } from "react-bootstrap";
import API, { multipartPostCall } from "../../services";
import _ from "lodash";
import Moment from "react-moment";
import Sidebar from "react-sidebar";
import SidebarContent from "../../components/SidebarContent";

import ComponentLoader from "../../components/loaders/ComponentLoader";

import Table from "./DataTable";
import { useTranslation } from "react-i18next";

import { Breadcrumb, Button, Container } from "react-bootstrap";
import { appBaseUrl } from "../../config/appConfig";
import swal from "sweetalert";
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

const UploadLogs = ({ props }) => {
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

  const [accessKey, setAccessKey] = useState(0);

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

  const [accessLogData, setAccessLogData] = useState([]);
  const changeHandler = (e) => {
    setFileName(e.target.files[0].name);
    var file = e.target.files[0];

    setSelectedFile(file);

    return;
  };

  const uploadXML = () => {
    var frmData = new FormData();
    frmData.append("file", selectedFile);
    var reqObj = {
      programid: JSON.parse(sessionStorage.getItem("userData")).programuid,
    };
    frmData.append("inputjson", JSON.stringify(reqObj));
    multipartPostCall("uploadfile/uploadexceldata", frmData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    swal({
      title: "Succes",
      text: "File uploaded sucessfully",
      icon: "success",
      button: "Close",
    });
  };
  useEffect(() => {
    setLoading(true);
    setLoadingChart(true);
    let mounted = true;
    let count = 0;

    if (!filterFlag) {
      setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
      setBreadcrumbOrg(defaultOrg);
    }
    if (orgID) getAccessLogs();
  }, [orgID, currentPeriod]);
  const getAccessLogs = () => {
    API.get("uploadfile/getExcelUploadLogs").then((res) => {
      console.log(res.data, "res");
      setAccessLogData(_.filter(res.data.data, { "username": JSON.parse(sessionStorage.getItem('userData')).username}));
      setAccessKey(Math.random());
    });
  };
  return (
    <>
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
      <div className="mainContainer">
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
                    {t("Data Upload")}
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
        <div class="container-fluid pl-1 pr-1 mt-110px">
          <div className="table-linelist mb-3 ml-3 mr-3">
            <Table key={accessKey} userData={accessLogData} />
          </div>
          {/* <Card className="fixHeight">
            <Card.Header>Data Upload</Card.Header>
            <Card.Body>
              
            </Card.Body>
          </Card> */}
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

export default UploadLogs;
