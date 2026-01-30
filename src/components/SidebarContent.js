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

export default function SidebarContent(props) {
  //console.log(props);
  const { t, i18n } = useTranslation();
  const date = new Date();
  const moment = extendMoment(originalMoment);
  const [currentOrg, setCurrentOrg] = useState();
  const [countryOrg, setCountryOrg] = useState(null);
  const [provinceOrg, setProvinceOrg] = useState(null);
  const [districtOrg, setDistrictOrg] = useState(null);
  const [blockOrg, setBlockOrg] = useState(null);
  const [facilityOrg, setFacilityOrg] = useState(null);
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
  const [periodType, setPeriodType] = useState("Yearly");
  const [dateRange, setDateRange] = useState(new Date());
  const [periodName, setPeriodName] = useState();
  const [selectedQuarter, setSelectedQuarter] = useState(
    date.getFullYear() +
      "01;" +
      date.getFullYear() +
      "02;" +
      date.getFullYear() +
      "03"
  );

  const closeSidebar = () => {
    props.closeSidebar();
  };

  const applyFilter = () => {
    
     console.log(currentPeriod, periodName, periodType)

     props.applyFilter(currentPeriod, periodName, periodType);
    }
  

  const resetFilter = () => {
    setProvinceList([]);
    setDistrictList([]);
    setBlocksList([]);
    setFacilityList([]);
    setPeriodName("");
    setPeriodType("Yearly");
    setUpdate(Math.random());
    setCurrentPeriod("2024");
    props.resetFilter()
    // if (props.filterFlag) props.resetFilter();
    // props.applyFilter(JSON.parse(sessionStorage.getItem("userData")).organisationUnits, "2024", periodName, periodType);
  };

  const selectCountryValue = (orgID, orgName) => {
    // console.log(orgID);

    let tempOrg = [{ displayName: orgName, id: orgID }];

    setCountryOrg(tempOrg);
    setProvinceOrg();
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

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
    // console.log(orgID);

    let tempOrg = [{ displayName: orgName, id: orgID }];

    setProvinceOrg(tempOrg);
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setDistrictList(r.data.children);
        setBlocksList([]);
        setFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectDistrictValue = (orgID, orgName) => {
    // console.log(orgID);

    let tempOrg = [{ displayName: orgName, id: orgID }];

    setDistrictOrg(tempOrg);
    setBlockOrg();
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setBlocksList(r.data.children);
        setFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectBlockValue = (orgID, orgName) => {
    // console.log(orgID);

    let tempOrg = [{ displayName: orgName, id: orgID }];

    setBlockOrg(tempOrg);
    setFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setFacilityList(r.data.children);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectFacilityValue = (orgID, orgName) => {
    // console.log(orgID);

    let tempOrg = [{ displayName: orgName, id: orgID }];

    setFacilityOrg(tempOrg);
  };

  const selectPeriodValue = (selectedYear, selectedMonth) => {
    let latestPeriod =
      selectedYear +
      (Number(selectedMonth) + 1 < 10 ? "0" : "") +
      (Number(selectedMonth) + 1);
    // console.log(latestPeriod);
    setCurrentPeriod(latestPeriod);
  };
  const getDatesBetweenDates = (startDate, endDate) => {
    if (startDate == endDate) return startDate.replaceAll("-", "") + ";";
  
    var dateString = "";
    var startDate = startDate.replaceAll("-", "") + ";";
    var endDate = endDate.replaceAll("-", "") + ";";;
    dateString += startDate + endDate

   
    return dateString;
  };
  // console.log()
  const renderPeriodFilter = () => {
    if (periodType == "Monthly") {
      return (
        <div className="mb-3">
          <MonthPickerInput
            style={{ color: "#fff" }}
            year={date.getFullYear()}
            month={date.getMonth()}
            closeOnSelect={false}
            onChange={function (maskedValue, selectedYear, selectedMonth) {
              selectPeriodValue(selectedYear, Number(selectedMonth));
              setPeriodName("");
            }}
          />
        </div>
      );
    } else if (periodType == "Yearly") {
      return (
        <div className="mb-3">
          <Datetime
            value={currentPeriod}
            style={{ color: "#000" }}
            dateFormat="YYYY"
            timeFormat={false}
            onChange={function (selectedYear) {
              setCurrentPeriod(selectedYear.toString().substring(11, 15));
              setPeriodName("");
            }}
          />
          {/* <YearPicker
            onChange={function (selectedYear) {
              setCurrentPeriod(selectedYear.toString());
              setPeriodName("");
            }}
          /> */}
        </div>
      );
    } else if (periodType == "Quarterly") {
      return (
        <div className="mb-3 periodselectcontainer">
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Control
                as="select"
                value={selectedQuarter}
                custom
                style={{ color: "#fff" }}
                onChange={function (value) {
                  // console.log(value.target.options[value.target.selectedIndex].text)
                  setSelectedQuarter(value.target.value);
                  setCurrentPeriod(value.target.value);
                  setPeriodName(
                    value.target.options[value.target.selectedIndex].text
                  );
                }}
              >
                <option
                  value={
                    date.getFullYear() +
                    "Q1"
                  }
                >
                  Quarter 1(Jan-Mar)
                </option>
                <option
                  value={
                    date.getFullYear() +
                    "Q2"
                  }
                >
                  Quarter 2(Apr-Jun)
                </option>
                <option
                  value={
                    date.getFullYear() +
                    "Q3"
                  }
                >
                  Quarter 3(Jul-Sep)
                </option>
                <option
                  value={
                    date.getFullYear() +
                    "Q4"
                  }
                >
                  Quarter 4(Oct-Dec)
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
      );
    } else if (periodType == "Date Range") {
      return (
        <div className="mb-3">
          <DateRangePicker
            className="DateRangePickercss"
            value={dateRange}
            onChange={function (selected) {
              // console.log(selected[0].toISOString().split('T')[0], selected[1].toISOString().split('T')[0])
              setDateRange(selected);
              setPeriodName(
                "" +
                  selected[0].toISOString().split("T")[0] +
                  " to " +
                  selected[1].toISOString().split("T")[0]
              );
              setCurrentPeriod(
                getDatesBetweenDates(
                  selected[0].toISOString().split("T")[0],
                  selected[1].toISOString().split("T")[0]
                )
              );
            }}
            // singleDateRange={true}
          />
        </div>
      );
    }
  };

  const pathname = window.location.pathname;
  // console.log(countryListFilter)

  return (
    <div className="filter-sidebar-content">
      <p className="sidebar-header mb-3">
        {t("Select Filter")}
        <button
          type="button"
          className="close-sidebar"
          onClick={() => closeSidebar()}
        >
          <FontAwesomeIcon className="color-white fs-12px mx-0" icon={faTimes} />
        </button>
      </p>
  
      <div className="sidebardropdown">
      
        {/* </Accordion> */}
      </div>
      {pathname != "/alerts" ? (
        <div>
          <div className="mb-2 mt-4">
            {/* <button
              type="button"
              className="btn sepbtn btn-secondary btn-block"
              style={{ color: "white" }}
            >
              Period
            </button> */}
          </div>
          <div className="periodselectcontainer">
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
                  style={{ color: "#fff" }}
                  onChange={function (value) {
                    setPeriodType(value.target.value);
                  }}
                >
                  <option style={{ color: "#fff" }} value="Date Range">
                    Date Range
                  </option>
                  <option style={{ color: "#fff" }} value="Monthly">
                    Monthly
                  </option>
                  <option style={{ color: "#fff" }} value="Quarterly">
                    Quarterly
                  </option>
                  <option style={{ color: "#fff" }} value="Yearly">
                    Yearly
                  </option>
                </Form.Control>
              </Form.Group>
            </Form> 
          </div>
          {renderPeriodFilter()} 
          {/* { periodType == 'Monthly' ? (
            <div className="mb-3">
              <MonthPickerInput
                year={date.getFullYear()}
                month={date.getMonth()}
                closeOnSelect={false}
                onChange={function (maskedValue, selectedYear, selectedMonth) {
                  selectPeriodValue(selectedYear, Number(selectedMonth));
                }}
              />
            </div>) : (
              <div className="mb-3">
          <Datetime onChange={function (selectedYear) {
                  setCurrentPeriod(selectedYear.toString())
                }}/>
              </div>
            )} */}
        </div>
      ) : (
        ""
      )}

      <div>
        {/* <Accordion>
          <Card className="mb-2 filtercard">
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Select Period
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form>
                  <div className="mb-1">
                    <Form.Check type="checkbox" label="Yearly" />
                  </div>
                  <div className="mb-1">
                    <Form.Check type="checkbox" label="Monthly" />
                  </div>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion> */}
      </div>

      <div className="mb-3 mt-3">
        <button
          className="btn btn-primary resetfilterbtn applyfilterbtn"
          onClick={() => applyFilter()}
        >
          Apply
        </button>
        <button
          className="btn btn-primary resetfilterbtn ml-2 "
          onClick={() => resetFilter()}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
