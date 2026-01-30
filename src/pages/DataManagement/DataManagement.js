import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import API from "../../services";
import Sidebar from "react-sidebar";
import Moment from "react-moment";

import { Container, Button, Breadcrumb, Modal, Row, Col, Form, Card } from "react-bootstrap";

import Loader from "../../components/loaders/loader";
import SidebarContent from "../../components/SidebarContent";
import Table from "./DataTable";

import {
  appFilter
} from "../../config/appConfig";


import * as Yup from 'yup';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import TextError from '../../components/ErrorText'

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const DataManagement = ({ props }) => {
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(appFilter);

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();
  const [appProgramID, setAppProgramID] = useState(null)

  const [userData, setUserData] = useState([])
  const [userTableKey, setUserTableKey] = useState(0)
  const [userAddVariable, setUserAddVariable] = useState(false)
  const [userEditVariable, setUserEditVariable] = useState(false)
  const [userRoles, setUserRoles] = useState([])
  const [orgStructure, setOrgStructure] = useState({})
  const [userEditObject, setUserEditObject] = useState({})
  const [userCheck, setUserCheck] = useState()

  const handleCloseModal = () => setShowModal(false);

  const onChange = (currentNode, selectedNodes) => {
    // console.log('onChange::', currentNode, selectedNodes)
    formRef.current.values.orgUnit = selectedNodes
    // setSelectedOrg(selectedNodes)
  }


  // For User Creation
  const userObjectSchema = Yup.object().shape({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email'),
    mobile: Yup.string().min(10, 'Minimum length 10'),

    role: Yup.string().required('Role is required'),
    orgUnit: Yup.array(),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/,
        'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol character'
      ),

  });

  const userEditSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    surname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email'),
    phoneNumber: Yup.string().min(10, 'Minimum length 10'),
    status: Yup.boolean()
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
  //console.log(latestPeriod);
  const [currentPeriod, setCurrentPeriod] = useState(
    (date.getFullYear() - 1).toString()
  );

  const [isSidebarOpen, setSidebar] = useState(false);

  // Dummy variable is just a flag used to switch  between the two tabs, "active" & "Deactivated" clients
  const [dummyVariable, setdummyVariable] = useState(true)
  const [refreshTable, setrefreshTable] = useState(false)



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

  const fetchLineListData = () => {
    setLoading(true);
    if (!filterFlag) {
      console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
      console.log(defaultOrg)
    }
    let period = currentPeriod.includes("-")
      ? currentPeriod.replace("-", "")
      : currentPeriod;
    console.log(defaultOrg[0].id)
    let columnUrl = "userRoles?fields=:all"
    let url = ''

    getUserList()
  };

  const getOrgStructure = () => {
    let dataHolder = {
      label: defaultOrg[0].displayName,
      value: defaultOrg[0].id,
      children: []
    }
    API.get(`organisationUnits?fields=id%2Cpath%2CdisplayName%2Cchildren%3A%3AisNotEmpty&paging=false`).then((res) => {
      dataHolder.children = res.data.organisationUnits.map((org, idx) => { return ({ value: org.id, label: org.displayName }) })
      console.log(dataHolder, "dataHolder")
      setOrgStructure(dataHolder)
    })
  }

  useEffect(() => {
    getUserList()

  }, [dummyVariable, refreshTable]);

  const getUserList = () => {
    setLoading(true)
    // API.get(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
    // API.get(`users?fields=:all&ou=` + orgID + `&includeChildren=true&paging=false`).then((res) => {
    let linelistAPI = `referral/myclient/list?programid=` + JSON.parse(sessionStorage.getItem("userData")).programuid + `&orgid=` + orgID
    let deactivatedClientsAPI = `adminmodule/getdeactivatepatientdata`
    let activeTabAPI = dummyVariable ? linelistAPI : deactivatedClientsAPI
    let inputParams = {
      "puid": JSON.parse(sessionStorage.getItem("userData")).programuid
    }
    console.log("dummyVariable", dummyVariable)
    if (dummyVariable) {
      API.get(activeTabAPI).then((res) => {
        // referral/myclient/list?programid=eAHvg6zuxvK&orgid=YUv0ube9634
        setLoading(false)
        setUserData(res.data.data)
        setUserTableKey(Math.random())
      })
    }
    else {
      API.post(activeTabAPI, inputParams).then((res) => {
        setLoading(false)
        setUserData(res.data.Data)
        setUserTableKey(Math.random())
      })
    }

  }

  useEffect(() => {
    setDefaultOrg(JSON.parse(sessionStorage.getItem("userData")).organisationUnits);
    setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
    if (orgID)
      fetchLineListData();
  }, [orgID, currentPeriod, appProgramID, categoryFilter]);

  const deactivateUser = (userData) => {
    console.log("userData", userData)
    let deactivateAPI = `adminmodule/actdeactpatient`
    let inputParams = {
      "status": "deactivate",
      "instanceuid": userData.instanceid,
      "puid": JSON.parse(sessionStorage.getItem("userData")).programuid
    }
    console.log("inputParams", inputParams)

    API.post(deactivateAPI, inputParams).then((res) => {
      swal({
        title: "Client status has been set to inactive",
        icon: "warning",
        button: "Close",
      })
      setLoading(false)
      if (!refreshTable) { setrefreshTable(true) }
      else { setrefreshTable(false) }

    })
  }

  const activateUser = (userData) => {
    console.log("userData", userData)
    let activateAPI = `adminmodule/actdeactpatient`
    let inputParams = {
      "status": "activate",
      "instanceuid": userData.instanceuid,
      "puid": JSON.parse(sessionStorage.getItem("userData")).programuid,
      "uic": userData.UIC
    }
    console.log("inputParams", inputParams)

    API.post(activateAPI, inputParams).then((res) => {
      swal({
        title: "Client status has been set to activate",
        icon: "success",
        button: "Close",
      })
      setLoading(false)
      if (!refreshTable) { setrefreshTable(true) }
      else { setrefreshTable(false) }
    })
  }

  const getDatePeriod = () => {
    console.log(periodName)
    if (!periodName || periodName == '') {
      if (currentPeriod.includes("-")) {
        return (
          <Moment
            date={new Date(currentPeriod)}
            format="MMM-YYYY"
          />
        )
      } else if (currentPeriod.includes(";")) {
        return (
          <>
            {currentPeriod.replace(";", "-")}
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
  }

  const linelistTabs = () => {

  }



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
      <div className="mainContainer" style={{ marginTop: "50px", overflow: "hidden" }}>
        <Loader isLoading={loading} />
        <div className="headerfixedcontainer subnavheaderfixedcontainer">
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
                    {/* <FontAwesomeIcon className="color-white" icon={faHome} />{" "} */}
                    {t("Data Management")}
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

        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="table-linelist mb-3">
            <Row>
              <Col lg={11} className="m-0-auto">
                <div className="row mb-2">
                  <div className="col-12" style={{ marginTop: "40px" }} >
                    <button onClick={(e) => { setdummyVariable(true) }} type="button" id="activated" title="Activated Patients" className={`btn btn-sm addbtn mt-2 mr-2 ${dummyVariable ? 'btn-primary' : 'btn-secondary'}`}> {t("Activated Patients")}</button>
                    <button onClick={(e) => { setdummyVariable(false) }} type="button" id="deactivated" title="Deactivated Patients" className={`btn btn-sm addbtn mt-2 mr-2 ${!dummyVariable ? 'btn-primary' : 'btn-secondary'}`}> {t("Deactivated Patients")}</button>
                  </div>
                </div>
                <Table
                  key={userTableKey}
                  // columns={linelistColumns}
                  dummyVariable={dummyVariable}
                  userData={userData}
                  deactivateUser={deactivateUser}
                  activateUser={activateUser}
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
                          <b>{t("Loading")}...</b>
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

export default connect(mapStateToProps, null)(DataManagement);
