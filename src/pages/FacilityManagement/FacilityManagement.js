import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { connect } from "react-redux";
import API from "../../services";
import Sidebar from "react-sidebar";
import Moment from "react-moment";
import { useTranslation } from "react-i18next";

import Select from "react-select";

import {
  Container,
  Button,
  Breadcrumb,
  Modal,
  Row,
  Col,
  Form,
  Card,
  Dropdown,
} from "react-bootstrap";

import Loader from "../../components/loaders/loader";
import SidebarContent from "../../components/SidebarContent";
import Table from "./DataTable";

import { appFilter } from "../../config/appConfig";

import * as Yup from "yup";
import { ErrorMessage, Field, useField, Formik, Form as FForm } from "formik";
import TextError from "../../components/ErrorText";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import swal from "sweetalert";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClose } from "@fortawesome/free-solid-svg-icons";
import { event } from "jquery";
import _ from "underscore";

const FacilityManagement = ({ props }) => {
  const { t, i18n } = useTranslation();

  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(appFilter);

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();
  const [appProgramID, setAppProgramID] = useState(null);

  const [facilityData, setFacilityData] = useState([]);
  const [facilityKey, setFacilityKey] = useState(0);

  const [orgStructure, setOrgStructure] = useState({});
  const formRefOrg = useRef(null);
  const [facilityAddVariable, setFacilityAddVariable] = useState(false);
  const [facilityEditVariable, setFacilityEditVariable] = useState(false);
  // Code for org add
  const [orgAddVariable, setOrgAddVariable] = useState(false);
  const [TempFacilityOrg, setTempFacilityOrg] = useState();
  const [selectedSR, setSelectedSR] = useState(null);
  const [sRList, setSRList] = useState([]);
  // Province district
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [facProvinceList, setfacProvinceList] = useState([]);

  // district district
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [facDistrictList, setfacDistrictList] = useState([]);

  // subdistrict
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
  const [facSubDistrictList, setfacSubdistrictList] = useState([]);

  // const [ pro]
  const [districtListFacility, setDistrictListFacility] = useState([]);
  const [cityList, setCityList] = useState([]);

  //Org Parent field
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(false);

  // organization for new organization
  const [currentOrg, setCurrentOrg] = useState(
    sessionStorage.getItem("userData")
      ? JSON.parse(sessionStorage.getItem("userData")).organisationUnits
      : [{ id: "scWe0JcnFNx", displayName: "South Africa" }]
  );
  const [countryOrg, setCountryOrg] = useState([
    { displayName: t("Select Level 1") + " *", id: null },
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

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [blocksList, setBlocksList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [subfacilityList, setSubFacilityList] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // Facility Dropdown Handle
  const [selectedcurrentOrg, setselectedcurrentOrg] = useState(null);

  const onChange = (currentNode, selectedNodes) => {
    console.log("onChange::", currentNode, selectedNodes, formRefOrg);
    formRefOrg.current.values.orgUnit = selectedNodes;
    // setSelectedOrg(selectedNodes)
  };

  // For Facility Creation
  const center = {
    lat: 51.505,
    lng: -0.09,
  };
  const [position, setPosition] = useState(center);
  function DraggableMarker() {
    const [draggable, setDraggable] = useState(false);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
            // console.log(marker.getLatLng())
          }
        },
      }),
      []
    );
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {true
              ? "Lat " +
              position.lat.toFixed(4) +
              " : Long " +
              position.lng.toFixed(4)
              : "Click here to make marker draggable"}
          </span>
        </Popup>
      </Marker>
    );
  }
  const [initialValuesObject, setInitialValuesObject] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
    isFacility: "No",
  });
  const facilityObjectSchema = Yup.object().shape({
    code: Yup.string().max(50, t("Maximum character limit is 50.")),
    name: Yup.string().required(t("Organization name is required.")).max(50, t("Maximum character limit is 50.")),
    state: Yup.string(),
    address: Yup.string(),
    email: Yup.string().email(t("Invalid email")),
    phoneNumber: Yup.string().matches(
      /^[0-9]{10}$/,
      t("Please enter a 10 digit phone number.")
    ),
    country: Yup.string().required(t("Level 1 is required.")),
    // sr: Yup.string().required(t("Province name is required.")),
    // province: Yup.string().required(t("District name is required.")),
  });
  const orgSchema = Yup.object().shape({
    name: Yup.string()
      .required("Organization name is required.")
      .max(50, "Maximum character limit is 50."),
    parent: Yup.string(),
  });

  const [filterFlag, setFilterFlag] = useState(false);

  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);
  const [periodName, setPeriodName] = useState();

  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [orgID, setOrgID] = useState(
    JSON.parse(sessionStorage.getItem("userData")).organisationUnits.length > 1
      ? "zRzmF39GKjp"
      : JSON.parse(sessionStorage.getItem("userData")).organisationUnits[0].id
  );
  // const [orgID, setOrgID] = useState();
  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);
  //console.log(latestPeriod);
  const [currentPeriod, setCurrentPeriod] = useState(
    (date.getFullYear() - 1).toString()
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
    setPeriodName(periodname);
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

  // filter list
  const selectCountryValue = (orgID, orgName) => {
    console.log(orgID);
    setselectedcurrentOrg(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setCountryOrg(tempOrg);
    setProvinceOrg();
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();
    setSubFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setProvinceList(r.data.children);
        setDistrictList([]);
        setBlocksList([]);
        setFacilityList([]);
        setSubFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectProvinceValue = (orgID, orgName) => {
    console.log(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setProvinceOrg(tempOrg);
    setDistrictOrg();
    setBlockOrg();
    setFacilityOrg();
    setSubFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setDistrictList(r.data.children);
        setBlocksList([]);
        setFacilityList([]);
        setSubFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectDistrictValue = (orgID, orgName) => {
    console.log(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setDistrictOrg(tempOrg);
    setBlockOrg();
    setFacilityOrg();
    setSubFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setBlocksList(r.data.children);
        setFacilityList([]);
        setSubFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectBlockValue = (orgID, orgName) => {
    // console.log(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setBlockOrg(tempOrg);
    setFacilityOrg();
    setSubFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        // console.log(r.data);

        setFacilityList(r.data.children);
        setSubFacilityList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectFacilityValue = (orgID, orgName) => {
    // console.log(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setFacilityOrg(tempOrg);
    setSubFacilityOrg();

    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;
    API.get(url)
      .then((r) => {
        console.log(r.data);

        setSubFacilityList(r.data.children);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectsubFacilityValue = (orgID, orgName) => {
    console.log(orgID);
    setCurrentOrg(orgID);
    let tempOrg = [{ displayName: orgName, id: orgID }];

    setSubFacilityOrg(tempOrg);
  };

  // filter for facility data
  const getFacilityList = () => {
    setLoading(true);
    // API.get(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
    // API.get(`users?fields=:all&ou=` + orgID + `&includeChildren=true&paging=false`).then((res) => {
    API.get(
      "organisationUnits?paging=false&filter=path:like:/" + orgID + "&skipPaging=true&fields=description,comment,address,id,level,name,path,email,geometry,lastUpdated,shortName,openingDate,parent,phoneNumber"
      // + JSON.parse(sessionStorage.getItem("userData"))..organisationUnits[0].id
    ).then((res) => {
      console.log(res.data, "res.data")
      setLoading(false);
      // setFacilityData(_.sortBy(res.data.organisationUnits, "name"));
      const units = (res.data.organisationUnits || []).slice().sort(
        (a, b) => Date.parse(b.lastUpdated || 0) - Date.parse(a.lastUpdated || 0)
      );
      setFacilityData(units);
      setFacilityKey(Math.random());
    });
  };
  // let TempFacilityOrg = ""

  const getSRList = () => {
    API.get(
      "organisationUnits/" +
      orgID +
      "?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]"
    ).then((res) => {
      console.log(res.data);
      setSRList(res.data.children);
      setfacProvinceList();
      setfacDistrictList();
      setfacSubdistrictList();
    });
  };

  const getProvinceList = (e) => {
    console.log(e);
    API.get(
      "organisationUnits/" +
      e +
      "?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]"
    ).then((res) => {
      // console.log(sRorg, res.data);
      setfacProvinceList(res.data.children);
      setSelectedProvince();
      setSelectedDistrict();
      setSelectedSubdistrict();
      // setfacDistrictList();
      // setfacSubdistrictList();
    });
  };

  const getDistrictList = (e) => {
    console.log(e);
    API.get(
      "organisationUnits/" +
      e +
      "?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]"
    ).then((res) => {
      console.log(res.data.children);
      setfacDistrictList(res.data.children);
      setSelectedDistrict();
      setSelectedSubdistrict();
      // setSelectedProvince();
    });
  };

  const getSubDistrictList = (e) => {
    console.log(e);
    API.get(
      "organisationUnits/" +
      e +
      "?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]"
    ).then((res) => {
      console.log(res.data.children);
      setfacSubdistrictList(res.data.children);
      setSelectedSubdistrict();
    });
  };

  // const addFacility = (instanct) => {
  //   API.post('/organisationUnits', instanct).then(response => {
  //     // console.log(response)

  //     let elem = document.createElement("div");
  //     if (response.data.status == "OK") {
  //       elem.innerHTML = "Facility created sucessfully."
  //       swal({
  //         title: "Success",
  //         content: elem,
  //         icon: "success",
  //         button: "Close",
  //       }).then(function () {
  //         getFacilityList()
  //         setFacilityAddVariable(false)
  //       });
  //     } else {
  //       let elem = document.createElement("div");
  //       elem.innerHTML = 'Someting went wrong.'
  //       swal({
  //         title: "Error",
  //         content: elem,
  //         icon: "error",
  //         button: "Close",
  //       })
  //     }
  //   })
  // }
  // getSRList();
  // getProvinceList();
  const editFacility = (values) => {
    // console.log(values)
  };
  useEffect(() => {
    // else{
    //   // for generic
    //   setAppProgramID('TMF8Tah3HFU')
    // }
    setDefaultOrg(
      JSON.parse(sessionStorage.getItem("userData")).organisationUnits
    );
    setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
    setBreadcrumbOrg(JSON.parse(sessionStorage.getItem("userData")).organisationUnits)
    if (orgID) {
      getFacilityList();
      // getOrgStructure()
      // filter logic
      getSRList();
      // getProvinceList();
    }
  }, [orgID, currentPeriod, appProgramID, categoryFilter]);
  const didMount = useRef(false);

  const editUser = (userData) => {
    console.log(userData)
    setInitialValuesObject({
      code: "",
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
      isFacility: "No",
    })
    userData.isFacility = (userData.comment == "Facility" ? "Yes" : "No");
    setInitialValuesObject(userData);
    setFacilityEditVariable(true);
    setOrgAddVariable(false);
    setFacilityAddVariable(false);
    // setUserEditObject(userData)
    // setUserEditVariable(true)
    // setUserAddVariable(false)
  };

  const getDatePeriod = () => {
    // console.log(periodName)
    if (!periodName || periodName == "") {
      if (currentPeriod.includes("-")) {
        return <Moment date={new Date(currentPeriod)} format="MMM-YYYY" />;
      } else if (currentPeriod.includes(";")) {
        return <>{currentPeriod.replace(";", "-")}</>;
      } else {
        return <Moment date={new Date(currentPeriod)} format="YYYY" />;
      }
    } else {
      return <>{periodName}</>;
    }
  };

  // getSRList();
  // getProvinceList();

  // New cde for organization
  const [levels, setLevels] = useState([
    // { id: "root", displayName: "Select Organisation", options: [], selected: null }
  ]);

  const handleSelect = (levelIndex, orgID, orgName) => {

    if (levelIndex === 0) {
      // If Country is selected, reset everything and fetch the next level
      setCountryOrg([{ displayName: orgName, id: orgID }]);
      setLevels([]); // Reset lower levels
    }

    // Remove levels after the current selection
    const newLevels = [...levels];
    newLevels.splice(levelIndex);
    // API call to fetch next level options
    let url = `organisationUnits/${orgID}?paging=false&fields=children%5Bid%2CdisplayName~rename(displayName)%2Ccode%2Cchildren%3A%3AisNotEmpty%2Cpath%2Cparent%5D&userDataViewFallback=true`;

    API.get(url)
      .then((r) => {
        const children = r.data.children;
        children.sort((a, b) =>
          a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" })
        );
        if (children.length > 0) {
          // Add next level dynamically
          newLevels.push({
            id: `level_${levelIndex + 1}`,
            displayName: `Select Level ${levelIndex + 2}`,
            options: children,
            children: true,
            selected: orgName == "" ? { displayName: "Select", id: orgID } : { displayName: orgName, id: orgID },
          });
        }
        else {
          newLevels.push({
            id: `level_${levelIndex + 1}`,
            displayName: `Select Level ${levelIndex + 2}`,
            options: [],
            children: false,
            selected: orgName == "" ? { displayName: "Select", id: orgID } : { displayName: orgName, id: orgID },
          });
        }
        setCurrentOrg(orgID)
        setLevels(newLevels);
      })
      .catch((error) => console.log(error));
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
        <Loader isLoading={loading} />
        <div className="headerfixedcontainer">
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
              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    {/* <img
                      src={require("../../assets/images/dashboard-icons/dashboard-icons/data sharing.png")}
                      alt=""
                      className="w-5 mr-1"
                      style={{ maxWidth: '20px' }}
                    />  */}
                    {t("Organization Management")}
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

        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="table-linelist mb-3 ml-3 mr-3">
            <Row>
            </Row>
            <Row>
              <Col lg={8}>
                <Table
                  key={facilityKey}
                  // columns={linelistColumns}
                  userData={facilityData}
                  edituser={editUser}
                />
              </Col>
              <Col lg={4}>
                <div className="row mb-2">
                  <div className="col-12 facility-buttons">
                    <button
                      onClick={(e) => {
                        setFacilityAddVariable(true);
                        setFacilityEditVariable(false);
                        setOrgAddVariable(false);
                        setSelectedSR(null);
                        setSelectedProvince(null);
                        setLevels([])
                      }}
                      type="button"
                      title="Add Organization"
                      className="btn btn-sm btn-primary addbtn mt-2 mr-2"
                    >
                      {" "}
                      {t("Create New Organization")}{" "}
                    </button>
                    {/* <button
                      onClick={(e) => {

                        setCountryOrg([
                          { displayName: t("Select Country") + " *", id: null }
                        ])
                        setProvinceOrg([
                          { displayName: "Select Province", id: null }
                        ])
                        setDistrictOrg([
                          { displayName: "Select District", id: null },
                        ])
                        setProvinceList([])
                        setDistrictList([])
                        setFacilityAddVariable(false);
                        setFacilityEditVariable(false);
                        setOrgAddVariable(true);
                        setError(false);
                      }}
                      type="button"
                      title="Add Organization "
                      className="btn btn-sm addbtn mt-2 btn-secondary"
                    >
                      {" "}
                      {t("Create New Organization")}{" "}
                    </button> */}
                  </div>
                </div>
                {facilityAddVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={{
                      code: "",
                      name: "",
                      address: "",
                      email: "",
                      phoneNumber: "",
                      sr: "",
                      province: "",
                      district: "",
                      subdistrict: "",
                      isFacility: "No",
                      country: ""
                    }}
                    validationSchema={facilityObjectSchema}
                    onSubmit={(values) => {
                      console.log(values, "values")
                      setLoading(true)
                      // Check if the facility name already exists in facilityData
                      const facilityExists = facilityData.some(
                        (facility) => facility.name.toLowerCase() === values.name.toLowerCase()
                      );

                      if (facilityExists) {
                        setLoading(false)
                        // Show an error message if the facility name already exists
                        let elem = document.createElement("div");
                        elem.innerHTML = "The Organization name already exists. Please choose a different name.";
                        swal({
                          title: "Error",
                          content: elem,
                          icon: "error",
                          button: "Close",
                        });
                        setLoading(false)
                        return; // Stop further execution
                      }

                      // Proceed with the API call if the facility name is unique
                      let instanct = {
                        ...values,
                        shortName: values.name,
                        openingDate: new Date().toISOString(),
                        geometry: {
                          type: "Point",
                          coordinates: [position.lng, position.lat],
                        },
                        comment: values.isFacility == "Yes" ? "Facility" : "",
                        parent: {
                          id: currentOrg,
                        },
                      };

                      API.post("/organisationUnits", instanct).then((response) => {
                        let elem = document.createElement("div");
                        if (response.data.status == "OK") {
                          API.post(
                            "organisationUnits/" +
                            response.data.response.uid +
                            "/programs",
                            {
                              additions: [{
                                id:
                                  // "eAHvg6zuxvK"
                                  JSON.parse(sessionStorage.getItem("userData")).programuid
                              }],
                              deletions: [],
                            }
                          )
                            .then((result) => {
                              console.log(result);
                            })
                            .catch((err) => { });
                          setLoading(false)
                          elem.innerHTML = "Organization created successfully.";
                          swal({
                            title: "Success",
                            content: elem,
                            icon: "success",
                            button: "Close",
                          }).then(function () {
                            getFacilityList();
                            setFacilityAddVariable(false);
                          });
                        } else {
                          setLoading(false)
                          elem.innerHTML = "Something went wrong.";
                          swal({
                            title: "Error",
                            content: elem,
                            icon: "error",
                            button: "Close",
                          });
                        }
                      });
                    }}
                  // onSubmit={(values) => {
                  //   console.log(formRef.current.values);

                  //   let instanct = {
                  //     ...values,
                  //     shortName: values.name,
                  //     openingDate: new Date().toISOString(),
                  //     geometry: {
                  //       type: "Point",
                  //       coordinates: [position.lng, position.lat],
                  //     },
                  //     comment: "Facility",
                  //     parent: {
                  //       id: values.province,
                  //     },
                  //   };

                  //   API.post("/organisationUnits", instanct).then(
                  //     (response) => {
                  //       // console.log(response)

                  //       let elem = document.createElement("div");
                  //       if (response.data.status == "OK") {
                  //         API.post(
                  //           "organisationUnits/" +
                  //           response.data.response.uid +
                  //           "/programs",
                  //           {
                  //             additions: [{ id: "eAHvg6zuxvK" }],
                  //             deletions: [],
                  //           }
                  //         )
                  //           .then((result) => {
                  //             console.log(result);
                  //           })
                  //           .catch((err) => { });
                  //         elem.innerHTML = "Facility  created sucessfully.";
                  //         swal({
                  //           title: "Success",
                  //           content: elem,
                  //           icon: "success",
                  //           button: "Close",
                  //         }).then(function () {
                  //           getFacilityList();
                  //           setFacilityAddVariable(false);
                  //         });
                  //       } else {
                  //         let elem = document.createElement("div");
                  //         elem.innerHTML = "Someting went wrong.";
                  //         swal({
                  //           title: "Error",
                  //           content: elem,
                  //           icon: "error",
                  //           button: "Close",
                  //         });
                  //       }
                  //     }
                  //   );
                  //   // console.log(instanct, values)
                  //   // addFacility(instanct)
                  // }}
                  >
                    {({ values, errors, touched }) => (
                      <FForm className="userAddForm mr-4">
                        <Card>
                          <Card.Header className="regcardheader d-flex justify-content-between">
                            {t("Add Organization Unit")}
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setFacilityAddVariable(false);
                              }}
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Row>
                              <Col lg="12">
                                <Row>
                                  {/* <Col lg="6">
                                    <Form.Group controlId="formBasicCode">
                                      <Field name="code">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Facility Code") }
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Facility Code")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="code"
                                      />
                                    </Form.Group>
                                  </Col> */}
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="name">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Organization Name") + " *"}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Organization Name")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="name"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicEmail">
                                      <Field name="email">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Email")}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Email")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="email"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicNumber">
                                      <Field name="phoneNumber">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Phone Number")}
                                              </Form.Label>
                                              {console.log("field::>>", field)}
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Phone Number")}
                                                    type="number"
                                                    className="form-control"
                                                    {...field}
                                                    onKeyDown={(e) => {
                                                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                    onInput={(e) => {
                                                      // just in case: strip anything non-digit if pasted
                                                      e.target.value = e.target.value.replace(/\D/g, "");
                                                      field.onChange(e);
                                                    }}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="phoneNumber"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicAddress">
                                      <Field name="address">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Address")}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <textarea
                                                    rows="4"
                                                    placeholder={t("Address")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="address"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group >
                                      <Form.Label className="label">Select Level 1 *</Form.Label>
                                      <Field
                                        name="country"
                                      >
                                        {({ field, form, meta, helpers }) => {
                                          const selectedCountryObj = countryListFilter.find(
                                            (org) => org.id === field.value
                                          );

                                          const sortedCountries = [...countryListFilter].sort((a, b) =>
                                            a.label.localeCompare(b.label)
                                          );
                                          console.log(selectedCountryObj, "selectedCountryObj")
                                          return (
                                            <>
                                              {/* <Select
                                                className="multiselect-dropdown"
                                                options={countryListFilter.map((org) => ({
                                                  value: org.id,
                                                  label: org.label
                                                }))}
                                                value={
                                                  countryListFilter.find((org) => org.id === values.country) || null
                                                }
                                                onChange={(option) => {
                                                  form.setFieldValue("country", option.value);
                                                  handleSelect(0, option.value, option.label)
                                                }}
                                                placeholder="Select Country"
                                                isSearchable
                                              /> */}
                                              <Dropdown>
                                                <Dropdown.Toggle
                                                  style={{
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    background: "transparent",
                                                    color: "#5C6875",
                                                    border: "#e4e7ea 1px solid",
                                                  }}
                                                  variant="success"
                                                  id="dropdown-basic"
                                                >
                                                  {selectedCountryObj ? selectedCountryObj.value : "Select Level 1"}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu
                                                  style={{ width: "100%" }}
                                                >
                                                  {countryListFilter?.map((org) => (
                                                    <Dropdown.Item
                                                      style={{ width: "100%" }}
                                                      key={org.id}
                                                      onClick={() => {
                                                        form.setFieldValue("country", org.id);
                                                        handleSelect(0, org.id, org.label)
                                                      }}
                                                    >
                                                      {org.label}
                                                    </Dropdown.Item>
                                                  ))}
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="country"
                                      />
                                    </Form.Group>
                                  </Col>
                                  {levels.map((level, index) => (
                                    level.children == true ?
                                      <Col lg="12">
                                        <Form.Group controlId="formBasicState">
                                          <Form.Label className="label">{level.displayName}</Form.Label>
                                          {/* <Select
                                            className="multiselect-dropdown"
                                            options={level.options.map((org) => ({
                                              value: org.id,
                                              label: org.displayName
                                            }))}
                                            value={
                                              level.selected
                                                ? { value: level.selected.id, label: level.selected.displayName }
                                                : null
                                            }
                                            onChange={(option) =>
                                              handleSelect(index + 1, option.value, option.label)
                                            }
                                            placeholder={`Select ${level.displayName}`}
                                            isSearchable
                                          /> */}
                                          <Dropdown key={level.id} className="dropdownset m-0">
                                            <Dropdown.Toggle
                                              style={{
                                                width: "100%",
                                                marginTop: "10px",
                                                background: "transparent",
                                                color: "#5C6875",
                                                border: "#e4e7ea 1px solid",
                                              }}
                                              variant="success"
                                              id="dropdown-basic"
                                            >
                                              {console.log("levelss::>>", level, level.selected, index, level.id, levels)}
                                              {levels[index + 1] ? levels[index + 1].selected.displayName : level.displayName}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu
                                              style={{ width: "100%" }}
                                            >
                                              {level.options.map((org) => (
                                                <Dropdown.Item style={{
                                                  width: "100%",
                                                }} key={org.id} onClick={() => handleSelect(index + 1, org.id, org.displayName)}>
                                                  {org.displayName}
                                                </Dropdown.Item>
                                              ))}
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </Form.Group>
                                      </Col>
                                      :
                                      <></>
                                  ))}
                                  <Col lg="12">
                                    <Form.Group controlId="formFacilityDropdown" className=" mt-3">
                                      <Field name="isFacility">
                                        {({ field, form }) => (
                                          <>
                                            {console.log("field::>>", field)}
                                            <Form.Label className="label">Mark as facility?</Form.Label>
                                            <Form.Select
                                              className="form-input form-control force-white-bg"
                                              {...field}
                                              value={field.value}
                                              onChange={(e) => {
                                                console.log("field::>>e.target.value::>>", e.target.value)
                                                form.setFieldValue("isFacility", e.target.value);
                                              }}
                                            >
                                              <option value="Yes">Yes</option>
                                              <option value="No">No</option>
                                            </Form.Select>
                                          </>
                                        )}
                                      </Field>
                                    </Form.Group>

                                  </Col>
                                  {/* <Col lg="6">
                                    <Form.Group controlId="formBasicState">
                                      <Field
                                        name="sr"
                                        onChange={(e) => {
                                          console.log(e);
                                        }}
                                      >
                                        {({ field, meta, helpers }) => {
                                          return (
                                            <>
                                              <Dropdown
                                                onSelect={(eventKey, e) => {
                                                  setSelectedSR(
                                                    e.target.getAttribute(
                                                      "name"
                                                    )
                                                  );
                                                  getProvinceList(
                                                    e.target.getAttribute(
                                                      "value"
                                                    )
                                                  );
                                                  formRef.current.values.sr =
                                                    e.target.getAttribute(
                                                      "value"
                                                    );
                                                }}
                                              >
                                                <label>
                                                  {t("Select Level 2") + " *"}
                                                </label>
                                                <Dropdown.Toggle
                                                  variant="success"
                                                  id="dropdown-basic"
                                                  style={{
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    background: "transparent",
                                                    color: "#5C6875",
                                                    border: "#e4e7ea 1px solid",
                                                  }}
                                                >
                                                  {selectedSR ||
                                                    t("Select Level 2")}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu
                                                  style={{ width: "100%" }}
                                                >
                                                  {sRList &&
                                                    sRList.map((state, id) => {
                                                      return (
                                                        <Dropdown.Item
                                                          key={id}
                                                          required={true}
                                                          value={state.id}
                                                          name={state.name}
                                                          style={{
                                                            width: "100%",
                                                          }}
                                                        >
                                                          {state.name}
                                                        </Dropdown.Item>
                                                      );
                                                    })}
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="sr"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="province">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Dropdown
                                                onSelect={(eventKey, e) => {
                                                  setSelectedProvince(
                                                    e.target.getAttribute(
                                                      "name"
                                                    )
                                                  );
                                                  getDistrictList(
                                                    e.target.getAttribute(
                                                      "value"
                                                    )
                                                  );
                                                  formRef.current.values.province =
                                                    e.target.getAttribute(
                                                      "value"
                                                    );
                                                }}
                                              // style={{ color: "black" }}
                                              >
                                                <label> {t("Select Level 3") + " *"}</label>

                                                <Dropdown.Toggle
                                                  variant="success"
                                                  id="dropdown-basic"
                                                  style={{
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    background: "transparent",
                                                    color: "#5C6875",
                                                    border: "#e4e7ea 1px solid",
                                                  }}
                                                >
                                                  {selectedProvince ||
                                                    t("Select Level 3")}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu
                                                  style={{
                                                    width: "100%",
                                                    marginTop: "5px",
                                                  }}
                                                >
                                                  {facProvinceList &&
                                                    facProvinceList.map(
                                                      (state, id) => {
                                                        return (
                                                          <Dropdown.Item
                                                            key={id}
                                                            required={true}
                                                            value={state.id}
                                                            name={state.name}
                                                            style={{
                                                              width: "100%",
                                                            }}
                                                          >
                                                            {state.name}
                                                          </Dropdown.Item>
                                                        );
                                                      }
                                                    )}
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="province"
                                      />
                                    </Form.Group>
                                  </Col> */}
                                </Row>
                              </Col>
                              {/* <Col lg="4">
                                <MapContainer
                                  style={{ height: "100%" }}
                                  center={[51.505, -0.09]}
                                  zoom={13}
                                  scrollWheelZoom={true}
                                >
                                  <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  />
                                  <DraggableMarker />
                                </MapContainer>
                              </Col> */}
                            </Row>

                            <Button className="btn addbtn mt-2" type="submit">
                              {t("Add")}
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}

                {facilityEditVariable ? (
                  <Formik
                    enableReinitialize
                    innerRef={formRef}
                    initialValues={initialValuesObject}
                    // validationSchema={facilityObjectSchema}
                    onSubmit={(values) => {
                      // Check if the facility name already exists in facilityData (excluding the current facility)
                      const facilityExists = facilityData.some(
                        (facility) =>
                          facility.id !== values.id &&
                          facility.name.toLowerCase() === values.name.toLowerCase()
                      );

                      if (facilityExists) {
                        // Show an error message if the facility name already exists
                        let elem = document.createElement("div");
                        elem.innerHTML = "The Organization name already exists. Please choose a different name.";
                        swal({
                          title: "Error",
                          content: elem,
                          icon: "error",
                          button: "Close",
                        });
                        return; // Stop further execution
                      }
                      values.comment = (values.isFacility == "Yes" ? "Facility" : "")
                      // Proceed with the API call if the facility name is unique
                      API.put(
                        "organisationUnits/" + values.id + "?mergeMode=REPLACE",
                        values
                      ).then((res) => {
                        let elem = document.createElement("div");
                        if (res.data.status == "OK") {
                          elem.innerHTML = "Organization updated successfully.";
                          swal({
                            title: "Success",
                            content: elem,
                            icon: "success",
                            button: "Close",
                          }).then(function () {
                            getFacilityList();
                            setFacilityEditVariable(false);
                          });
                        }
                      });
                    }}

                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm mr-4">
                        <Card>
                          <Card.Header className="regcardheader d-flex justify-content-between card-header">
                            {t("Edit Organization")}
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setFacilityEditVariable(false);
                              }}
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody pt-0">
                            <Row>
                              <Col lg="12">
                                <Row>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="name">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Name") + " *"}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Name")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="name"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicEmail">
                                      <Field name="email">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Email")}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">

                                                  <input
                                                    placeholder={t("Email")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="email"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicNumber">
                                      <Field name="phoneNumber">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Phone Number")}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder={t("Phone Number")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="phoneNumber"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formBasicAddress">
                                      <Field name="address">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Address")}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <textarea
                                                    rows="4"
                                                    placeholder={t("Address")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="address"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="12">
                                    <Form.Group controlId="formFacilityDropdown" className=" mt-3">
                                      <Field name="isFacility">
                                        {({ field, form }) => (
                                          <>
                                            {console.log("field::>>", field)}
                                            <Form.Label className="label">Mark as facility?</Form.Label>
                                            <Form.Select
                                              className="form-input form-control force-white-bg"
                                              {...field}
                                              value={field.value}
                                              onChange={(e) => {
                                                console.log("field::>>e.target.value::>>", e.target.value)
                                                form.setFieldValue("isFacility", e.target.value);
                                              }}
                                            >
                                              <option value="Yes">Yes</option>
                                              <option value="No">No</option>
                                            </Form.Select>
                                          </>
                                        )}
                                      </Field>
                                    </Form.Group>

                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Button className="btn addbtn mt-2" type="submit">
                              {t("Update")}
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}

                {orgAddVariable ? (
                  <Formik
                    innerRef={formRefOrg}
                    initialValues={{
                      name: "",
                    }}
                    validationSchema={orgSchema}
                    onSubmit={(values) => {
                      setLoading(true)
                      let instanct = {
                        ...values,
                        shortName: values.name,
                        openingDate: new Date().toISOString(),
                        parent: {
                          id: currentOrg,
                        },
                      };
                      if (countryOrg[0].displayName !== t("Select Country") + " *") {
                        setError(false);
                      } else {
                        setError(true);
                        setLoading(false);
                        return;
                      }
                      // console.log(instanct)

                      // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                      API.post("/organisationUnits", instanct).then(
                        (response) => {
                          console.log(response);
                          setLoading(true)
                          let elem = document.createElement("div");
                          if (response.data.status == "OK") {
                            API.post(
                              "organisationUnits/" +
                              response.data.response.uid +
                              "/programs",
                              {
                                additions: [{ id: "eAHvg6zuxvK" }],
                                deletions: [],
                              }
                            )
                              .then((result) => {
                                console.log(result);
                              })
                              .catch((err) => { });
                            elem.innerHTML =
                              "Organization  created sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getFacilityList();
                              setOrgAddVariable(false);
                              getSRList();
                            });
                          } else {
                            let elem = document.createElement("div");
                            elem.innerHTML = "Someting went wrong.";
                            swal({
                              title: "Error",
                              content: elem,
                              icon: "error",
                              button: "Close",
                            });
                          }
                        }
                      ).catch(err => {
                        setLoading(false)
                        console.log(err)
                      });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="orgAddForm mr-4 mt-3">
                        <Card>
                          <Card.Header className="regcardheader d-flex justify-content-between card-header">
                            {t("Add Organization")}
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setOrgAddVariable(false);
                              }}
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody pt-0">
                            <Row className="organisationDiv">
                              <Col lg="8">
                                <Row>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="name">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                {t("Organization Name") + " *"}
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    required={true}
                                                    placeholder={t("Organization Name")}
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="name"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Label className="label">
                                      {t("Organization Parent") + " *"}
                                    </Form.Label>
                                    {/* <DropdownTreeSelect texts={{ placeholder: 'Select Organization ' }} className="customSelect" data={orgStructure} mode="radioSelect" onChange={onChange} /> */}
                                    <div className="sidebardropdown">
                                      <Dropdown onSelect={() => { setError(false) }} required={true} className="dropdownset m-0">
                                        <Dropdown.Toggle required={true} className="dropdownset">
                                          {/* {selectedValue ? countryListFilter.find((org) => org.id === selectedValue)?.label : countryOrg[0].displayName} */}
                                          {countryOrg[0]?.displayName}
                                        </Dropdown.Toggle>
                                        {error && <div style={{ fontSize: "15px" }} className="text-danger mt-2">{t("Organization Parent is required.")}</div>}

                                        <Dropdown.Menu>
                                          {countryListFilter?.map(
                                            (org, index) => {
                                              return (
                                                <Dropdown.Item
                                                  key={index + "_country"}
                                                  required={true}
                                                  onClick={() =>
                                                    selectCountryValue(
                                                      org.id,
                                                      org.label
                                                    )
                                                  }
                                                  value={org.id}
                                                >
                                                  {org.label}
                                                </Dropdown.Item>
                                              );
                                            }
                                          )}
                                        </Dropdown.Menu>
                                      </Dropdown>
                                      {console.log("error::>>", error)}

                                      {provinceList?.length > 0 ? (
                                        <Dropdown required={true} className="dropdownset m-0">
                                          <Dropdown.Toggle className="dropdownset">
                                            <label>
                                              {provinceOrg?.length > 0
                                                ? provinceOrg[0].displayName
                                                : t("Select Province")}
                                            </label>
                                          </Dropdown.Toggle>

                                          <Dropdown.Menu>
                                            {provinceList.map((org, index) => {
                                              // console.log(org)
                                              return (
                                                <Dropdown.Item
                                                  key={index + "_province"}

                                                  onClick={() =>
                                                    selectProvinceValue(
                                                      org.id,
                                                      org.displayName
                                                    )
                                                  }
                                                  value={org.id}
                                                >
                                                  {org.displayName}
                                                </Dropdown.Item>
                                              );
                                            })}
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      ) : (
                                        ""
                                      )}
                                      {districtList?.length > 0 ? (
                                        <Dropdown required={true} className="dropdownset m-0">
                                          <Dropdown.Toggle
                                            id="dropdown-basic"
                                            className="dropdownset"
                                          >
                                            {districtOrg?.length > 0
                                              ? districtOrg[0].displayName
                                              : t("Select District")}
                                          </Dropdown.Toggle>

                                          <Dropdown.Menu>
                                            {districtList?.map((org, index) => {
                                              // console.log(org)
                                              return (
                                                <Dropdown.Item
                                                  key={index + "_district"}
                                                  required={true}
                                                  onClick={() =>
                                                    selectDistrictValue(
                                                      org.id,
                                                      org.displayName
                                                    )
                                                  }
                                                  value={org.id}
                                                >
                                                  {org.displayName}
                                                </Dropdown.Item>
                                              );
                                            })}
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      ) : (
                                        ""
                                      )}
                                      {/* </Accordion> */}
                                    </div>
                                    {/* <DropdownTreeSelect texts={{ placeholder: 'Select Organisation' }} className="customSelect" data={orgStructure} mode="radioSelect" onChange={onChange} /> */}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Button className="btn addbtn mt-2" type="submit">
                              {t("Add")}
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}
              </Col>
            </Row>

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
        <footer className="footer">
          <p>Powered By</p>
          <img
            src={require("../../assets/images/durelogowhite.png")}
            alt="gallery"
            className="ml-2"
          />
        </footer>
      </div >
    </>
  );
};
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(FacilityManagement);
