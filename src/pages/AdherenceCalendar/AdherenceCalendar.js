import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../../services";
import { apiUrl } from "../../services/urls";
import { connect } from "react-redux";
// import { Accordion, Card, Form, Row, Col } from "react-bootstrap";
// import Loader from "../../components/loaders/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";

import ComponentLoader from "../../components/loaders/ComponentLoader";

import {
    Container,
    Button,
    Modal,
    Breadcrumb,
    Card,
    Form,
    Col,
    Row,
} from "react-bootstrap";
import {
    chart1,
    pie1,
    pie2
} from "../../components/highchart/chartconfig";
import ChartComponent from "../../components/highchart/ChartComponent";
import { data } from "jquery";

// import DateRangePicker from "react-daterange-picker";
// import "react-daterange-picker/dist/css/react-calendar.css";
import swal from "sweetalert";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { chart } from "highcharts";

const AdherenceCalendar = ({ props }) => {
    const [loading, setLoading] = useState(false);
    const styleObj = {
        width: '100%',
        height: '300px',
    }
    var tableData = []

    const getDaysInMonth = (month, year) => {
        // console.log(month, year)
        return new Date(year, month, 0).getDate();
    }
    var monthsArray = [{
        id: 1,
        name: "Jan",
    },
    {
        id: 2,
        name: "Feb",
    },
    {
        id: 3,
        name: "Mar",
    },
    {
        id: 4,
        name: "Apr",
    },
    {
        id: 5,
        name: "May",
    },
    {
        id: 6,
        name: "Jun",
    },
    {
        id: 7,
        name: "Jul",
    },
    {
        id: 8,
        name: "Aug",
    },
    {
        id: 9,
        name: "Sep",
    },
    {
        id: 10,
        name: "Oct",
    },
    {
        id: 11,
        name: "Nov",
    },
    {
        id: 12,
        name: "Dec",
    },
    ];
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    var daysOfMonth = getDaysInMonth(new Date().getMonth() + 1, new Date().getFullYear())
    const [year, setYear] = useState(new Date().getFullYear());
    const [daysArray, setDaysArray] = useState([]);
    const [adheranceMetaData, setAdheranceMetaData] = useState([])
    const [DOTLINK, setDOTLINK] = useState("")

    Highcharts.setOptions({
        colors: ["#1d6996",
            "#ff8080",
            "#67cb60",
            "#8866a5",
            "#09a799"]
    });
    const chart1 = {
        title: {
            text: ''
        },
        chart: {
            type: 'column',
        }, plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        color: ["#1d6996",
            "#ff8080",
            "#67cb60",
            "#8866a5",
            "#09a799"],
        xAxis: {
            categories: ['Dec']
        },
        series: [{
            name: "Patinet on Treatment",
            data: [adheranceMetaData.length]
        }, {
            name: "Patients in crisis(missed min 3 doses)",
            data: [4]
        }, {
            name: "Patient Following Regime",
            data: [2]
        }]
    }
    const chart2 = {
        title: {
            text: ''
        },
        chart: {
            type: 'item',
        }, plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: "Following Regimen By Age",
            keys: ['name', 'y', 'color', 'label'],
            data: [
                ['Below 40 years: ', 60, '#1d6996', ''],
                ['40 - 60 years:  ', 25, '#ff8080', ''],
                ['Above 60 years: ', 15, '#67cb60', ''],
            ],
            dataLabels: {
                enabled: false,
                format: '{point.label}',
                style: {
                    textOutline: ''
                }
            },

            // Circular options
            center: ['50%', '88%'],
            size: '100%',
            startAngle: -100,
            endAngle: 100
        }]
    }
    const chart3 = {
        title: {
            text: ''
        },
        chart: {
            type: 'item',
        }, plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: "Patients in crisis by Age",
            keys: ['name', 'y', 'color', 'label'],
            data: [
                ['Below 40 years: ', 60, '#1d6996', ''],
                ['40 - 60 years:  ', 25, '#ff8080', ''],
                ['Above 60 years: ', 15, '#67cb60', ''],
            ],
            dataLabels: {
                enabled: false,
                format: '{point.label}',
                style: {
                    textOutline: ''
                }
            },

            // Circular options
            center: ['50%', '88%'],
            size: '100%',
            startAngle: -100,
            endAngle: 100
        }]
    }
    useEffect(() => {
        getAdheranceData()
        var arry = []
        for (var i = 1; i <= daysOfMonth; i++) {
            arry.push(i)
        }
        setDaysArray(arry)
    }, [month, year])
    const getAdheranceData = () => {
        setLoading(true)
        var instance = {
            "programuid": JSON.parse(sessionStorage.getItem("userData")).programuid,
            "orguid": JSON.parse(sessionStorage.getItem("userData")).orguid,
            "year": year,
            "month": month
        }
        // https://uatundp.imonitorplus.com/service/api/gettransfer/gettreatmentadherence
        API.post('gettransfer/gettreatmentadherence', instance).then(res => {
            let followRegime = 0;
            let defaulter = 0
            tableData = []
            tableData = JSON.parse(JSON.stringify(res.data));
            var flags = [], output = [], l = tableData.length, i;
            for (i = 0; i < l; i++) {
                if (!flags[tableData[i].trackedentityinstanceid]) {
                    flags[tableData[i].trackedentityinstanceid] = true;
                    tableData[i].data = []
                    var tempObj = {}
                    tempObj[new Date(tableData[i]['Date Medicine Taken']).getDate()] = tableData[i]
                    tableData[i].data.push(tempObj)
                    output.push(tableData[i]);
                    // console.log(tempObj)
                } else {
                    output.map(el => {
                        if (el.trackedentityinstanceid == tableData[i].trackedentityinstanceid) {
                            var tempObj = {}
                            var min3dose = 0;
                            tempObj[new Date(tableData[i]['Date Medicine Taken']).getDate()] = tableData[i]
                            el.data.push(tempObj)
                            // console.log(el.data)
                            // tempObj["Medicine Taken"] == "no" > 3 ? min3dose++ : '';
                            // el.data.push(new Date(tableData[i]['Date Medicine Taken']).getDate())
                        }
                    })
                }
            }
            setAdheranceMetaData(output)
            // console.log(adheranceMetaData, output)
            output.map(el => {
                let noCount = 0;
                for (let i = 0; i < output.length; i++) {
                    // console.log(el.data[i])
                    // if (el.data[i]["Medicine Taken"])
                    // console.log(Object.values(el.data[i]))
                    // if (el.data[i]["Medicine Taken"].includes("no"))
                    // noCount++
                    // debugger
                }
                // console.log(noCount)
            })
            setLoading(false)
        })
        //     output.map(e => {

        // })
    }
    const getRows = (row) => {
        // console.log(row)
        return (<tr>
            <td>
                {row.uic}
            </td>
            <td>
                {row.name}
            </td>
            {
                daysArray.map(el => {
                    return (getsubrows(el, row))
                })
            }
        </tr>)
    }
    const getsubrows = (date, row) => {
        // console.log(date, row['DOTLINK'])
        var taken = false
        var nottaken = false
        var partial = false
        var adverseEvnet = false
        var matchedData
        var drugReact = ''
        var takeArray = []
        var medicineArry = []
        var dotlink = ""
        row.data.map(el => {
            if (el[date]) {
                let temp = {}
                matchedData = el[date]
                drugReact = el[date]['Adverse drug reactions']
                takeArray.push(el[date]['Medicine Taken'])
                temp['medName'] = el[date]['Treatment adherence ID']
                temp['taken'] = el[date]['Medicine Taken']
                medicineArry.push(temp)
                if (el[date]['Any adverse drug reactions '] == 'Yes')
                    adverseEvnet = true
                dotlink = el[date]["DOTLINK"]
                // console.log(el, el[date].uic, takeArray, "el,data")
            }
        })
        // let dataCount = 0;
        if (takeArray.length > 0) {
            // console.log(takeArray)
            if ((takeArray.includes('yes') || takeArray.includes('Yes')) && (takeArray.includes('no') || takeArray.includes('No'))) {
                partial = true
            } else if (takeArray.includes('no') || takeArray.includes('No')) {
                nottaken = true
            } else if (takeArray.includes('yes') || takeArray.includes('Yes'))
                taken = true
        }
        // console.log(taken, nottaken, partial, takeArray, row.uic, "medicineArry,takeArray")
        // console.log(takeArray, row.data, daysArray)
        if (takeArray)
            if (!taken && !nottaken & !adverseEvnet & !partial) {
                return (
                    <td>

                    </td>
                )
            } else {
                // console.log(date,matchedData,drugReact)
                return (
                    <td onClick={(e) => openModal(drugReact, medicineArry, dotlink)} class={taken ? 'Taken' : (nottaken ? 'Missed' : (partial ? 'Incorrect' : ''))} >
                        {adverseEvnet ? (
                            <i class="fa fa-exclamation-circle" style={{ color: '#333' }} aria-hidden="true"></i>
                        ) : ''}
                    </td>
                )
            }
    }
    const [show, setShow] = useState(false);
    const [currentDataSet, setCurrentDataSet] = useState();
    const [currentMedList, setCurrentMedList] = useState([]);
    const openModal = (data, medList, DOTLINK) => {
        // console.log(DOTLINK, "DOTLINK")
        // console.log(data, medList)
        setCurrentDataSet(data)
        setCurrentMedList(medList)
        setDOTLINK(DOTLINK);
        handleShow()
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAd, setShowAd] = useState(false);
    const handleAdClose = () => setShowAd(false);
    const handleAdShow = () => setShowAd(true);
    const [providerType, setProviderType] = useState("Wisepill");
    const [dateRange, setDateRange] = useState();
    const [UIC, setUIC] = useState();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const yearChange = (e) => {
        // console.log(e.target.value)
        setYear(e.target.value)
        daysOfMonth = getDaysInMonth(month, e.target.value)
    }


    const monthChange = (e) => {
        console.log('insde')
        // if (step == 'prev' && month == 1)
        //     setMonth(month - 1)
        // else if (step == 'next' && month == 12)
        setMonth(e.target.value)

        daysOfMonth = getDaysInMonth(e.target.value - 1, year)
    }
    const addAdherance = () => {
        let oReqObj = {
            "fromdate": fromDate,
            "todate": toDate,
            "patienttype": providerType,
            "uic": UIC
        }
        API.post('wisepill/sampleAdherance', oReqObj).then(res => {
            // console.log(res)
            if (res.data.status == 'success') {
                handleAdClose()
                swal({
                    title: "Success",
                    text: "Adherence Updated",
                    icon: "success",
                    button: "Close",
                });
            } else {
                handleAdClose()
            }
        })
    }
    return (
        <>
            <div className="mainContainer">
                {/* <div className="headerfixedcontainer">
                </div> */}
                {/* <Loader isLoading={loading} /> */}
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
                                        <FontAwesomeIcon className="color-white" icon={faHome} /> Adherence Calendar
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                        </div>
                    </Container>
                </div>
                <div class="container-fluid pl-1 pr-1 mt-110px">
                    <Card className="fixHeight">
                        <Card.Header className="d-flex" style={{ "justify-content": "space-between" }}>
                            Adherence Calendar
                            <Button className="btn-sm" onClick={(e) => handleAdShow()}>Add Adherence</Button>
                        </Card.Header>
                        <Card.Body>
                            <div class="d-flex justify-content-between mb-2">
                                <div ></div>
                                <div >
                                    {/* <button onClick={ monthChange('prev')} class="btn-cases btn btn-sm mr-2">&lt;</button> */}
                                    {/* <button class="btn-cases btn btn-sm mr-2">{ monthsArray[month - 1].name }</button> */}
                                    <select value={month} onChange={monthChange} class="dropdownList mt-0 mr-2">
                                        {monthsArray.map(el => {
                                            return (<option value={el.id}>{el.name}</option>)
                                        })}
                                    </select>
                                    <select value={year} onChange={yearChange} class="dropdownList mt-0 mr-2">
                                        <option value="2024"> 2024 </option>
                                        <option value="2023"> 2023 </option>
                                        <option value="2022"> 2022 </option>
                                        <option value="2021"> 2021 </option>
                                        <option value="2020"> 2020 </option>
                                    </select>
                                    {/* <button onClick={ monthChange('next')} class="btn-cases btn btn-sm mr-2">&gt;</button> */}
                                </div>
                                <div >
                                    <select class="dropdownList mt-0 mr-2">
                                        <option value="all">All</option>
                                        <option value="Patients in crisis">Patients in crisis</option>
                                    </select>
                                </div>
                            </div>
                            {loading ? <ComponentLoader /> : <table class="table table-dashboard mg-b-0 table-bordered calenderTable">
                                <thead>
                                    <tr >
                                        <th >Patient Id</th>
                                        <th >Patient Name</th>
                                        {daysArray.map(el => {
                                            return (
                                                <th>{el}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                {/* <tr > */}
                                {adheranceMetaData.map(el => {
                                    return getRows(el)
                                })
                                }
                                {/* </tr> */}

                            </table>}
                            <div class="adheranceBottomDiv">
                                <div >
                                    <p class="m-0" >* Patient in crisis</p>
                                    <p class="m-0" >Note: Click on patient name and ID to view details</p>
                                </div>
                                <div >
                                    <p class="m-0" ><i class="fa fa-circle" style={{ 'color': 'green' }}></i> : All medicines taken</p>
                                    <p class="m-0" ><i class="fa fa-circle" style={{ 'color': 'orange' }}></i> : One of the medicines not taken</p>
                                    <p class="m-0" ><i class="fa fa-circle" style={{ 'color': 'red' }}></i> : None of the medicines taken</p>
                                    <p class="m-0" ><i class="fa fa-exclamation-circle"></i> : Adverse event faced</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <Modal show={show} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row m-1">
                            {DOTLINK != "" ?
                                <Col xs={12} md={6} lg={6} >
                                    <div >
                                        <div class="card mb-2 cardbgdark border-grey">

                                            <div class="card-header p-1">DOT LINK</div>
                                            <div class="card-body p-0">

                                                <video width="100%" controls autoplay={true}>
                                                    <source src={DOTLINK} type="video/mp4" />.
                                                </video>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                :
                                null}

                            <Col xs={12} lg={5}>
                                <div >
                                    <div class="card mb-2 cardbgdark border-grey">

                                        <div class="card-header p-1">Regimen</div>
                                        <div class="card-body">

                                            <table class="table table-dashboard mg-b-0 mb-0 table-bordered">
                                                <thead >
                                                    <tr >
                                                        <th >Medicine Name</th>
                                                        <th >Medicine Taken</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {currentMedList.map(el => {
                                                        return (
                                                            <tr >
                                                                <td >{el.medName}</td>
                                                                <td >{el.taken}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <div>

                                    <div class="card mb-2 cardbgdark border-grey">

                                        <div class="card-header p-1">Adverse Event faced</div>
                                        <div class="card-body table table-dashboard mg-b-0 mb-0 table-bordered">
                                            {currentDataSet}
                                            {/* <table class="table table-dashboard mg-b-0 mb-0 table-bordered">
                                            <thead >
                                                <tr >
                                                    <th >Adverse Event faced</th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                <tr >
                                                    <td ></td>
                                                </tr>
                                            </tbody>
                                        </table> */}
                                        </div>

                                    </div>
                                </div>
                            </Col>

                        </div>
                    </Modal.Body>

                </Modal>
                <Modal show={showAd} onHide={handleAdClose} size="md" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row p-2">
                            <div class="col-4" >
                                <Form>
                                    <Form.Group controlId="exampleForm.SelectCustom mt-2">
                                        <Form.Label>UIC</Form.Label>
                                        <Form.Control type="text" placeholder="Enter UIC"
                                            onChange={e => {
                                                setUIC(e.target.value)
                                            }}
                                            value={UIC} />
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col-4" >
                                <Form>
                                    <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Provider Type</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={providerType}
                                            custom
                                            onChange={e => {
                                                // console.log(e.target.value)
                                                setProviderType(e.target.value)
                                                // console.log(value.target.options[value.target.selectedIndex].text)
                                            }}
                                        >
                                            <option value="Wisepill">Wisepill</option>
                                            <option value="DOT">DOTS</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col-4" >
                                {/* <DateRangePicker
                                    value={dateRange}
                                    onSelect={function (selected) {
                                        setDateRange(selected);
                                        setFromDate(selected.start.format("YYYY-MM-DD"))
                                        setToDate(selected.end.format("YYYY-MM-DD"))
                                    }}
                                    singleDateRange={true}
                                /> */}
                            </div>
                        </div>

                        <div class="p-4">
                            <Button onClick={(e) => {
                                addAdherance()
                            }}>Submit</Button>
                        </div>
                    </Modal.Body>

                </Modal>
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

export default AdherenceCalendar;