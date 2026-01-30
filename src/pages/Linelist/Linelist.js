import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import API from "../../services";
import Sidebar from "react-sidebar";
import Moment from "react-moment";

import { Container, Button, Breadcrumb, Modal } from "react-bootstrap";

import SidebarContent from "../../components/SidebarContent";
import Table from "./DataTable";
import SubTable from "./SubTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";
import {
  appDefaultOrg,
  appProgramID,
  appAttributeID,
  appEQ,
  appFilter,
  appFilterLabel,
  parentTableHeader,
  childTableHeader,
} from "../../config/appConfig";

import _ from "lodash";
// import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import ComponentLoader from "../../components/loaders/ComponentLoader";

import { useTranslation } from 'react-i18next';

const Linelist = ({ props }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [linelistColumns, setLinelistColumns] = useState([
    // {
    //   // Build our expander column
    //   id: "expander", // Make sure it has an ID
    //   Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) =>
    //     true ? (
    //       <span {...getToggleAllRowsExpandedProps()}>
    //         {isAllRowsExpanded ? "🔽" : "▶️"}
    //       </span>
    //     ) : (
    //       ""
    //     ),

    //   Cell: ({ row }) =>
    //      (
    //       <span
    //         {...row.getToggleRowExpandedProps({
    //           style: {
    //             paddingLeft: `${row.depth * 2}rem`,
    //           },
    //         })}
    //       >
    //         test
    //         {/* {row.isExpanded == undefined ? '👇' : '👉'} */}
    //       </span>
    //     ) ,

    // },
    {
      "Header": "UIC",
      "accessor": "uic",
    },
    {
      "Header": "Age",
      "accessor": "age"
    },
    {
      "Header": "Gender",
      "accessor": "gender"
    },
    {
      "Header": "First name",
      "accessor": "firstname"
    },
    {
      "Header": "ADDRESS",
      "accessor": "ADDRESS"
    }
  ]);
  const [lineListData, setLineListData] = useState([]);
  const [lineListRawData, setLineListRawData] = useState([]);
  const [lineListDataExport, setLineListDataExport] = useState([]);
  //const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(appFilter);
  const [categoryLabel, setCategoryLabel] = useState(appFilterLabel);

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();

  const handleCloseModal = () => setShowModal(false);

  // >>> Sidebar

  const [filterFlag, setFilterFlag] = useState(false);
  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);
  const [periodName, setPeriodName] = useState();

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

  const applyFilter = (org, period, periodname) => {
    // console.log(org);
    setOrgID(org[org.length - 1].id);
    // console.log(period);
    setCurrentPeriod(period);
    setPeriodName(periodname)
    setBreadcrumbOrg(org);
    setFilterFlag(true);
    closeSidebar();
  };

  const resetFilter = () => {
    setOrgID(defaultOrg[0].id);
    setCurrentPeriod(currentPeriod);
    setBreadcrumbOrg(defaultOrg);
    closeSidebar();
  };

  const changeCategory = (category) => {
    if (sessionStorage.getItem("indicatorData") != "")
      sessionStorage.setItem("indicatorData", "");
    // console.log(category);
    setCategoryFilter(category.value);
    setCategoryLabel(category.label);
  };
  // <<< Sidebar

  const titleCase = (str) => {
    //console.log(str);
    //console.log(str.length);
    if (str.length <= 1) {
      return str;
    } else if (/\d/.test(str)) {
      return str;
    } else {
      return str
        .toLowerCase()
        .split(" ")
        .map(function (word) {
          return word.replace(word[0], word[0].toUpperCase());
        })
        .join(" ");
    }
  };

  const showCaseHistory = (uic, events, caseName) => {
    setModalContent();
    setModalHeader(caseName);

    let trackedEntityUrl =
      "metadata?fields=:owner,displayName&programs:filter=id:eq:" + appProgramID + "&programs:fields=:owner,displayName,attributeValues[:all,attribute[id,name,displayName]],renderType,program,sortOrder,lastUpdated,programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,translations[*],style]],attributeValues[:all,attribute[id,name,displayName]],domainType]],user[id,name],programStages[:owner,user[id,name],displayName,attributeValues[:all,attribute[id,name,displayName]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName]],optionSet[id,options[id,code,displayName,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName],dataEntryForm[:owner],programStageSections[:owner,displayName,translations[*],dataElements[id,displayName]]]&dataElements:fields=id,displayName,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER";

    API.get(trackedEntityUrl)
      .then((r) => {
        //console.log(r.data.trackedEntityAttributes);

        if (r.status === 200) {
          //setTrackedEntityAttributes(r.data.trackedEntityAttributes);

          let dataElements = r.data.dataElements;
          let programs = r.data.programs.filter(
            (program) => program.id === appProgramID
          );
          //console.log(uic);
          // console.log(events);
          //console.log(dataElements);
          //console.log(programs);

          let mainModalContent = "";

          if (events === "parentTable") {
            let url = `trackedEntityInstances/${uic}.json?program=${appProgramID}&fields=*?`;

            API.get(url)
              .then((res) => {
                // console.log("Events >>>>", res);
                let parentEvents = res.data.enrollments[0].events;

                // console.log(parentEvents);

                if (Array.isArray(parentEvents) && parentEvents.length > 0) {
                  mainModalContent = parentEvents.map((val, ind) => {
                    //console.log(ind);
                    //console.log(val);

                    let programStage = programs[0].programStages.filter(
                      (stage) => stage.id === val.programStage
                    );

                    // console.log(programStage,"programStage");

                    let modalContent = (
                      <table key={ind} style={{ width: "100%" }}>
                        <tbody>
                          <tr key={ind}>
                            <td>
                              <b>Program Stage</b>
                            </td>
                            <td>{programStage[0]?.displayName}</td>
                          </tr>
                          <tr key={ind + 1}>
                            <td>
                              <b>Status</b>
                            </td>
                            <td>{val.status}</td>
                          </tr>
                          {val.dataValues.map((v, i) => {
                            //console.log(v.dataElement);

                            let labelName = dataElements.filter(
                              (entity) => entity.id === v.dataElement
                            );

                            //console.log(labelName[0].displayName);
                            //console.log(v.value);

                            if (
                              labelName[0].displayName !== "District" &&
                              labelName[0].displayName !==
                              "Referral facility" &&
                              labelName[0].displayName !==
                              "Select Referral Service"
                            ) {
                              return (
                                <tr key={i}>
                                  <td>
                                    <b>{labelName[0].displayName}</b>
                                  </td>
                                  <td>{v.value}</td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    );

                    return modalContent;
                  });
                } else {
                  mainModalContent = (
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td>
                            <b>No Data</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                }
                setModalContent(mainModalContent);
              })
              .catch((error) => {
                console.log("error>>", error);
              });
          } else if (Array.isArray(events) && events.length > 0) {
            mainModalContent = events.map((val, ind) => {
              //console.log(ind);
              //console.log(val);

              let programStage = programs[0].programStages.filter(
                (stage) => stage.id === val.programStage
              );

              //console.log(programStage);

              let modalContent = (
                <table key={ind} style={{ width: "100%" }}>
                  <tbody>
                    <tr key={ind}>
                      <td>
                        <b>Program Stage</b>
                      </td>
                      <td>{programStage[0].displayName}</td>
                    </tr>
                    <tr key={ind + 1}>
                      <td>
                        <b>Status</b>
                      </td>
                      <td>{val.status}</td>
                    </tr>
                    {val.dataValues.map((v, i) => {
                      //console.log(v.dataElement);

                      let labelName = dataElements.filter(
                        (entity) => entity.id === v.dataElement
                      );

                      //console.log(labelName[0].displayName);
                      //console.log(v.value);

                      if (
                        labelName[0].displayName !== "District" &&
                        labelName[0].displayName !== "Referral facility" &&
                        labelName[0].displayName !== "Select Referral Service"
                      ) {
                        return (
                          <tr key={i}>
                            <td>
                              <b>{labelName[0].displayName}</b>
                            </td>
                            <td>{v.value}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              );

              return modalContent;
            });

            setModalContent(mainModalContent);
          } else {
            mainModalContent = (
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>
                      <b>No Data</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            );

            setModalContent(mainModalContent);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setShowModal(true);
  };

  // This could be inlined into SubRowAsync, this this lets you reuse it across tables
  const SubRows = ({
    row,
    rowProps,
    visibleColumns,
    subRowColumns,
    subRowData,
    loading,
  }) => {
    if (loading) {
      return (
        <tr>
          <td />
          <td colSpan={visibleColumns.length - 1}>Loading...</td>
        </tr>
      );
    }

    // error handling here :)
    //console.log(visibleColumns);
    //console.log(subRowColumns);
    //console.log(subRowData);
    // console.log(row)

    return (
      <>
        <tr>
          <td />
          <td colSpan={visibleColumns.length - 1}>
            {subRowData.length > 0 ? (
              <SubTable columns={subRowColumns} data={subRowData} />
            ) : (
              "No data"
            )}

            {/* For Independent Sub Table */}
          </td>
        </tr>

        {/* For using headers of main table */}
        {/* {subRowData.map((x, i) => {
          return (
            <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render(cell.column.SubCell ? "SubCell" : "Cell", {
                      value: cell.column.accessor && cell.column.accessor(x, i),
                      row: { ...row, original: x },
                    })}
                  </td>
                );
              })}
            </tr>
          );
        })} */}
      </>
    );
  };

  const SubRowAsync = ({ row, rowProps, visibleColumns }) => {
    const [subRowData, setSubRowData] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.log(row,rowProps,visibleColumns);

    let entityInstance = row["original"]['instanceid'];

    const subRowColumns = childTableHeader;

    const getHouseholdRelations = (trackedEntityInstance) => {
      let url = `trackedEntityInstances/${trackedEntityInstance}.json?program=${appProgramID}&fields=relationships`;

      //console.log("trackedEntityInstancesURL>>", url);

      API.get(url)
        .then((res) => {
          // console.log("getAPI>>>>", res);

          getChildrenById(res.data.relationships);
        })
        .catch((error) => {
          console.log("error>>", error);
        });
    };

    const getChildrenById = (relationshipsArr) => {
      let p = [];
      relationshipsArr.map((relobj) => {
        let url = `trackedEntityInstances/${relobj.to.trackedEntityInstance.trackedEntityInstance}.json?program=${appProgramID}&fields=*?`;
        p.push(API.get(url));
        return true;
      });

      Promise.all([...p]).then(([...res]) => {
        let childrenArr = [...res];
        //console.log("Children -->>", childrenArr);
        let subRowData = [];

        childrenArr.map((children) => {
          let tempObj = {};

          // console.log("Child Row -------->", children.data);

          let caseName = children.data.attributes.find(
            (el) => el.displayName.trim().toLowerCase() === "name"
          );

          children.data.attributes.map((attr, index) => {
            //console.log(index + ") " + attr.displayName + " : " + attr.value);

            if (
              attr.displayName === "UIC" ||
              attr.displayName === "Order number"
            ) {
              tempObj[attr.displayName] = (
                <span
                  style={{
                    margin: "0px",
                    // color: "#fff",
                    cursor: "pointer",
                    textDecorationLine: "underline",
                  }}
                  onClick={() =>
                    showCaseHistory(
                      children.data.trackedEntityInstance,
                      children.data.enrollments[0].events,
                      ""
                    )
                  }
                >
                  {attr.value}
                </span>
              );
            } else {
              tempObj[attr.displayName] = attr.value;
            }

            return true;
          });

          subRowData.push(tempObj);
          return true;
        });

        ///console.log("Sub Row Data >>>", subRowData);
        setLoading(false);
        setSubRowData(subRowData);
      });
    };

    React.useEffect(() => {
      const timer = setTimeout(() => {
        //setData(makeData(3));
        getHouseholdRelations(entityInstance);

        //setLoading(false);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }, []);

    return (
      <SubRows
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
        subRowColumns={subRowColumns}
        subRowData={subRowData}
        loading={loading}
      />
    );
  };

  const fetchLineListDataGen = () => {
    API.get('referral/myclient/list?programid=' + JSON.parse(sessionStorage.getItem("userData")).programuid + '&orgid=' + JSON.parse(sessionStorage.getItem("userData")).orguid) 
      .then(res => {
        var Sortedtemp = []
        let temp = _.cloneDeep(res.data.data)
        res.data.data.map(el => {
          el['uic'] = <p
            style={{
              margin: '0px',
              color: "#fff",
              cursor: "pointer",
              textDecorationLine: "underline",
            }}
            onClick={() =>
              showCaseHistory(
                el.instanceid,
                "parentTable",
                el['familyaname']
              )
            }
          >
            {el['uic']}
          </p>
        })
        temp.map(el => {
          delete el.parent
          delete el.types
          delete el.instanceid
          delete el.Code
          delete el['Number of members in the household']
          delete el['Other vulnerable population']
          delete el['Relationship with index']
          delete el['General population']
          delete el['Miners']

          // unhide code if values are not in format from db

          // el['Date of birth'] = new Date(el['Date of birth']).toISOString().split('T')[0]
          // if(el["Date of initiation of TB treatment"] != '' && el["Date of initiation of TB treatment"] != undefined ){
          // el["Date of initiation of TB treatment"] = new Date(el["Date of initiation of TB treatment"]).toISOString().split('T')[0]
          // }
          // if(!el['Phone number (permanent)'])
          // el['Phone number (permanent)'] = '' 
          
          // if(!el['Date of initiation of TB treatment'])
          // el['Date of initiation of TB treatment'] = ''

          // if(!el['Are you on ART?'])
          // el['Are you on ART?'] = ''

          // if(!el['Current or previous TPT'])
          // el['Current or previous TPT'] = ''
          Sortedtemp.push(JSON.parse(JSON.stringify( el, [
            // "registerbyuser",
            "uic",
            "Client type",
            "firstname",
            "familyaname",
            // "Date of birth",
            "age",
            "gender"
          ] , 4)))
        })
        setLineListDataExport(Sortedtemp)
        // setLineListDataExport(temp)
        if (categoryLabel == 'All')
          setLineListData(res.data.data);
        else
          setLineListData(_.filter(res.data.data, { 'Client type': categoryFilter }))
      })
    // } 
  }

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
    fetchLineListDataGen()
  }, [orgID, currentPeriod, categoryFilter]);

  // console.log(linelistColumns);
  //console.log(lineListData);

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    []
  );

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
              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    {t("Linelist")}
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
          <div className="fixHeight">
            <div className="table-linelist table-linelist-stick">
              {loading ? <ComponentLoader /> :
                <Table
                  columns={linelistColumns}
                  data={lineListData}
                  exportData={_.cloneDeep(lineListDataExport)}
                  renderRowSubComponent={renderRowSubComponent}
                  changeCategory={changeCategory}
                  selectedCategory={categoryLabel}
                />}
              <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                id="caseHistory"
              >
                <Modal.Header closeButton>
                  <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {modalContent ? (
                    modalContent
                  ) : (
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td>
                            <b>Loading...</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </Modal.Body>
              </Modal>
            </div>
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
};

export default Linelist;
