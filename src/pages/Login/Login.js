import React, { useState , useEffect} from "react";
//import { withRouter, Link,Route } from "react-router-dom";
//import { useNavigate } from 'react-router-dom';
import { setUserDetail } from "../../redux/actions/appActions";
import Loader from "../../components/loaders/loader";
import { loginApi } from "../../services";
import { apiUrl } from "../../services/urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom"; // For navigation

import { useDispatch } from "react-redux";

import axios from "axios";

const Login = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPasswordFlag, setShowPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [responseError, setResponseError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get("activateaccount"); // Get the entire query string
    console.log(queryParam,"queryParam")
    if (queryParam == "1") {
      // const newUrl = `${window.location.pathname}activateaccount`;
      navigate("/activateaccount?email="+searchParams.get('email'))
      // window.location.replace(newUrl); // Redirect to the new URL
    }
  }, []);


  const handleSubmit = (e) => {
    // setLoading(true);
    e.preventDefault();

    const Authorization = "Basic " + btoa(email.trim() + ":" + password.trim());

    loginApi(Authorization)
      .then((res) => {
        console.log(res)
        if(res.data.userRoles[0].name != "APPADMIN" && res.data.userRoles[0].name != "Superuser"){
          swal({
            title: "Access Denied",
            //text: error.response.data.message,
            text: "You do not have the required access.",
            icon: "error",
            button: "Close",
          });
          return
        }
        let instance = axios.create();
        instance.defaults.headers.common["Authorization"] = Authorization;
        instance
          .get(apiUrl + "organisationUnits/" + res.data.organisationUnits[0].id)
          .then((orgres) => {
            if (orgres && orgres.data && orgres.data.path) {
              let orgheirarchypath = orgres.data.path;
              let orgunit = orgheirarchypath.split("/")[2];
              // https://tpttest.imonitorplus.com/service/api/37/dataStore/translations/vsHsKkQBDU5
              instance
                .get(apiUrl + "dataStore/translations/" + orgunit)
                .then((ress) => {
                  console.log(ress.data);
                  if (ress.data["TB"]) {
                    res.data["programuid"] = ress.data["TB"].programuid;
                    res.data["appname"] = ress.data["TB"].appname;
                    res.data["selectedlanguage"] = ress.data["TB"].selectedlanguage;
                  } else {
                    res.data["programuid"] = ress.data.programuid;
                    res.data["appname"] = ress.data.appname;
                    res.data["selectedlanguage"] = ress.data.selectedlanguage;
                    res.data["mfaFlag"] = ress.data.mfaFlag
                  }
                  res.data["orguid"] = res.data.organisationUnits[0].id;
                  res.data["orgname"] = orgres.data.name;
                  sessionStorage.setItem("userData", JSON.stringify(res.data));
                  sessionStorage.setItem("Authorization", Authorization);
                  dispatch(setUserDetail(res.data));
                  setLoading(false);
                  onSuccess();
                });
            }
          });
      })
      .catch((error) => {
        if (error.response) {
          swal({
            title: "Login Failed",
            //text: error.response.data.message,
            text: "Please check the credentials.",
            icon: "error",
            button: "Close",
          });
        } else {
          swal({
            title: "Login Failed",
            text: "Please check the credentials.",
            icon: "error",
            button: "Close",
          });
        }
        setLoading(false);
      });
  };

  const handleLogout = () => {
    //console.log(":inside logout");
    sessionStorage.removeItem("Authorization");
    //window.location.reload();
    // this.props.history.push("/Home");
  };

  function showPassword() {
    if (showPasswordFlag) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  const resetCreds = () => {
    setEmail("");
    setPassword("");
  }

  const handleUserInput = ({ target }) => {
    let { name, value } = target;
    if (name === "email") {
      setEmail(value);
      // validateField('email',value);
    } else {
      setPassword(value);
      validateField('password',value);
    }
  };
  const validateField = (fieldName, value) => {
    let emailValid,
      passwordValid,
      fieldValidationErrors = {};
    console.log(fieldName, value);
    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
        setEmailError(fieldValidationErrors.email);
        setIsEmailValid(emailValid);
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Password is too short, atleast 6 character";
        setPasswordError(fieldValidationErrors.password);
        setIsPasswordValid(passwordValid);
        break;
      default:
        break;
    }
  };
  const errorClass = (error) => {
    return !error ? "" : "is-invalid";
  };

  const errorResp = responseError ? (
    <div
      className="alert alert-danger"
      dangerouslySetInnerHTML={{ __html: responseError }}
    ></div>
  ) : (
    ""
  );

  const [defaultChecked, setDefaultChecked] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);
  const handleDefaultLogin = (e) => {
    if (e.target.checked) {
      setDefaultChecked(true);
      setAdminChecked(false);
      setEmail();
      setPassword();
    } else {
      setEmail("");
      setPassword("");
      setDefaultChecked(false);
    }
  };
  const handleAdminDefaultLogin = (e) =>{
    if (e.target.checked) {
      setAdminChecked(true);
      setDefaultChecked(false)
      setEmail("");
      setPassword("");
    } else {
      setEmail("");
      setPassword("");
      setAdminChecked(false);
    }
  }
  return (
    <div className="app bgLogin">
      <Loader isLoading={loading} />
      <div className="container-fluid mainContent">
        <div className="row w-100">
          <div className="col-lg-3"></div>
          <div className="col-lg-6 bg-greycolor logincenter">
            <div className="loginContainer w-100">
              <div className="row">
                <div className="col-lg-4 sideImage">
                  <div className="sideimagelogo">
                    <div className="logohome">
                      <img
                        src={require("../../assets/images/cdic-logo.png")}
                        alt="gallary"
                        style={{ width: "100%" }}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card loginCard">
                    <div className="card-body">
                      <div className="text-center mb-4">
                        <h4 className="login-head">Login</h4>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label className="color-white mb-0">User Name</label>
                          <div className="input-group">
                            {/* <span className="input-group-addon">
                              <i className="far fa-user-circle"></i>
                            </span> */}
                            <input
                              autoComplete="off"
                              type="text"
                              className={`form-control  ${errorClass(
                                emailError
                              )}`}
                              onChange={handleUserInput}
                              value={email}
                              name="email"
                              placeholder="Enter your username"
                            />
                            <em className="error invalid-feedback">
                              {emailError}
                            </em>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="color-white mb-0">Password</label>
                          <div className="input-group">
                            <input
                              autoComplete="off"
                              type={showPasswordFlag ? "text" : "password"} // Toggle input type
                              className={`form-control  ${errorClass(passwordError)}`}
                              onChange={handleUserInput}
                              value={password}
                              name="password"
                              placeholder="Enter your password"
                            />
                           
                            <span 
                              className="input-group-text visibility-icon-container" 
                              onClick={() => showPassword()}
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon icon={showPasswordFlag ? faEye : faEyeSlash} />
                            </span>
                          </div>
                           <div className="error-feedback">{passwordError}</div>
                        </div>

                        <button
                          type="submit"
                          // disabled={!formValid}
                          className="btn btn-default loginBtn "
                        >
                          Login
                        </button>
                        <button
                          type="reset"
                          onClick={resetCreds}
                          className={password || email ? "btn mt-2 btn-default loginBtn" : "btn mt-2 btn-default loginBtn disabled"}
                        >
                          Reset
                        </button>
                      
                      </form>
                      <div className="color-white tx-12 registerMargin">
                        {/* Don't have an account? Create an Account */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>

      {/*<footer className="footer">
        <p>Powered By</p>
        <img
          src={require("../../assets/images/durelogowhite.png")}
          alt="gallary"
          className="ml-2"
        />
      </footer>*/}
    </div>
  );
};

export default Login;
// export default withRouter(Login);
