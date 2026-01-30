import React, { useEffect, useState } from "react";
// import KeyNumber from '../../components/KeyNumber'
import { faCalendar, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import { Card, Col, Row } from "react-bootstrap";
import API from "../../services";

import Moment from "react-moment";
import Sidebar from "react-sidebar";
import SidebarContent from "../../components/SidebarContent";
import { useTranslation } from 'react-i18next';

import ComponentLoader from "../../components/loaders/ComponentLoader";

import {
  Breadcrumb,
  Button,
  Container
} from "react-bootstrap";
const colors = [
  "#1d6996",
  "#ff8080",
  "#67cb60",
  "#8866a5",
  "#09a799",
  "#f5d63d",
  "#79ff4d",
  "#f35b5a",
  "#79c267",
  "#bf62a6",
  "#c5d647",
  "#6cc9dd",
  "#e868a2",
  "#fb5e19",
  "#66ffff",
  "#ff1a8c",
  "#cccc00",
  "#000080",
];

const Pathway = ({ props }) => {
  const { t, i18n } = useTranslation();
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [orgID, setOrgID] = useState();
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  //const [chartData, setchartData] = useState([]);
  const [indicatorData, setindicatorData] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [defaultOrg, setDefaultOrg] = useState(JSON.parse(sessionStorage.getItem("userData")).organisationUnits);
  const [periodName, setPeriodName] = useState();
  const [periodType, setPeriodType] = useState('Yearly');
  const [isSidebarOpen, setSidebar] = useState(false);
  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);

  const [indicatorObject, setIndicatorObject] = useState({});

  const [currentPeriod, setCurrentPeriod] = useState(
    date.getFullYear().toString()
  );

  const onSetSidebarOpen = () => {
    if (isSidebarOpen === true) {
      setSidebar(false);
    } else {
      setSidebar(true);
    }
  };

  const closeSidebar = () => {
    setSidebar(false);
  };

  const applyFilter = (org, period, periodname, periodType) => {
    setFilterFlag(true);
    setBreadcrumbOrg(org);
    setOrgID();

    setPeriodName(periodname);
    setPeriodType(periodType)
    //setTimeout(function () {

    setOrgID(org[org.length - 1].id);
    // console.log(org);
    setCurrentPeriod(period);
    // console.log(period);
    closeSidebar();
    //}, 800);

    //setCurrentMapKey(currentMapKey + 1);
  };

  const resetFilter = () => {
    setCurrentPeriod(date.getFullYear().toString());
    setPeriodName("");
    setOrgID(defaultOrg[0].id);
    setBreadcrumbOrg(defaultOrg);
    setFilterFlag(false);
    closeSidebar();
    //setCurrentMapKey(currentMapKey + 1);
  };

  const getDatePeriod = () => {
    //console.log(periodName);
    if (!periodName || periodName == "") {
      if (currentPeriod.includes("-")) {
        return <Moment date={new Date(currentPeriod)} format="MMM-YYYY" />;
      } else {
        return <Moment date={new Date(currentPeriod)} format="YYYY" />;
      }
    } else {
      return <>{periodName}</>;
    }
  };
  
  const tree = {
    name: t("Total Enrolled"),
    data: 0,
    percent: "100%",
    children: [
      {
        name: t("Referred For Further Investigation"),
        data: 0,
        children: [
          {
            name: t("Diagnosed"),
            data: 0,
            children: [
              {
                name: t("On Treatment/ Medical Therapy"),
                data: 0,
                children: [
                  {
                    name: t("Cured"),
                    data: 0,
                    children: [
                      
                    ],
                  },
                  {
                    name: t("Not Cured"),
                    data: 0,
                  },
                ],
              },
              {
                name: t("Medical therapy not initiated"),
                data: 0,
              },
            ],
          },
          {
            name: t("Not Diagnosed"),
            data: 0,
          },
        ],
      },
      {
        name: t("Not Referred"),
        data: 0,
      },
    ],
  };
  const colorObj = [{
    name: 'Total Registered',
    color: '#03a9fb',
  }, {
    name: 'Total Tested',
    color: '#0bf5e0',
  }, {
    name: 'Total Tested Positive',
    color: '#e64a19',
  }, {
    name: 'Total on Treatment',
    color: '#fbc02d',
  }, {
    name: 'Total Recovered',
    color: '#c5d647',
  }, {
    name: 'Total Deaths',
    color: '#f35b5a',
  }, {
    "name": "Test Result Pending",
    color: '#fbc02d',
  }, {
    "name": "Test Result Inconclusive",
    color: '#ffa000',
  }, {
    "name": "Test Result Negative",
    color: '#388e3c',
  }, {
    "name": "Outcome Pending",
    color: '#79c267',
  }, {
    "name": "Total Transferred",
    color: '#6cc9dd',
  }, {
    "name": "Total Lost To Follow-up",
    color: '#e868a2',
  }];
  const maxnum = '';
  const minnum = '';
  const maxradius = 22;
  const minradius = 5;
  const minnumbeArr = [];

  useEffect(() => {
    setLoading(true);
    setLoadingChart(true);
    let mounted = true;
    let count = 0;

    if (!filterFlag) {
      setOrgID(JSON.parse(sessionStorage.getItem("userData")).orguid);
      setBreadcrumbOrg(defaultOrg);
    }
    getDashboardIndicator()
  }, [orgID, currentPeriod]);
  const getDashboardIndicator = () => {
    if (orgID) {
      let instance = {
        "programid":"eAHvg6zuxvK","orguid": orgID,"periodyear":"2023","periodvalue":"Yearly"
      };
      let aGet_custom_tb_dashboard_indicators = API.post('dashboardIndicator/getlistindicator', instance)
        // aGet_custom_ltbi_dashboard_indicators = API.post('dashboardIndicator/geindicators/get_custom_ltbi_dashboard_indicators', instance);
      Promise.all([aGet_custom_tb_dashboard_indicators])
        .then(([aGet_custom_tb_dashboard_indicators]) => {
          setLoading(false);
          let indicatorData = {}
          // console.log(aGet_custom_tb_dashboard_indicators.data.data, aGet_custom_ltbi_dashboard_indicators.data.data)
          aGet_custom_tb_dashboard_indicators.data.data.map(el => {
            indicatorData[el.indicatorname] = el.counts
          })
          setIndicatorObject(indicatorData)
        })
    }
  }
  useEffect(() => {
    // console.log(indicatorObject)
    // tree.data = indicatorObject['100'];
    // tree.children[0].data = indicatorObject['Total screened for T1D-'];
    // tree.children[1].data = indicatorObject['Total Registered -'] - indicatorObject['Total screened for T1D-'];
    // tree.children[0].children[0].data = indicatorObject['Total Diagnosed with T1 D-'];
    // tree.children[0].children[1].data = indicatorObject['Total screened for T1D-']- indicatorObject['Total Diagnosed with T1 D-'];
    // tree.children[0].children[0].children[0].data = indicatorObject['Total on medical tehrapy- '];
    // tree.children[0].children[0].children[1].data = indicatorObject['Total Diagnosed with T1 D-']- indicatorObject['Total on medical tehrapy- '];
    tree.data = 100;
    tree.children[0].data = 98;
    tree.children[1].data = 2;
    tree.children[0].children[0].data = 97;
    tree.children[0].children[1].data = 1;
    tree.children[0].children[0].children[0].data = 96;
    tree.children[0].children[0].children[1].data = 1;
    tree.children[0].children[0].children[0].children[0].data = 75;
    tree.children[0].children[0].children[0].children[1].data = 21;
    mapDataRadius()
    renderChart()
  }, [indicatorObject])
  //  console.log(indicatorData)
  // useEffect(() => {
  //     mapDataRadius()
  //     renderChart()
  // })
  const mapDataRadius = () => {
    tree['radius'] = getCircleRadius(parseInt(tree.data));
    tree['color'] = '#001965';
    getEachChildRadius(tree.children)
  }
  const getCircleRadius = (val, min, max) => {
    //console.log(this.minnumbeArr)
    //this.minnum = Math.min.apply(null, this.minnumbeArr);
    // Map a data property that ranges from 0 to 100 to a value between 5 and 20 (e.g. marker radius)
    // var linearFunction = new L.LinearFunction(new L.Point(minnum, minradius), new L.Point(maxnum, maxradius));
    return 15;
  }
  const getEachChildRadius = (children) => {
    children.forEach(obj => {
      var colo = colorObj.filter(q => q.name == obj.name)
      obj['radius'] = getCircleRadius(parseInt(obj.data))
      obj['color'] = '#001965'
      // colo.length > 0 ? colo[0]['color'] : '#2c6bb8'
      if (obj.children != undefined) {
        getEachChildRadius(obj.children)
      }
    })
  }
  const renderChart = () => {
    var that = this
    // Set the dimensions and margins of the diagram
    document.getElementById('treecontainer2').innerHTML = "";
    var margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 50
    },
      width = document.getElementById('treecontainer2').offsetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    var maxLabel = 150;
    var divider = 200;
    var svg = d3.select("#treecontainer2").append("svg")
      //.attr("width", width)
      //.attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", "0 0 1278 " + height)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", "translate(141.9059066772461,20)");

    // Add tooltip div
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 1e-6);

    var i = 0,
      duration = 750,
      root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);
    root = d3.hierarchy(tree, function (d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
    // root.children.forEach(collapse);
    function collapse(d) {
      console.log(d, "child")
      if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }
    function update(source) {
      // console.log(source,"sorce")
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = d.depth * divider
      });

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click)
        .on("mouseover", mouseover)
        .on("mousemove", function (d) {
          mousemove(d, source);
        })
        .on("mouseout", mouseout)

      function mouseover() {
        tooltip.transition()
          .duration(300)
          .style("opacity", 1);
      }

      function mousemove(event, d) {
        var html = '<div>'
        html += '<div class="pathwaytitle">' + event.target.__data__.data.name + ': </div>'
        html += '<div class="pathwaydata">Count: ' + event.target.__data__.data.data + '</div>'
        if (event.target.__data__.data.percent) {
          html += '<div class="pathwaydata">Percentage : ' + event.target.__data__.data.percent + '</div>'
        }
        html += '</div>'
        tooltip.html(html)
          .style("opacity", 1)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY) + "px");

      }

      function mouseout() {
        tooltip.transition()
          .duration(300)
          .style("opacity", 1e-6);
      }


      // Add Circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("stroke", function (d) {
          return d.data.color;
        })
        .style("fill", function (d) {
          return d.data.color
        });

      // Add labels for the nodes
      var text = nodeEnter.append('text')
        .attr("x", function (d) {
          // console.log(d.data)
          return d.data.name == "Test Result Negative" ? '25' : d.data.name == "Not Tested" ? '0' : d.data.name == "LTBI" ? "40" : d.children || d._children ? "40" : "20";
        })
        .attr("dy", function (d) {

          return d.data.radius > 18 && d.children ? '-30' : d.data.name == "Not Tested" ? '30' : d.children || d._children ? "-20" : "5";
        })
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .style('fill', '#333333')
        .text(function (d) {
          return d.data.name;
        });

      text.append("tspan")
        .style("font-weight", function (d) {
          return "bold";
        })
        .text(function (d) {
          return ' (' + d.data.data + ')'
          // + (d.data.percent ? '(' + d.data.percent + ')' : '')
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', function (d) {
          if (d.data != undefined) {
            return d.data.radius
          }
        })
        .style("stroke", function (d) {
          return d.children || d._children ? "#a51c30c" : d.data.color;
        })
        .style("fill", function (d) {
          if (d.data != undefined) {
            return d.data.color || '#fff'
          }
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.id;
        });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr("stroke-width", function (d) {
          return 3;
        })
        .attr('d', function (d) {
          var o = {
            x: source.x0,
            y: source.y0
          }
          return diagonal(o, o)
        })
        .attr("stroke", function (d) {
          if (d.data != undefined) {
            return d.data.color || '#a9a9a9'; //'#eee';
          }
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) {
          return diagonal(d, d.parent)
        });

      // Remove any exiting links
      var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
          var o = {
            x: source.x,
            y: source.y
          }
          return diagonal(o, o)
        }).remove();

      // Store the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        return "M" + s.y + "," + s.x +
          "C" + (s.y + d.y) / 2 + "," + s.x +
          " " + (s.y + d.y) / 2 + "," + d.x +
          " " + d.y + "," + d.x;

      }

      // Toggle children on click.
      function click(d) {
        console.log(d, "clicked")
        d = d.target.__data__
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }
  }
  return (
    <>
      <Sidebar
        sidebar={
          <SidebarContent
            closeSidebar={closeSidebar}
            defaultOrg={defaultOrg}
            latestPeriod={currentPeriod}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
          ></SidebarContent>
        }
        open={isSidebarOpen}
        onSetOpen={() => onSetSidebarOpen()}
        styles={{ sidebar: { background: "white", zIndex: 99999 } }}
        //docked="true"
        sidebarClassName="custom-sidebar-class"
        //contentId= "custom-sidebar-content-id"
        //open="false"
        touch={true}
        shadow={true}
        //pullRight="false"
        //touchHandleWidth="1000"
        //dragToggleDistance="30"
        transitions={true}
      >
        <b>Main content</b>
      </Sidebar>
      <div className="mainContainer">

        <div className="headerfixedcontainer">
          <Container fluid>
            <div className="headerbarcontainer">
              <div className="mr-2">
                <Button
                  variant="primary"
                  className="selectfilterbtn"
                  onClick={() => onSetSidebarOpen()}
                >
                  {t("Select filter")} <i className="fa fa-caret-down"></i>
                </Button>
              </div>
              <div className="mr-2">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    {t("Pathway")}
                  </Breadcrumb.Item>
                  {breadcrumbOrg
                    ? breadcrumbOrg.map((org) => (
                      <Breadcrumb.Item href="#" key={org.id}>
                        {org.displayName}
                      </Breadcrumb.Item>
                    ))
                    : ""}
                  {/* {/* <Breadcrumb.Item href="#">Library</Breadcrumb.Item> */}
                  {/* <Breadcrumb.Item>World</Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
            </div>
          </Container>
        </div>
        <div class="container-fluid pl-1 pr-1 mt-110px">
          <Card className="fixHeight pathway-section">
            <Card.Header className="pb-0 pt-3">{t("Pathway")}</Card.Header>
            <Card.Body className="pb-0 pt-0">
              <Card.Text>
                <Row>
                  <Col lg={12}>
                    <div id="treeWrapper" style={{ width: '100%', height: '65vh' }}>
                      {/* <Tree data={orgChart} /> */}
                      {loading ? <ComponentLoader /> : <div id='treecontainer2'></div>}
                    </div>
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
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

export default Pathway;