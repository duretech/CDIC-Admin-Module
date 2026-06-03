// Dashboard Application Configuration

//======================================================================================//
// Application Basic Info
import undpLogo from "../assets/images/undp.png"; // Tajik Logo

// Tajik
export const appLogo = undpLogo;
export const appName = "UNDP Cross Border TB Program";

//======================================================================================//
// Application API URLs
// Tajik
export const appBaseUrl = "https://undp.imonitorplus.com/";
export const appApiUrl = "https://undp.imonitorplus.com/service/api/";

//======================================================================================//
// Application Default Organisation ID
// Tajik
export const appDefaultOrg = [
  { id: "I9jfaLculAp", displayName: "Afghanistan" },
];

//======================================================================================//
// Dashboard IDs
// Tajik
export const appDashboardID = "qtYj0wESfis";

//======================================================================================//
// Map Config
export const mapDefaultCenter = [33.93911, 67.709953];
export const mapDefaultZoom = 6;
export const mapIndicatorsList = [
  { label: "Index Registered", value: "bBvHHWrO1gM" },
  { label: "Contact Registered", value: "eq3VypiS896" },
  { label: "Screened for TB", value: "vqbtkGG8DI9" },
  { label: "Screened for LTBI", value: "xrUNR85WRBh" },
  { label: "Referred To Investigation - TB", value: "w1NmNPyWryQ" },
  { label: "Referred To Investigation - LTBI", value: "r1uvBMgpmyC" },
  { label: "LTBI Treatment Initiated", value: "rLtY68TshGt" },
  { label: "TB Treatment Initiated", value: "NxBWpUz1V5L" },
  { label: "TB Treatment Not Initiated", value: "URV3cL5TycO" },
  { label: "LTBI Treatment Not Initiated", value: "T2ZC58N8hLP" },
  { label: "TB Tested", value: "HuBBY08PVLD" },
  { label: "LTBI Tested", value: "qPeGmUs2xQL" },
  { label: "TB Positive", value: "Z8OzPEghkMj" },
  { label: "LTBI Positive", value: "unTl5wSIRgH" },
];

//======================================================================================//
// Line list
// OVC
export const appProgramID = "i1yaRN8esOJ";
export const appAttributeID = "dddXq4Ddh6Z";
export const appEQ = "Index";
export const appFilter = "Index;Contact;Presumptive TB";
export const appFilterLabel = "All";
export const lineListCategories = [
  { label: "All", value: "Index;Contact;Presumptive TB" },
  { label: "Index", value: "Index" },
  { label: "Contact", value: "Contact" },
  { label: "Suspect", value: "Presumptive TB" },
];

// Line list Table Meta data

export const childTableHeader = [
  {
    Header: "UIC",
    accessor: "UIC",
  },
  {
    Header: "Name",
    accessor: "Name",
  },
  {
    Header: "Age",
    accessor: "Age",
  },
  {
    Header: "Gender",
    accessor: "Gender",
  },
  {
    Header: "Nationality",
    accessor: "Nationality ",
  },
  {
    Header: "Mobile Number",
    accessor: "Mobile Number",
  },
  {
    Header: "Client Type",
    accessor: "Client type",
  },
  {
    Header: "Contact details (Permanent)",
    accessor: "Contact details (Permanent) ",
  },
  {
    Header: "Relationship with index",
    accessor: "Relationship with index",
  },
];

//======================================================================================//

// Alerts

export const alertsThresholdVal = 5;
