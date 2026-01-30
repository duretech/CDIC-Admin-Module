import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation
import "../../assets/css/custom.css";
import "../../assets/css/theme-blue.css";
import { apiUrl } from "../../services/urls";
import axios from "axios";
import { decryptData } from "../../AesEnc"
import swal from 'sweetalert';
import { adminAccountEmail, adminAccountPassword } from "../../config/appConfig";

function ActivateAccount() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get('email'))
    if(searchParams.get('email'))
      setEmail(searchParams.get('email'))
  }, [])
  const instance = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Authorization": "Basic " + btoa(adminAccountEmail + ":" + adminAccountPassword)
    },
  });
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showTokenField, setShowTokenField] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email onChange
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  };

  // API call to activate
  const handleActivate = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    instance.post('save/mfa/user/sendToken', {
      status: "1",
      username: email,
      userrole: "",
      userid: "",
    }).then(res => {
      if (res.data.status == "fail") {
        swal({
          title: res.data.message,
          text: 'Make sure the email id is correct.',
          icon: "error",
          button: "Ok",
        })
      }
      else {
        swal({
          title: "Token Sent!",
          text: res.data.message,
          icon: "success",
          button: "Ok",
        })
        setShowTokenField(true);
      }
    })
  };

  // API call to validate token
  const handleValidate = async () => {
    if (!token) {
      setError("Token is required.");
      return;
    }
    instance.post('save/mfa/user/validate/token', {
      username: email,
      token: token,
    }).then(res => {
      res.data = decryptData(res.data)
      console.log(res, "respons for token")
      sessionStorage.setItem("username", email);
      if (
        res &&
        res.data &&
        res.data.status &&
        res.data.status == "success"
      ) {
        swal({
          title: "Token Validated!",
          text: "Now setup a new password for your account.",
          icon: "success",
          button: "Ok",
        })
        navigate("/setuppassword");
      }
      else
        swal({
          title: "Invalid Token!",
          text: "Check if the entered token is correct.",
          icon: "error",
          button: "Ok",
        })
    })
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 mainContent">
      <Card style={{ width: "350px", padding: "20px" }} className="activate-card">
        <h4 className="text-center mb-3">Activate Account</h4>

        <Form>
          <Form.Group className="mb-3 color-white">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled
            />
            {emailError && <p className="text-danger p-2">{emailError}</p>}
          </Form.Group>

          {showTokenField && (
            <Form.Group className="mb-3 color-white">
              <Form.Label>Token</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              {error && <p className="text-danger p-2">{error}</p>}
            </Form.Group>
          )}
          <Button
            variant="dark"
            className="w-100 loginBtn"
            onClick={showTokenField ? handleValidate : handleActivate}
          >
            {showTokenField ? "Validate" : "Activate"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default ActivateAccount;
