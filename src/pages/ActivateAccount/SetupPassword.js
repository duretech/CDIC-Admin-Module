import React, { useState } from "react";
import { Form, Button, Container, Card, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import { apiUrl } from "../../services/urls";
import swal from 'sweetalert';
import { adminAccountEmail, adminAccountPassword } from "../../config/appConfig";

function SetupPassword() {
    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Authorization": "Basic " + btoa(adminAccountEmail + ":" + adminAccountPassword),
        },
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = (pwd) => passwordRegex.test(pwd);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (!isValidPassword(password)) {
            setPasswordError(
                "Must have at least 8 characters, one uppercase, one lowercase, one number, and one special character."
            );
        } else {
            setPasswordError("");
        }

        // Also check confirm password field (if already filled)
        if (confirmPassword && confirmPassword !== value) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    // Validate confirm password onChange
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (password !== value) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    // API call to set up password
    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.")
            return;
        }
        else if (!password || !confirmPassword) {
            setConfirmPasswordError("Both fields are mandatory!")
            return;
        } else {
            instance.post('rtmpro/subscribe/updatePassword', {
                "email": sessionStorage.getItem('username'),
                "password": password
            }).then(res => {
                swal({
                    title: "Password is set successfully!",
                    text: "Now you can login with your new account.",
                    icon: "success",
                    button: "Ok",
                })
                navigate("/login");
            })
        }
        console.log("Setting up password...");
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 mainContent">
            <Card style={{ width: "350px", padding: "20px" }} className="activate-card">
                <h4 className="text-center mb-3">Setup Password</h4>

                <Form>
                    {/* Password Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Enter Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <span
                                className="input-group-text visibility-icon-container"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </InputGroup>

                        {passwordError && <p className="text-danger p-2">{passwordError}</p>}

                    </Form.Group>

                    {/* Confirm Password Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            <span
                                className="input-group-text visibility-icon-container"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </span>
                        </InputGroup>
                        {confirmPasswordError && (
                            <p className="text-danger p-2">{confirmPasswordError}</p>
                        )}
                    </Form.Group>


                    <Button variant="dark" className="w-100 loginBtn" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default SetupPassword;
