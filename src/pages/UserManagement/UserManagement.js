import React, { useState, useEffect, useRef } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import API from "../../services";
import Sidebar from "react-sidebar";
import Moment from "react-moment";

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
import { useTranslation } from "react-i18next";
import Loader from "../../components/loaders/loader";
import SidebarContent from "../../components/SidebarContent";
import Table from "./DataTable";

import { app_locale, appFilter } from "../../config/appConfig";

import * as Yup from "yup";
import { ErrorMessage, Field, useField, Formik, Form as FForm } from "formik";
import TextError from "../../components/ErrorText";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { setLoader } from '../../redux/actions/userAction';
import _ from 'lodash';

const UserManagement = ({ props }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(appFilter);
  const { t, i18n } = useTranslation();

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();
  const [appProgramID, setAppProgramID] = useState(null);

  const [userData, setUserData] = useState([]);
  const [userTableKey, setUserTableKey] = useState(0);
  const [userAddVariable, setUserAddVariable] = useState(false);
  const [userEditVariable, setUserEditVariable] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [orgStructure, setOrgStructure] = useState({});
  const [userEditObject, setUserEditObject] = useState({});
  const [userCheck, setUserCheck] = useState();

  const handleCloseModal = () => setShowModal(false);
  const [currentOrg, setCurrentOrg] = useState(
    sessionStorage.getItem("userData")
      ? JSON.parse(sessionStorage.getItem("userData")).organisationUnits
      : [{ id: "scWe0JcnFNx", displayName: "South Africa" }]
  );
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

  const [facTree, setFacTree] = useState(null);
  const [orgTree, setOrgTree] = useState(null);
  const userStoreState = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const onChange = (currentNode, selectedNodes) => {

    formRef.current.values.orgUnit = selectedNodes;
    // setSelectedOrg(selectedNodes)
  };

  //Organisation Levels
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

  // For User Creation
  const userObjectSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required")
      .matches(
        /^[A-Za-z]+([ '-][A-Za-z]+)*$/,
        "Cannot contain number or special symbols"
      ),
    lastname: Yup.string().required("Last name is required")
      .matches(
        /^[A-Za-z]+([ '-][A-Za-z]+)*$/,
        "Cannot contain number or special symbols"
      ),
    username: Yup.string().required("Username is required"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    mobile: Yup.string()
      .min(10, "Minimum length 10")
      .max(15, "Maximum length 15"),
    // .matches(
    //   /^(\+91[\s-]?)?[6-9]\d{9}$/,
    //   "Invalid input"
    // ),

    // role: Yup.string().required("Role is required"),
    role: Yup.string()
      .notOneOf(["--Select--"], "Role is required") // Ensure the placeholder is not selected
      .required("Role is required"),
    orgUnit: Yup.array(),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/,
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol character"
      ),
  });

  const userEditSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    surname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email"),
    phoneNumber: Yup.string().min(10, "Minimum length 10"),
    status: Yup.boolean(),

    // password: Yup.string().min(6, 'Minimum length 6 character').required('Password is required')
  });

  const [filterFlag, setFilterFlag] = useState(false);

  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);
  const [periodName, setPeriodName] = useState();

  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [orgID, setOrgID] = useState();
  // const [orgID, setOrgID] = useState();
  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);
  const [currentPeriod, setCurrentPeriod] = useState(
    (date.getFullYear() - 1).toString()
  );

  const [isSidebarOpen, setSidebar] = useState(false);

  function buildOrgUnitTree(units) {
    const unitMap = new Map();
    const roots = [];

    // Step 1: Create a clean node { label, value, children: [] }
    units?.forEach(unit => {
      unitMap.set(unit.id, {
        label: unit.displayName,
        value: unit.id,
        children: []
      });
    });

    // Step 2: Link children
    units?.forEach(unit => {
      if (unit.parent && unit.parent.id) {
        const parent = unitMap.get(unit.parent.id);
        if (parent) {
          parent.children.push(unitMap.get(unit.id));
        } else {
          // Missing parent, treat as root
          roots.push(unitMap.get(unit.id));
        }
      } else {
        // No parent, root node
        roots.push(unitMap.get(unit.id));
      }
    });
    return roots;
  }

  async function fetchOrgUnits() {
    dispatch(setLoader(true))
    const response = await API.get(`organisationUnits.json?filter=path:like:/wBH6Q6LzJPv&fields=id,displayName,path,parent[id],level,children::isNotEmpty&paging=false`)
    console.log(response, "check response")
    const tree = buildOrgUnitTree(response.data.organisationUnits);
    console.log("tree", tree)
    setOrgTree(tree);

    let facilitylist = response.data.organisationUnits?.filter(item => item.level === 5);
    const factree = buildOrgUnitTree(facilitylist);
    dispatch(setLoader(false))
    setFacTree(factree)
  }

  useEffect(() => {
    console.log("Fetching organisation units", userEditVariable);
    fetchOrgUnits();

  }, [])
  useEffect(() => {
    if (userEditVariable && userEditVariable == true) {
      setUserAddVariable(false);
    }
  }, [userEditVariable, userAddVariable])



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
    console.log(org);
    setOrgID(org[org.length - 1].id);
    console.log(period);
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

  const fetchLineListData = () => {
    setLoading(true);
    if (!filterFlag) {
      console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
      console.log(defaultOrg);
    }
    let period = currentPeriod.includes("-")
      ? currentPeriod.replace("-", "")
      : currentPeriod;
    console.log(defaultOrg[0].id);
    let userRolesUrl = "userRoles?fields=id,displayName,name&paging=false";
    let userGroupsUrl = "userGroups?fields=id,displayName,name&paging=false";

    // Fetch both user roles and user groups, then filter roles that have matching groups
    Promise.all([
      API.get(userRolesUrl),
      API.get(userGroupsUrl)
    ])
      .then(([rolesResponse, groupsResponse]) => {
        const _ = require("lodash");
        const userRoles = rolesResponse.data.userRoles;
        const userGroups = groupsResponse.data.userGroups;

        // Create a set of user group names for faster lookup
        const userGroupNames = new Set(
          userGroups.map(group => group.name || group.displayName)
        );

        console.log("Available user groups:", Array.from(userGroupNames));

        // Filter roles that have a matching user group with the same name
        const filteredRoles = _.chain(userRoles)
          .filter(role => {
            const roleName = role.name || role.displayName;
            const hasMatchingGroup = userGroupNames.has(roleName);
            if (hasMatchingGroup) {
              console.log(`Role "${roleName}" has matching user group`);
            }
            return hasMatchingGroup;
          })
          .map((role) => ({
            value: role.id,
            label: role.displayName || role.name
          }))
          .value();

        console.log("Filtered roles with matching user groups:", filteredRoles);
        setUserRoles(filteredRoles);

        setLoading(false);
        getOrgStructure();
        getUserList();
      })
      .catch((error) => {
        console.log("Error fetching user roles or groups:", error);
        setLoading(false);
      });
  };

  const getOrgStructure = () => {
    let tempOrg = [];

    // let dataHolder = {
    //   label: defaultOrg[0].displayName,
    //   value: defaultOrg[0].id,
    //   children: []
    // }
    // API.get(`organisationUnits?fields=id%2Cpath%2CdisplayName%2Cchildren%3A%3AisNotEmpty&paging=false`).then((res) => {
    //   dataHolder.children = res.data.organisationUnits.map((org, idx) => { return ({ value: org.id, label: org.displayName }) })
    //   console.log(dataHolder.children, "dataHolder")
    //   setOrgStructure(dataHolder)
    //   console.log(res.data.organisationUnits)
    // })
  };

  // filter logic
  // if (subfacilityOrg) {
  //   setCurrentOrg([subfacilityOrg]);
  // } else if (facilityOrg) {
  //   setCurrentOrg = [facilityOrg];
  // } else if (blockOrg) {
  //   setCurrentOrg = [blockOrg];
  // } else if (districtOrg) {
  //   setCurrentOrg = [districtOrg];
  // } else if (provinceOrg) {
  //   setCurrentOrg = [provinceOrg];
  // } else if (countryOrg) {
  //   setCurrentOrg = [countryOrg];
  // }

  // console.log(tempOrg);

  // if (tempOrg.length > 0) {
  //   setCurrentOrg(tempOrg);
  //   // console.log(periodName);
  //   props.applyFilter(tempOrg, currentPeriod, periodName, periodType);
  // }
  // filter list
  const selectCountryValue = (orgID, orgName) => {
    console.log(orgID);
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

  const getUserList = () => {
    setLoading(true);
    // API.get(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
    API.get(
      `users?fields=:all,userRoles[id,name]&ou=` + orgID + `&includeChildren=true&paging=false`
    ).then((res) => {
      setLoading(false);
      var excludedRole = "Patient Role";
      var filteredUsers = _.filter(res.data.users, function (user) {
        // Check if any of the userRoles match the excluded role
        return !_.some(user.userRoles, function (role) {
          return role.name === excludedRole;
        });
      });
      setUserData(filteredUsers);
      setUserTableKey(Math.random());
    });
  };

  useEffect(() => {
    // if (orgID == "zRzmF39GKjp") {
    //   // for philipnes
    //   setAppProgramID("zEcXs9CsP4a")
    // }
    // else if (orgID == "cPp4Njup8ps") {
    //   // for egypt
    //   setAppProgramID("t0vE0JNKagy")
    // }
    // else if (orgID == "xSIboJSOyJK") {
    //   // for jordan
    //   setAppProgramID("TMF8Tah3HFU")
    // }
    // else{
    //   // for generic
    //   setAppProgramID('TMF8Tah3HFU')
    // }
    setDefaultOrg(
      JSON.parse(sessionStorage.getItem("userData")).organisationUnits
    );
    setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
    if (orgID) fetchLineListData();
  }, [orgID, currentPeriod, appProgramID, categoryFilter]);

  const editUser = (userData) => {
    console.log(userData);
    if (userData.userCredentials.disabled) userData.status = false;
    else userData.status = true;
    setUserCheck(userData.status);
    // userData.firstName = userData.firstName
    // userData.lastname = userData.surname
    setUserEditObject(userData);
    setUserEditVariable(true);
    setUserAddVariable(false);
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
                    {t("User Management")}
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
              <Col lg={8}>
                <Table
                  key={userTableKey}
                  setUserEditObject={setUserEditObject}
                  setUserEditVariable={setUserEditVariable}
                  userData={userData}
                  edituser={editUser}
                />
              </Col>
              <Col className="" lg={4}>
                <div className="row">
                  <div className="col-12">
                    <button
                      onClick={(e) => {
                        setUserAddVariable(true);
                        setUserEditVariable(false);
                      }}
                      type="button"
                      title="Add User"
                      className="btn btn-primary mt-2 mb-2 "
                    >
                      {" "}
                      {t("Add User")}{" "}
                    </button>
                  </div>
                </div>
                {userAddVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={{
                      firstname: "",
                      lastname: "",
                      email: "",
                      mobile: "",
                      password: "",
                      role: "",
                    }}
                    validationSchema={userObjectSchema}
                    onSubmit={(values) => {
                      console.log("validationSchema", values, formRef);

                      // Find the selected role name from userRoles array
                      const selectedRole = userRoles.find(role => role.value === values.role);
                      const roleName = selectedRole ? selectedRole.label : null;

                      console.log("Selected role name:", roleName);

                      // First, search for user group with the same name as the role
                      // Search by both name and displayName to ensure we find the match
                      API.get(`userGroups?fields=id,name,displayName&paging=false`)
                        .then((userGroupResponse) => {
                          let userGroupId = "CvRG0GbxLvB"; // default fallback

                          // Find matching user group by comparing name or displayName
                          const matchingGroup = userGroupResponse.data.userGroups?.find(
                            group => group.name === roleName || group.displayName === roleName
                          );

                          if (matchingGroup) {
                            userGroupId = matchingGroup.id;
                            console.log("Found matching user group:", matchingGroup.name || matchingGroup.displayName, "ID:", userGroupId);
                          } else {
                            console.log("No matching user group found for role:", roleName, "Using default group");
                          }

                          // Create user instance with dynamic user group
                          let instanct = {
                            userCredentials: {
                              cogsDimensionConstraints: [],
                              catDimensionConstraints: [],
                              username: values.username,
                              password: values.password,
                              userRoles: [
                                {
                                  id: values.role,
                                },
                              ],
                            },
                            email: values.email,
                            phoneNumber: values.mobile,
                            surname: values.lastname,
                            firstName: values.firstname,
                            organisationUnits: [
                              {
                                id: currentOrg,
                              },
                            ],
                            dataViewOrganisationUnits: [
                              {
                                id: currentOrg,
                              },
                            ],
                            teiSearchOrganisationUnits: [
                              {
                                id: currentOrg,
                              },
                            ],
                            userGroups: [{ id: userGroupId }],
                            attributeValues: [],
                          };

                          if (orgID == "zRzmF39GKjp") {
                            // for philipnes
                            instanct["twitter"] = "Philippines";
                          } else if (orgID == "cPp4Njup8ps") {
                            // for egypt
                            instanct["twitter"] = "Egypt";
                          } else if (orgID == "xSIboJSOyJK") {
                            // for jordan
                            instanct["twitter"] = "Jordan";
                          }

                          console.log(instanct, "instance");

                          // Check if username already exists
                          API.get(
                            "users?filter=userCredentials.username:eq:" +
                            values.username +
                            "&fields=id"
                          ).then((response) => {
                            if (response.data.users.length == 0) {
                              setLoading(true)
                              API.post("users", instanct)
                                .then((res) => {
                                  setLoading(false)
                                  // console.log(res)
                                  let elem = document.createElement("div");
                                  if (res.data.status == "OK") {
                                    elem.innerHTML = "User created sucessfully.";
                                    swal({
                                      title: "Success",
                                      content: elem,
                                      icon: "success",
                                      button: "Close",
                                    }).then(function () {
                                      if (JSON.parse(sessionStorage.getItem("userData"))?.mfaFlag) {
                                        API.post('save/mfa/user/send/token', { "username": values.username }).then(res => {
                                          console.log(res, "Token Sent succesfully")
                                        }).catch(e => {
                                          console.log(e, "Token Failed")
                                        })
                                      }
                                      // values.email
                                      getUserList();
                                      setUserAddVariable(false);
                                    });
                                  } else {
                                    elem.innerHTML =
                                      res.data.typeReports[0].objectReports[0].errorReports[0].message;
                                    swal({
                                      title: "Error",
                                      content: elem,
                                      icon: "error",
                                      button: "Close",
                                    });
                                  }
                                })
                                .catch((error) => {
                                  setLoading(false)
                                  console.log(error);
                                });
                            } else {
                              let elem = document.createElement("div");
                              elem.innerHTML =
                                "Username / Email already exist in the system.";
                              swal({
                                title: "Error",
                                content: elem,
                                icon: "error",
                                button: "Close",
                              });
                            }
                          });
                        })
                        .catch((error) => {
                          console.log("Error fetching user group:", error);
                          // If user group search fails, show error
                          let elem = document.createElement("div");
                          elem.innerHTML = "Error fetching user group. Please try again.";
                          swal({
                            title: "Error",
                            content: elem,
                            icon: "error",
                            button: "Close",
                          });
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm mr-4">
                        <Card>
                          <Card.Header className="regcardheader d-flex justify-content-between ">
                            {t("Add User")}
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setUserAddVariable(false);
                              }}
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Form.Group controlId="formBasicEmail">
                              <Field name="firstname">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("First Name")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("First Name")}
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
                                name="firstname"
                              />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                              <Field name="lastname">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Last Name")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Last Name")}
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
                                name="lastname"
                              />
                            </Form.Group>
                            <Form.Group controlId="formBasicUsername">
                              <Field name="username">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Username")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Username")}
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
                                name="username"
                              />
                            </Form.Group>
                            <Form.Group controlId="formYourMobileNumber">
                              <Field name="mobile">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Mobile Number")}
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Mobile Number")}
                                            type="number"
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
                                name="mobile"
                              />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                              <Field name="role">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Role")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <select
                                            type="text"
                                            className="form-control"
                                            {...field}
                                          >
                                            <option>--{t("Select")}--</option>
                                            {userRoles
                                              .filter(role => !role.label.toLowerCase().includes('patient'))
                                              .map((role, id) => {
                                                return (
                                                  <option
                                                    key={id}
                                                    value={t(role.value)}
                                                  >
                                                    {" "}
                                                    {t(role.label)}
                                                  </option>
                                                );
                                              })}
                                          </select>
                                        </span>
                                      </div>
                                    </>
                                  );
                                }}
                              </Field>
                              <ErrorMessage component={TextError} name="role" />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmailAddress">
                              <Field name="email">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Email Address *")}
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Email")}
                                            type="email"
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
                            <Form.Group controlId="formYourPassword">
                              <Field name="password">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Password")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Password")}
                                            type="password"
                                            className="form-control"
                                            {...field}
                                            autoComplete="new-password"
                                          />
                                        </span>
                                      </div>
                                    </>
                                  );
                                }}
                              </Field>
                              <ErrorMessage
                                component={TextError}
                                name="password"
                              />
                            </Form.Group>

                            <Form.Group controlId="formOrg">
                              <Form.Label className="label">Organisation *</Form.Label>
                              <div className="sidebardropdown organisationDiv">
                                <Dropdown className="dropdownset m-0">
                                  <Dropdown.Toggle className="dropdownset">
                                    {countryOrg[0].displayName ? t(countryOrg[0].displayName) : "Select Country"}
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

                                {levels.map((level, index) => (
                                  level.children == true ?
                                    <Dropdown key={level.id} className="dropdownset m-0">
                                      <Dropdown.Toggle className="dropdownset">
                                        {console.log("levelss::>>", level, level.selected, index, level.id, levels)}
                                        {levels[index + 1] ? levels[index + 1].selected.displayName : level.displayName}
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        {level.options.map((org) => (
                                          <Dropdown.Item key={org.id} onClick={() => handleSelect(index + 1, org.id, org.displayName)}>
                                            {org.displayName}
                                          </Dropdown.Item>
                                        ))}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    <></>
                                ))}

                              </div>
                            </Form.Group>
                            <Button className="btn addbtn mt-3" type="submit">
                              {t("Add")}
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}
                {userEditVariable ? (
                  <Formik
                    key={userEditObject?.id}
                    innerRef={formRef}
                    initialValues={userEditObject || {}}
                    validationSchema={userEditSchema}
                    onSubmit={(values) => {
                      console.log(values, "values")
                      if (values.disabled === "deactivate") {
                        values.disabled = true
                        values.userCredentials.disabled = true;
                      } else if (values.disabled === "activate") {
                        values.disabled = false
                        values.userCredentials.disabled = false;
                      }
                      if (userCheck) values.userCredentials.disabled = false;
                      else values.userCredentials.disabled = true;
                      // return
                      API.put("users/" + values.id, values)
                        .then((res) => {
                          let elem = document.createElement("div");
                          if (res.data.status == "OK") {
                            elem.innerHTML = "User updated sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getUserList();
                              setUserEditVariable(false);
                            });
                          } else {
                            elem.innerHTML =
                              res.data.typeReports[0].objectReports[0].errorReports[0].message;
                            swal({
                              title: "Error",
                              content: elem,
                              icon: "error",
                              button: "Close",
                            });
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm mr-4">
                        <Card>
                          <Card.Header className="regcardheader d-flex justify-content-between">
                            {t("Edit User")}
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setUserEditVariable(false);
                              }}
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Form.Group controlId="formBasicEmail">
                              <Field name="firstName">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("First Name")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("First Name")}
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
                                name="firstName"
                              />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                              <Field name="surname">
                                {({ field, meta }) => {
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Last Name")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Last Name")}
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
                                name="surname"
                              />
                            </Form.Group>
                            <Form.Group controlId="formYourMobileNumber">
                              <Field name="phoneNumber">
                                {({ field, meta }) => {
                                  console.log("formBasicEmailmobile", field)
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Mobile Number")}
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Mobile Number")}
                                            type="number"
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
                                name="mobile"
                              />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmailAddress">
                              <Field name="email">
                                {({ field, meta }) => {
                                  console.log("formBasicEmailemail", field)

                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Email Address")}
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Email")}
                                            type="email"
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
                            <Form.Group controlId="formYourPassword">
                              <Field name="password">
                                {({ field, meta }) => {
                                  console.log("formBasicEmailpassword", field)
                                  return (
                                    <>
                                      <Form.Label className="label">
                                        {t("Password")} *
                                      </Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <input
                                            placeholder={t("Password")}
                                            type="password"
                                            className="form-control"
                                            {...field}
                                            autoComplete="new-password"
                                          />
                                        </span>
                                      </div>
                                    </>
                                  );
                                }}
                              </Field>
                              <ErrorMessage
                                component={TextError}
                                name="password"
                              />
                            </Form.Group>

                            {
                              <Form.Group controlId="formStatus">
                                <Field name="disabled">
                                  {({ field, meta }) => (
                                    <>
                                      <Form.Label className="label">Status</Form.Label>
                                      <div className="formgroup">
                                        <span className="formInput">
                                          <select className="form-control" {...field} value={field.value}>
                                            <option value="">--Select--</option>
                                            <option value="activate">Active</option>
                                            <option value="deactivate">Deactivate</option>
                                          </select>
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="disabled"
                                />
                              </Form.Group>
                            }

                            <Button className="btn addbtn mt-3" type="submit">
                              {t("Update")}
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
                <Modal.Title>{t(modalHeader)}</Modal.Title>
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
      </div>
    </>
  );
};
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(UserManagement);
