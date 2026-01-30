import ActivateAccount from "../pages/ActivateAccount/ActivateAccount";
import SetupPassword from "../pages/ActivateAccount/SetupPassword";
import Login from "../pages/Login/Login";
import LoginSmartSetup from "../pages/LoginSmartSetup/LoginSmartSetup";
//import Home from "../pages/Home/Home";

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
const routes = [
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/loginSmartSetup",
    element: LoginSmartSetup,
  },
  {
    path: "/activateaccount",
    element: ActivateAccount,
  },
  {
    path: "/setuppassword",
    element: SetupPassword,
  },
  {
    default: "/",
    path: "/",
    element: Login,
  },
];

export default routes;
