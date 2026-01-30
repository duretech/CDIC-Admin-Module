import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { Container, Button, Breadcrumb, Dropdown } from "react-bootstrap";
import API from "../../services";
import Sidebar from "react-sidebar";
import SidebarContent from "../../components/SidebarContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";
import _ from 'lodash';
import exportFromJSON from 'export-from-json'  

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";

import {
  appDefaultOrg,
  appProgramID,
  alertsThresholdVal,
} from "../../config/appConfig";

import { useTranslation } from 'react-i18next';

const Alerts = ({}) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [alertColumns, setAlertColumns] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [allAlertsData, setAllAlertsData] = useState([]);
  const [alertNames, setAlertNames] = useState([]);
  const [alertFilterSelected, setAlertFilterSelected] = useState("All");
  const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
  const [exportData,setexportData] = useState([]);

  // >>> Sidebar

  const [filterFlag, setFilterFlag] = useState(false);
  const [defaultOrg, setDefaultOrg] = useState(JSON.parse(sessionStorage.getItem("userData")).organisationUnits);

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

  const fetchTrackedEntity = (allAlerts) => {

    let tempColumns = [
      {
        Header: t("Details"),
        columns: [{
          "Header": "UIC",
          "accessor": "UIC"
        },
        {
          "Header": "First name",
          "accessor": "Patient Name"
        },
        {
          "Header": "Age",
          "accessor": "Age"
        },
        {
          "Header": "Gender",
          "accessor": "Gender"
        },
        ],
      },
      {
        Header: "Alerts",
        columns: [],
      },
    ];

    allAlerts.map((el, index) => {
      //console.log(index);
      //console.log(el);
      //console.log(el.alertname);

      //console.log(tempColumns);

      if (
        !tempColumns[1].columns.some(
          (el1) => el1.accessor === el.alertname
        )
      ) {
        // console.log(el.alertname);
        if(el.alertname != 'TB Treatment Referral Alert' && el.alertname != 'LTBI Treatment Referral Alert')
        tempColumns[1].columns.push({
          Header: el.alertname,
          accessor: el.alertname,
        });
      }
    });

    // console.log(tempColumns);
    setAlertColumns(tempColumns);
  };

  const fetchAlertsData = () => {
    setLoading(true);
    if (!filterFlag) {
      // console.log(defaultOrg[0].id);
      setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
      setBreadcrumbOrg(defaultOrg);
    }

    //let period = currentPeriod.replace("-", "");

    if (orgID) {
      let url =
        "alerts/alertlist?ouid=" +
        orgID +
        "&programid=" +
        JSON.parse(sessionStorage.getItem("userData")).programuid +
        "&pageSize=100000&skipPaging=true&paging=true&offset=0";

      API.get(url)
        .then((r) => {
          // console.log(r);
          setLoading(false);
          if (r.status === 200) {
            let allAlerts = r.data.data;
            const tempFilters = ["All"];
            const tempColumns = [];

            for (let i = 0; i < allAlerts.length; i++) {
              //console.log(allAlerts[i]);
              const obj = allAlerts[i];
              const { alertname, duedays } = obj;

              // if (alertname === "FollowUp Alert") {
              //   obj.alertname = "Follow Up Alert"; // Change the alertname property
              // }

              console.log(alertname);

              allAlerts[i][alertname] = duedays;
              // let tempName = "Follow Up Alert";
              if (tempFilters.indexOf(alertname) === -1 && alertname != 'TB Treatment Referral Alert' && alertname != 'LTBI Treatment Referral Alert') {
                // if(alertname == "FollowUp Alert"){
                  // alertname = tempName
                // }
                // if(alertname == "FollowUp Alert")
                tempFilters.push(alertname);
              }
            }

            // console.log(allAlerts);
            //console.log(tempFilters);
            var Sortedtemp = []
            let tempSort = _.cloneDeep(allAlerts)
            // console.log(tempSort)
            tempSort.map( el => {
              Sortedtemp.push(JSON.parse(JSON.stringify( el, [
                // "registerbyuser",
                "UIC",
                "Client type",
                "First name",
                "Surname",
                "Date of birth",
                "Age",
                "Gender",
                'Adherence Alert',
                'TP Treatment',
                'LTBI Testing Referral Alert',
                'TB Testing Referral Alert',
                // "Nationality",
                // "Phone number (permanent)",
                // "Patient address",
                // "Facility Name",
                // "Previous BCG Vaccination?",
                // "Current or Previous TB treatment?",
                // "Date of initiation of TB treatment",
                // "Current or previous TPT",
                // "Are you immuno-compromised?",
                // "HIV Status",
                // "Are you on ART?",
                // "Comments",
              ] , 4)))
            })
            setexportData(Sortedtemp)

            setAlertsData(_.cloneDeep(r.data.data));
            setAllAlertsData(allAlerts);
            setAlertNames(tempFilters);

            // console.log(allAlerts);
            //console.log(tempFilters);
            setAlertsData(allAlerts);
            setAllAlertsData(allAlerts);
            setAlertNames(tempFilters);

            fetchTrackedEntity(allAlerts);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (
      JSON.parse(sessionStorage.getItem("userData")).organisationUnits.length >= 1
    ) {
      setDefaultOrg(defaultOrg);
    } else {
      setDefaultOrg(
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits
      );
    }
    fetchAlertsData();
  }, [orgID]);

  // useEffect(() => {
  //   fetchTrackedEntity();
  // }, []);

  const selectAlertFilter = (filterName) => {
    // console.log(filterName);
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

  // Define a default UI for filtering
  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (
      <span>
        {t("Search:")}{" "}
        <input
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} Alerts...`}
          style={{
            fontSize: "1.1rem",
            border: "0",
          }}
        />
      </span>
    );
  }

  // Create a default prop getter
  const defaultPropGetter = () => ({});

  function Table({
    columns,
    data,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  }) {
    const filterTypes = React.useMemo(
      () => ({
        text: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
              : true;
          });
        },
      }),
      []
    );
    const defaultColumn = React.useMemo(() => ({}), []);

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      //rows,
      prepareRow,
      state,
      //visibleColumns,
      preGlobalFilteredRows,
      setGlobalFilter,

      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page

      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        defaultColumn /* Be sure to pass the defaultColumn option */,
        filterTypes,
        initialState: { pageIndex: 0 },
      },
      useFilters,
      useGlobalFilter,
      usePagination
    );
    // console.log(pageOptions, "pageOptions")
    // Render the UI for your table
    return (
      <>
        <div className="pagination">
          <div className="alertfiltercontainer">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="alertfilterbtn">
                {t(alertFilterSelected)}
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
                        {t(name)}
                      </Dropdown.Item>
                    );
                  })
                  : t("No Alerts")}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            style={{ marginRight: "10px" }}
          />
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            {t("Page")}{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span className="mobile-css">
            | {t("Go to page")}:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {t("Show")} {pageSize}
              </option>
            ))}
          </select>
          {/* unhide for ecport alerts */}
          <Button
          className="excelDownload pl-2 btn btn-primary"
          onClick={e => {
          // console.log(data)
          const fileName = 'download'  
          const exportType = 'xls'  
          const data = exportData
          exportFromJSON({ data, fileName, exportType})
        }}>
          {t("Excel Download")}
        </Button>
        </div>
        <table {...getTableProps()} id="alertsTable" style={{ width: "90%" ,margin:"0 auto "}}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {t(column.render("Header"))}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {data.length > 0 ? (
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                let rowProps = row.getRowProps();

                //console.log(row);
                //console.log(rowProps);
                return (
                  <React.Fragment key={row.id}>
                    {/* <tr {...rowProps} key={row.id}>
                      {row.cells.map((cell) => {
                        let cellProps = cell.getCellProps();
                        if (cell.value !== undefined) {
                          return (
                            <td {...cellProps} key={cell.column.id}>
                              {cell.render("Cell")}
                            </td>
                          );
                        } else {
                          //console.log(cell);
                          return <td {...cellProps} key={cell.column.id}></td>;
                        }
                      })}
                    </tr> */}
                    <tr {...row.getRowProps(getRowProps(row))}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            // Return an array of prop objects and react-table will merge them appropriately
                            {...cell.getCellProps([
                              {
                                className: cell.column.className,
                                style: cell.column.style,
                              },
                              //getColumnProps(cell.column),
                              getCellProps(cell),
                            ])}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={columns.length}>No Data</td>
              </tr>
            </tbody>
          )}
        </table>
      </>
    );
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

              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#"> {t("Alerts")}
                  </Breadcrumb.Item>
                  {breadcrumbOrg
                    ? breadcrumbOrg.map((org) => (
                      <Breadcrumb.Item href="#" key={org.id}>
                        {t(org.displayName)}
                      </Breadcrumb.Item>
                    ))
                    : ""}
                  {/* <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
              <div
                className="ml-auto mr-3 alertfiltercontainer"
                style={{ display: "none" }}
              >
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="alertfilterbtn">
                    {t(alertFilterSelected)}
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
                            {t(name)}
                          </Dropdown.Item>
                        );
                      })
                      : t("No Alerts")}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="ml-auto mr-2">
                <p className="mb-0 color-white fs-12px">
                  {t("Threshold Value:")}{" "}
                  <span className="threshold">{alertsThresholdVal} Days</span>
                </p>
              </div>
            </div>
          </Container>
        </div>
        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="fixHeight">

            <div className="table-linelist">
              <Table
                columns={alertColumns}
                data={alertsData}
                getRowProps={(row) => ({
                  style: {
                    background:
                      row.index % 2 === 0 ? "rgba(0,0,0,.1)" : "white",
                  },
                })}
                getCellProps={(cellInfo) => {
                  //console.log(cellInfo);
                  let color = "";
                  if (cellInfo.column.parent.Header === "Alerts") {
                    if (Number(cellInfo.value) < Number(alertsThresholdVal)) {
                      color = "#67cb60";
                    } else if (
                      Number(cellInfo.value) > Number(alertsThresholdVal)
                    ) {
                      color = "#ff8080";
                    } else {
                      color = "";
                    }
                  }
                  return {
                    style: {
                      backgroundColor: color,
                    },
                  };
                }}
              />
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
}

export default Alerts;
