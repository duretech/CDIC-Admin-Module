import React, { useState, useEffect, useRef } from "react";
// import KeyNumber from '../../components/KeyNumber'
import ReactGridLayout from "react-grid-layout";
import API from "../../services";
import { connect } from "react-redux";
import Loader from "../../components/loaders/loader";
import { columnConfig, pieConf } from "../../components/highchart/chartconfig";
import ChartComponent from "../../components/highchart/ChartComponent";
import LeafletMap from "../../components/map/LeafletTest";
import LeafletMarkerMap from "../../components/map/react-leaflet-markercluster";
import Sidebar from "react-sidebar";
import Moment from "react-moment";
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
} from "react-bootstrap";

import {
  appDefaultOrg,
  appDashboardID,
  appProgramID,
  mapIndicatorsList,
} from "../../config/appConfig";
import { useTranslation } from "react-i18next";


// import {getData} from '../../services/urls';
const Home = ({ props }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  //const [chartData, setchartData] = useState([]);
  const [periodType, setPeriodType] = useState('Yearly');
  const [indicatorData, setindicatorData] = useState([]);
  const [mapMarkerData, setMapMarkerData] = useState([]);
  const [mapIndicatorData, setMapIndicatorData] = useState({});
  const [geoJsonData, setGeoJsonData] = useState({});
  const [currentMapKey, setCurrentMapKey] = useState(0);
  const reactGrid = useRef(null);
  const [mapIndicatorLabel, setMapIndicatorLabel] = useState(
    mapIndicatorsList[0].label
  );
  const [mapIndicatorValue, setMapIndicatorValue] = useState(
    mapIndicatorsList[0].value
  );

  const [mapView, setMapView] = useState("choropleth");

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

  const applyFilter = (org, period,periodname,periodType) => {
    setFilterFlag(true);
    setBreadcrumbOrg(org);
    setindicatorData([]);
    setMapIndicatorData({});
    setGeoJsonData({});
    setOrgID();
    setPeriodType(periodType)
    
    setPeriodName(periodname)
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
    setindicatorData([]);
    setMapIndicatorData({});
    setGeoJsonData({});
    setCurrentPeriod(date.getFullYear().toString());
    setPeriodName('');
    setPeriodType('');
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

  const mapViewChange = (type) => {
    // console.log(type);
    setMapView(type);
  };

  useEffect(() => {
    setLoading(true);
    setLoadingChart(true);
    // window.location.reload()
    let mounted = true;
    // API.defaults.headers.common['Authorization'] = props.userBO.Authorization

    let count = 0;

    //console.log(breadcrumbOrg);

    if (!filterFlag) {
      if (
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits.length >=
        1
      ) {
        setDefaultOrg(appDefaultOrg);
      } else {
        setDefaultOrg(
          JSON.parse(sessionStorage.getItem("userData")).organisationUnits
        );
      }

      // console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
    }
    
    API.get(`dashboards/${appDashboardID}.json`).then((res) => {
      //console.log(res.data);
      if (res.status === 200) {
        res.data.dashboardItems.map((el) => {
          //console.log(el);
          if (el.visualization) {
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
                  if (orgID) {
                    API.get(url)
                      .then((r) => {
                        //console.log(r.data);
                        temp["dashboardItemValue"] = r.data;
                        setindicatorData((prevVals) => [...prevVals, temp]);
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
                  url +=
                    "&filter=ou:" +
                    //response.data.organisationUnits[0].id +
                    orgID +
                    //"&dimension=pe:LAST_6_MONTHS;THIS_MONTH&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";
                    // LAST_6_MONTHS;THIS_MONTH;
                    "&dimension=pe:" +
                    period +
                    "&includeNumDen=false&skipData=false&skipMeta=false&includeMetadataDetails=true";

                  // console.log(url)
                  // console.log(response.data.name)
                  //console.log(orgID);
                  if (orgID) {
                    API.get(url)
                      .then((r) => {
                        //console.log(r.data);
                        temp["dashboardItemValue"] = r.data;
                        setindicatorData((prevVals) => [...prevVals, temp]);
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
            if (el.type === "MAP") {
              //API.get("maps/" + el.map.id + ".json").then((response) => {
              //setLoading(true);
              API.get(
                "maps/" +
                  el.map.id +
                  "?fields=id%2CdisplayName~rename(name)%2Cuser%2Clongitude%2Clatitude%2Czoom%2Cbasemap%2CmapViews%5Bid%2CdisplayName~rename(name)%2CdisplayDescription~rename(description)%2Ccolumns%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2Crows%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2Cfilters%5Bdimension%2ClegendSet%5Bid%5D%2Cfilter%2CprogramStage%2Citems%5BdimensionItem~rename(id)%2CdisplayName~rename(name)%2CdimensionItemType%5D%5D%2C*%2C!attributeDimensions%2C!attributeValues%2C!category%2C!categoryDimensions%2C!categoryOptionGroupSetDimensions%2C!columnDimensions%2C!dataDimensionItems%2C!dataElementDimensions%2C!dataElementGroupSetDimensions%2C!filterDimensions%2C!itemOrganisationUnitGroups%2C!lastUpdatedBy%2C!organisationUnitGroupSetDimensions%2C!organisationUnitLevels%2C!organisationUnits%2C!programIndicatorDimensions%2C!relativePeriods%2C!reportParams%2C!rowDimensions%2C!series%2C!translations%2C!userOrganisationUnit%2C!userOrganisationUnitChildren%2C!userOrganisationUnitGrandChildren%5D"
              ).then((response) => {
                //console.log(response);
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
                        setindicatorData((prevVals) => [...prevVals, temp]);
                        //console.log(indicatorData);
                        markerData(temp);
                        //setLoading(false);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                } else {
                  //et dxID = response.data.mapViews[0].columns[0].items[0].id; // dxID from mapping
                  let dxID = mapIndicatorValue; // dxID from configuration
                  createMapIndicatorData(temp, dxID);
                  //setLoading(false);
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
  }, [orgID, currentPeriod]);

  useEffect(() => {
    createMapIndicatorData(mapIndicatorData, mapIndicatorValue);
  }, [mapIndicatorValue]);

  const GetDataForChart = (data) => {
    //setLoading(true);
    // console.log(data, ">chart Data")
    let chartName = data.indicatorName;
    let chartType = data.type.toLowerCase();
    data = data.dashboardItemValue;
    let ChartDataArray = [];
    let oCatArr = [];
    if (data.rows.length > 0) {
      data.metaData.dimensions.pe.map((el) => {
        oCatArr.push(data.metaData.items[el].name);
        return true;
      });
      data.metaData.dimensions.dx.map((ell) => {
        let tempObj = {};
        tempObj["name"] = data.metaData.items[ell].name;

        if (chartType === "pie") {
          tempObj["y"] = "";
        } else {
          tempObj["data"] = [];
        }
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
        ChartDataArray.push(tempObj);
        return true;
      });
    }
    // console.log(ChartDataArray, oCatArr)
    let oChartConf = "";

    if (chartType === "pie") {
      oChartConf = pieConf(ChartDataArray, chartName);
    } else {
      oChartConf = columnConfig(chartType, ChartDataArray, oCatArr, chartName);
    }

    //setLoading(false);
    return oChartConf;
  };

  const getDashboardIndicator = () => {
    if (orgID) {
      let instance = {
        "orguid": orgID,
        "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
        "periodtype": periodType.toLowerCase() === 'quaterly' ? 'monthly' : periodType.toLowerCase(),
        "periodvalue": currentPeriod.replace("-", "")
      };
       API.post('dashboardIndicator/geindicators/get_custom_tb_dashboard_indicators', instance)
         .then(res => {
            console.log(res);
         })
         .catch(error => {
            console.error("Error fetching dashboard indicators:", error);
         });
    }
};

getDashboardIndicator();


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
        "?fields=lastUpdated,attributes%5BdisplayName~rename(name),value%5D,relationships";

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
      })
      .catch((e) => {
        console.error(e);
      });
    //return markers;
  };

  const createMapIndicatorData = (mapData, dxID, level, childID) => {
    // console.log(level, childID);
    setLoadingMap(true);
    //console.log(breadcrumbOrg);
    //console.log(mapData);
    if (orgID) {
      //setLoading(true);
      let geoJsonUrl =
        "organisationUnits.geojson?parent=" +
        (childID ? childID : orgID) +
        "&level=" +
        (level ? Number(level) + 1 : 3 + (breadcrumbOrg.length - 1));

      API.get(geoJsonUrl)
        .then((r) => {
          //console.log(r.data);

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
            mapData["type"] = "markerMap";
            setindicatorData((prevVals) => [...prevVals, mapData]);
            setLoadingMap(false);
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
    // console.log(indicatorData)
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
    if (!periodName || periodName =='') {
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
              {/* <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <i className="fa fa-chart-bar color-white fs-12px"></i>
                  <span className="daterange color-white">Cumulative</span>
                </p>
              </div> */}
              <div className="daterangeholder mr-2">
                <p className="mb-0 daterangeholder">
                  <i className="fa fa-calendar-alt color-white fs-12px"></i>
                  <span className="daterange color-white">
                    {getDatePeriod()}
                  </span>
                </p>
              </div>
              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <i className="fa fa-home color-white"></i> Dashboard
                  </Breadcrumb.Item>
                  {breadcrumbOrg
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
          {/* <CreateIndicators data={indicatorData}></CreateIndicators> */}
          <ReactGridLayout
            className="layout"
            margin={MARGIN}
            cols={getGridColumns()}
            rowHeight={GRID_ROW_HEIGHT}
            width={window.innerWidth}
            layout={indicatorData}
            isDraggable={false}
            isResizable={false}
            ref={reactGrid}
          >
            {indicatorData.length > 0 ? (
              indicatorData.map((el, index) => {
                //console.log(el);

                //return <div key={el.id}></div>;
                if (el.type === "SINGLE_VALUE") {
                  //console.log(el);
                  return (
                    <div
                      data-grid={{ x: el.x, y: el.y, w: el.w, h: el.h }}
                      key={el.id}
                      //key={5}
                      className="card mb-2 cardbgdark"
                      style={{ borderLeft: "5px solid " + el.color }}
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
                        {el["indicatorName"]}
                      </h5>
                      <div
                        className="card-body indicatorBody"
                        style={{ background: "#2d3d4f" }}
                        onClick={() => getIndicatorData(el)}
                      >
                        <div className="card-text">
                          {el.dashboardItemValue.rows.length > 0 ? (
                            <CountUp
                              duration={5}
                              end={Number(el.dashboardItemValue.rows[0][2])}
                            />
                          ) : (
                            "No Data"
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else if (
                  el.type === "COLUMN" ||
                  el.type === "LINE" ||
                  el.type === "PIE"
                ) {
                  return (
                    <div
                      key={el.id}
                      //key={2}
                      data-grid={{ x: el.x, y: el.y, w: el.w, h: el.h }}
                      className="card mb-2 cardbgdark border-grey"
                    >
                      <Loader isLoading={loadingChart} />
                      <h5 className="card-header">{el.indicatorName}</h5>
                      <div
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
                  el.type === "choroplethMap"
                ) {
                  return (
                    <div
                      key={el.id}
                      //key={3}
                      data-grid={{ x: el.x, y: el.y, w: el.w, h: el.h }}
                      className="card mb-2 cardbgdark border-grey"
                    >
                      <Loader isLoading={loadingMap} />
                      {el.type === "markerMap" && mapMarkerData ? (
                        <h5 key={el.id} className="card-header">
                          {el.indicatorName}
                        </h5>
                      ) : (
                        ""
                      )}

                      {el.type === "choroplethMap" &&
                      geoJsonData.type === "FeatureCollection" &&
                      mapIndicatorData.type === "choroplethMap" ? (
                        // <h5 key={el.id} className="card-header">
                        //   {el.indicatorName}
                        // </h5>
                        <div className="alertfiltercontainer">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="primary"
                              id="alertfilterbtn"
                            >
                              {mapIndicatorLabel}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {mapIndicatorsList?.length > 0
                                ? mapIndicatorsList.map((indicator, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        as="button"
                                        onClick={(e) =>
                                          changeMapIndicator(indicator)
                                        }
                                      >
                                        {indicator.label}
                                      </Dropdown.Item>
                                    );
                                  })
                                : ""}
                            </Dropdown.Menu>
                          </Dropdown>
                          <ToggleButtonGroup
                            value={mapView}
                            onChange={mapViewChange}
                            type="radio"
                              name="options"
                              id="mapToggle"
                          >
                            <ToggleButton value="choropleth">
                              Choropleth View
                            </ToggleButton>
                            <ToggleButton value="hotspot">
                              Hotspot View
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className="card-body p-0"
                        style={{ background: "#2d3d4f", width: "100%" }}
                      >
                        {el.type === "markerMap" && mapMarkerData ? (
                          <LeafletMarkerMap
                            key={el.id}
                            mapHeight={el.h + 2.375}
                            markerData={mapMarkerData}
                          />
                        ) : (
                          ""
                        )}
                        {el.type === "choroplethMap" &&
                        geoJsonData.type === "FeatureCollection" &&
                        mapIndicatorData.type === "choroplethMap" ? (
                          <LeafletMap
                            key={el.id + currentMapKey}
                            mapKey={currentMapKey}
                            mapHeight={el.h + 2.375}
                            mapIndicatorData={mapIndicatorData}
                            geoJsonData={geoJsonData}
                            latestPeriod={currentPeriod}
                            applyFilter={applyFilter}
                            createMapIndicatorData={createMapIndicatorData}
                            resetFilter={resetFilter}
                            breadcrumbOrg={breadcrumbOrg}
                            mapIndicatorValue={mapIndicatorValue}
                            mapView={mapView}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={el.id}
                      //key={3}
                      data-grid={{ x: el.x, y: el.y, w: el.w, h: el.h }}
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
              <div key={1}></div>
            )}
          </ReactGridLayout>
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

const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(Home);
