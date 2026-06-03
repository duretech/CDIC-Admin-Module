// Dashboard Application Configuration

//======================================================================================//
// Application Basic Info
import OVCLogo from "../assets/images/undp-tpt.png"; // OVC Logo

// OVC
export const appLogo = OVCLogo;
export const appName = "OVC - Côte d'Ivoire";

//======================================================================================//
// Application API URLs
// OVC
export const appBaseUrl = "https://devovc.imonitorplus.com/";
export const appApiUrl = "https://devovc.imonitorplus.com/service/api/";

//======================================================================================//
// Application Default Organisation ID
// OVC
export const appDefaultOrg = [
  { id: "oHHlhg1pMzN", displayName: "Ivory Coast" },
];

//======================================================================================//
// Dashboard IDs
// OVC
export const appDashboardID = "wx6iNKQKDaf";

//======================================================================================//
// Map Config
export const mapDefaultCenter = [5.350649, -4.009412];
export const mapDefaultZoom = 8;
export const mapIndicatorsList = [
  { label: "Index registered", value: "d5FaORFvA7w" },
];
//======================================================================================//

// Line list
// OVC
export const appProgramID = "yLZGD4NV7wH";
export const appAttributeID = "dQVANzBeXVP";
export const appEQ = "Household";
export const appFilter = "Household;Individual";
export const appFilterLabel = "All";
export const lineListCategories = [
  { label: "All", value: "Household;Individual" },
  { label: "Household", value: "Household" },
  { label: "Individual", value: "Individual" },
];

// Line list Table Meta data
export const parentTableHeader = [
  "Instance",
  "Name of the structure",
  "Date of registration",
  "Household identifier",
  "PFC",
  "CS",
  "Region",
  "Department",
  "Sub/Prefecture",
  "Village/Commune",
  "Quarter",
  "Size of household",
  "Number of persons active in the household",
  "Housing situation",
  "Religions practiced by the head of the household",
  "Estimated monthly household revenue (in F CFA)",
  "Classification of the household",
];

export const childTableHeader = [
  {
    Header: "Order Number",
    accessor: "Order number",
  },
  {
    Header: "Date of entry into the household",
    accessor: "Date of entry into the household",
  },
  {
    Header: "First Name",
    accessor: "First name",
  },
  {
    Header: "Last Name",
    accessor: "Last name",
  },
  {
    Header: "Beneficiary Type",
    accessor: "Beneficiary Type",
  },
  {
    Header: "Sex",
    accessor: "Sex",
  },
  {
    Header: "Date of Birth",
    accessor: "Date of birth",
  },
  {
    Header: "Relationship with head of the household",
    accessor: "Relationship with head of the household",
  },
  {
    Header: "Level of Education",
    accessor: "Level of education",
  },
  {
    Header: "Vulnerability",
    accessor: "Vulnerability",
  },
  {
    Header: "Serological Status",
    accessor: "Serological status",
  },
  {
    Header: "Persons informed of serological status",
    accessor: "Persons informed of serological status",
  },
  {
    Header: "TARV Monitoring",
    accessor: "TARV monitoring",
  },
];

//======================================================================================//

// Alerts

export const alertsThresholdVal = 5;
