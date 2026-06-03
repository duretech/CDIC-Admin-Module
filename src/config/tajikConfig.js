// Dashboard Application Configuration

//======================================================================================//
// Application Basic Info
import tajikLogo from "../assets/images/tajik-logo.png"; // Tajik Logo

// Tajik
export const appLogo = tajikLogo;
export const appName = "Prevent TB - Tajikistan";

//======================================================================================//
// Application API URLs
// Tajik
export const appBaseUrl = "https://tajik.preventtb.org/";
export const appApiUrl = "https://tajik.preventtb.org/service/api/";

//======================================================================================//
// Application Default Organisation ID
// Tajik
export const appDefaultOrg = [{ id: "fdEhHai0ZNj", displayName: "Tajikistan" }];

//======================================================================================//
// Dashboard IDs
// Tajik
export const appDashboardID = "lsiVUTDchc9";

//======================================================================================//
// Map Config
export const mapDefaultCenter = [38.861034, 71.276093];
export const mapDefaultZoom = 6;
export const mapIndicatorsList = [
  { label: "Index Registered", value: "d5FaORFvA7w" },
  { label: "Contact Registered", value: "nTlrxcgZr8Q" },
  { label: "Suspect Registered", value: "nuZITkfqDvm" },
  { label: "Index Screened", value: "nIAO7RFK3F1" },
  { label: "Contact Screened", value: "WnD5wOD0SuO" },
  { label: "Gender (Male)", value: "sV3WZkf6UCF" },
  { label: "Gender (Female)", value: "Ucmou5dFDm9" },
  { label: "Gender (TG)", value: "lxciXnypJdL" },
  { label: "Referred TB", value: "JmxPClnZt1d" },
  { label: "TB testing - Positive", value: "w9YQqIafjZN" },
  { label: "TB testing - Negative", value: "SFdCoTs6ImP" },
  { label: "Referred LTBI", value: "mHkiT3Sl3vj" },
  { label: "LTBI Testing - Positive", value: "dYqbNQ7ZJnQ" },
  { label: "LTBI Testing - Negative", value: "EcrMbOQekDo" },
];

//======================================================================================//
// Line list
// OVC
export const appProgramID = "mgQS5cw2rVi";
export const appAttributeID = "DyvjG42flhS";
export const appEQ = "Index";
export const appFilter = "Index;Contact;Presumptive TB";
export const appFilterLabel = "All";
export const lineListCategories = [
  { label: "All", value: "Index;Contact;Presumptive TB" },
  { label: "Index", value: "Index" },
  { label: "Contact", value: "Contact" },
  { label: "Key Population", value: "Presumptive TB" },
];

// Line list Table Meta data

export const childTableHeader = [
  {
    Header: "UIC",
    accessor: "UIC",
  },
  {
    Header: "Name",
    accessor: " Name",
  },
  {
    Header: "Age (in years)",
    accessor: "Age (in years)",
  },
  {
    Header: "Gender",
    accessor: "Gender",
  },
  {
    Header: "Mobile Number",
    accessor: "Mobile Number",
  },
  {
    Header: "Client type",
    accessor: "Client type",
  },
  {
    Header: "Voucher Number",
    accessor: "Voucher Number",
  },
];

//======================================================================================//

// Alerts

export const alertsThresholdVal = 5;
