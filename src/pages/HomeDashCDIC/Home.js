import React, { useState, useEffect, useRef } from "react";
import API from "../../services";
import { connect } from "react-redux";
import Loader from "../../components/loaders/loader";
import { columnConfig, pieConf } from "../../components/highchart/chartconfig";
import ChartComponent from "../../components/highchart/ChartComponent";
import LeafletTest from "../../components/map/LeafletTest";
import Sidebar from "react-sidebar";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import SidebarContent from "../../components/SidebarContent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";

import {
  migrantChart,
  migrantRegisterPieChart,
} from "../../components/highchart/chartconfig";
import CountUp from "react-countup";
import { Container, Button, Breadcrumb, Col, Row } from "react-bootstrap";

import { useSelector } from "react-redux";

// import ReactECharts from 'echarts-for-react';
// import { barConfig, parlimentConfig, pieConfig, stackColumnConfig } from "../../components/echarts/chartconfig";
// import * as echarts from 'echarts';

import { mapIndicatorsList } from "../../config/appConfig";
import {
  LineTarget,
  barchart,
  highlightTableConfig,
  lineBMIChart,
  pieChart,
  stagchart,
  HardcodePieChart
} from "../../components/cdiccharts";
require("react-leaflet-markercluster/dist/styles.min.css");

const Home = ({ props }) => {
  const userData = useSelector((state) => state.storeState.userBO);
  const [loading, setLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  //const [chartData, setchartData] = useState([]);
  const [indicatorData, setindicatorData] = useState([]);
  const [mapMarkerData, setMapMarkerData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState({});
  const [currentMapKey, setCurrentMapKey] = useState(0);
  const reactGrid = useRef(null);
  const [mapIndicatorLabel, setMapIndicatorLabel] = useState(
    mapIndicatorsList[0].label
  );
  const [mapIndicatorValue, setMapIndicatorValue] = useState(
    mapIndicatorsList[0].value
  );

  const [filterFlag, setFilterFlag] = useState(false);
  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [defaultOrg, setDefaultOrg] = useState(
    useSelector((state) =>
      state.storeState.userBO.organisationUnits
        ? state.storeState.userBO.organisationUnits
        : []
    )
  );
  // useState(JSON.parse(sessionStorage.getItem("userData")).organisationUnits);

  const [orgID, setOrgID] = useState();

  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);
  //console.log(latestPeriod);
  const [currentPeriod, setCurrentPeriod] = useState(
    // date.getFullYear().toString()
    "2023;2024"
  );
  const [periodName, setPeriodName] = useState();
  const [periodType, setPeriodType] = useState("Yearly");

  const [isSidebarOpen, setSidebar] = useState(false);

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

  const applyFilter = (org, period, periodname,periodType) => {
    setFilterFlag(true);
    setBreadcrumbOrg(org);
    setindicatorData([]);
    setGeoJsonData({});
    setOrgID();
    setPeriodType(periodType)
    setPeriodName(periodname);
    //setTimeout(function () {

    // console.log(org);
    setOrgID(org[org.length - 1].id);
    // console.log(period);
    setCurrentPeriod(period);

    closeSidebar();
  };

  const resetFilter = () => {
    setindicatorData([]);
    setGeoJsonData({});
    setCurrentPeriod(date.getFullYear().toString());
    setPeriodName("");
    setOrgID(defaultOrg[0].id);
    setBreadcrumbOrg(defaultOrg);
    setFilterFlag(false);
    closeSidebar();
    //setCurrentMapKey(currentMapKey + 1);
  };

  useEffect(() => {
    // console.log(defaultOrg)
    if (!filterFlag) {
      setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
      setBreadcrumbOrg(defaultOrg);
    }
    getMapData();
    DataForCharts();
  }, [orgID, currentPeriod, userData]);

  const getMapData = () => {
    if (orgID) {
      let instance = {
        orguid: orgID,
        programid: JSON.parse(sessionStorage.getItem("userData")).programuid,
        fromdate: "2022-01-01",
        todate:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate(),
      };
      API.post("dashboardIndicator/realtimemap", instance).then((res) => {
        // console.log(res, "MapData")
        setMapMarkerData(res.data.data);
        setCurrentMapKey(Math.random());
      });
    }
  };

  // new function for indicator click
  const history = useNavigate();

  const getDatePeriod = () => {
    // console.log(periodName)
      // console.log(periodName)
      if (!periodName || periodName == '') {
        if (currentPeriod.includes("-")) {
          return (
            <Moment
              date={new Date(currentPeriod)}
              format="MMM-YYYY"
            />
          )
        } else if(currentPeriod.includes(";")) {
          return (
            <>
            {currentPeriod.replace(";","-")}
            </>
          )
        } else {
          return (
            <Moment date={new Date(currentPeriod)} format="YYYY" />
          )
        }
      }
      else {
        return (
          <>
            {periodName}
          </>
        )
      }
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
  const radioClick1 = (name, indicator) => {
    // if (indicator == 'Cascade Of Care (TB)')
    // setTbChartType(name)
    // setCurrentChartKey(currentChartKey + 1);
  };
  const radioClick2 = (name, indicator) => {
    // if (indicator == 'Cascade Of Care (LTBI)')
    // setLtbiChartType(name)
    // setCurrentChartKey(currentChartKey + 1);
  };

  // Variable for CDIC Chart

  const [indicatorDataMeta, setindicatorDataMeta] = useState({
    "Total screened for T1D": 0,
    "Total patients diagnosed with T1D": 0,
    "Total T1D patients on medical therapy": 0,
  });

  const [FRAILTYCHARTDATA, setFRAILTYCHARTDATA] = useState([
    {
      name: "Year 2022",
      data: [45, 30, 5, 20],
    },
    {
      name: "Year 2023",
      data: [20, 30, 45, 5],
    },
  ]);
  const FRAILTYCHARTCATEGORY = ["Region1", "Region2", "Region3", "Region4"];

  const [TD1GENDERCHARTDATA, setTD1GENDERCHARTDATA] = useState([
    {
      name: "male ",
      data: [10, 30],
    },
    {
      name: "female",
      data: [20, 20],
    },
    {
      name: "other",
      data: [0, 0],
    },
  ]);
  const TD1GENDERCHARTCATEGORY = ["Children", "Adolescents"];

  const xaxiscontroldiabetes = [
    "Patients with controlled diabetes",
    "Patients with uncontrolled diabetes",
  ];

  const [BMICHARTDATA, setBMICHARTDATA] = useState([
    {
      name: "diabetic and obessed",
      data: [10, 4, 5, 1],
      type: "line",
    },
    {
      name: "diabetic and fit",
      data: [8, 4, 6, 2],
      type: "line",
    },
    {
      name: "daibetic and low fat",
      data: [10, 4, 7, 3],
      type: "line",
    },
    {
      name: "daibetic and highly obessed",
      data: [2, 4, 1, 0],
      type: "line",
    },
  ]);

  const [CASCADECHARTDATA, setCASCADECHARTDATA] = useState([
    {
      name: "male ",
      data: [50, 50, 50, 40, ],
    },
    {
      name: "female",
      data: [40, 40, 40, 35, ],
    },
    {
      name: "other",
      data: [10, 8, 6, 0,],
    },
  ]);

  const CASCADECHARTCATEGORY = [
    "Total Enrolled",
    "Total Referred for further Investigations",
    "Treatment Initiated",
    "Total Cured",
    // "Treatment Initiated",
  ];

  const [dataofPCS, setDataofPCS] = useState([
    {
      name: "Mental health",
      y: 5,
    },
    {
      name: "Celiac diasease",
      y: 5,
    },
    {
      name: "Others",
      y: 5,
    },
    {
      name: "No co-morbidity reported",
      y: 5,
    },
  ]);

  const [dataofDiabeteChart, setDataofDiabeteChart] = useState([10, 15, 20]);

  const xAxisCategoriesofDiabeteChart = ["Daily", "Alternate", "Weekly"];

  const [dataOfAMTE, setDataOfAMTE] = useState([
    [0, 0, 20],
    [0, 1, 10],
    [0, 2, 5],
  ]);

  const yAxisCategoriesOfAMTE = [
    "Availability of Diabetes Core Medicines",
    "Availability of Plasma Glucose Testing Kits",
    "Availability of HbA1c Testing Kits",
  ];

  const [dataofpie, setdataofpie] = useState([
    {
      name: "DKA",
      y: 5,
    },
    {
      name: "Hypoglycemic events",
      y: 5,
    },
    {
      name: "Retinopathy",
      y: 5,
    },
    {
      name: "Neuropathy",
      y: 5,
    },
    {
      name: "Nephropathy",
      y: 5,
    },
    {
      name: "CVA",
      y: 5,
    },
    {
      name: "MI",
      y: 5,
    },
  ]);

  const DataForCharts = (data) => {
    if(orgID){
      setLoading(true)
    let instance = {
      programid: "eAHvg6zuxvK",
      orguid: orgID,
      "periodvalue": periodType == 'quaterly' ? 'monthly' : periodType,
      "periodyear": currentPeriod.replace("-","")
    };

    API.post(`dashboardIndicator/getlistindicator`, instance).then((res) => {
      console.log(res.data.data);
      // const [indicatorDataMeta,setindicatorDataMeta] = useState({
      //   "Total screened for T1D":60,
      //   "Total patients diagnosed with T1D":40,
      //   "Total T1D patients on medical therapy":15
      // });
      let temp = {
        "Total screened for T1D": 0,
        "Total patients diagnosed with T1D": 0,
        "Total T1D patients on medical therapy": 0,
      };
      res.data.data.map((el) => {
        console.log(el);
        if (el.indicatorname === "Total screened for T1D-")
          temp["Total screened for T1D"] = el.counts;

        if (el.indicatorname === "Total Diagnosed with T1 D-")
          temp["Total patients diagnosed with T1D"] = el.counts;

        if (el.indicatorname === "Total on medical tehrapy- ")
          temp["Total T1D patients on medical therapy"] = el.counts;

        // setINDICATOROBJECTDATA(el)
        // setindicatorDataMeta({
        //   "Total screened for T1D":el.indicatorname === "Total screened for T1D-" ? el.counts : 0,
        //   "Total patients diagnosed with T1D":el.indicatorname === "Total Diagnosed with T1 D-" ? el.counts : 0,
        //   "Total T1D patients on medical therapy":el.indicatorname === "Total on medical tehrapy- " ? el.counts : 0
        // })
      });
      setindicatorDataMeta(temp);
    }).catch((err)=> {
      console.log("API call error:",err)
    });

    API.post(`dashboardIndicator/getchartlist`, instance).then((res) => {
      console.log(res.data.data);
      let WholeData = res.data.data;
      let hardcodechartDiabetes = [
        WholeData[1]["Hospital_Visit Daily"]["Hospital_Visit Daily"],
        WholeData[1]["Hospital_Visit Alternate"]["Hospital_Visit Alternate"],
        WholeData[1]["Hospital_Visit Weekly"]["Hospital_Visit Weekly"],
      ];

      setDataofDiabeteChart(hardcodechartDiabetes);

      let hardcodepiechartPCS = [
        {
          name: "Mental health",
          y: WholeData[0]["Mental Health Disorder"]["Mental Health Disorder"],
        },
        {
          name: "Celiac diasease",
          y: WholeData[0]["Celiac Disease"]["Celiac Disease"],
        },
        {
          name: "Others",
          y: WholeData[0]["Smoking"]["Smoking"],
        },
        {
          name: "No co-morbidity reported",
          y: WholeData[0]["Pubertal Stage"]["Pubertal Stage"],
        },
      ];
      setDataofPCS(hardcodepiechartPCS);

      let cascadeData = [
        {
          name: "male ",
          data: [
            WholeData[2]["Total Registered Male -"]["Total Registered Male -"],
            WholeData[3]["Total screened Male -"]["Total screened Male -"],
            WholeData[4]["Total referred fo further investigation Male -"][
              "Total referred fo further investigation Male -"
            ],
            WholeData[5]["Total diagnosed Male -"]["Total diagnosed Male -"],
            WholeData[6]["Treatment initiated Male"][
              "Treatment initiated Male"
            ],
          ],
        },
        {
          name: "female",
          data: [
            WholeData[2]["Total Registered Female -"][
              "Total Registered Female -"
            ],
            WholeData[3]["Total screened Female -"]["Total screened Female -"],
            WholeData[4]["Total referred fo further investigation Female -"][
              "Total referred fo further investigation Female -"
            ],
            WholeData[5]["Total diagnosed Female -"][
              "Total diagnosed Female -"
            ],
            WholeData[6]["Treatment initiated Female"][
              "Treatment initiated Female"
            ],
          ],
        },
        {
          name: "other",
          data: [
            WholeData[2]["Total Registered Other -"][
              "Total Registered Other -"
            ],
            WholeData[3]["Total screened Other -"]["Total screened Female -"],
            WholeData[4]["Total referred fo further investigation Other -"][
              "Total referred fo further investigation Other -"
            ],
            WholeData[5]["Total diagnosed Other -"]["Total diagnosed Other -"],
            WholeData[6]["Treatment initiated Other"][
              "Treatment initiated Other"
            ],
          ],
        },
      ];

      // setCASCADECHARTDATA(cascadeData);

      let piedata = [
        {
          name: "DKA",
          y: WholeData[7]["DKA"]["DKA"],
        },
        {
          name: "Hypoglycemic events",
          y: WholeData[7]["Hypoglycemic"]["Hypoglycemic"],
        },
        {
          name: "Retinopathy",
          y: WholeData[7]["Retinopathy"]["Retinopathy"],
        },
        {
          name: "Neuropathy",
          y: WholeData[7]["Neuropathy"]["Neuropathy"],
        },
        {
          name: "Nephropathy",
          y: WholeData[7]["Nephropathy"]["Nephropathy"],
        },
        {
          name: "CVA",
          y: WholeData[7]["CVA"]["CVA"],
        },
        {
          name: "MI",
          y: WholeData[7]["MI"]["MI"],
        },
      ];
      setdataofpie(piedata);

      // let frailtyChart = [
      //   {
      //     name: "Year 2022",
      //     data: [45, 30, 5, 20],
      //   },
      //   {
      //     name: "Year 2023",
      //     data: [20, 30, 45, 5],
      //   }
      // ]
      // setFRAILTYCHARTDATA(frailtyChart)

      let TD1Chart = [
        {
          name: "male ",
          data: [
            WholeData[8]["Total Children Male -"]["Total Children Male -"],
            WholeData[9]["Total Adolescents Male -"][
              "Total Adolescents Male -"
            ],
          ],
        },
        {
          name: "female",
          data: [
            WholeData[8]["Total Children Female -"]["Total Children Female -"],
            WholeData[9]["Total Adolescents Female -"][
              "Total Adolescents Female -"
            ],
          ],
        },
        {
          name: "other",
          data: [
            WholeData[8]["Total Children Other -"]["Total Children Other -"],
            WholeData[9]["Total Adolescents Other -"][
              "Total Adolescents Other -"
            ],
          ],
        },
      ];
      // setTD1GENDERCHARTDATA(TD1Chart);
    }).catch((err)=> {
      console.log("API call error:",err)
    });

    setLoading(false)
    //   // chart3 piechart PCS
      
  }
    
  }

  return (
    <>
      <Sidebar
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
        sidebarClassName="custom-sidebar-class"
        touch={true}
        shadow={true}
        transitions={true}
      >
        <b>Main content</b>
      </Sidebar>
      <div className="mainContainer">
        <Loader isLoading={loading} />

        <div className="headerfixedcontainer">
          <Container fluid>
            <div className="headerbarcontainer">
              <div className="mr-2">
                <Button
                  variant="primary"
                  className="selectfilterbtn"
                  onClick={() => onSetSidebarOpen()}
                >
                  Select Filter <i className="fa fa-caret-down"></i>
                </Button>
              </div>
              <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <FontAwesomeIcon
                    className="color-white fs-12px"
                    icon={faCalendar}
                  />
                  <span className="daterange color-white">
                    {getDatePeriod()}
                  </span>
                </p>
              </div>
              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <FontAwesomeIcon className="color-white" icon={faHome} />
                    {/* <i className="fa fa-home color-white"></i> */}
                    Dashboard
                  </Breadcrumb.Item>
                  {breadcrumbOrg && breadcrumbOrg.length > 0
                    ? breadcrumbOrg.map((org) => (
                        <Breadcrumb.Item href="#" key={org.id}>
                          {org.displayName}
                        </Breadcrumb.Item>
                      ))
                    : ""}
                  {/* <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
                  <Breadcrumb.Item active>Data</Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
            </div>
          </Container>
        </div>

        <div className="container-fluid pl-1 pr-1 mt-110px">
          {/* custom layout .................................................................................................*/}
          <>
            <div className="container-fluid mobile-container">
              <Row>
                <Col xs={4} lg={4}>
                  <div
                    className="card mb-2 cardbgdark"
                    style={{
                      borderLeft: "5px solid ",
                      width: "100%",
                      height: "9rem",
                    }}
                  >
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      Total Enrolled
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    >
                    
                      <div className="card-text">
                        
                        <CountUp
                          duration={5}
                          // end={indicatorDataMeta["Total screened for T1D"]}
                          end={100}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={4} lg={4}>
                  <div
                    className="card mb-2 cardbgdark"
                    style={{
                      borderLeft: "5px solid ",
                      width: "100%",
                      height: "9rem",
                    }}
                  >
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      Total TID patients on Treatment
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    >
                     
                      <div className="card-text">
                        
                        <CountUp
                          duration={5}
                          end={
                           96
                            // end={
                            //   indicatorDataMeta[
                            //     "Total patients diagnosed with T1D"
                            //   ]
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={4} lg={4}>
                  <div
                    className="card mb-2 cardbgdark"
                    style={{
                      borderLeft: "5px solid ",
                      width: "100%",
                      height: "9rem",
                    }}
                  >
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      Total Cured
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    >
                      <div className="card-text">
                        
                        <CountUp
                          duration={5}
                          end={
                            75
                            // indicatorDataMeta[
                            //   "Total T1D patients on medical therapy"
                            // ]
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                {/* <Col xs={12} lg={6}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">FRAILTY CHART</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={barchart(
                          FRAILTYCHARTDATA,
                          "",
                          FRAILTYCHARTCATEGORY
                        )}
                      />
                    </div>
                  </div>
                </Col> */}
                <Col xs={12} lg={4}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">
                    Distribution of T1D Patients by Gender
                    </h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={stagchart(
                          TD1GENDERCHARTDATA,
                          "",
                          TD1GENDERCHARTCATEGORY
                        )}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={4}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">
                      Diabetes Control Status in Patients
                    </h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={LineTarget(
                          [40, 20],
                          "Diabetes Chart",
                          xaxiscontroldiabetes
                        )}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={4}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">BMI Chart</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent options={lineBMIChart(BMICHARTDATA)} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row></Row>
              <Row>
                <Col xs={12} lg={12}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">T1D- Cascade of Care</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={stagchart(
                          CASCADECHARTDATA,
                          "Timeliness of Referral for testing & treatment",
                          CASCADECHARTCATEGORY
                        )}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={6}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">
                      Total patients with Co-mobidities
                    </h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={HardcodePieChart(dataofPCS, "Patient Control Status")}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Hospital Visit Frequency</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={LineTarget(
                          dataofDiabeteChart,
                          "Diabetes Chart",
                          xAxisCategoriesofDiabeteChart
                        )}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={6}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">
                      Availability of Medicines &amp; tests/equipments (Per
                      facility)
                    </h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={highlightTableConfig(
                          dataOfAMTE,
                          "Availability of Medicines & tests/equipments",
                          yAxisCategoriesOfAMTE
                        )}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Complication Reporting Rate</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={pieChart(dataofpie, "Patient Control Status")}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Hotspot Map</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{
                        background: "#2d3d4f",
                        height: "300px",
                        width: "100%",
                        zIndex: "999",
                      }}
                    >
                      <LeafletTest
                        key={1234 + currentMapKey}
                        mapHeight={10 + 2.375}
                        markerData={mapMarkerData}
                      />
                    {/* <LeafletMarkerMap
                        key={1234 + currentMapKey}
                        mapHeight={10 + 2.375}
                        markerData={mapMarkerData}
                      /> */}
                      {/* <LeafletMarkerMap
                        key={1234 + currentMapKey}
                        mapHeight={10 + 2.375}
                        markerData={mapMarkerData}
                      /> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </>
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

export default Home;
