import React, { useState } from "react";
import { Accordion, Card, Form, Dropdown } from "react-bootstrap";
import Select from "react-select";

import MonthPickerInput from "react-month-picker-input";
import "react-month-picker-input/dist/react-month-picker-input.css";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";

import originalMoment from "moment";
import { extendMoment } from "moment-range";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import API from "../services";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { app_locale } from "../config/appConfig";
import swal from "sweetalert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SidebarContent(props) {
  const { t, i18n } = useTranslation();
  const date = new Date();
  const moment = extendMoment(originalMoment);

  const defaultCountryOrg = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData")).organisationUnits
    : [{ id: "scWe0JcnFNx", displayName: "South Africa" }];

  const [currentOrg, setCurrentOrg] = useState(defaultCountryOrg);

  const [countryOrg, setCountryOrg] = useState([
    { displayName: "Select Country", id: null },
  ]);
  const [provinceOrg, setProvinceOrg] = useState([
    { displayName: "Select Province", id: null },
  ]);
  const [districtOrg, setDistrictOrg] = useState([
    { displayName: "Select District", id: null },
  ]);
  const [blockOrg, setBlockOrg] = useState([
    { displayName: "Select Block", id: null },
  ]);
  const [facilityOrg, setFacilityOrg] = useState([
    { displayName: "Select Facility", id: null },
  ]);
  const [subfacilityOrg, setSubFacilityOrg] = useState([
    { displayName: "Select Facility", id: null },
  ]);

  const [currentPeriod, setCurrentPeriod] = useState(props.latestPeriod);

  const countryListFilter = [
    {
      id: sessionStorage.getItem("userData")
        ? JSON.parse(sessionStorage.getItem("userData")).orguid
        : "",
      label: sessionStorage.getItem("userData")
        ? JSON.parse(sessionStorage.getItem("userData")).orgname
        : "",
      value: sessionStorage.getItem("userData")
        ? JSON.parse(sessionStorage.getItem("userData")).orgname
        : "",
    },
  ];

  const [update, setUpdate] = useState(0);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [blocksList, setBlocksList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [periodType, setPeriodType] = useState(
    app_locale == "ETHIOPIA" ? "Date Range" : "Yearly"
  );
  const [subfacilityList, setSubFacilityList] = useState([]);

  // FIX: dateRange now stores [fromDate, toDate] separately — both null by default
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [periodName, setPeriodName] = useState();
  const [selectedQuarter, setSelectedQuarter] = useState(
    date.getFullYear() +
      "01;" +
      date.getFullYear() +
      "02;" +
      date.getFullYear() +
      "03"
  );

  // Organisation levels state
  const [levels, setLevels] = useState([]);

  const closeSidebar = () => {
    props.closeSidebar();
  };

  // FIX: applyFilter now validates date range before applying
  const applyFilter = async () => {
    // Validate date range - both dates must be selected
     if (periodType === "Date Range") {
      if (!fromDate || !toDate) {
        await swal({
          title: "Date Required",
          text: !fromDate && !toDate
            ? "Please select both From Date and To Date."
            : !fromDate
            ? "Please select From Date."
            : "Please select To Date.",
          icon: "warning",
          button: "OK",
        });
        return;
      }
    }

    console.log(currentPeriod, periodName, periodType, currentOrg);
    props.applyFilter(currentPeriod, periodName, periodType, currentOrg);

    toast.success("Filters applied successfully!");
    
  };

  // Organisation Levels
  const handleSelect = (levelIndex, orgID, orgName) => {
    if (levelIndex === 0) {
      setCountryOrg([{ displayName: orgName, id: orgID }]);
      setLevels([]);
    }

    const newLevels = [...levels];
    newLevels.splice(levelIndex);

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;

    API.get(url)
      .then((r) => {
        const children = r.data.children;
        if (children.length > 0) {
          newLevels.push({
            id: `level_${levelIndex + 1}`,
            displayName: `Select Level ${levelIndex + 2}`,
            options: children,
            children: true,
            selected:
              orgName == ""
                ? { displayName: "Select", id: orgID }
                : { displayName: orgName, id: orgID },
          });
        } else {
          newLevels.push({
            id: `level_${levelIndex + 1}`,
            displayName: `Select Level ${levelIndex + 2}`,
            options: [],
            children: false,
            selected:
              orgName == ""
                ? { displayName: "Select", id: orgID }
                : { displayName: orgName, id: orgID },
          });
        }
        setCurrentOrg(orgID);
        setLevels(newLevels);
      })
      .catch((error) => console.log(error));
  };

  // FIX: resetFilter now resets ALL fields properly
  const resetFilter = () => {

    // Reset organisation
    setCurrentOrg(defaultCountryOrg);
    setCountryOrg([{ displayName: "Select Country", id: null }]);
    setProvinceOrg([{ displayName: "Select Province", id: null }]);
    setDistrictOrg([{ displayName: "Select District", id: null }]);
    setBlockOrg([{ displayName: "Select Block", id: null }]);
    setFacilityOrg([{ displayName: "Select Facility", id: null }]);
    setSubFacilityOrg([{ displayName: "Select Facility", id: null }]);

    // Reset organisation levels dropdown
    setLevels([]);

    // Reset lists
    setProvinceList([]);
    setDistrictList([]);
    setBlocksList([]);
    setFacilityList([]);
    setSubFacilityList([]);

    // Reset period
    setPeriodName("");
    setPeriodType(app_locale == "ETHIOPIA" ? "Date Range" :"Yearly");
    setCurrentPeriod(date.getFullYear().toString());
    
    // FIX: Reset date range to null (empty)
    setFromDate(null);
    setToDate(null);

    // Reset quarter
    setSelectedQuarter(
      date.getFullYear() +
        "01;" +
        date.getFullYear() +
        "02;" +
        date.getFullYear() +
        "03"
    );

    setUpdate(Math.random());

    props.resetFilter();
    toast.success("Filters reset successfully!");
  };

  const selectCountryValue = (orgID, orgName) => {
    let tempOrg = [{ displayName: orgName, id: orgID }];
    setCountryOrg(tempOrg);
    setProvinceOrg();
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        setProvinceList(r.data.children);
        setDistrictList([]);
        setBlocksList([]);
        setFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectProvinceValue = (orgID, orgName) => {
    let tempOrg = [{ displayName: orgName, id: orgID }];
    setProvinceOrg(tempOrg);
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        setDistrictList(r.data.children);
        setBlocksList([]);
        setFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectDistrictValue = (orgID, orgName) => {
    let tempOrg = [{ displayName: orgName, id: orgID }];
    setDistrictOrg(tempOrg);
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        setBlocksList(r.data.children);
        setFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // FIX: Date Range picker - handle fromDate and toDate separately
  // User must manually select both dates - no auto-set
  const handleFromDateChange = (selected) => {
    if (!selected) {
      setFromDate(null);
      return;
    }
    const from = new Date(selected);
    setFromDate(from);

    // FIX: Do NOT auto-set toDate - user must select it manually
    // Only update period if BOTH dates are selected
    if (toDate) {
      updateDateRangePeriod(from, toDate);
    }
  };

  const handleToDateChange = (selected) => {
    if (!selected) {
      setToDate(null);
      return;
    }
    const to = new Date(selected);

    // Validate: toDate must be after fromDate
    if (fromDate && to < fromDate) {
      swal({
        title: "Invalid Date",
        text: "To Date must be after From Date.",
        icon: "warning",
        button: "OK",
      });
      return;
    }

    setToDate(to);

    // Only update period if BOTH dates are selected
    if (fromDate) {
      updateDateRangePeriod(fromDate, to);
    }
  };

  const updateDateRangePeriod = (from, to) => {
    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    setPeriodName(`${fromStr} to ${toStr}`);
    //setCurrentPeriod(getDatesBetweenDates(fromStr, toStr));
    setCurrentPeriod(`${fromStr};${toStr}`);
  };

  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = [];
    const theDate = new Date(startDate);
    const end = new Date(endDate);
    while (theDate <= end) {
      dates.push(new Date(theDate).toISOString().split("T")[0]);
      theDate.setDate(theDate.getDate() + 1);
    }
    return dates.join(";");
  };

  const renderPeriodFilter = () => {
    if (periodType == "Yearly") {
      return (
        <div className="mb-3">
          <Form>
            <Form.Group>
              <Form.Control
                as="select"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
              >
                {[...Array(5)].map((_, i) => {
                  const year = date.getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
      );
    } else if (periodType == "Monthly") {
      return (
        <div className="mb-3">
          <MonthPickerInput
            key={update}
            year={date.getFullYear()}
            month={date.getMonth()}
            closeOnSelect={true}
            onChange={function (maskedValue, selectedYear, selectedMonth) {
              const month = String(Number(selectedMonth) + 1).padStart(2, "0");
              setCurrentPeriod(`${selectedYear}${month}`);
              setPeriodName(`${maskedValue}`);
            }}
          />
        </div>
      );
    } else if (periodType == "Quarterly") {
      return (
        <div className="mb-3">
          <Form>
            <Form.Group>
              <Form.Control
                as="select"
                value={currentPeriod}
                onChange={(e) => {
                  setCurrentPeriod(e.target.value);
                  setPeriodName(
                    e.target.options[e.target.selectedIndex].text
                  );
                }}
              >
                <option value={date.getFullYear() + "Q1"}>
                  Quarter 1(Jan-Mar)
                </option>
                <option value={date.getFullYear() + "Q2"}>
                  Quarter 2(Apr-Jun)
                </option>
                <option value={date.getFullYear() + "Q3"}>
                  Quarter 3(Jul-Sep)
                </option>
                <option value={date.getFullYear() + "Q4"}>
                  Quarter 4(Oct-Dec)
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
      );
    } else if (periodType == "Date Range") {
      // FIX: Separate From and To date pickers
      // User must select both manually - no auto-set
      return (
        <div className="mb-3">
          <Form>
            <Form.Group>
              <Form.Label className="sidebar-header whiteColor">
                From Date
              </Form.Label>
              <Form.Control
                type="date"
                value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
                max={toDate ? toDate.toISOString().split("T")[0] : ""}
                onChange={(e) => handleFromDateChange(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label className="sidebar-header whiteColor">
                To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={toDate ? toDate.toISOString().split("T")[0] : ""}
                min={fromDate ? fromDate.toISOString().split("T")[0] : ""}
                onChange={(e) => handleToDateChange(e.target.value)}
              />
            </Form.Group>
            {/* Show selected range info */}
            {fromDate && toDate && (
              <p className="mt-2" style={{ color: "#fff", fontSize: "12px" }}>
                Selected: {fromDate.toISOString().split("T")[0]} to{" "}
                {toDate.toISOString().split("T")[0]}
              </p>
            )}
            {/* Show warning if incomplete */}
            {(fromDate && !toDate) || (!fromDate && toDate) ? (
              <p className="mt-2" style={{ color: "#ffcc00", fontSize: "12px" }}>
                ⚠ Please select both From Date and To Date.
              </p>
            ) : null}
          </Form>
        </div>
      );
    }
  };

  const pathname = window.location.pathname;

  return (
    <div className="filter-sidebar-content">
      {app_locale == "ETHIOPIA" &&
        <p className="sidebar-header mb-3">
          {t("Select Filter")}
          <button
            type="button"
            className="close-sidebar"
            onClick={() => closeSidebar()}
          >
            <FontAwesomeIcon
              className="color-white fs-12px mx-0"
              icon={faTimes}
            />
          </button>
        </p>
      }
      <div className="sidebardropdown"></div>

      {pathname != "/alerts" ? (
        <div>
          <div className="mb-2 mt-4"></div>
          {app_locale != "ETHIOPIA" && <div className="periodselectcontainer">
            <Form>
              <Form.Group controlId="exampleForm.SelectCustom mt-2">
                <Form.Label className="sidebar-header whiteColor">
                  Period Type{" "}
                </Form.Label>
                <Form.Control
                  as="select"
                  value={periodType}
                  custom
                  className="mt-2"
                  onChange={function (value) {
                    setPeriodType(value.target.value);
                    // FIX: Reset dates when period type changes
                    setFromDate(null);
                    setToDate(null);
                    setPeriodName("");
                  }}
                  disabled={app_locale == "ETHIOPIA" ? true : false}
                >
                  <option value="Date Range">Date Range</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </div>}

          {renderPeriodFilter()}

          <div>
            <Form>
              <Form.Group controlId="formOrg">
                <Form.Label className="label">Organisation</Form.Label>
                <div className="sidebardropdown organisationDiv">
                  <Dropdown className="dropdownset m-0">
                    <Dropdown.Toggle className="dropdownset">
                      {countryOrg[0].displayName
                        ? t(countryOrg[0].displayName)
                        : "Select Country"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {countryListFilter?.map((org) => (
                        <Dropdown.Item
                          key={org.id}
                          onClick={() => handleSelect(0, org.id, org.label)}
                        >
                          {org.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {levels.map((level, index) =>
                    level.children == true ? (
                      <Dropdown key={level.id} className="dropdownset m-0">
                        <Dropdown.Toggle className="dropdownset">
                          {levels[index + 1]
                            ? levels[index + 1].selected.displayName
                            : level.displayName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {level.options.map((org) => (
                            <Dropdown.Item
                              key={org.id}
                              onClick={() =>
                                handleSelect(index + 1, org.id, org.displayName)
                              }
                            >
                              {org.displayName}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="mb-3 mt-3">
        <button
          className="btn btn-primary resetfilterbtn applyfilterbtn"
          onClick={() => applyFilter()}
           disabled={
            periodType === "Date Range" && (!fromDate || !toDate)
          }
          style={{
            opacity: periodType === "Date Range" && (!fromDate || !toDate) ? 0.5 : 1,
            cursor: periodType === "Date Range" && (!fromDate || !toDate) ? "not-allowed" : "pointer"
          }}
        >
          Apply
        </button>
        <button
          className="btn btn-primary resetfilterbtn ml-2"
          onClick={() => resetFilter()}
        >
          Reset
        </button>
      </div>
    </div>
  );
}