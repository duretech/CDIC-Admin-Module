import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { connect } from "react-redux";
import API from "../../services";
import Moment from "react-moment";
import { Container, Button, Breadcrumb, Row, Col } from "react-bootstrap";
import Table from "./DataTable";
import Loader from "../../components/loaders/loader";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import _ from "underscore";
//import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const AuditTrailManagement = ({ props }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  // State management
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [auditData, setAuditData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultOrg, setDefaultOrg] = useState([{ id: "", displayName: "" }]);
  const [userList, setUserList] = useState([]);
  const [orgID, setOrgID] = useState();
  const [username, setUsername] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [searchByUIC, setSearchByUIC] = useState(false);


  const getUserList = () => {
      setLoading(true);
      API.get(
        `users?fields=:all,userRoles[id,name]&ou=` + orgID + `&includeChildren=true&paging=false`
      ).then((res) => {
        setLoading(false);
        var excludedRole = "Patient Role";
        var filteredUsers = _.filter(res.data.users, function(user) {
        // Check if any of the userRoles match the excluded role
            return !_.some(user.userRoles, function(role) {
                return role.name === excludedRole;
            });
        });
        setUserList(filteredUsers);
      });
    };
  useEffect(() => {
      setDefaultOrg(
        JSON.parse(sessionStorage.getItem("userData")).organisationUnits
      );
      setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
      if (orgID) getUserList();
    }, [orgID]);

  // Filter data based on user and date selection
  const filteredData = () => {
    //console.log("selectedUser, startDate, endDate ",selectedUser, startDate, endDate)
    let param = {
        "programid":sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")).programuid : '',
        "fromDate":startDate,
        "toDate":endDate,
        "username":selectedUser
    }
    setLoading(true)
    API.post("audit/getreport", param)
      .then((res) => {
        setLoading(false)
        //console.log("res.data ",res,JSON.parse(sessionStorage.getItem("userData")))
        if (res?.data?.data.length > 0) {
          //console.log("res.data ",res.data,sessionStorage.getItem("userData"))
          const formattedData = mapAuditData(res.data.data);
          console.log("searchByUIC",searchByUIC)
          if(!searchByUIC){
            setUsername(formattedData[0]["modifierusername"])
            setLastLogin(formattedData[0]["lastlogindetails"])
          }
          setAuditData(formattedData)
        }else{
          setAuditData([])
        }
      }).catch(e => {
        setLoading(false)
        setAuditData([])
      })

    
  };

  const isValidDateValue = (value) => {
    if (!value || typeof value !== "string") return false;

    // Match ONLY yyyy-mm-dd or yyyy-mm-ddTHH:mm:ss formats
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

    if (!isoDateRegex.test(value)) return false; // Not a date-like string

    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const formatDateTime = (value) => {
    if (!value) return value;

    const d = new Date(value);

    if (isNaN(d.getTime())) return value; // invalid date safety

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); 
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };


  const mapAuditData = (data) => {
    return data
      .map(row => {
        return {
          ...row,

          // Format main date fields
          datetime: formatDateTime(row.datetime),
          lastlogindetails: formatDateTime(row.lastlogindetails),

          // Format previous & new values if they contain dates
          auditvalue: isValidDateValue(row.auditvalue)
            ? formatDateTime(row.auditvalue)
            : row.auditvalue,

          currentvalues: isValidDateValue(row.currentvalues)
            ? formatDateTime(row.currentvalues)
            : row.currentvalues,
        };
      })

      // Sort by datetime descending (latest first)
      .sort((a, b) => {
        const dateA = new Date(a.datetime.split(" ")[0].split("-").reverse().join("-") + " " + a.datetime.split(" ")[1]);
        const dateB = new Date(b.datetime.split(" ")[0].split("-").reverse().join("-") + " " + b.datetime.split(" ")[1]);

        return dateB - dateA; // latest on top
      });
  };

  const handleSearch = () => {
    //console.log(selectedUser , startDate , endDate,!selectedUser && !startDate && !endDate)
    // Run validation only when full date entered (dd-mm-yyyy = 10 chars)
    console.log("end ",endDate,startDate, endDate < startDate)
    setUsername('')
    setLastLogin('')
    if(!selectedUser || !startDate || !endDate){
      swal({
        title: "Alert",
        text: t("Please select Username/UIC, Start Date and End Date!"),
        icon: "warning",
        button: "Close",
      })
      return;
    }else{
        if (endDate < startDate) {
          swal({
              title: t("Alert"),
              text: t("End date cannot be earlier than start date!"),
              icon: "warning",
              button: t("Close"),
            })
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          filteredData();
          setIsLoading(false);
        }, 500);
    }
  };

  const handleClear = () => {
    setSelectedUser("");
    setStartDate("");
    setEndDate("");
    setAuditData([]);
    setUsername('')
    setLastLogin('')
  };

  const enforce4DigitYear = (dateStr) => {
    if (!dateStr) return dateStr;

    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;

    let [year, month, day] = parts;

    // Restrict year to 4 digits ONLY
    year = year.slice(0, 4);

    return `${year}-${month}-${day}`;
  };


  const handleStartDate = (e) => {
    const value = enforce4DigitYear(e.target.value);
    setStartDate(value);

    // Reset end date if invalid
    if (endDate && new Date(value) > new Date(endDate)) {
      setEndDate("");
    }
  };


  const handleEndDate = (e) => {
  let value = e.target.value;

  // Apply 4-digit year restriction (typing allowed until 10 chars)
  value = enforce4DigitYear(value);
  setEndDate(value);
  };

  return (
    <div className="mainContainer">
      <Loader isLoading={loading} />
      <div className="headerfixedcontainer">
        <Container fluid>
          <div className="headerbarcontainer">
            <div className="mr-2">
              <Breadcrumb>
                <Breadcrumb.Item href="#">{t("Audit Trail")}</Breadcrumb.Item>
                {breadcrumbOrg
                  ? breadcrumbOrg.map((org) => (
                      <Breadcrumb.Item href="#" key={org.id}>
                        {org.displayName}
                      </Breadcrumb.Item>
                    ))
                  : ""}
              </Breadcrumb>
            </div>
          </div>
        </Container>
      </div>
      <div style={{ padding: "20px" }}>
        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="audit-page-container">
          <div
            style={{
              background: "#f8f9fa",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              border: "1px solid #dee2e6",
            }}
            className="filter-section"
          >
            <h4 style={{ marginTop: 0, marginBottom: "5px", color: "#333" }}>
              {t("Filter")}
            </h4>

            {/* GRID START */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                marginBottom: "10px",
                alignItems: "end",
              }}
            >
              {/* Username/UIC */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  {t("Username/UIC")}:
                </label>

                <CreatableSelect
                  options={userList.map((u) => ({
                    label: u.username,
                    value: u.username,
                  }))}
                  value={
                    selectedUser ? { label: selectedUser, value: selectedUser } : null
                  }
                  onChange={(selected) => {
                    console.log("selected",selected)
                    if (!selected) {
                        setSelectedUser("");
                        setSearchByUIC(false);
                        return;
                      }

                      // Check if typed value is NOT in username list → means UIC
                      const isUIC = !userList.some((u) => u.username === selected.value);

                      setSearchByUIC(isUIC);

                      // finally store selected or UIC text
                      setSelectedUser(selected.value);
                  }}
                  placeholder={t("Select Username or Enter UIC")}
                  isClearable
                  formatCreateLabel={(val) => `Use UIC: "${val}"`}
                  styles={{
                    container: (base) => ({ ...base, width: "100%" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>

              {/* Start Date */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  {t("Start Date")}:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDate}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* End Date + Buttons */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  {t("End Date")}:
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={handleEndDate}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                

                {/* Buttons */}
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "white",
                      backgroundColor: "#001965",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      height: "39px",
                      //marginTop: "2px"
                    }}
                  >
                    {isLoading ? t("Loading") + "..." : t("Apply")}
                  </button>

                  <button
                    onClick={handleClear}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                      backgroundColor: "white",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      height: "39px",
                      //marginTop: "2px"
                    }}
                  >
                    {t("Clear")}
                  </button>
                </div>
              </div>
            </div>
          </div>
            
            <div style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              fontSize: "14px",
              padding: "10px 15px 20px 0px",
              color: "#1a2b5f",
              fontWeight: 500
            }}>
              {username && lastLogin && 
              <>  
                <span><strong>{t("Username")}:</strong> {username}</span>
                <span><strong>{t("Last Login")}:</strong> {lastLogin}</span>
              </>   
              }
            </div>
          
          <div
              style={{
                  background: "white",
                  padding: "0",
                  // borderRadius: "6px",
                  // border: "1px solid #dee2e6"
              }}
              className="table-linelist audit-table audit-table-wrapper"
          >
              <Table key={Math.random()} userData={auditData} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const headerStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "600",
  color: "#495057",
  borderBottom: "2px solid #dee2e6",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "12px",
  textAlign: "left",
  color: "#495057",
};
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(AuditTrailManagement);
