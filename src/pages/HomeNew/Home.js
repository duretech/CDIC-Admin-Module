import React, { useState, useEffect, useRef } from "react";
// import KeyNumber from '../../components/KeyNumber'
import ReactGridLayout from "react-grid-layout";
import API from "../../services";
import { connect } from "react-redux";
import Loader from "../../components/loaders/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendar,
  faInfo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  columnConfig,
  BarConfig,
  pieConf,
  parlimentConfig,
  ageConfig,
  migrConfig,
  genderPieConfig,
  drillDownConfig,
  epiConfig,
  migrantChart,
  countryTransfer,
  migrantRegisterPieChart,
  countryCaseType,
  TreeConfig
} from "../../components/highchart/chartconfig";
import ChartComponent from "../../components/highchart/ChartComponent";
import LeafletMap from "../../components/map/LeafletTest";
// import LeafletMarkerMap from "../../components/map/react-leaflet-markercluster";
// import MigrantMap from "../../components/map/MigrantMap";
// import RegionalMap from "../../components/map/RegionalMap";
// import HotspotMap from "../../components/map/HotspotMap";
import Sidebar from "react-sidebar";
import Moment from "react-moment";
import RaceChart from "../../components/chart/raceChart";
// import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

import SidebarContent from "../../components/SidebarContent";

import {
  GRID_ROW_HEIGHT,
  MARGIN,
  getGridColumns,
} from "../../components/grid/gridUtil";
import CountUp from "react-countup";
import {
  Container,
  Button,
  Breadcrumb,
  Dropdown,
  ToggleButton,
  ToggleButtonGroup,
  InputGroup,
  DropdownButton,
  Modal
} from "react-bootstrap";

import { useTranslation } from 'react-i18next';

import {
  appDefaultOrg,
  appDashboardID,
  appProgramID,
  mapIndicatorsList,
  metaIndicatorsList,
  countryList,
  migrantFilter,
} from "../../config/appConfig";
import { json } from "d3-fetch";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { chart } from "highcharts";
import drilldown from "highcharts/modules/drilldown.js";
import ItemSeries from 'highcharts/modules/item-series';
ItemSeries(Highcharts)
drilldown(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);

// import {getData} from '../../services/urls';



const Home = ({ props }) => {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [ defination, setDefination] = useState('');
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  //const [chartData, setchartData] = useState([]);
  const [indicatorData, setindicatorData] = useState([]);
  const [mapMarkerData, setMapMarkerData] = useState([]);
  const [mapIndicatorData, setMapIndicatorData] = useState({});
  const [geoJsonData, setGeoJsonData] = useState({});
  const [currentMapKey, setCurrentMapKey] = useState(0);
  const [currentChartKey, setCurrentChartKey] = useState(0);
  const reactGrid = useRef(null);
  const [customIndicator,setCustomIndicator] = useState([
    {
      name : "Total T1D Inactive patient",
      data : 0
    },
    {
      name : "Total T1Ds patient on treatment",
      data : 0
    },
    {
      name : "Diabetes Controlled",
      data : 0
    },
    {
      name : "Diabetes Uncontrolled",
      data : 0
    }]
  )
  const [mapIndicatorLabel, setMapIndicatorLabel] = useState(
    mapIndicatorsList[0].label
  );
  const [mapIndicatorValue, setMapIndicatorValue] = useState(
    mapIndicatorsList[0].value
  );
  const [migrantFilterLabel, setmigrantFilterLabel] = useState(
    migrantFilter[0].label
  );
  const [countryListLabel, setcountryListLabel] = useState(
    countryList[0].label
  );

  const [mapView, setMapView] = useState("choropleth");

  const [migrantMapView, setMigrantMapView] = useState("migrantMap");

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

  // Race Chart Variable
  const raceChartData = [
    {
      date: "March-2021",
      dataSet: [
        {
          name: "Afghanistan  ",
          value: 77 + 17 + 3 + 41 + 4,
        },
        {
          name: "Pakistan  ",
          value: 14 + 21,
        },
        {
          name: "Iran  ",
          value: 11 + 7,
        },
      ],
    },
    {
      date: "April-2021",
      dataSet: [
        {
          name: "Afghanistan  ",
          value: 97 + 27 + 13 + 61 + 24,
        },
        {
          name: "Pakistan  ",
          value: 34 + 31,
        },
        {
          name: "Iran  ",
          value: 21 + 17,
        },
      ],
    },
  ];
  const indicatorMetaData = [
    {
      name: "Total Registered",
      value: "402",
    },
    {
      name: "Index Registered",
      value: "221",
    },
    {
      name: "Contact Registered",
      value: "181",
    },
    {
      name: "Total Screened",
      value: "350",
    },
    {
      name: "TB Positive",
      value: "100",
    },
    {
      name: "LTBI Positive",
      value: "74",
    },
    {
      name: "Transferred In",
      value: "27",
    },
    {
      name: "Transferred Out",
      value: "59",
    },
    {
      name: "Deaths",
      value: "21",
    },
    {
      name: "Recovered",
      value: "79",
    },
    {
      name: "Screened",
      value: "87%",
    },
    {
      name: "Tested",
      value: "76.6%",
    },
    {
      name: "Tested positive for TB",
      value: "50%",
    },
    {
      name: "Tested positive for LTBI",
      value: "74%",
    },
    {
      name: "Initiated on treatment (TB)",
      value: "92%",
    },
    {
      name: "Initiated on treatment (LTBI)",
      value: "94.5%",
    },
    {
      name: "Transferred out",
      value: "14.6%",
    },
    {
      name: "Transferred in",
      value: "6.7%",
    },
    {
      name: "Recovered (%)",
      value: "45.4%",
    },
  ];
  const [filterFlag, setFilterFlag] = useState(false);
  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);

  const [orgID, setOrgID] = useState();

  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);
  //console.log(latestPeriod);
  const [currentPeriod, setCurrentPeriod] = useState(
  "2023;2024"
  );
  const [periodName, setPeriodName] = useState();
  const [periodType, setPeriodType] = useState('Yearly');

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
    setMapIndicatorData({});
    setGeoJsonData({});
    setOrgID();

    setPeriodName(periodname);
    setPeriodType(periodType)
    //setTimeout(function () {

    // console.log(org);
    setOrgID(org[org.length - 1].id);
    // console.log(period);
    setCurrentPeriod(period);

    closeSidebar();
    //}, 800);

    //setCurrentMapKey(currentMapKey + 1);
  };

  const resetFilter = () => {
    // console.log(defaultOrg)
    setindicatorData([]);
    setMapIndicatorData({});
    setGeoJsonData({});
    setCurrentPeriod(date.getFullYear().toString());
    setPeriodName("");
    setOrgID(defaultOrg[0].id);
    setBreadcrumbOrg(defaultOrg);
    setFilterFlag(false);
    closeSidebar();
    //setCurrentMapKey(currentMapKey + 1);
  };

  const changeMapIndicator = (indicator) => {
    // console.log(indicator);
    setMapIndicatorValue(indicator.value);
    setMapIndicatorLabel(indicator.label);
  };
  const ageAndGenderMeteData = [
    {
      "Age distribution Chart": "0-9",
      "Total registered": "10",
      "Total screened": "9",
      "TB positive": "1",
      "LTBI positive": "0",
    },
    {
      "Age distribution Chart": "10 - 19 ",
      "Total registered": "34",
      "Total screened": "27",
      "TB positive": "11",
      "LTBI positive": "5",
      "Transferred in ": "0",
      "Transferred out": "13",
      Death: "2",
      Recovered: "1",
    },
    {
      "Age distribution Chart": "20 - 29",
      "Total registered": "83",
      "Total screened": "70",
      "TB positive": "18",
      "LTBI positive": "14",
      "Transferred in ": "7",
      "Transferred out": "9",
      Death: "1",
      Recovered: "8",
    },
    {
      "Age distribution Chart": "30 - 39 ",
      "Total registered": "97",
      "Total screened": "94",
      "TB positive": "21",
      "LTBI positive": "19",
      "Transferred in ": "13",
      "Transferred out": "17",
      Death: "0",
      Recovered: "35",
    },
    {
      "Age distribution Chart": "40 - 49 ",
      "Total registered": "82",
      "Total screened": "79",
      "TB positive": "27",
      "LTBI positive": "22",
      "Transferred in ": "3",
      "Transferred out": "15",
      Death: "12",
      Recovered: "19",
    },
    {
      "Age distribution Chart": "50 - 59 ",
      "Total registered": "41",
      "Total screened": "30",
      "TB positive": "11",
      "LTBI positive": "8",
      "Transferred in ": "2",
      "Transferred out": "3",
      Death: "5",
      Recovered: "7",
    },
    {
      "Age distribution Chart": "60 - 69 ",
      "Total registered": "37",
      "Total screened": "32",
      "TB positive": "8",
      "LTBI positive": "3",
      "Transferred in ": "2",
      "Transferred out": "0",
      Death: "1",
    },
    {
      "Age distribution Chart": "70 - 79 ",
      "Total registered": "11",
      "Total screened": "9",
      "TB positive": "3",
      "LTBI positive": "1",
      "Transferred in ": "0",
      "Transferred out": "2",
      Death: "0",
      Recovered: "7",
    },
    {
      "Age distribution Chart": "80 - 89 ",
      "Total registered": "5",
      "Total screened": "0",
      "TB positive": "2",
      "LTBI positive": "0",
      "Transferred in ": "1",
    },
    {
      "Age distribution Chart": "90 - 100",
      "Total registered": "2",
      "Total screened": "0",
    },
  ];
  const [ageMetaSeries, setAgeMetaSeries] = useState([
    10,
    34,
    83,
    97,
    41,
    37,
    11,
    5,
    2,
  ]);
  const genderMetaData = [
    {
      "Gender chart": "Male",
      "Total registered": "250",
      "Total screened": "307",
      "TB positive": "87",
      "LTBI positive": "57",
      "Transferred in ": "21",
      "Transferred out": "47",
      Death: "14",
      Recovered: "64",
    },
    {
      "Gender chart": "Female",
      "Total registered": "150",
      "Total screened": "41",
      "TB positive": "12",
      "LTBI positive": "16",
      "Transferred in ": "5",
      "Transferred out": "12",
      Death: "6",
      Recovered: "14",
    },
    {
      "Gender chart": "Third gender ",
      "Total registered": "2",
      "Total screened": "1",
      "TB positive": "0",
      "LTBI positive": "1",
    },
  ];
  const [genderMetaSeries, setGenderMetaSeries] = useState([
    ["Male", 250],
    ["Female", 150],
    ["Third gender ", 2],
  ]);
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

  const migrantRegistrationData = {
    Afghanistan: [
      ["Documented migrant", 31.25],
      ["Non-documented migrant", 22.6],
      ["Refugees", 27.3],
      ["Returnees", 11.7],
      ["IDPs", 7],
    ],
    Iran: [
      ["Documented migrant", 25],
      ["Non-documented migrant", 21.6],
      ["Refugees", 25],
      ["Returnees", 16.6],
      ["IDPs", 11.8],
    ],
    Pakistan: [
      ["Documented migrant", 26.4],
      ["Non-documented migrant", 21.6],
      ["Refugees", 25],
      ["Returnees", 16.6],
      ["IDPs", 11.8],
    ],
  };
  const [migrantChartData, setMigrantChartData] = useState([
    ["Documented migrant", 31.25],
    ["Non-documented migrant", 22.6],
    ["Refugees", 27.3],
    ["Returnees", 11.7],
    ["IDPs", 7],
  ]);
  const changeGeneriIndicator = (indicator, chartName, chartId) => {
    // console.log(indicator, chartName, chartId, ageAndGenderMeteData);
    // if (chartName == "Cascade of care for migrants (TB)") {
    //   settbFilterVal(indicator.value)
    // }
    // if (chartName == "Cascade of care for migrants (LTBI)") {
    //   setltbiFilterVal(indicator.value)
    // }
    var btn = document.getElementById(chartId);
    btn.innerHTML = indicator.label;
    let temp = [];
    if (chartName == "Age Distribution") {
      ageAndGenderMeteData.map((element, index) => {
        temp.push(parseInt(element[indicator.label]));
      });
      setAgeMetaSeries(temp);
    } else if (chartName == "Gender") {
      genderMetaData.map((element, index) => {
        temp.push([
          element["Gender chart"],
          parseInt(element[indicator.label] ? element[indicator.label] : 0),
        ]);
      });
      setGenderMetaSeries(temp);
    } else if (chartName == "Cascade of care (TB)") {
      loadTBCascadeChart(indicator.value)
      // settbMigrData(cascadeTbMigrantData[indicator.label]);
    } else if (chartName == "Cascade of care (LTBI)") {
      loadLTBICascadeChart(indicator.value)
      // setLtbiMigrData(cascadeLtbiMigrantData[indicator.label]);
    } else if (chartName == "Types of migrant registered ") {
      setMigrantChartData(migrantRegistrationData[indicator.label]);
    }
    setCurrentChartKey(currentChartKey + 1);
  };

  const mapViewChange = (type) => {
    console.log(type);
    setMapView(type);
  };

  const migrantMapViewChange = (type) => {
    // console.log(type);
    setMigrantMapView(type);
  };
  const getDashboardIndicator = () => {
    // console.log(periodType)
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodvalue": periodType === 'Quaterly' ? 'Monthly' : periodType,
        "periodyear": currentPeriod.replace("-", "")
      };
       API.post('dashboardIndicator/getlistindicator', instance)
         .then(res => {
          let tempDAta = res.data.data
          // console.log(res.data.data)
            setCustomIndicator([{
              name : "Total T1D Inactive patient ",
              data : tempDAta[1].counts
            },
            {
              name : "Total T1Ds patient on treatment",
              data : tempDAta[0].counts
            },
            {
              name : "Diabetes Controlled",
              data : tempDAta[2].counts
            },
            {
              name : "Diabetes Uncontrolled",
              data : tempDAta[3].counts
            }]);
         })
         .catch(error => {
            console.error("Error fetching dashboard indicators:", error);
         });
    }
  };


  useEffect(() => {
    setLoading(true);
    setLoadingChart(true);
    getDashboardIndicator();
    // window.location.reload()
    let mounted = true;
    // API.defaults.headers.common['Authorization'] = props.userBO.Authorization

    let count = 0;

    if (!filterFlag) {
      if (
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits.length >=
        1
      ) {
        let orgIdList = JSON.parse(sessionStorage.getItem("userData")).organisationUnits;
        let orgidString = ''
        orgIdList.map(el => {
          orgidString += el.id + ';'
        })
        orgidString = orgidString.replace('C5cdBtfapEp;', '')
        setDefaultOrg(JSON.parse(sessionStorage.getItem("userData")).organisationUnits);
      } else {
        setDefaultOrg(
          JSON.parse(sessionStorage.getItem("userData")).organisationUnits
        );
      }
      // console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
      
    }
    
    // loadLTBICascadeChart('Gender');
    // loadTBCascadeChart('Gender');
    
    let tempIndicatorData = [];

    API.get(`dashboards/${appDashboardID}.json`).then((res) => {
      // console.log(res.data);
      if (res.status === 200) {
        res.data.dashboardItems.map((el) => {
          //console.log(el);
          if (el?.visualization) {
            API.get("visualizations/" + el.visualization.id + ".json").then(
              (response) => {
                //console.log(response);
                let temp = {};
                temp["id"] = el.id;
                temp["h"] = el.height;
                temp["w"] = el.width;
                temp["x"] = el.x;
                temp["y"] = el.y;
                temp["isDraggable"] = false;
                temp["isResizable"] = false;

                //console.log(response.data);
                if (response.data.type === "SINGLE_VALUE") {
                  el["styleObject"] = {
                    position: "absolute",
                    left: el.x + `rem`,
                    bottom: el.y + `rem`,
                    // bottom: -el.y - 2 + `rem`,
                    width: el.width + `rem`,
                    height: el.height + `rem`,
                  };
                  temp["styleObject"] = el.styleObject;
                  temp["indicatorName"] = response.data.name;
                  temp["dashboardItemData"] = response.data;
                  temp["type"] = response.data.type;
                  temp["color"] = colors[count];
                  count++;
                  //  console.log(response.data.dataDimensionItems[0].programIndicator.id,response.data.name)
                  let period = currentPeriod.includes("-")
                    ? currentPeriod.replace("-", "")
                    : currentPeriod;

                  let url =
                    "analytics.json?dimension=dx:" +
                    response.data.dataDimensionItems[0].programIndicator.id +
                    "&filter=ou:" +
                    //response.data.organisationUnits[0].id +
                    orgID +
                    //"&filter=pe:LAST_6_MONTHS;THIS_MONTH&includeNumDen=false&skipData=false&skipMeta=true";
                    "&dimension=pe:" +
                    period +
                    "&includeNumDen=false&skipData=false&skipMeta=true";
                  //console.log(orgID);
                  
                  // console.log(response.data.name,customIndicator,response.data)
                    // logic for defination
                    
                  
                  
                  if (orgID) {
                    
                    API.get(url)
                      .then((r) => {
                        // Commented for live
                        if (response.data.name == 'Not Screened' || response.data.name == 'Not tested') {
                        // if (false) {
                          let instace = {
                            "orguid":orgID,
                            "periodtype":periodType.toLocaleLowerCase(),
                            "periodvalue":period
                        }
                          API.post('filter/getnotscreenedtestedcount', instace).then(res => {
                            res.data.map(el => {
                              if (el.indicatorname.toLocaleLowerCase() == response.data.name.toLocaleLowerCase()) {
                                if(r.data.rows[0])
                                r.data.rows[0][2] = el.count
                              }
                            })
                          })
                          temp["dashboardItemValue"] = r.data;
                          // console.log(r.data, response.data.name,orgID,period);
                        } else {
                          temp["dashboardItemValue"] = r.data;
                        }
                        if (!indicatorData.some((data) => data.id === el.id)) {
                          setindicatorData((prevVals) => [...prevVals, temp]);
                        }
                        setLoading(false);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                } else {
                  //setLoading(true);
                  // console.log(el)
                  el["styleObject"] = {
                    //position: "absolute",
                    //left: el.x + `rem`,
                    //bottom: el.y + `rem`,
                    // bottom: -el.y - 9 + `rem`,
                    //width: el.width + `rem`,
                    //height: el.height + `rem`,
                    width: `100%`,
                    height: `100%`,
                  };
                  temp["styleObject"] = el.styleObject;
                  temp["indicatorName"] = response.data.name;
                  temp["dashboardItemData"] = response.data;
                  temp["type"] = response.data.type;

                  let period = currentPeriod.includes("-")
                    ? currentPeriod.replace("-", "")
                    : currentPeriod;

                  let url = "analytics.json?dimension=dx:";
                  response.data.dataDimensionItems.map((el) => {
                    if (el.programIndicator)
                      url += el.programIndicator.id + ";";
                    else if (el.dataElement) url += el.dataElement.id + ";";
                    return true;
                  });
                  if (response.data.name == 'Country Wise Transfers') {
                    url +=
                      "&dimension=ou:"
                      + orgID +
                      "&filter=pe:" +
                      period
                      +"&includeNumDen=false&skipData=false&skipMeta=false&eventStatus=SKIPPED"
                    // "&filter=pe:" +
                    // //response.data.organisationUnits[0].id +
                    // period +
                    // "&dimension=ou:" +
                    // orgID +
                    // "&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";
                  } else {
                    url +=
                    "&filter=ou:" +
                    //response.data.organisationUnits[0].id +
                    orgID +
                    //"&dimension=pe:LAST_6_MONTHS;THIS_MONTH&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";
                    // LAST_6_MONTHS;THIS_MONTH;
                    "&dimension=pe:" +
                    period +
                    "&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";
                  }
                  // console.log(url)
                  // console.log(response.data.name)
                  //console.log(orgID);
                  if (orgID) {
                    API.get(url)
                      .then((r) => {
                        //console.log(r.data);
                        temp["dashboardItemValue"] = r.data;
                        if (!indicatorData.some((data) => data.id === el.id)) {
                          setindicatorData((prevVals) => [...prevVals, temp]);
                        }
                        //console.log(indicatorData);
                        setLoadingChart(false);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }
              }
            );
          } else {
            //console.log(el);
            if (el?.type === "MAP") {
              //API.get("maps/" + el.map.id + ".json").then((response) => {
              //setLoading(true);
              API.get(
                "maps/" +
                  el.map.id +
                  "?fields=id%2CdisplayName~rename(name)%2Cuser%2Clongitude%2Clatitude%2Czoom%2Cbasemap%2CmapViews%5Bid%2CdisplayName~rename(name)%2CdisplayDescription~rename(description)%2Ccolumns%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2Crows%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2Cfilters%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2C*%2C!attributeDimensions%2C!attributeValues%2C!category%2C!categoryDimensions%2C!categoryOptionGroupSetDimensions%2C!columnDimensions%2C!dataDimensionItems%2C!dataElementDimensions%2C!dataElementGroupSetDimensions%2C!filterDimensions%2C!itemOrganisationUnitGroups%2C!lastUpdatedBy%2C!organisationUnitGroupSetDimensions%2C!organisationUnitLevels%2C!organisationUnits%2C!programIndicatorDimensions%2C!relativePeriods%2C!reportParams%2C!rowDimensions%2C!series%2C!translations%2C!userOrganisationUnit%2C!userOrganisationUnitChildren%2C!userOrganisationUnitGrandChildren%5D"
              ).then((response) => {
                //console.log(response);
                //console.log(response.data.name);
                let temp = {};
                temp["id"] = el.id;
                temp["h"] = el.height;
                temp["w"] = el.width;
                temp["x"] = el.x;
                temp["y"] = el.y;
                temp["isDraggable"] = false;
                temp["isResizable"] = false;

                el["styleObject"] = {
                  //position: "absolute",
                  //left: el.x + `rem`,
                  //bottom: el.y + `rem`,
                  // bottom: -el.y - 9 + `rem`,
                  //width: el.width + `rem`,
                  //height: el.height + `rem`,
                  width: `100%`,
                  height: `100%`,
                };
                temp["styleObject"] = el.styleObject;
                temp["indicatorName"] = response.data.name;
                temp["dashboardItemData"] = response.data.mapViews[0];

                let period = currentPeriod.includes("-")
                  ? currentPeriod.replace("-", "")
                  : currentPeriod;

                if (response.data.mapViews[0].layer === "trackedEntity") {
                  temp["type"] = "markerMap";
                  let url =
                    "trackedEntityInstances?skipPaging=true&fields=trackedEntityInstance~rename(id),featureType,coordinates,relationships&ou=" +
                    orgID +
                    "&ouMode=DESCENDANTS&program=" +
                    //"&ouMode=CHILDREN&program=" +
                    appProgramID +
                    "&programStatus=ACTIVE";

                  if (orgID) {
                    API.get(url)
                      .then((r) => {
                        //console.log(r.data);
                        temp["dashboardItemValue"] = r.data;
                        if (!indicatorData.some((data) => data.id === el.id)) {
                          setindicatorData((prevVals) => [...prevVals, temp]);
                        }
                        //console.log(indicatorData);
                        markerData(temp);
                        //setLoading(false);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                } else {
                  // if (response.data.name === "Migrants Map") {
                  //   // temp["type"] = "migrantMap";

                  //   if (!tempIndicatorData.some((ele) => ele.id === el.id)) {
                  //     setindicatorData((prevVals) => [...prevVals, temp]);
                  //     setLoadingMap(false);
                  //   }
                  // } else
                  {
                    //et dxID = response.data.mapViews[0].columns[0].items[0].id; // dxID from mapping
                    let dxID = mapIndicatorValue; // dxID from configuration
                    createMapIndicatorData(temp, dxID);
                    //setLoading(false);
                  }
                }
              });
            }
          }

          return true;
        });
        //console.log(reactGrid);
      }
      if (mounted) {
        // setindicatorData(res.data.dashboardItems)
      }
    });
    return function cleanup() {
      mounted = false;
    };
  }, [orgID, currentPeriod,periodName,periodType]);

  useEffect(() => {
    createMapIndicatorData(mapIndicatorData, mapIndicatorValue);
  }, [mapIndicatorValue]);

  const loadLTBICascadeChart = (typeValue) => {
    // console.log(typeValue)
    if (orgID) {
      let instance = {
        "orguid":orgID,
        "filter": typeValue,
        "programuid":"i1yaRN8esOJ",
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(),
        "periodvalue": currentPeriod.replace("-","")
      }
      // https://undp.imonitorplus.com/service/api/29/sqlViews/qa0zRBFmh7y/data?paging=false&var=orguid:I9jfaLculAp&var=type:Country
      // API.get(`29/sqlViews/qa0zRBFmh7y/data?paging=false&var=orguid:`+ 'I9jfaLculAp' + `&var=type:`+ typeValue).then((res) => {
      API.post(`filter/getltbifilter`, instance).then((res) => {
        // console.log(res.data.rows,"res.data.rows")
        let tempCat= []
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
        // console.log(cascadeLtbiMigrantData[typeValue],tempCat)
        setLtbiMigrData(cascadeLtbiMigrantData[typeValue])
        setltbiMigrCat(tempCat)
      })
    }
  }
  const loadTBCascadeChart = (typeValue) => {
    if (orgID) {
      let instance = {
        "orguid":orgID,
        "filter": typeValue,
        "programuid":"i1yaRN8esOJ",
        "periodtype": periodType.toLocaleLowerCase() == 'quaterly' ? 'monthly' : periodType.toLocaleLowerCase(), 
        "periodvalue": currentPeriod.replace("-","")
      }
      // API.get(`29/sqlViews/qQGeS96l7WB/data?paging=false&var=orguid:`+  'I9jfaLculAp' + `&var=type:`+ typeValue).then((res) => {
        API.post(`filter/gettbfilter`, instance).then((res) => {
          let tempCat= []
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
        settbMigrData(cascadeTbMigrantData[typeValue])
        settbMigrCat(tempCat)
        // console.log(template,tempCat)
      })
    }
  }

  
  
  //qQGeS96l7WB -> tb
  // qa0zRBFmh7y -> ltbi
  const GetDataForChart = (data) => {
    let id = data.id
    let isItem = data.isitem
    let chartName = data.indicatorName;
    let chartType = data.type.toLowerCase();
    data = data.dashboardItemValue;
    let ChartDataArray = [];
    let oCatArr = [];
      // console.log(chartType,chartName, ">chart Data")
    if (data.rows.length > 0) {
      if (chartName == "Country Wise Transfers") {
        data.metaData.dimensions.ou.map((el) => {
          oCatArr.push(data.metaData.items[el].name);
          return true;
        });
      }
      else {
        data.metaData.dimensions.pe.map((el) => {
          oCatArr.push(data.metaData.items[el].name);
          return true;
        });
       }
      data.metaData.dimensions.dx.map((ell) => {
        let tempObj = {};
        tempObj["name"] = data.metaData.items[ell].name;
        if (chartType === "pie") {
          tempObj["y"] = "";
        } else {
          tempObj["data"] = [];
        }
        if (chartName == "Country Wise Transfers") {
          data.metaData.dimensions.ou.map((elll) => {
            let nomatched = true
            data.rows.map((key) => {
              if (key[0] === ell && key[1] === elll) {
                nomatched = false
                tempObj["data"].push(parseInt(key[2]));
              }
              return true;
            });
            if (nomatched)
              tempObj["data"].push(0);
            return true;
          });
        } else {
          data.metaData.dimensions.pe.map((elll) => {
            data.rows.map((key) => {
              if (key[0] === ell && key[1] === elll)
                if (chartType === "pie") {
                  tempObj["y"] = parseInt(key[2]);
                } else {
                  tempObj["data"].push(parseInt(key[2]));
                }
              return true;
            });
            return true;
          });
        }
        ChartDataArray.push(tempObj);
        return true;
      });
    }
    // console.log(ChartDataArray, oCatArr)
    let oChartConf = "";
    if (chartType == 'stacked_column') {
      // console.log(ChartDataArray,oCatArr)
      oChartConf = migrantChart(data, ChartDataArray,tbChartType,oCatArr);
    }
    if (chartType === "pie") {
      if (isItem) {
        // console.log(ChartDataArray)
        let parlimentData = []
        ChartDataArray.map(el => {
          parlimentData.push([el.name,el.y])
        })
        oChartConf = parlimentConfig(data, parlimentData, oCatArr, chartName);
        
        // oChartConf = migrantRegisterPieChart(data, ChartDataArray);
        // console.log(ChartDataArray,chartName,"chcek me")
      }else
        oChartConf = migrantRegisterPieChart(data, ChartDataArray);
      // pieConf(ChartDataArray, chartName);
    }
    // console.log(chartType,chartName)
    if(chartName === "BMI value distribution"){
      let SemidonutConfig = []
        ChartDataArray.map(el => {
          // console.log(el)
          SemidonutConfig.push([el.name,el.y])
        })
        oChartConf = parlimentConfig(data, SemidonutConfig, oCatArr, chartName);
    }

    if(chartType === "bar")
    oChartConf = BarConfig(chartType,ChartDataArray,oCatArr)
    
    if (chartType === "column")
      oChartConf = columnConfig(chartType,ChartDataArray,oCatArr);
    if(chartName === 'Complication Reporting Rate'){
    let tempData = []
    ChartDataArray.map(el => {
      // console.log(el.data[0],el,el.name)
      tempData.push({
        'name' : el.name,
        value : el.data[0],
        colorValue: el.data[0]
    })
    })
    oChartConf = TreeConfig(chartType,tempData,oCatArr);
    }
      // oChartConf
    // if (chartName == "Gender")
      // oChartConf = parlimentConfig(data, genderMetaSeries, oCatArr, chartName);
    // if (chartName == "Type of Client")
    //   oChartConf = migrConfig(data, ChartDataArray, oCatArr, chartName);
    // else if (chartName == "Total Cases")
    //   oChartConf = drillDownConfig(data, ChartDataArray, oCatArr, chartName);
    // else if (chartName == "Epidemiological Curve")
    //   oChartConf = epiConfig(data, ChartDataArray, oCatArr, chartName);
    // else if (chartName == "Cascade of care (TB)") {
    //   oChartConf = migrantChart(data, tbMigrData,tbChartType,tbMigrCat);
    // }
    // else if (chartName == "Cascade of care (LTBI)") {
    //   oChartConf = migrantChart(data, ltbiMigrData,ltbiChartType,ltbiMigrCat);
    // }
    // else if (chartName == "Country wise transfers")
    //   oChartConf = countryTransfer(data);
    // else if (chartName == "Types of migrant registered ")
    //   oChartConf = migrantRegisterPieChart(data, migrantChartData);
    // else if (chartName == "Country wise case type")
    //   oChartConf = countryCaseType(data);
    
    // if (chartName == "Country Wise Transfers")
        // console.log(ChartDataArray,oCatArr,chartType,"chcek me")
    //setLoading(false);
    indicatorData.map(el => {
      if (el.id == id) {
        el['chartData'] = oChartConf
      }
    })
    return oChartConf;
  };

  const markerData = (mapData) => {
    //console.log(mapData);
    let markers = mapData.dashboardItemValue.trackedEntityInstances.filter(
      (marker) => marker.featureType === "POINT"
    );
    //console.log(markers);

    let promises = markers.map(async (marker) => {
      //console.log(marker);

      marker.attributes = "";
      marker.coordinates = marker.coordinates
        .replace("[", "")
        .replace("]", "")
        .split(",");

      let url =
        "trackedEntityInstances/" +
        marker.id +
        "?program=eAHvg6zuxvK&fields=lastUpdated,attributes%5BdisplayName~rename(name),value%5D,relationships";

      await API.get(url)
        .then((r) => {
          //console.log(r.data);
          marker.attributes = r.data.attributes;
        })
        .catch((error) => {
          console.log(error);
        });

      return marker;
    });

    //console.log(promises);
    // Wait for all Promises to complete
    Promise.all(promises)
      .then((results) => {
        // Handle results
        //console.log(results);
        //console.log(markers);
        //markers = results;

        setMapMarkerData(results);
        setCurrentMapKey(Math.random())
      })
      .catch((e) => {
        console.error(e);
      });
    //return markers;
  };

  const createMapIndicatorData = (mapData, dxID, level, childID) => {
    // console.log(mapData, dxID, level, childID);
    // setLoadingMap(true);
    //console.log(breadcrumbOrg);
    //console.log(mapData);
    if (orgID) {
      //setLoading(true);
      let geoJsonUrl =
        "organisationUnits.geojson?parent=" +
        (childID ? childID : orgID) +
        "&level=" +
        (level ? Number(level) + 1 : 2 + (breadcrumbOrg.length - 1));

      API.get(geoJsonUrl)
        .then((r) => {
          // console.log(r.data);

          if (r.data.features.length > 0) {
            let period = currentPeriod.includes("-")
              ? currentPeriod.replace("-", "")
              : currentPeriod;

            let orgIDs = r.data.features
              .map((element) => element.id)
              .toString()
              .replace(/,/g, ";");

            mapData["type"] = "choroplethMap";
            let url = "analytics.json?";

            url += "&dimension=ou:" + orgIDs;

            url += "&dimension=dx:" + dxID;

            url +=
              "&dimension=pe:" +
              period +
              "&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";
            // console.log(url);

            if (orgID) {
              API.get(url)
                .then((res) => {
                  //console.log(res.data);

                  //let dataLabels = res.data.metaData.items;
                  let dataRows = res.data.rows;

                  let tempArray = [];

                  dataRows.map((row) => {
                    // tempArray.push({
                    //   orgID: row[1],
                    //   name: dataLabels[row[1]].name,
                    //   value: row[3],
                    // });

                    tempArray[row[1]] = row[3];

                    return tempArray;
                  });

                  //console.log(tempArray);

                  mapData["dashboardItemValue"] = tempArray;
                  setindicatorData((prevVals) => [...prevVals, mapData]);
                  //console.log(indicatorData);

                  setGeoJsonData(r.data);
                  setMapIndicatorData(mapData);
                  setCurrentMapKey(currentMapKey + 1);
                  setLoadingMap(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else {
            
            mapData["type"] = "choroplethMap";
            setindicatorData((prevVals) => [...prevVals, mapData]);
            setLoadingMap(false);
            setCurrentMapKey(currentMapKey + 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // new function for indicator click
  const history = useNavigate();

  const getIndicatorData = (indicatorData) => {
    // console.log(indicatorData);
    API.get(
      "29/programIndicators/" +
        indicatorData.dashboardItemData.dataDimensionItems[0].programIndicator
          .id
    ).then((response) => {
      // console.log(response);
      sessionStorage.setItem("indicatorData", JSON.stringify(response.data));
      // if (!response.data.filter.includes('#')){
      history.push("/linelist");
      // }
    });
    // this.history.push("/linelist");
  };
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
    
  };
  const [tbChartType, setTbChartType] = useState('normal')
  const [ltbiChartType, setLtbiChartType] = useState('normal')

   // modal code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentChart, setCurrentChart] = useState();
  const [currentId, setCurrentID] = useState();
   // modal code end
  const fullScreen = (data) => {
    // console.log(data)
    setCurrentID(data.id)
    data.chartData.chart.height = 600
    data.chartData.exporting = {
      enabled: true,
      showTable: true
    }
    setCurrentChart(data.chartData)
    handleShow()
  }
  const radioClick = (name,indicator) => {
    if (indicator == 'Cascade of care (TB)')
      setTbChartType(name)
    if (indicator == 'Cascade of care (LTBI)')
      setLtbiChartType(name)
    setCurrentChartKey(currentChartKey + 1);
  }
  const chartTypeChange = (type,data) => {
    // console.log(data, indicatorData)
    // if(type == 'ITEM')
    //   data['isitem'] = true
    // else
    //   data['isitem'] = false
    indicatorData.map(el => {
      if (el.id == data.id) {
        if(type == 'ITEM')
          el['isitem'] = true
        else
          el['isitem'] = false
      }
    })
    setCurrentChartKey(currentChartKey + 1);
  }
  // Function for custom headers
  const getHeader = (data) => {
    console.log(data.indicatorName)
    if (
      data.indicatorName === "Cascade of care (TB)" ||
      data.indicatorName === "Cascade of care (LTBI)"
    ) {
      return (
        <div className="alertfiltercontainer">
          <h5 className="card-header">{t(data.indicatorName)}</h5>
          <div class="alertfiltercontainer">
            <div class="alertfiltercontainer radioDiv">
              <InputGroup.Prepend>
                <label class="form-check-label" for="flexCheckDefault">
                  Val
                </label>
                <InputGroup.Radio value="normal" name="noteit"  onClick={(e) =>
                            radioClick('normal',data.indicatorName)
                          }/>
              </InputGroup.Prepend>
              <InputGroup.Prepend>
                <label class="form-check-label"  for="flexCheckDefault">
                  %
                </label>
                <InputGroup.Radio value="percent" name="noteit" onClick={(e) =>
                            radioClick('percent',data.indicatorName)
                          } />
            </InputGroup.Prepend>
            </div>
            {/* <DropdownButton
              id={data.id}
              menuAlign="right"
              title={migrantFilterLabel}
            >
              {migrantFilter?.length > 0
                  ? migrantFilter.map((indicator, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={(e) =>
                            changeGeneriIndicator(
                              indicator,
                              data.indicatorName,
                              data.id
                            )
                          }
                        >
                          {indicator.label}
                        </Dropdown.Item>
                      );
                    })
                  : ""}
            </DropdownButton> */}
            <i class=" btn btn-sm fa fa-expand color-white" onClick={(e) =>fullScreen(data)} aria-hidden="true"></i>
          </div>
          {/* <button class="btn btn-sm" > */}
          {/* </button> */}
        </div>
      );
    } else if (
      data.indicatorName === "Age Distribution"
    ) {
      return (
        <div className="alertfiltercontainer">
          <h5 className="card-header">{data.indicatorName}</h5>
          {/* <DropdownButton
              id={data.id}
              menuAlign="createMapIndicatorDataright"
              title={mapIndicatorLabel}
            >
              {metaIndicatorsList?.length > 0
                  ? metaIndicatorsList.map((indicator, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={(e) =>
                            changeGeneriIndicator(
                              indicator,
                              data.indicatorName,
                              data.id
                            )
                          }
                        >
                          {indicator.label}
                        </Dropdown.Item>
                      );
                    })
                  : ""}
            </DropdownButton> */}
            <i class=" btn btn-sm fa fa-expand color-white" onClick={(e) =>fullScreen(data)} aria-hidden="true"></i>
        </div>
      );
    } else if (data.indicatorName == "Types of migrant registered ") {
      return (
        <div className="alertfiltercontainer">
          <h5 className="card-header">{data.indicatorName}</h5>
          <DropdownButton
              id={data.id}
              menuAlign="right"
              title={countryListLabel}
            >
            {countryList?.length > 0
                ? countryList.map((indicator, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={(e) =>
                          changeGeneriIndicator(
                            indicator,
                            data.indicatorName,
                            data.id
                          )
                        }
                      >
                        {indicator.label}
                      </Dropdown.Item>
                    );
                  })
                : ""}
          </DropdownButton>
        </div>
      );
    }
    else if (data.type == 'PIE') {
      return (
        <div className="alertfiltercontainer">
          <h5 className="card-header">{t(data.indicatorName)}</h5>
          <div class="alertfiltercontainer radioDiv">
              {/* <InputGroup.Prepend title="Pie View">
                <label class="form-check-label" for="flexCheckDefault">
                  <i class="fa fa-pie-chart" aria-hidden="true"></i>
                </label>
                <InputGroup.Radio title="Pie View" value="normal" name="noteit"  onClick={(e) =>
                            chartTypeChange('PIE',data)
                          }/>
              </InputGroup.Prepend>
              <InputGroup.Prepend title="Parliment View">
                <label class="form-check-label"  for="flexCheckDefault">
                  <i class="fa fa-area-chart" aria-hidden="true"></i>
                </label>
                <InputGroup.Radio title="Parliment View" value="percent" name="noteit" onClick={(e) =>
                            chartTypeChange('ITEM',data)
                          } />
            </InputGroup.Prepend> */}
            <i class=" btn btn-sm fa fa-expand color-white" onClick={(e) =>fullScreen(data)} aria-hidden="true"></i>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="alertfiltercontainer">
          <h5 className="card-header">{t(data.indicatorName)}</h5>
          <i class=" btn btn-sm fa fa-expand color-white" onClick={(e) =>fullScreen(data)} aria-hidden="true"></i>
        </div>
      );
    }
  };
  // console.log(JSON.stringify(indicatorData));
  const ensureNumber = (value, defaultValue = 0) => (typeof value === 'number' ? value : defaultValue);

  let uniqueArray = indicatorData.filter((thing, index) => {
    let _thing = JSON.stringify(thing);
    return (
      index ===
      indicatorData.findIndex((obj) => {
        return JSON.stringify(obj) === _thing;
      })
    );
  });
  //console.log(uniqueArray);

  //let unique = [...new Set(temp1.map(item => item.id))];
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
            filterFlag={filterFlag}
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
        {/* <Loader isLoading={loading} /> */}

        <div className="headerfixedcontainer">
          <Container fluid>
            <div className="headerbarcontainer">
              <div className="mr-2">
                <Button
                  variant="primary"
                  className="selectfilterbtn"
                  onClick={() => onSetSidebarOpen()}
                >
                  {t("Select filter")} <i className="fa fa-caret-down"></i>
                </Button>
              </div>
              {/* <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <i className="fa fa-chart-bar color-white fs-12px"></i>
                  <span className="daterange color-white">Cumulative</span>
                </p>
              </div> */}
              {/* <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <i className="fa fa-calendar-alt color-white fs-12px"></i>
                  <span className="daterange color-white">
                    {getDatePeriod()}
                  </span>
                </p>
              </div> */}
              <div className="ml-4">
                <Breadcrumb>
                  <Breadcrumb.Item href="#" >
                    {/* <i className="fa fa-home color-white" ></i> */}
                    <div className="headline-head">
                    {t("Dashboard")}
                    </div>
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

        <div className="container-fluid pl-1 pr-1 mt-110px main-divlayout">
          <h3 className="pl-10px mt-130px">T1D ANALYTICAL DASHBOARD OVERVIEW</h3>
          {/* <CreateIndicators data={indicatorData}></CreateIndicators> */}
          <div className="main-layout-div">
          <ReactGridLayout
            className="layout"
            margin={MARGIN}
            cols={getGridColumns()}
            rowHeight={GRID_ROW_HEIGHT}
            width={window.innerWidth}
            layout={uniqueArray}
            isDraggable={false}
            isResizable={false}
            ref={reactGrid}
          >
            {uniqueArray.length > 0 ? (
              uniqueArray.map((el, index) => {
                const x = ensureNumber(el.x);
          const c = ensureNumber(el.y);
          const w = ensureNumber(el.w);
          const h = ensureNumber(el.h);
                // console.log(el.type);

                //return <div key={el.id}></div>;
                if (el.type === "SINGLE_VALUE") {
                  return (
                    <div
                      data-grid={{ x: x, y: c, w: w, h: h }}
                      key={el.id + "_123"}
                      //key={5}
                      className="card mb-2 d-flex justify-content-between card-div-main"
                      // style={{ borderLeft: "5px solid " + el.color }}
                    >
                      {/* <Loader isLoading={loading} /> */}
                      {/* <h5
                        className="card-header"
                        style={{
                          color: "#fff",
                          backgroundColor: "#2f2c2c",
                          height: "45px",
                        }}
                      >
                        {t(el["indicatorName"])}
                        <FontAwesomeIcon
                            className="color-white ml-2 fs-12px"
                            icon={faInfoCircle}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={ t( el["indicatorName"] === "Total people enrolled" ? "Total Number of unique people got registered on the platform."
                            : el["indicatorName"] === "Total T1Ds patient on treatment" ? "Total number of T1D patients on active treatment" 
                            : el["indicatorName"] === "Total T1D Inactive patient " ? "Total number of T1D patients who are not active on treatment." 
                            : el["indicatorName"] === "Diabetes Controlled" ? "Diabetic patient who's last HBA1C recorded value is less than or equal to 7" 
                            : el["indicatorName"] === "Diabetes Uncontrolled" ? "Diabetic patient who's last HBA1C recorded value is greater than or equal to 8" 
                            : "no Defination available")
                            }
                          ></FontAwesomeIcon>

                      </h5> */}
                      
                      <div
                        className="card-body indicatorBody"
                        style={{ background: "#2d3d4f" }}
                        // onClick={() => getIndicatorData(el)}
                      >
                        <div className="card-text">
                          {el.dashboardItemValue.rows.length > 0 ? (
                            !filterFlag ? 
                            <CountUp
                              duration={5}
                              end = {
                                el["indicatorName"] === "Total T1D Inactive patient " ? customIndicator[1].data : 
                                el["indicatorName"] === "Total T1Ds patient on treatment" ? customIndicator[0].data : 
                                el["indicatorName"] === "Diabetes Controlled" ? customIndicator[2].data : 
                                el["indicatorName"] === "Diabetes Uncontrolled" ? customIndicator[3].data : 
                                el["indicatorName"] === "Total people enrolled" ? Number(el.dashboardItemValue.rows.map(item => Number(item[2])).reduce((prev, next) => prev + next))   : 
                                0
                                    }

                              // end={0}
                            />  : 
                            <span>
                              {t(el["indicatorName"] === "Total T1D Inactive patient "  ? "-" : el["indicatorName"] === "Total T1Ds patient on treatment" ? "-" : el["indicatorName"] === "Diabetes Controlled" ? customIndicator[2].data : el["indicatorName"] === "Diabetes Uncontrolled" ? customIndicator[3].data :  Number(el.dashboardItemValue.rows.map(item => Number(item[2])).reduce((prev, next) => prev + next)) )}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                          <h4>
                          {t(el["indicatorName"])}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                } else if (
                  el.type === "COLUMN" ||
                  el.type === "LINE" ||
                  el.type === "PIE" ||
                  el.type === "AREA" ||
                  el.type === "STACKED_COLUMN" ||
                  el.type === "BAR"
                ) {
                  return (
                    <div
                      key={el.id + "_124"}
                      //key={2}
                      data-grid={{ x: x, y: c, w: w, h: h }}
                      className="card mb-2 cardbgdark border-grey"
                    >
                      <Loader isLoading={loadingChart} />
                      {getHeader(el)}
                      <div
                        key={el.id + currentChartKey}
                        className="card-body indicatorBody p-0"
                        style={{ background: "#2d3d4f", width: "100%" }}
                      >
                        <ChartComponent
                          options={GetDataForChart(el)}
                          styleObj={el.styleObject}
                          //style={{ overflow: "scroll" }}
                        />
                      </div>
                    </div>
                  );
                } else if (
                  el.type === "markerMap" ||
                  el.type === "choroplethMap" ||
                  el.type === "migrantMap"
                ) {
                  return (
                    <div
                      key={el.id + "_126_" + el.type}
                      //key={3}
                      data-grid={{ x: x, y: c, w: w, h: h }}
                      className="card mb-2 cardbgdark border-grey"
                    >
                      <LeafletMap
                            key={el.id + currentMapKey + +"_130_" + el.type}
                            mapKey={currentMapKey}
                            mapHeight={el.h + 4}
                            mapIndicatorData={mapIndicatorData}
                            geoJsonData={geoJsonData}
                            latestPeriod={currentPeriod}
                            applyFilter={applyFilter}
                            createMapIndicatorData={createMapIndicatorData}
                            resetFilter={resetFilter}
                            breadcrumbOrg={breadcrumbOrg}
                            mapIndicatorValue={mapIndicatorValue}
                            mapView={mapView}
                            markerData={mapMarkerData}
                          />
                    </div>
                  );
                }
                
                else {
                  return (
                    <div
                      key={el.id + "_132_emptycard"}
                      //key={3}
                      data-grid={{ x: x, y: c, w: w, h: h }}
                      className="card mb-2 cardbgdark border-grey"
                    >
                      <h5 className="card-header">{el.indicatorName}</h5>
                      <div
                        className="card-body indicatorBody p-0"
                        style={{ background: "#2d3d4f", width: "100%" }}
                      ></div>
                    </div>
                  );
                }
              })
            ) : (
              <div key={1 + "_133_empty"}></div>
            )}
          </ReactGridLayout>
          </div>
        </div>
        <Modal show={show} onHide={handleClose} size="lg" id="chartFullScreen">
            <Modal.Header closeButton>
                {/* <Modal.Title>Details</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
              <div class="card" id={currentId}>
                <HighchartsReact
                  highcharts={Highcharts}
                  allowChartUpdate={true}
                  options={currentChart}
                  //style={{ overflow: "scroll" }}
                />
                </div>
            </Modal.Body>
        </Modal>
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

const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(Home);
