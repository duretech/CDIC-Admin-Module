import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import {
  Container,
  Button,
  Breadcrumb,
  Accordion,
  Card,
  Dropdown,
} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import API from "../../services";
import Loader from "../../components/loaders/loader";
import Sidebar from "react-sidebar";
import SidebarContent from "../../components/SidebarContent";

import {
  appDefaultOrg,
  appProgramID,
  alertsThresholdVal,
} from "../../config/appConfig";

export default function Alerts() {
  const [loading, setLoading] = useState(false);
  const [alertsData, setAlertsData] = useState([]);
  const [allAlertsData, setAllAlertsData] = useState([]);
  const [alertNames, setAlertNames] = useState([]);
  const [alertFilterSelected, setAlertFilterSelected] = useState("All");
  const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);

  // >>> Sidebar

  const [filterFlag, setFilterFlag] = useState(false);
  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);

  const [breadcrumbOrg, setBreadcrumbOrg] = useState();

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

  const applyFilter = (org, period) => {
    // console.log(org);
    setOrgID(org[org.length - 1].id);
    // console.log(period);
    //setCurrentPeriod(period);

    setBreadcrumbOrg(org);
    setFilterFlag(true);
    closeSidebar();
  };

  const resetFilter = () => {
    setOrgID(defaultOrg[0].id);
    //setCurrentPeriod(latestPeriod);
    setBreadcrumbOrg(defaultOrg);
    closeSidebar();
  };

  // <<< Sidebar

  const fetchTrackedEntity = () => {
    let trackedEntityUrl =
      "metadata?fields=:owner,displayName&programs:fields=:owner,displayName,attributeValues[:all,attribute[id,name,displayName]],organisationUnits[id,path,displayName,level],dataEntryForm[:owner],programSections[id,name,displayName,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,sortOrder,attributeValues[:all,attribute[id,name,displayName]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,translations[*],style]],attributeValues[:all,attribute[id,name,displayName]],domainType]],user[id,name],programStages[:owner,user[id,name],displayName,attributeValues[:all,attribute[id,name,displayName]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName]],optionSet[id,options[id,code,displayName,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName],dataEntryForm[:owner],programStageSections[:owner,displayName,translations[*],dataElements[id,displayName]]]&dataElements:fields=id,displayName,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,valueType,optionSet[id,options[id,code,displayName,style]],unique";

    API.get(trackedEntityUrl)
      .then((r) => {
        // console.log(r);

        if (r.status === 200) {
          setTrackedEntityAttributes(r.data.trackedEntityAttributes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAlertsData = () => {
    setLoading(true);
    if (!filterFlag) {
      // console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
    }

    //let period = currentPeriod.replace("-", "");

    let url =
      "alerts/list?ouid=" +
      orgID +
      "&programid=" +
      appProgramID +
      "&pageSize=50&skipPaging=true&paging=true";

    API.get(url)
      .then((r) => {
        console.log(r);

        if (r.status === 200) {
          let allAlerts = r.data.data;
          const tempFilters = ["All"];

          for (let i = 0; i < allAlerts.length; i++) {
            //console.log(allAlerts[i]);
            const obj = allAlerts[i];
            const { alertname } = obj;

            //console.log(alertname);

            if (tempFilters.indexOf(alertname) === -1) {
              tempFilters.push(alertname);
            }
          }
          //console.log(tempFilters);
          setAlertsData(r.data.data);
          setAllAlertsData(r.data.data);
          setAlertNames(tempFilters);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (
      JSON.parse(sessionStorage.getItem("userData")).organisationUnits.length >= 1
    ) {
      setDefaultOrg(appDefaultOrg);
    } else {
      setDefaultOrg(
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits
      );
    }
    fetchAlertsData();
  }, [orgID]);

  useEffect(() => {
    fetchTrackedEntity();
  }, []);

  const selectAlertFilter = (filterName) => {
    console.log(filterName);
    //console.log(alertNames);
    //console.log(alertsData);
    setAlertFilterSelected(filterName);

    if (filterName === "All") {
      setAlertsData(allAlertsData);
    } else {
      setAlertsData(
        allAlertsData.filter((item) => item.alertname === filterName)
      );
    }
  };

  //   const findActive = (arr = []) => {
  //     const res = [];
  //     for(let i = 0; i < arr.length; i++){
  //        const obj = arr[i];
  //        const {
  //           id,
  //           isActive
  //        } = obj;
  //        if(isActive){
  //           res.push(id);
  //        }
  //     };
  //     return res;
  //  };

  const pathname = window.location.pathname;

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
                  Select Filter <i className="fa fa-caret-down"></i>
                </Button>
              </div>
              {/* <div className="daterangeholder mr-2">
              <p className="mb-0 daterangeholder">
                <i className="fa fa-chart-bar color-white fs-12px"></i>
                <span className="daterange color-white">Cumulative</span>
              </p>
            </div> */}
              {pathname !== "/alerts" ? (
                <div className="daterangeholder mr-2">
                  <p className="mb-0 daterangeholder">
                    <i className="fa fa-calendar-alt color-white fs-12px"></i>
                    <span className="daterange color-white">
                      {currentPeriod.includes("-") ? (
                        <Moment
                          date={new Date(currentPeriod)}
                          format="MMM-YYYY"
                        />
                      ) : (
                        <Moment date={new Date(currentPeriod)} format="YYYY" />
                      )}
                    </span>
                  </p>
                </div>
              ) : (
                ""
              )}

              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <i className="fa fa-home color-white"></i> Alerts
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
              <div className="ml-auto mr-3 alertfiltercontainer">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="alertfilterbtn">
                    {alertFilterSelected}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {alertNames?.length > 0
                      ? alertNames.map((name, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              as="button"
                              onClick={(e) =>
                                selectAlertFilter(e.target.textContent)
                              }
                            >
                              {name}
                            </Dropdown.Item>
                          );
                        })
                      : "No Alerts"}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="mr-2">
                <p className="mb-0 color-white fs-12px">
                  Threshold Value:{" "}
                  <span className="threshold">{alertsThresholdVal} Days</span>
                </p>
              </div>
            </div>
          </Container>
        </div>

        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="mt-3 table-linelist mb-3 ml-3 mr-3">
            <Accordion defaultActiveKey="0">
              <Row>
                {alertsData?.length > 0 ? (
                  alertsData.map((el, index) => {
                    //console.log(index);
                    //console.log(el);
                    //console.log(trackedEntityAttributes);

                    return (
                      <Col xs lg="4" key={index}>
                        <Card
                          key={index}
                          className="card mb-2 cardbgdark border-grey"
                        >
                          {/* <Accordion.Toggle
                            style={{
                              backgroundColor:
                                el.duedays > alertsThresholdVal
                                  ? "#ff8080"
                                  : "#67cb60",
                            }}
                            as={Card.Header}
                            eventKey={index + 1}
                          >
                            {`${el.alertname}`}{" "}
                            <span style={{ float: "right" }}>
                              Due Days - {`${el.duedays}`}
                            </span>
                          </Accordion.Toggle> */}

                          <Card.Header
                            className="card-header"
                            style={{
                              backgroundColor:
                                el.duedays > alertsThresholdVal
                                  ? "#ff8080"
                                  : "#67cb60",
                            }}
                          >
                            {`${el.alertname}`}{" "}
                            <span style={{ float: "right" }}>
                              Due Days - {`${el.duedays}`}
                            </span>
                          </Card.Header>

                          {/* <Accordion.Collapse eventKey={index + 1}> */}
                          <Card.Body
                            className="card-body"
                            style={{ background: "#2d3d4f" }}
                          >
                            {trackedEntityAttributes.map((val, ind) => {
                              if (el[val.id] !== undefined) {
                                //console.log(ind);
                                //console.log(val.displayName);
                                //console.log(el[val.id]);

                                return (
                                  <p key={ind}>
                                    <b>{`${val.displayName}: `}</b>
                                    {`${el[val.id]}`}
                                  </p>
                                );
                              }
                            })}
                          </Card.Body>
                          {/* </Accordion.Collapse> */}
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <Card>
                    {/* <Accordion.Toggle as={Card.Header} eventKey="0">
                      No Alerts
                    </Accordion.Toggle> */}
                    <Card.Header>No Alerts</Card.Header>
                  </Card>
                )}
              </Row>
            </Accordion>
          </div>
        </div>
        <footer className="footer">
          <p>Powered By</p>
          <img
            src={require("../../assets/images/durelogowhite.png")}
            alt="gallery"
            className="ml-2"
          />
        </footer>
      </div>
    </>
  );
}
