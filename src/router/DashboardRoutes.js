import React from "react";
import Translations from "../pages/Translations/Translations";
import AppLabelTranslations from "../pages/Translations/AppLabelTranslations";
// User HomeDashCDIC for v2 and HomeNew for v3
 const HomeDash1 = React.lazy(() => import("../pages/HomeDashCDIC/Home"));
//const HomeDash1 = React.lazy(() => import("../pages/HomeNew/Home"));
const Pathway = React.lazy(() => import("../pages/Pathway/Pathway"));
const Linelist = React.lazy(() => import("../pages/Linelist/Linelist"));
const Qrcode = React.lazy(() => import("../pages/QRcode/Qrcode"));
const AdherenceCalendar = React.lazy(() => import("../pages/AdherenceCalendar/AdherenceCalendar"));
const Alerts = React.lazy(() => import("../pages/Alerts/Alerts"));
const Upload = React.lazy(() => import("../pages/Upload/Upload"));
const UploadLogs = React.lazy(() => import("../pages/UploadLogs/UploadLogs"));

const UserManagement = React.lazy(() => import("../pages/UserManagement/UserManagement"));
const FacilityManagement = React.lazy(() => import("../pages/FacilityManagement/FacilityManagement"));
const DataManagement = React.lazy(() => import("../pages/DataManagement/DataManagement"));
const DataExport = React.lazy(() => import("../pages/DataExport/DataExport"));

const VariableDownload = React.lazy(() => import("../pages/VariableDownload/VariableDownload"));

const AuditTrailManagement = React.lazy(() => import("../pages/AuditTrailManagement/AuditTrailManagement"))

const routes = [
  {
    path: "/home",
    component: HomeDash1,
  },
  {
    path: "/dashboard",
    component: HomeDash1,
  },
  {
    path: "/linelist",
    component: Linelist,
  },
  {
    path: "/qrcode",
    component: Qrcode,
  },
  {
    path: "/alerts",
    component: Alerts,
  },
  {
    path: "/pathway",
    component: Pathway,
  },
  {
    path: "/adherencecalendar",
    component: AdherenceCalendar,
  },
  {
    path: "/upload",
    component: Upload,
  },
  {
    path: "/usermanagement",
    component: UserManagement,
  },
  {
    path: "/facilitymanagement",
    component: FacilityManagement,
  },
  {
    path: "/datamanagement",
    component: DataManagement,
  },
  {
    path: "/dataexport",
    component: DataExport,
  },
  {
    path: "/translations",
    component: Translations,
  },
  {
    path: "/applabels",
    component: AppLabelTranslations,
  },
  {
    path:"/uploadlogs",
    component:UploadLogs
  },
  {
    path:"/variabledownload",
    component:VariableDownload
  },
  {
    path: "/audittrailmanagement",
    component: AuditTrailManagement,
  },
  {
    default: "/",
    path: "/",
    component: DataManagement,
  }
];

export default routes;
