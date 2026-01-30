import React, { useState } from "react";
//import { withRouter, Link,Route } from "react-router-dom";
//import { useNavigate } from 'react-router-dom';
import { setUserDetail } from "../../redux/actions/appActions";
import { connect } from "react-redux";
import Loader from "../../components/loaders/loader";
import { API, loginApi } from "../../services";
import swal from "sweetalert";

import { appName, appLogo, apppartnerundpLogo, apppartnerglobalfundLogo, apppartnerdureLogo } from "../../config/appConfig";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel'

const LoginSmartSetup = ({ onSuccess, setUserDetail }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [responseError, setResponseError] = useState("");

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        const Authorization = "Basic " + btoa(email.trim() + ":" + password.trim());
        // console.log(Authorization);

        loginApi(Authorization)
            .then((res) => {
                // console.log(res);
                // sessionStorage.setItem("userData", JSON.stringify(res.data));
                // sessionStorage.setItem("Authorization", Authorization);
                // setUserDetail({ Authorization: Authorization });
                setLoading(false);
                // onSuccess();
                window.location.href = "https://undp.imonitorplus.com/smartsetup/";
                // window.location('smartsetup')
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

    const handleUserInput = ({ target }) => {
        let { name, value } = target;
        if (name === "email") {
            setEmail(value);
            // validateField('email',value);
        } else {
            setPassword(value);
            // validateField('password',value);
        }
    };
    const validateField = (fieldName, value) => {
        let emailValid,
            passwordValid,
            fieldValidationErrors = {};
        // console.log(fieldName, value);
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

    return (
        <div className="app bgLogin">
            <Loader isLoading={loading} />
            <div className="container-fluid mainContent">
                <div className="row w-100">
                    <div className="col-lg-8 col-md-6 loginleftsection">
                        <div className="row w-100">
                            <div className="col-lg-5 col-md-6">
                                <div className="loginimagebackground">
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-6 logincenter">
                                <div>
                                    <p class="logappname text-left">Migrant Care</p>
                                    {/* <p>The Islamic Republic of Afghanistan (Afghanistan) has one of the highest numbers of refugees,
returnees, and internally displaced people (IDPs) in the region of the Middle East. Afghanistan
faces a variety of political, security, economic, social, and human development challenges
among which the HIV/AIDS, Tuberculosis, and Malaria epidemic pose an emerging threat.</p>
            <p> The
UNDP and the Global Fund have come together to lead a multi-country approach to fight these
epidemics through supporting national governments and other partners including UNHCR, and
IOM through a multi-country grant, which aims to provide TB prevention, care, and treatment
services for migrants, refugees and returnees in Afghanistan, Iran and Pakistan.</p>
<p>Under this multi-country grant project, UNDP is seeking to develop an innovative digital tool that
aims to improve data transfer, and referral of TB patients across the borders of the three
countries to enhance the continuum of prevention and treatment services.</p> */}
                                </div>
                            </div>
                        </div>





                    </div>
                    <div className="col-lg-4 col-md-6 bg-greycolor logincenter">
                        {/*<p className="logapplogo"><img src={appLogo} className="" alt="logo" /></p>*/}
                        {/*<p className="logappname">Migration TB Network Platform</p>*/}
                        <div className="loginContainer w-100">
                            <div className="card loginCard">
                                {/*<div className="card-header">
                  <span>Login Form</span>
                </div>*/}
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="color-white">Username</label>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="far fa-user-circle"></i>
                                                </span>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className={`form-control  ${errorClass(emailError)}`}
                                                    onChange={handleUserInput}
                                                    value={email}
                                                    name="email"
                                                    placeholder="Enter your username"
                                                />
                                                <em className="error invalid-feedback">{emailError}</em>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="color-white">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fas fa-fingerprint"></i>
                                                </span>
                                                <input
                                                    autoComplete="off"
                                                    type="password"
                                                    className={`form-control  ${errorClass(
                                                        passwordError
                                                    )}`}
                                                    onChange={handleUserInput}
                                                    value={password}
                                                    name="password"
                                                    placeholder="Enter your password"
                                                />
                                                <em className="error invalid-feedback">
                                                    {passwordError}
                                                </em>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            // disabled={!formValid}
                                            className="btn btn-default loginBtn "
                                        >
                                            Log me in
                    </button>
                                    </form>
                                    <div className="color-white tx-12 registerMargin">
                                        Don't have an account? Create an Account
                  </div>
                                </div>

                            </div>
                            {/*<Row className="partnerlogoholder">
    <Col xs={2}> <p className="logpartneriom"></p></Col>
    <Col xs={2}> <p className="logpartnerindiairan"></p></Col>
    <Col xs={2}> <p className="logpartnermohp"></p></Col>
    <Col xs={2}> <p className="logpartnermopha"></p></Col>
    <Col xs={2}> <p className="logpartnerundp"></p></Col>
    <Col xs={2}> <p className="logpartnerunhcr"></p></Col>
  </Row>*/}
                            <Carousel>
                                <Carousel.Item>
                                    <Row className="partnerlogoholder">
                                        <Col xs={6}> <p className="logpartneriom"></p></Col>
                                        <Col xs={6}> <p className="logpartnerindiairan"></p></Col>

                                    </Row>

                                </Carousel.Item>
                                <Carousel.Item>
                                    <Row className="partnerlogoholder">

                                        <Col xs={6}> <p className="logpartnermohp"></p></Col>
                                        <Col xs={6}> <p className="logpartnermopha"></p></Col>

                                    </Row>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Row className="partnerlogoholder">

                                        <Col xs={6}> <p className="logpartnerundp"></p></Col>
                                        <Col xs={6}> <p className="logpartnerunhcr"></p></Col>
                                    </Row>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </div>
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

export default connect(null, { setUserDetail })(LoginSmartSetup);
// export default withRouter(Login);
