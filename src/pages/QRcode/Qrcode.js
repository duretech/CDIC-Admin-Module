import React, { useState, useEffect, useRef } from "react";
// import KeyNumber from '../../components/KeyNumber'
import axios from "axios";
import { apiUrl } from "../../services/urls";
import { connect } from "react-redux";
import { Accordion, Card, Form, Row, Col, Breadcrumb } from "react-bootstrap";
import { saveAs } from 'file-saver';
import Loader from "../../components/loaders/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";

import {
  Container,
  Button,
} from "react-bootstrap";

const Qrcode = ({ props }) => {
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const getQrCode = () => {
    setLoading(true)
    // API.get(`qrcode/generate?count=` + count)
    let url = apiUrl + `qrcode/generate?count=` + count
    axios({
      url: url,
      method: 'GET',
      responseType: 'blob',
      headers: { Authorization: sessionStorage.getItem("Authorization") },
    }).then((res) => {
      // console.log(res)
      var FileSaver = require('file-saver');
      var blob = new Blob([res.data], { type: 'application/pdf' });
      FileSaver.saveAs(blob, "QRCode_" + new Date());
      setLoading(false)
    })
  }
  return (
    <>
      <div className="mainContainer">
        <div className="headerfixedcontainer bg-darkgrey">
          <Loader isLoading={loading} />
          <div className="headerfixedcontainer">
            <Container fluid>
              <div className="headerbarcontainer">
                <div className="mr-2 pt-4 mt-1">
                </div>
                <div className="daterangeholder mr-2">
                  <p className="mb-0 daterangeholder">
                    <i className="fa fa-calendar-alt color-white fs-12px"></i>
                    <span className="daterange color-white">
                      {/* {getDatePeriod()} */}
                    </span>
                  </p>
                </div>
                <div className="mr-2">
                  <Breadcrumb>
                    <Breadcrumb.Item href="#">
                      <FontAwesomeIcon className="color-white" icon={faHome} /> QR Code Generation
                    </Breadcrumb.Item>
                    {/* {breadcrumbOrg
                    ? breadcrumbOrg.map((org) => (
                      <Breadcrumb.Item href="#" key={org.id}>
                        {org.displayName}
                      </Breadcrumb.Item>
                    ))
                    : ""} */}
                    {/* <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
                  <Breadcrumb.Item active>Data</Breadcrumb.Item> */}
                  </Breadcrumb>
                </div>
              </div>
            </Container>
          </div>
        </div>
        
        <Container fluid className="pl-1 pr-1 mt-110px">
            <Card className="fixHeight">
              <Card.Header>QR Code Generation</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Row>
                    <Col lg={4}>
                      <Form>
                        <Form.Group controlId="formBasicEmail">
                          {/* <Form.Label>Enter No of QR code to be generated</Form.Label> */}
                          <Form.Control
                            value={count}
                            onChange={function (e) {
                              // console.log(e.target.value)
                              setCount(e.target.value)
                            }}
                            style={{ color: "black", backgroundColor: "white" }}
                            type="number"
                            placeholder="Enter No of QR code to be generated" />
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col lg={8}>
                      <Button onClick={() => getQrCode(10)} variant="primary">Generate</Button>
                    </Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>
        <footer className="footer">
          <p>Powered By</p>
          <img
            src={require("../../assets/images/durelogowhite.png")}
            alt="gallary"
            className="ml-2"
          />
        </footer>
      </div>
    </>
  );
}
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(Qrcode);