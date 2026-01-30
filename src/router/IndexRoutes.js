import React from 'react';
const Layout = React.lazy(() => import('../pages/Layout/Layout'));

var indexRoutes = [
  { path: "/cdicdashboardv2", name: "Layout", component: Layout },
];

export default indexRoutes;
