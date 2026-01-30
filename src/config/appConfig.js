// Dashboard Application Configuration

//======================================================================================//
// Application Basic Info
import undpLogo from "../assets/images/cdic-logo.png"; // Tajik Logo

import undppartnerLogo from "../assets/images/undp.png"; // UNDP Partner Logo
import globalfundpartnerLogo from "../assets/images/globalfundlogo.png"; // GlobalFund Partner Logo
import durepartnerLogo from "../assets/images/durelogo.png"; // UNDP Partner Logo


export const appLogo = undpLogo;

export const appName = "TPT";

export const apppartnerundpLogo = undppartnerLogo;
export const apppartnerglobalfundLogo = globalfundpartnerLogo;
export const apppartnerdureLogo = durepartnerLogo;

//======================================================================================//
// Application API URLs

// live
export const appBaseUrl = "https://YOUR_SERVER_URL/";
export const appApiUrl = "https://YOUR_SERVER_URL/service/api/";
export const app_locale = "";// Mention your locale e.g. "ETHIOPIA" or else it should be blank "";
export const adminAccountEmail = "YOUR_ADMIN_ACCOUNT_EMAIL";
export const adminAccountPassword = "YOUR_ADMIN_ACCOUNT_PASSWORD";



export const appDefaultOrg = [
  // { id: "I9jfaLculAp;l9eB9W7EOPo;ZyweqRVeQFD", displayName: "World" },
  { id: "mqpu9Wy05Nk", displayName: "Zimbabwe" },
  // { id: "l9eB9W7EOPo", displayName: "Iran" },
  // { id: "ZyweqRVeQFD", displayName: "Pakistan" },
];

//======================================================================================//
// Dashboard IDs
// Tajik
// export const appDashboardID = "I6io1yQFINy";
// dashboardID for CDIC 
export const appDashboardID = "ZWdQ6HmfVMG";

//======================================================================================//
// Map Config
export const mapDefaultCenter = [20.5937, 78.9629];
export const mapDefaultZoom = 6;
export const mapIndicatorsList = [
  { label: "Total registered", value: "chyBcCBkpJq" },
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

// Hardcoaded Indicator List
export const metaIndicatorsList = [
  { label: "Total registered", value: "bBvHHWrO1gM" },
  { label: "Total screened", value: "eq3VypiS896" },
  { label: "TB positive", value: "vqbtkGG8DI9" },
  { label: "LTBI positive", value: "xrUNR85WRBh" },
  { label: "Transferred in ", value: "xrUNR85WRBh" },
  { label: "Transferred out ", value: "xrUNR85WRBh" },
  { label: "Death", value: "xrUNR85WRBh" },
  { label: "Recovered", value: "xrUNR85WRBh" },
];
// Country List
export const countryList = [
  { label: "Afghanistan", value: "Afghanistan" },
  { label: "Iran", value: "Iran" },
  { label: "Pakistan", value: "Pakistan" },
];
// Country List
export const migrantFilter = [
  // { label: "Type of migrant", value: "Type Of Migrant" },
  { label: "Gender", value: "Gender" },
  // { label: "Import vs Indegenous", value: "Import vs Indegenous" },
  { label: "Country", value: "Country" },
];
//======================================================================================//
// Line list
// OVC
export const appProgramID = "eAHvg6zuxvK";
export const appAttributeID = "dddXq4Ddh6Z";
export const appEQ = "Index";
export const appFilter = "Index;Contact;Presumptive TB";
export const appFilterLabel = "All";
export const lineListCategories = [
  { label: "All", value: "Index;Contact;Presumptive TB" },
  { label: "Index", value: "Index" },
  { label: "Contact", value: "Contact" },
  { label: "Presumptive TB", value: "Presumptive TB" },
  { label: "Transfer In", value: "Pou4egMv0pp" },
  { label: "Transfer Out", value: "DUfi9lGlqky" },
];

// Line list Table Meta data

export const childTableHeader = [{
  "Header": "UIC",
  "accessor": "UIC",
},
{
  "Header": "Age",
  "accessor": "Age"
},
{
  "Header": "Gender",
  "accessor": "Gender"
},
{
  "Header": "First name",
  "accessor": "First Name"
},
{
  "Header": "Client type",
  "accessor": "Client Type"
},
{
  "Header": "Phone number (permanent)",
  "accessor": "Phone number (permanent)"
},
{
  "Header": "Presently on anti-TB medication?",
  "accessor": "Presently on anti-TB medication?"
}]

//======================================================================================//

// Alerts

export const alertsThresholdVal = 5;

//======================================================================================//
// Circle Marker Data

export const circleMarkerDataAll = [
  { name: "Abdul", latlon: [34.500387, 69.039341] },
  { name: "Salim", latlon: [34.455105, 69.162251] },
  { name: "Rahim", latlon: [34.53603, 69.254948] },
  { name: "Kalam", latlon: [34.549549, 69.174042] },
  { name: "Salman", latlon: [34.568776, 69.101257] },
  { name: "Abdul", latlon: [34.55491789958487, 69.24699772669119] },
  { name: "Salim", latlon: [34.55491789958487, 69.24755562619522] },
  { name: "Rahim", latlon: [34.55502393254761, 69.24745906666567] },
  { name: "Kalam", latlon: [34.55484721086797, 69.24693335367151] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Hamid", latlon: [31.868439, 67.66291] },
  { name: "Shardul", latlon: [31.494473, 66.959785] },
  { name: "Shardul", latlon: [33.422479, 69.948066] },
  { name: "Shardul", latlon: [34.298273, 70.299629] },
  { name: "Shardul", latlon: [33.156156, 69.168037] },
  { name: "Shardul", latlon: [29.907545, 64.10334] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Shardul", latlon: [31.606821, 67.794746] },
  { name: "Shardul", latlon: [31.456994, 67.267402] },
  { name: "Shardul", latlon: [30.097828, 65.421699] },
  { name: "Shardul", latlon: [29.907545, 64.10334] },
  { name: "Shardul", latlon: [29.755056, 63.35627] },
  { name: "Shardul", latlon: [29.7932, 62.125801] },
  { name: "Shardul", latlon: [33.788485, 68.937324] },
  { name: "Shardul", latlon: [36.412641, 71.178535] },
  { name: "Shardul", latlon: [34.298273, 68.497871] },
  { name: "Shardul", latlon: [35.844736, 70.255684] },
  { name: "Shardul", latlon: [30.36361, 63.400215] },
  { name: "Shardul", latlon: [30.439416, 65.773262] },
  { name: "Shardul", latlon: [31.4195, 66.740059] },
  { name: "Shardul", latlon: [31.456994, 67.069649] },
  { name: "Shardul", latlon: [32.129316, 68.014473] },
  { name: "Shardul", latlon: [32.667334, 67.816719] },
  { name: "Shardul", latlon: [32.772785, 69.206841] },
  { name: "Shardul", latlon: [32.477119, 69.132934] },
  { name: "Shardul", latlon: [31.898555, 69.040551] },
  { name: "Shardul", latlon: [31.882868, 68.375389] },
  { name: "Shardul", latlon: [31.024907, 66.102852] },
  { name: "Shardul", latlon: [30.855292, 65.366768] },
  { name: "Shardul", latlon: [31.737722, 66.542305] },
  { name: "Shardul", latlon: [31.336181, 65.79597] },
  { name: "Shardul", latlon: [30.515163, 62.609199] },
  { name: "Shardul", latlon: [34.804987, 70.123848] },
  { name: "Shardul", latlon: [36.058182, 69.81623] },
  { name: "Shardul", latlon: [32.965837, 69.44273] },
  { name: "Shardul", latlon: [34.696665, 67.618965] },
  { name: "Paktika", latlon: [32.42655, 68.761543] },
  { name: "Paktika", latlon: [31.905752, 68.849434] },
  { name: "Paktika", latlon: [32.092093, 68.146309] },
  { name: "Zabul", latlon: [32.203715, 67.355293] },
  { name: "Zabul", latlon: [32.389449, 67.794746] },
  { name: "Zabul", latlon: [32.129316, 67.618965] },
  { name: "Kandahar", latlon: [31.494473, 66.959785] },
  { name: "Kandahar", latlon: [32.054855, 66.080879] },
  { name: "Kandahar", latlon: [31.353782, 65.71259] },
  { name: "Khost", latlon: [33.422479, 69.948066] },
  { name: "Khost", latlon: [33.332217, 70.10672] },
  { name: "Khost", latlon: [33.258754, 69.821075] },
  { name: "Nangarhar", latlon: [34.298273, 70.299629] },
  { name: "Nangarhar", latlon: [34.240837, 70.549633] },
  { name: "Nangarhar", latlon: [34.230548, 70.277443] },
  { name: "Sar Hawza", latlon: [33.156156, 69.168037] },
  { name: "Reg", latlon: [30.097828, 65.421699] },
  { name: "Reg", latlon: [30.270552, 64.708154] },
  { name: "Reg", latlon: [30.130258, 64.985231] },
  { name: "Garmser", latlon: [29.907545, 64.10334] },
  { name: "Garmser", latlon: [30.510636, 64.495846] },
  { name: "Garmser", latlon: [30.287721, 64.356004] },
  { name: "Dishu", latlon: [29.755056, 63.35627] },
  { name: "Dishu", latlon: [29.911348, 62.86445] },
  { name: "Dishu", latlon: [29.749608, 63.330561] },
  { name: "Helmand", latlon: [30.054713, 63.431053] },
  { name: "Helmand", latlon: [29.828288, 63.953653] },
  { name: "Helmand", latlon: [30.190321, 63.431053] },
  { name: "Chahar Burjak", latlon: [30.145139, 62.124551] },
  { name: "Chahar Burjak", latlon: [29.7932, 62.125801] },
  { name: "Chahar Burjak", latlon: [30.00947, 61.39291] },
  { name: "Logar", latlon: [34.010354, 69.430032] },
  { name: "Logar", latlon: [33.788485, 68.937324] },
  { name: "Kuran Wa Munjan", latlon: [35.86517, 71.090562] },
  { name: "Kuran Wa Munjan", latlon: [35.544004, 70.870836] },
  { name: "Mandol", latlon: [35.509835, 70.567405] },
  { name: "Nuristan", latlon: [35.53991, 70.955417] },
  { name: "Nuristan", latlon: [35.449651, 70.844556] },
  { name: "Nuristan", latlon: [35.528835, 71.110068] },
  { name: "Mandol", latlon: [35.509835, 70.511975] },
  { name: "Lal Pur", latlon: [34.350765, 71.057808] },
  { name: "Nangarhar", latlon: [34.523171, 70.691987] },
  { name: "Qarghayi", latlon: [34.566216, 70.469882] },
  { name: "Nangarhar", latlon: [34.512406, 70.874897] },
  { name: "Khost", latlon: [33.559669, 70.038736] },
  { name: "Khost", latlon: [33.407113, 70.077931] },
  { name: "Khost", latlon: [33.221507, 69.986476] },
  { name: "Khost", latlon: [33.396206, 70.208582] },
  { name: "Urgun", latlon: [32.969764, 69.29403] },
  { name: "Gayan", latlon: [32.991683, 69.463875] },
  { name: "Barmal", latlon: [32.574288, 69.202575] },
  { name: "Barmal", latlon: [32.662323, 69.254835] },
  { name: "Gomal", latlon: [32.188118, 69.21564] },
  { name: "Gomal", latlon: [32.397958, 69.202575] },
  { name: "Gomal", latlon: [32.177061, 69.228705] },
  { name: "Wor Mamay", latlon: [32.057601, 68.783434] },
  { name: "Wor Mamay", latlon: [32.020349, 68.871324] },
  { name: "Wazakhwa District", latlon: [31.964443, 68.278062] },
  { name: "Wazakhwa District", latlon: [32.141362, 68.278062] },
  { name: "Shamulzayi", latlon: [31.927153, 67.959459] },
  { name: "Shamulzayi", latlon: [31.759162, 67.948473] },
  { name: "Shamulzayi", latlon: [31.983082, 67.970445] },
  { name: "Shamulzayi", latlon: [31.65635, 67.706773] },
  { name: "Atghar", latlon: [31.469129, 67.552965] },
  { name: "Maruf", latlon: [31.365997, 67.585924] },
  { name: "Maruf", latlon: [31.384756, 67.739732] },
  { name: "Maruf", latlon: [31.328466, 67.432115] },
  { name: "Maruf", latlon: [31.347233, 67.146471] },
  { name: "Arghistan", latlon: [31.375377, 66.827867] },
  { name: "Arghistan", latlon: [31.328466, 66.652086] },
  { name: "Arghistan", latlon: [31.328466, 66.498277] },
  { name: "Spin Boldak", latlon: [31.102968, 66.355455] },
  { name: "Spin Boldak", latlon: [30.97118, 66.31151] },
  { name: "Spin Boldak", latlon: [30.810906, 66.212633] },
  { name: "Spin Boldak", latlon: [30.650365, 66.168687] },
  { name: "Shorabak", latlon: [30.442209, 66.036852] },
  { name: "Shorabak", latlon: [30.233608, 65.992906] },
  { name: "Shorabak", latlon: [30.005537, 66.168687] },
  { name: "Reg", latlon: [29.853198, 64.872301] },
  { name: "Reg", latlon: [29.853198, 65.377672] },
  { name: "Reg", latlon: [30.347446, 65.135973] },
  { name: "Razavi Khorasan Province", latlon: [34.967972, 60.899106] },
  { name: "Razavi Khorasan Province", latlon: [35.395108, 61.003626] },
  { name: "Razavi Khorasan Province", latlon: [35.010787, 61.029756] },
  { name: "Ghayenat", latlon: [33.738397, 60.298115] },
  { name: "Ghayenat", latlon: [33.850027, 60.414167] },
  { name: "Ghayenat", latlon: [33.697985, 60.453362] },
  { name: "Darmiyan", latlon: [33.010471, 60.492557] },
  { name: "Darmiyan", latlon: [32.856955, 60.544817] },
  { name: "Darmiyan", latlon: [32.692178, 60.610142] },
  { name: "Sarbishe", latlon: [32.472001, 60.649337] },
  { name: "Sarbishe", latlon: [32.306514, 60.740792] },
  { name: "Sarbishe", latlon: [32.140724, 60.779987] },
  { name: "Nehbandan", latlon: [31.563653, 60.675467] },
  { name: "Nehbandan", latlon: [31.429972, 60.819182] },
  { name: "Nehbandan", latlon: [31.407673, 60.662402] },
  { name: "Zabol", latlon: [31.353358, 61.081972] },
  { name: "Zabol", latlon: [31.326477, 61.289827] },
  { name: "Zabol", latlon: [31.170102, 61.603387] },
  { name: "Zabol", latlon: [30.676958, 61.080787] },
  { name: "Shahabaz", latlon: [33.468108, 70.576172] },
  { name: "Samad", latlon: [32.731841, 69.829102] },
  { name: "Yousuf", latlon: [30.675715, 66.884766] },
];

export const circleMarkerDataAFG = [
  { name: "Abdul", latlon: [34.500387, 69.039341] },
  { name: "Salim", latlon: [34.455105, 69.162251] },
  { name: "Rahim", latlon: [34.53603, 69.254948] },
  { name: "Kalam", latlon: [34.549549, 69.174042] },
  { name: "Salman", latlon: [34.568776, 69.101257] },
  { name: "Abdul", latlon: [34.55491789958487, 69.24699772669119] },
  { name: "Salim", latlon: [34.55491789958487, 69.24755562619522] },
  { name: "Rahim", latlon: [34.55502393254761, 69.24745906666567] },
  { name: "Kalam", latlon: [34.55484721086797, 69.24693335367151] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Hamid", latlon: [31.868439, 67.66291] },
  { name: "Shardul", latlon: [31.494473, 66.959785] },
  { name: "Shardul", latlon: [33.422479, 69.948066] },
  { name: "Shardul", latlon: [34.298273, 70.299629] },
  { name: "Shardul", latlon: [33.156156, 69.168037] },
  { name: "Shardul", latlon: [29.907545, 64.10334] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Shardul", latlon: [32.092093, 69.06916] },
  { name: "Shardul", latlon: [31.606821, 67.794746] },
  { name: "Shardul", latlon: [31.456994, 67.267402] },
  { name: "Shardul", latlon: [30.097828, 65.421699] },
  { name: "Shardul", latlon: [29.907545, 64.10334] },
  { name: "Shardul", latlon: [29.755056, 63.35627] },
  { name: "Shardul", latlon: [29.7932, 62.125801] },
  { name: "Shardul", latlon: [33.788485, 68.937324] },
  { name: "Shardul", latlon: [36.412641, 71.178535] },
  { name: "Shardul", latlon: [34.298273, 68.497871] },
  { name: "Shardul", latlon: [35.844736, 70.255684] },
  { name: "Shardul", latlon: [30.36361, 63.400215] },
  { name: "Shardul", latlon: [30.439416, 65.773262] },
  { name: "Shardul", latlon: [31.4195, 66.740059] },
  { name: "Shardul", latlon: [31.456994, 67.069649] },
  { name: "Shardul", latlon: [32.129316, 68.014473] },
  { name: "Shardul", latlon: [32.667334, 67.816719] },
  { name: "Shardul", latlon: [32.772785, 69.206841] },
  { name: "Shardul", latlon: [32.477119, 69.132934] },
  { name: "Shardul", latlon: [31.898555, 69.040551] },
  { name: "Shardul", latlon: [31.882868, 68.375389] },
  { name: "Shardul", latlon: [31.024907, 66.102852] },
  { name: "Shardul", latlon: [30.855292, 65.366768] },
  { name: "Shardul", latlon: [31.737722, 66.542305] },
  { name: "Shardul", latlon: [31.336181, 65.79597] },
  { name: "Shardul", latlon: [30.515163, 62.609199] },
  { name: "Shardul", latlon: [34.804987, 70.123848] },
  { name: "Shardul", latlon: [36.058182, 69.81623] },
  { name: "Shardul", latlon: [32.965837, 69.44273] },
  { name: "Shardul", latlon: [34.696665, 67.618965] },
  { name: "Paktika", latlon: [32.42655, 68.761543] },
  { name: "Paktika", latlon: [31.905752, 68.849434] },
  { name: "Paktika", latlon: [32.092093, 68.146309] },
  { name: "Zabul", latlon: [32.203715, 67.355293] },
  { name: "Zabul", latlon: [32.389449, 67.794746] },
  { name: "Zabul", latlon: [32.129316, 67.618965] },
  { name: "Kandahar", latlon: [31.494473, 66.959785] },
  { name: "Kandahar", latlon: [32.054855, 66.080879] },
  { name: "Kandahar", latlon: [31.353782, 65.71259] },
  { name: "Khost", latlon: [33.422479, 69.948066] },
  { name: "Khost", latlon: [33.332217, 70.10672] },
  { name: "Khost", latlon: [33.258754, 69.821075] },
  { name: "Nangarhar", latlon: [34.298273, 70.299629] },
  { name: "Nangarhar", latlon: [34.240837, 70.549633] },
  { name: "Nangarhar", latlon: [34.230548, 70.277443] },
  { name: "Sar Hawza", latlon: [33.156156, 69.168037] },
  { name: "Reg", latlon: [30.097828, 65.421699] },
  { name: "Reg", latlon: [30.270552, 64.708154] },
  { name: "Reg", latlon: [30.130258, 64.985231] },
  { name: "Garmser", latlon: [29.907545, 64.10334] },
  { name: "Garmser", latlon: [30.510636, 64.495846] },
  { name: "Garmser", latlon: [30.287721, 64.356004] },
  { name: "Dishu", latlon: [29.755056, 63.35627] },
  { name: "Dishu", latlon: [29.911348, 62.86445] },
  { name: "Dishu", latlon: [29.749608, 63.330561] },
  { name: "Helmand", latlon: [30.054713, 63.431053] },
  { name: "Helmand", latlon: [29.828288, 63.953653] },
  { name: "Helmand", latlon: [30.190321, 63.431053] },
  { name: "Chahar Burjak", latlon: [30.145139, 62.124551] },
  { name: "Chahar Burjak", latlon: [29.7932, 62.125801] },
  { name: "Chahar Burjak", latlon: [30.00947, 61.39291] },
  { name: "Logar", latlon: [34.010354, 69.430032] },
  { name: "Logar", latlon: [33.788485, 68.937324] },
  { name: "Kuran Wa Munjan", latlon: [35.86517, 71.090562] },
  { name: "Kuran Wa Munjan", latlon: [35.544004, 70.870836] },
  { name: "Mandol", latlon: [35.509835, 70.567405] },
  { name: "Nuristan", latlon: [35.53991, 70.955417] },
  { name: "Nuristan", latlon: [35.449651, 70.844556] },
  { name: "Nuristan", latlon: [35.528835, 71.110068] },
  { name: "Mandol", latlon: [35.509835, 70.511975] },
  { name: "Lal Pur", latlon: [34.350765, 71.057808] },
  { name: "Nangarhar", latlon: [34.523171, 70.691987] },
  { name: "Qarghayi", latlon: [34.566216, 70.469882] },
  { name: "Nangarhar", latlon: [34.512406, 70.874897] },
  { name: "Khost", latlon: [33.559669, 70.038736] },
  { name: "Khost", latlon: [33.407113, 70.077931] },
  { name: "Khost", latlon: [33.221507, 69.986476] },
  { name: "Khost", latlon: [33.396206, 70.208582] },
  { name: "Urgun", latlon: [32.969764, 69.29403] },
  { name: "Gayan", latlon: [32.991683, 69.463875] },
  { name: "Barmal", latlon: [32.574288, 69.202575] },
  { name: "Barmal", latlon: [32.662323, 69.254835] },
  { name: "Gomal", latlon: [32.188118, 69.21564] },
  { name: "Gomal", latlon: [32.397958, 69.202575] },
  { name: "Gomal", latlon: [32.177061, 69.228705] },
  { name: "Wor Mamay", latlon: [32.057601, 68.783434] },
  { name: "Wor Mamay", latlon: [32.020349, 68.871324] },
  { name: "Wazakhwa District", latlon: [31.964443, 68.278062] },
  { name: "Wazakhwa District", latlon: [32.141362, 68.278062] },
  { name: "Shamulzayi", latlon: [31.927153, 67.959459] },
  { name: "Shamulzayi", latlon: [31.759162, 67.948473] },
  { name: "Shamulzayi", latlon: [31.983082, 67.970445] },
  { name: "Shamulzayi", latlon: [31.65635, 67.706773] },
  { name: "Atghar", latlon: [31.469129, 67.552965] },
  { name: "Maruf", latlon: [31.365997, 67.585924] },
  { name: "Maruf", latlon: [31.384756, 67.739732] },
  { name: "Maruf", latlon: [31.328466, 67.432115] },
  { name: "Maruf", latlon: [31.347233, 67.146471] },
  { name: "Arghistan", latlon: [31.375377, 66.827867] },
  { name: "Arghistan", latlon: [31.328466, 66.652086] },
  { name: "Arghistan", latlon: [31.328466, 66.498277] },
  { name: "Spin Boldak", latlon: [31.102968, 66.355455] },
  { name: "Spin Boldak", latlon: [30.97118, 66.31151] },
  { name: "Spin Boldak", latlon: [30.810906, 66.212633] },
  { name: "Spin Boldak", latlon: [30.650365, 66.168687] },
  { name: "Shorabak", latlon: [30.442209, 66.036852] },
  { name: "Shorabak", latlon: [30.233608, 65.992906] },
  { name: "Shorabak", latlon: [30.005537, 66.168687] },
  { name: "Reg", latlon: [29.853198, 64.872301] },
  { name: "Reg", latlon: [29.853198, 65.377672] },
  { name: "Reg", latlon: [30.347446, 65.135973] },
];

export const circleMarkerDataIRN = [
  { name: "Razavi Khorasan Province", latlon: [34.967972, 60.899106] },
  { name: "Razavi Khorasan Province", latlon: [35.395108, 61.003626] },
  { name: "Razavi Khorasan Province", latlon: [35.010787, 61.029756] },
  { name: "Ghayenat", latlon: [33.738397, 60.298115] },
  { name: "Ghayenat", latlon: [33.850027, 60.414167] },
  { name: "Ghayenat", latlon: [33.697985, 60.453362] },
  { name: "Darmiyan", latlon: [33.010471, 60.492557] },
  { name: "Darmiyan", latlon: [32.856955, 60.544817] },
  { name: "Darmiyan", latlon: [32.692178, 60.610142] },
  { name: "Sarbishe", latlon: [32.472001, 60.649337] },
  { name: "Sarbishe", latlon: [32.306514, 60.740792] },
  { name: "Sarbishe", latlon: [32.140724, 60.779987] },
  { name: "Nehbandan", latlon: [31.563653, 60.675467] },
  { name: "Nehbandan", latlon: [31.429972, 60.819182] },
  { name: "Nehbandan", latlon: [31.407673, 60.662402] },
  { name: "Zabol", latlon: [31.353358, 61.081972] },
  { name: "Zabol", latlon: [31.326477, 61.289827] },
  { name: "Zabol", latlon: [31.170102, 61.603387] },
  { name: "Zabol", latlon: [30.676958, 61.080787] },
];

export const circleMarkerDataPAK = [
  { name: "Shahabaz", latlon: [33.468108, 70.576172] },
  { name: "Samad", latlon: [32.731841, 69.829102] },
  { name: "Yousuf", latlon: [30.675715, 66.884766] },
];
