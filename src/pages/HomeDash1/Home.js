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
  migrantRegisterPieChart
} from "../../components/highchart/chartconfig";
import CountUp from "react-countup";
import {
  Container,
  Button,
  Breadcrumb,
  Col,
  Row,
} from "react-bootstrap";

import { useSelector } from "react-redux"

// import ReactECharts from 'echarts-for-react';
// import { barConfig, parlimentConfig, pieConfig, stackColumnConfig } from "../../components/echarts/chartconfig";
// import * as echarts from 'echarts';


import {
  mapIndicatorsList,
} from "../../config/appConfig";
import { t } from "i18next";
require("react-leaflet-markercluster/dist/styles.min.css");

const Home = ({ props }) => {
  const userData = useSelector(state => state.storeState.userBO)
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
  const [defaultOrg, setDefaultOrg] = useState(useSelector(state => state.storeState.userBO.organisationUnits ? state.storeState.userBO.organisationUnits : []))
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
    date.getFullYear().toString()
  );
  const [periodName, setPeriodName] = useState();
  const [periodType, setPeriodType] = useState('Yearly');

  const [isSidebarOpen, setSidebar] = useState(false);

  const [genderTBMetaSeries, setGenderTBMetaSeries] = useState([]);
  const [genderLTBIMetaSeries, setGenderLTBIMetaSeries] = useState([]);

  const [ageCat, setAgeCat] = useState([]);
  const [ageData, setAgeData] = useState([]);

  const [coMobCat, setCoMobCat] = useState([]);
  const [coMobData, setCoMobData] = useState([]);

  const cascadeTbMigrantData = {
    "Type Of Migrant": [
      {
        name: "Documented migrant",
        data: [],
      },
      {
        name: "Non-documented migrant",
        data: [],
      },
      {
        name: "Refugees",
        data: [],
      },
      {
        name: "Returnees",
        data: [],
      },
      {
        name: "IDPs",
        data: [],
      },
    ],
    'Gender': [
      {
        name: "Male",
        data: [],
      },
      {
        name: "Female",
        data: [],
      },
      {
        name: "Transgender",
        data: [],
      },
    ],
    "Import vs Indegenous": [
      {
        name: "Indigenous",
        data: [84, 49, 27, 20, 7],
      },
      {
        name: "Import",
        data: [45, 31, 16, 8, 2],
      },
    ],
    'Country': [
      {
        name: "Afghanistan",
        data: [],
      },
      {
        name: "Iran",
        data: [],
      },
      {
        name: "Pakistan",
        data: [],
      },
    ]
  };
  const cascadeLtbiMigrantData = {
    "Type Of Migrant": [
      {
        name: "Documented migrant",
        data: [],
      },
      {
        name: "Non-documented migrant",
        data: [],
      },
      {
        name: "Refugees",
        data: [],
      },
      {
        name: "Returnees",
        data: [],
      },
      {
        name: "IDPs",
        data: [],
      },
    ],
    'Gender': [
      {
        name: "Male",
        data: [],
      },
      {
        name: "Female",
        data: [],
      },
      {
        name: "Transgender",
        data: [],
      },
    ],
    "Import vs Indegenous": [
      {
        name: "Indigenous",
        data: [84, 49, 27, 20, 7],
      },
      {
        name: "Import",
        data: [45, 31, 16, 8, 2],
      },
    ],
    'Country': [
      {
        name: "Afghanistan",
        data: [],
      },
      {
        name: "Iran",
        data: [],
      },
      {
        name: "Pakistan",
        data: [],
      },
    ]
  };
  const [tbMigrData, settbMigrData] = useState([]);
  const [ltbiMigrData, setLtbiMigrData] = useState([]);
  const [tbMigrCat, settbMigrCat] = useState([]);
  const [ltbiMigrCat, setltbiMigrCat] = useState([]);
  const [tbChartType, setTbChartType] = useState('normal')
  const [ltbiChartType, setLtbiChartType] = useState('normal')
  const [currentChartKey, setCurrentChartKey] = useState(0);
  const [indicatorObject, setIndicatorObject] = useState({});

  const [tptName, setTPTName] = useState(JSON.parse(sessionStorage.getItem("userData")).programuid == 'xr2u8yFicc5' ? "LTBI" : "TPT");

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

  const applyFilter = (org, period, periodname) => {
    setFilterFlag(true);
    setBreadcrumbOrg(org);
    setindicatorData([]);
    setGeoJsonData({});
    setOrgID();

    setPeriodName(periodname)
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
    setPeriodName('')
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
    loadLTBICascadeChart('Gender');
    loadTBCascadeChart('Gender');
    getDashboardIndicator();
    getGenderChart();
    ageDistChart();
    coMobChart();
    getMapData();
  }, [orgID, currentPeriod,userData]);

  const getMapData = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "fromdate": "2022-01-01",
        "todate": new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
      }
      API.post('dashboardIndicator/realtimemap', instance).then(res => {
        // console.log(res, "MapData")
        setMapMarkerData(res.data.data)
        setCurrentMapKey(Math.random())
      })
    }
  }
  const ageDistChart = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      API.post('dashboardIndicator/geindicators/get_custom_dashboard_Age', instance).then(res => {
        let indicatorData = {}
        res.data.data && res.data.data.map(el => {
          indicatorData[el.indicator] = el.count
        })
        setAgeCat(Object.keys(indicatorData))
        let ageData = [{
          name: 'Age Distribution',
          data: Object.values(indicatorData)
        }]
        setAgeData(ageData)
      })
    }
  }
  const coMobChart = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      API.post('dashboardIndicator/geindicators/get_custom_dashboard_morbidity', instance).then(res => {
        let indicatorData = {}
        res.data.data && res.data.data.map(el => {
          indicatorData[el.indicator] = el.count
        })
        setCoMobCat(Object.keys(indicatorData))
        let ageData = [{
          name: 'Co Morbidity Factors',
          data: Object.values(indicatorData)
        }]
        setCoMobData(ageData)
      })
    }
  }
  const getGenderChart = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      API.post('dashboardIndicator/geindicators/get_custom_dashboard_gender', instance).then(res => {
        let tbData = [];
        let tptData = []
        res.data.data && res.data.data.map(el => {
          if(el.indicator.includes('LTBI Positive')){
            let temp = {
              'name': el.indicator.split("and")[1],
              'y': el.count
            }
            tptData.push(temp)
          }
          if(el.indicator.includes('TB Positive')){
            let temp = {
              'name': el.indicator.split("and")[1],
              'y': el.count
            }
            tbData.push(temp)
          }
        })
        if(JSON.parse(sessionStorage.getItem("userData")).programuid == 'xr2u8yFicc5'){
          tbData.pop()
          tptData.pop()
        }
        setGenderTBMetaSeries(tbData)
        setGenderLTBIMetaSeries(tptData)
      })
    }
  }
  const getDashboardIndicator = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      let aGet_custom_tb_dashboard_indicators = API.post('dashboardIndicator/geindicators/get_custom_tb_dashboard_indicators', instance),
        aGet_custom_ltbi_dashboard_indicators = API.post('dashboardIndicator/geindicators/get_custom_ltbi_dashboard_indicators', instance);
      Promise.all([aGet_custom_tb_dashboard_indicators, aGet_custom_ltbi_dashboard_indicators])
        .then(([aGet_custom_tb_dashboard_indicators, aGet_custom_ltbi_dashboard_indicators]) => {
          let indicatorData = {}
          // console.log(aGet_custom_tb_dashboard_indicators.data.data, aGet_custom_ltbi_dashboard_indicators.data.data)
          aGet_custom_tb_dashboard_indicators.data.data && aGet_custom_tb_dashboard_indicators.data.data.map(el => {
            indicatorData[el.indicator] = el.count
          })
          aGet_custom_ltbi_dashboard_indicators.data.data && aGet_custom_ltbi_dashboard_indicators.data.data.map(el => {
            indicatorData[el.indicator] = el.count
          })
          setIndicatorObject(indicatorData)
        })
    }
  }
  const loadLTBICascadeChart = (typeValue) => {
    // console.log(typeValue)
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "filter": typeValue,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      // https://undp.imonitorplus.com/service/api/29/sqlViews/qa0zRBFmh7y/data?paging=false&var=orguid:I9jfaLculAp&var=type:Country
      // API.get(`29/sqlViews/qa0zRBFmh7y/data?paging=false&var=orguid:`+ 'I9jfaLculAp' + `&var=type:`+ typeValue).then((res) => {
      API.post(`filter/getltbifilter`, instance).then((res) => {
        // console.log(res.data.rows, "res.data.rows")
        let tempCat = []
        res.data.rows && res.data.rows.map(el => {
          if (!tempCat.includes(el[1]))
            tempCat.push(el[1])
          if (typeValue == 'Type Of Migrant') {
            if (el[2].includes('Migrant documented'))
              cascadeLtbiMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Non documented migrant'))
              cascadeLtbiMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Refugee'))
              cascadeLtbiMigrantData[typeValue][2].data.push(el[0])
            if (el[2].includes('Returnees'))
              cascadeLtbiMigrantData[typeValue][3].data.push(el[0])
            if (el[2].includes('IDP'))
              cascadeLtbiMigrantData[typeValue][4].data.push(el[0])
          }
          else if (typeValue == 'Gender') {
            
            if (el[2].includes('Male'))
              cascadeLtbiMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Female'))
              cascadeLtbiMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Third gender'))
              cascadeLtbiMigrantData[typeValue][2].data.push(el[0])
          }
          else if (typeValue == 'Country') {
            if (el[2].includes('Afghanistan'))
              cascadeLtbiMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Iran'))
              cascadeLtbiMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Pakistan'))
              cascadeLtbiMigrantData[typeValue][2].data.push(el[0])
          }
        })
        if(JSON.parse(sessionStorage.getItem("userData")).programuid == 'xr2u8yFicc5' && typeValue == 'Gender'){
          cascadeLtbiMigrantData[typeValue].pop()
        }
        // console.log(cascadeLtbiMigrantData[typeValue],tempCat)
        setLtbiMigrData(cascadeLtbiMigrantData[typeValue])
        setltbiMigrCat(tempCat)
      })
    }
  }
  const loadTBCascadeChart = (typeValue) => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "filter": typeValue,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      }
      // API.get(`29/sqlViews/qQGeS96l7WB/data?paging=false&var=orguid:`+  'I9jfaLculAp' + `&var=type:`+ typeValue).then((res) => {
      API.post(`filter/gettbfilter`, instance).then((res) => {
        let tempCat = []
        res.data.rows && res.data.rows.map(el => {
          if (!tempCat.includes(el[1]))
            tempCat.push(el[1])
          if (typeValue == 'Type Of Migrant') {
            if (el[2].includes('Migrant documented'))
              cascadeTbMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Non documented migrant'))
              cascadeTbMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Refugee'))
              cascadeTbMigrantData[typeValue][2].data.push(el[0])
            if (el[2].includes('Returnees'))
              cascadeTbMigrantData[typeValue][3].data.push(el[0])
            if (el[2].includes('IDP'))
              cascadeTbMigrantData[typeValue][4].data.push(el[0])
          }
          else if (typeValue == 'Gender') {
            if (el[2].includes('Male'))
              cascadeTbMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Female'))
              cascadeTbMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Third gender'))
              cascadeTbMigrantData[typeValue][2].data.push(el[0])
          }
          else if (typeValue == 'Country') {
            if (el[2].includes('Afghanistan'))
              cascadeTbMigrantData[typeValue][0].data.push(el[0])
            if (el[2].includes('Iran'))
              cascadeTbMigrantData[typeValue][1].data.push(el[0])
            if (el[2].includes('Pakistan'))
              cascadeTbMigrantData[typeValue][2].data.push(el[0])
          }
        })
        if(JSON.parse(sessionStorage.getItem("userData")).programuid == 'xr2u8yFicc5' && typeValue == 'Gender'){
          cascadeTbMigrantData[typeValue].pop()
        }
        settbMigrData(cascadeTbMigrantData[typeValue])
        settbMigrCat(tempCat)
        // console.log(template,tempCat)
      })
    }
  }

  // new function for indicator click
  const history = useNavigate();

  const getDatePeriod = () => {
    // console.log(periodName)
    if (!periodName || periodName == '') {
      if (currentPeriod.includes("-")) {
        return (
          <Moment
            date={new Date(currentPeriod)}
            format="MMM-YYYY"
          />
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
  }
  const radioClick1 = (name, indicator) => {
    if (indicator == 'Cascade Of Care (TB)')
      setTbChartType(name)
    // setCurrentChartKey(currentChartKey + 1);
  }
  const radioClick2 = (name, indicator) => {
    if (indicator == 'Cascade Of Care (LTBI)')
      setLtbiChartType(name)
    // setCurrentChartKey(currentChartKey + 1);
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
                  {t("Select Filter")} <i className="fa fa-caret-down"></i>
                </Button>
              </div>
              <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <FontAwesomeIcon className="color-white fs-12px" icon={faCalendar} />
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
                  {breadcrumbOrg && breadcrumbOrg.length>0 ? breadcrumbOrg.map((org) => (
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
              {/* row1 */}
              <Row xs={12} lg={12}>
                {/* chart1 */}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div

                    data-grid={{ x: 0, y: 0, w: 10, h: 20, static: true }}
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <div className="alertfiltercontainer">
                      <h5 className="card-header">Cascade Of Care (TB)</h5>
                      <div className="alertfiltercontainer">
                        <div className="alertfiltercontainer ">
                          <label className="labelClass">
                            <input type="radio" value='normal' name='noteit1' className="mr-1" onClick={(e) =>
                              radioClick1('normal', "Cascade Of Care (TB)")} />Val
                          </label>
                          <label className="labelClass">
                            <input type="radio" value='percent' name='noteit1' className="mr-1" onClick={(e) =>
                              radioClick1('percent', "Cascade Of Care (TB)")} />%
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* <h5 className="card-header">Cascade Of Care (TB)</h5> */}
                    <div
                      key={"123" + currentChartKey}
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={migrantChart({}, tbMigrData, tbChartType, tbMigrCat)}
                      />
                    </div>
                  </div>
                </Col>
                {/* chart2 */}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div
                    //key={2}
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <div className="alertfiltercontainer">
                      <h5 className="card-header">Cascade Of Care ({tptName})</h5>
                      <div className="alertfiltercontainer">
                        <div className="alertfiltercontainer radioDiv">
                          <label className="labelClass">
                            <input type="radio" value='normal' name='noteit2' className="mr-1" onClick={(e) =>
                              radioClick2('normal', "Cascade Of Care (LTBI)")} />Val
                          </label>
                          <label className="labelClass">
                            <input type="radio" value='percent' name='noteit2' className="mr-1" onClick={(e) =>
                              radioClick2('percent', "Cascade Of Care (LTBI)")} />%
                          </label>
                          {/* <InputGroup>
                            <label  className="form-check-label" htmlFor="flexCheckDefault2">
                              Val
                            </label>
                            <InputGroup.Radio  value="normal" name="noteit2" onClick={(e) =>
                              radioClick2('normal', "Cascade Of Care (LTBI)")
                            } />
                          </InputGroup>
                          <InputGroup>
                            <label className="form-check-label" htmlFor="flexCheckDefault2">
                              %
                            </label>
                            <InputGroup.Radio value="percent" name="noteit2" onClick={(e) =>
                              radioClick2('percent', "Cascade Of Care (LTBI)")
                            } />
                          </InputGroup> */}
                        </div>
                      </div>
                    </div>
                    {/* <h5 className="card-header">Cascade Of Care (LTBI)</h5> */}
                    <div
                      key={"456" + currentChartKey}
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                       {/* <ReactECharts
                        style={{ height: '100%', width: '100%' }}
                        echarts={echarts}
                        option={stackColumnConfig()} /> */}
                      <ChartComponent
                        options={migrantChart({}, ltbiMigrData, ltbiChartType, ltbiMigrCat)}
                      />
                    </div>
                  </div>
                </Col>
                {/* 3indicators */}
                <Col xs={12} lg={2}>
                  <Row xs={12}>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          Total Registered
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['Total Registered'] ? indicatorObject['Total Registered'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0"> <div
                      //key={5}
                      className="card mb-2 cardbgdark"
                      style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                    >
                      {/* <Loader isLoading={loading} /> */}
                      <h5
                        className="card-header"
                        style={{
                          color: "#fff",
                          backgroundColor: "#2f2c2c",
                          height: "45px",
                        }}
                      >
                        Total Screened
                        {/* {el["indicatorName"]} */}
                      </h5>
                      <div
                        className="card-body indicatorBody"
                        style={{ background: "#2d3d4f" }}
                      // onClick={() => getIndicatorData(el)}
                      >
                        <div className="card-text">
                          <CountUp
                            duration={5}
                            end={Number(indicatorObject['Total Screened'] ? indicatorObject['Total Screened'] : 0)}
                          />
                        </div>
                      </div>
                    </div></Col>
                    <Col xs={4} lg={12} className="px-0 mobile-card">  <div
                      //key={5}
                      className="card mb-2 cardbgdark"
                      style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                    >
                      {/* <Loader isLoading={loading} /> */}
                      <h5
                        className="card-header"
                        style={{
                          color: "#fff",
                          backgroundColor: "#2f2c2c",
                          height: "45px",
                        }}
                      >
                        Not Screened
                        {/* {el["indicatorName"]} */}
                      </h5>
                      <div
                        className="card-body indicatorBody"
                        style={{ background: "#2d3d4f" }}
                      // onClick={() => getIndicatorData(el)}
                      >
                        <div className="card-text">
                          <CountUp
                            duration={5}
                            end={Number(indicatorObject['Not Screened'] ? indicatorObject['Not Screened'] : 0)}
                          />
                        </div>
                      </div>
                    </div></Col>

                  </Row>
                  {/* <Row xs={12}>
                    
                  </Row> */}
                  {/* <Row xs={12}>
                   
                  </Row> */}
                </Col>
              </Row>
              {/* row2 */}
              <Row xs={12} lg={12}>
                {/* chart4 - TB Cases By Gender*/}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div
                    //key={2}
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">{t("TB Cases By Gender")}</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                     
                      <ChartComponent
                        options={migrantRegisterPieChart({}, genderTBMetaSeries)}
                      />
                    </div>
                  </div>
                </Col>
                
                {/* chart3 - TPT Cases By Gender*/}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div
                    // key={el.id}
                    //key={2}

                    data-grid={{ x: 0, y: 0, w: 10, h: 20, static: true }}
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">{tptName} Cases By Gender</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                       {/* <ReactECharts
                        style={{ height: '100%', width: '100%' }}
                        echarts={echarts}
                        option={pieConfig(genderLTBIMetaSeries)} /> */}
                      <ChartComponent
                        options={migrantRegisterPieChart({}, genderLTBIMetaSeries)}
                      />
                    </div>
                  </div>
                </Col>
                {/* 456indicators - Total Tested - Not Tested - TB tested*/}
                <Col xs={12} lg={2}>
                  <Row xs={12}>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          Total Tested
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['Total Tested'] ? indicatorObject['Total Tested'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          Not Tested
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['Not Tested'] ? indicatorObject['Not Tested'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0 mobile-card">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          TB Tested
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['TB Tested'] ? indicatorObject['TB Tested'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* row3 */}
              <Row xs={12} lg={12}>
                {/* chart4 */}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Age Distribution</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      {/* <ReactECharts
                        style={{ height: '100%', width: '100%' }}
                        echarts={echarts}
                        option={barConfig(ageCat, ageData)} /> */}
                      <ChartComponent
                        options={columnConfig('column', ageData, ageCat, 'Age Distribution')}
                      />
                    </div>
                  </div>
                </Col>
                {/* chart6 */}
                <Col xs={12} lg={5} style={{ paddingLeft: "1px", }} >
                  <div
                    //key={2}
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Co Morbidity Factors</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", width: "100%" }}
                    >
                      <ChartComponent
                        options={columnConfig('column', coMobData, coMobCat, 'Co Morbidity Factors')}
                      />
                    </div>
                  </div>
                </Col>
                {/* 789indicators */}
                <Col xs={12} lg={2}>
                  <Row xs={12}>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          TB Positive
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['TB Positive'] ? indicatorObject['TB Positive'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          TB Negative
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['TB Negative'] ? indicatorObject['TB Negative'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0 mobile-card">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          {tptName} Tested
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['LTBI Tested'] ? indicatorObject['LTBI Tested'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* row4 */}
              <Row xs={12} lg={12}>
                {/* map */}
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    className="card mb-2 cardbgdark border-grey"
                    style={{ height: "28rem" }}
                  >
                    <h5 className="card-header">Registered Map</h5>
                    <div
                      className="card-body indicatorBody p-0"
                      style={{ background: "#2d3d4f", height: "300px", width: "100%", zIndex: "999" }}
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
                {/* 10,11,12indicators */}
                <Col xs={12} lg={2}>
                  <Row xs={12}>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          {tptName} Positive
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['LTBI Positive'] ? indicatorObject['LTBI Positive'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          {tptName} Negative
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['LTBI Negative'] ? indicatorObject['LTBI Negative'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={4} lg={12} className="px-0 mobile-card">
                      <div
                        //key={5}
                        className="card mb-2 cardbgdark"
                        style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                      >
                        {/* <Loader isLoading={loading} /> */}
                        <h5
                          className="card-header"
                          style={{
                            color: "#fff",
                            backgroundColor: "#2f2c2c",
                            height: "45px",
                          }}
                        >
                          TB Treatment Initiated
                          {/* {el["indicatorName"]} */}
                        </h5>
                        <div
                          className="card-body indicatorBody"
                          style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                        >
                          <div className="card-text">
                            <CountUp
                              duration={5}
                              end={Number(indicatorObject['TB Treatment Initiated'] ? indicatorObject['TB Treatment Initiated'] : 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* row5 indicators ....................................................................................... */}
              <Row  >
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    //key={5}
                    className="card mb-2 cardbgdark"
                    style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                  >
                    {/* <Loader isLoading={loading} /> */}
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      {tptName} Treatment Initiated
                      {/* {el["indicatorName"]} */}
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    // onClick={() => getIndicatorData(el)}
                    >
                      <div className="card-text">
                        <CountUp
                          duration={5}
                          end={Number(indicatorObject['LTBI Treatment Initiated'] ? indicatorObject['LTBI Treatment Initiated'] : 0)}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                {/* horizontalindicator2 */}
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    //key={5}
                    className="card mb-2 cardbgdark"
                    style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                  >
                    {/* <Loader isLoading={loading} /> */}
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      {tptName} Treatment Not Initiated
                      {/* {el["indicatorName"]} */}
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    // onClick={() => getIndicatorData(el)}
                    >
                      <div className="card-text">
                        <CountUp
                          duration={5}
                          end={Number(indicatorObject['LTBI Treatment Not Initiated'] ? indicatorObject['LTBI Treatment Not Initiated'] : 0)}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                {/* horizontalindicator3 */}
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    //key={5}
                    className="card mb-2 cardbgdark"
                    style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                  >
                    {/* <Loader isLoading={loading} /> */}
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      TB Recovered
                      {/* {el["indicatorName"]} */}
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    // onClick={() => getIndicatorData(el)}
                    >
                      <div className="card-text">
                        <CountUp
                          duration={5}
                          end={Number(indicatorObject['TB Recovered'] ? indicatorObject['TB Recovered'] : 0)}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                {/* horizontalindicator4 */}
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    //key={5}
                    className="card mb-2 cardbgdark"
                    style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                  >
                    {/* <Loader isLoading={loading} /> */}
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      {tptName} Recovered
                      {/* {el["indicatorName"]} */}
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    // onClick={() => getIndicatorData(el)}
                    >
                      <div className="card-text">
                        <CountUp
                          duration={5}
                          end={Number(indicatorObject['LTBI Recovered'] ? indicatorObject['LTBI Recovered'] : 0)}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                {/* horizontalindicator5 */}
                <Col style={{ paddingLeft: "1px", }} >
                  <div
                    //key={5}
                    className="card mb-2 cardbgdark"
                    style={{ borderLeft: "5px solid ", width: "100%", height: "9rem" }}
                  >
                    {/* <Loader isLoading={loading} /> */}
                    <h5
                      className="card-header"
                      style={{
                        color: "#fff",
                        backgroundColor: "#2f2c2c",
                        height: "45px",
                      }}
                    >
                      TB Treatment Not Initiated
                      {/* {el["indicatorName"]} */}
                    </h5>
                    <div
                      className="card-body indicatorBody"
                      style={{ background: "#2d3d4f" }}
                    // onClick={() => getIndicatorData(el)}
                    >
                      <div className="card-text">
                        <CountUp
                          duration={5}
                          end={Number(indicatorObject['TB Treatment Not Initiated'] ? indicatorObject['TB Treatment Not Initiated'] : 0)}
                        />
                      </div>
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
