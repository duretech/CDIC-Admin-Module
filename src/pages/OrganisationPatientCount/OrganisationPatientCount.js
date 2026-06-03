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

const OrganisationPatientCount = ({ props }) => {
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
    API.post(
      'filter/getcustomorglist',{"programuid":JSON.parse(sessionStorage.getItem("userData")).programuid}
    ).then((res) => {
      console.log(res.data, "res.data")
      setLoading(false);
      // setFacilityData(_.sortBy(res.data.organisationUnits, "name"));
      setFacilityData(res.data);
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
     // getSRList();
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
              <Col lg={11}>
                <Table
                  key={facilityKey}
                  // columns={linelistColumns}
                  userData={facilityData}
                  edituser={editUser}
                />
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

export default connect(mapStateToProps, null)(OrganisationPatientCount);
