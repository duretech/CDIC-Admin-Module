import React, { useState, useMemo, useEffect } from "react";
//import { render } from "react-dom";
import _ from "underscore";
//import ScriptTag from "react-script-tag";
import $ from "jquery";
import L from "leaflet";
import {
  MapContainer,
  GeoJSON,
  TileLayer,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet-dvf";
import "leaflet-geometryutil";
//import "leaflet.migration";
//import "leaflet.migration/dist/index.js";
import "leaflet.migration/dist/index";
import axios from "axios";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { mapDefaultCenter, mapDefaultZoom } from "../../config/appConfig";
import { ListGroup } from "react-bootstrap";
import Loader from "../loaders/loader";

require("leaflet-dvf/dist/css/dvf.css");
//const worldShape = require("../../assets/shapeFile/AFG_IRN_PAK.json");
let worldData = [];
worldData["Afghanistan"] = 8;
worldData["Iran"] = 49;
worldData["Pakistan"] = 236;

//const AFGShape = require("../../assets/shapeFile/AFG.json");
let AFGData = [];
AFGData["Kabul"] = 5;
AFGData["Kandahar"] = 3;

//const AFGDistrictShape = require("../../assets/shapeFile/AfghanistanDistrict.json");
let AFGDistrictData = [];
AFGDistrictData["Kabul"] = 3;
AFGDistrictData["Guldarah"] = 2;
AFGDistrictData["Shorabak"] = 3;
AFGDistrictData["Arghestaan"] = 2;

//const IRNShape = require("../../assets/shapeFile/IRN.json");
let IRNData = [];
IRNData["Tehran"] = 39;
IRNData["Fars"] = 10;

//const IRNDistrictShape = require("../../assets/shapeFile/IranDistrict.json");
let IRNDistrictData = [];
IRNDistrictData["Tehran"] = 31;
IRNDistrictData["Rey"] = 8;
IRNDistrictData["Shiraz"] = 7;
IRNDistrictData["Jahrom"] = 3;

//const PAKShape = require("../../assets/shapeFile/PAK.json");
let PAKData = [];
PAKData["Sind"] = 147;
PAKData["Punjab"] = 89;

//const PAKDistrictShape = require("../../assets/shapeFile/PakistanDistrict.json");
let PAKDistrictData = [];
PAKDistrictData["Karachi west"] = 47;
PAKDistrictData["Malir"] = 25;
PAKDistrictData["Karachi Central"] = 25;
PAKDistrictData["Karachi South"] = 27;
PAKDistrictData["Karachi East"] = 23;
PAKDistrictData["Multan"] = 89;
PAKDistrictData["Dadu"] = 33;
PAKDistrictData["Jamshoro"] = 73;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const RegionalMap = ({ mapKey, mapHeight }) => {
  //console.log(mapKey);
  //const mapRef = useRef(null);
  const [currentMapReference, setCurrentMapReference] = useState(null);
  const [currentMapKey, setCurrentMapKey] = useState(mapKey);
  const [mapZoom, setMapZoom] = useState(mapDefaultZoom - 1);
  const [mapCenter, setMapCenter] = useState([
    32.094645767953665,
    59.55465316772462,
  ]);

  //const [geoJsonData, setGeoJsonData] = useState(worldShape);
  const [mapIndicatorData, setMapIndicatorData] = useState(worldData);
  const [shapeLabel, setShapeLabel] = useState("NAME_0");
  const [shapeFileName, setShapeFileName] = useState("AFG_IRN_PAK");

  const [migrantLayer, setMigrantLayer] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);

  const resetMap = () => {
    console.log("Reset Marker Map");
    //console.log("Map Marker Ref:", currentMapReference);
    //console.log(currentMapReference);
    //console.log(mapDefaultZoom);
    //currentMapReference.setZoom(mapDefaultZoom - 1);
    //currentMapReference.setView(mapCenter);

    //setGeoJsonData(geoJsonData);
    setShapeFileName("AFG_IRN_PAK");
    setMapIndicatorData(worldData);
    setShapeLabel("NAME_0");
    setMapZoom(mapDefaultZoom - 1);
    setMapCenter([32.094645767953665, 59.55465316772462]);
    setCurrentMapKey(currentMapKey + 1);
    //currentMapReference.setView(mapDefaultCenter);
  };

  const updateGeoJson = (location) => {
    // console.log(location);
    //console.log(currentMapKey);
    //console.log(currentMapReference);
    if (location === "world") {
      //setGeoJsonData(geoJsonData);
      setShapeFileName("AFG_IRN_PAK");
      setMapIndicatorData(worldData);
      setShapeLabel("NAME_0");
      setMapZoom(mapDefaultZoom - 1);
      setMapCenter([32.094645767953665, 59.55465316772462]);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "AFG") {
      console.log(location);
      //setGeoJsonData(AFGShape);
      setShapeFileName("AFG");
      setMapIndicatorData(AFGData);
      setShapeLabel("NAME_1");
      setMapZoom(mapDefaultZoom);
      setMapCenter([33.93911, 67.709953]);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "IRN") {
      console.log(location);
      //setGeoJsonData(IRNShape);
      setShapeFileName("IRN");
      setMapIndicatorData(IRNData);
      setShapeLabel("NAME_1");
      setMapZoom(mapDefaultZoom - 1);
      setMapCenter([32.42791, 53.688046]);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "PAK") {
      console.log(location);
      //setGeoJsonData(PAKShape);
      setShapeFileName("PAK");
      setMapIndicatorData(PAKData);
      setShapeLabel("NAME_1");
      setMapZoom(mapDefaultZoom - 1);
      setMapCenter([30.37532, 69.345116]);
      setCurrentMapKey(currentMapKey + 1);
    }
  };

  const MigrantLayer = (map) => {
    console.log(map);
    //const map = useMap();
    const airports = [
      {
        code: "KARACHI",
        lat: "24.975769",
        lon: "67.049561",
        name: "Karachi",
        country: "Pakistan",
        type: "Airports",
        direct_flights: "212",
        carriers: "1",
      },
      {
        code: "MULTAN",
        lat: "30.439350",
        lon: "69.805069",
        name: "Multan",
        country: "Pakistan",
        type: "Airports",
        direct_flights: "147",
        carriers: "1",
      },
      {
        code: "KABUL",
        lat: "34.555347",
        lon: "69.207489",
        name: "Kabul",
        country: "Afghanistan",
        type: "Airports",
        direct_flights: "1",
        carriers: "2",
      },
      {
        code: "TEHRAN",
        lat: "35.689198",
        lon: "51.388973",
        name: "Tehran",
        country: "Iran",
        type: "Airports",
        direct_flights: "99",
        carriers: "3",
      },
      {
        code: "KANDAHAR",
        lat: "31.612181",
        lon: "65.712219",
        name: "Kandahar",
        country: "Afghanistan",
        type: "Airports",
        direct_flights: "27",
        carriers: "4",
      },
      {
        code: "LAHORE",
        lat: "31.520370",
        lon: "74.358749",
        name: "Lahore",
        country: "Pakistan",
        type: "Airports",
        direct_flights: "1",
        carriers: "5",
      },
      {
        code: "SHIRAZ",
        lat: "29.591768",
        lon: "52.583698",
        name: "Shiraz",
        country: "Iran",
        type: "Airports",
        direct_flights: "50",
        carriers: "6",
      },
    ];

    let flights = [
      {
        airline: "AA",
        airport1: "KABUL",
        airport2: "TEHRAN",
        cnt: "44",
      },
      {
        airline: "AA",
        airport1: "KABUL",
        airport2: "MULTAN",
        cnt: "101",
      },
      {
        airline: "AA",
        airport1: "LAHORE",
        airport2: "KANDAHAR",
        cnt: "8",
      },
      {
        airline: "00",
        airport1: "KABUL",
        airport2: "KARACHI",
        cnt: "135",
      },
      {
        airline: "00",
        airport1: "MULTAN",
        airport2: "SHIRAZ",
        cnt: "5",
      },
    ];

    // Add a layer control
    //var layerControl = L.control.layers().addTo(map);

    // Add a legend control
    // var legendControl = L.control
    //   .legend({
    //     autoAdd: false,
    //   })
    //   .addTo(currentMapReference);

    // Create a lookup of airports by code.  NOTE:  this is easy, but non-optimal, particularly with a large dataset
    // Ideally, the lookup would have already been created on the server or created and imported directly
    var airportsLookup = L.GeometryUtils.arrayToMap(airports, "code");

    // Sort flight data in descending order by the number of flights.  This will ensure that thicker lines get displayed
    // below thinner lines
    flights = _.sortBy(flights, function (value) {
      return -1 * value.cnt;
    });

    // Group flight data by airline code
    var airlineLookup = _.groupBy(flights, function (value) {
      return value.airline;
    });

    //var maxCountAll = Number(flights[0].cnt);

    // Get the top count of flights
    flights = _.filter(flights, function (value) {
      return value.airline !== "all";
    });

    var maxCount = Number(flights[0].cnt);

    var count = 0;

    // Get an airport location.  This function looks up an airport from a provided airport code
    var getLocation = function (context, locationField, fieldValues, callback) {
      var key = fieldValues[0];
      var airport = airportsLookup[key];
      var location;

      if (airport) {
        var latlng = new L.LatLng(Number(airport.lat), Number(airport.lon));

        location = {
          location: latlng,
          text: key,
          center: latlng,
        };
      }

      return location;
    };

    var sizeFunction = new L.LinearFunction([1, 16], [253, 48]);

    var options = {
      recordsField: null,
      locationMode: L.LocationModes.CUSTOM,
      fromField: "airport1",
      toField: "airport2",
      codeField: null,
      getLocation: getLocation,
      getEdge: L.Graph.EDGESTYLE.ARC, // STRAIGHT
      includeLayer: function (record) {
        return true;
      },
      getIndexKey: function (location, record) {
        return record.airport1 + "_" + record.airport2;
      },
      setHighlight: function (style) {
        style.opacity = 0.9;

        return style;
      },
      unsetHighlight: function (style) {
        style.opacity = 0.3;

        return style;
      },
      onEachRecord: function (layer, featureData) {
        //console.log(featureData);
        //console.log(layer);

        let toolTipContent = `<div style="background: rgb(45, 61, 79); width: 200px; height: 100px; color: #fff; font-size:15px;"><p><b>From:</b> ${featureData.airport1}</p><p><b> To:</b> ${featureData.airport2} </p><p><b>Number of Migrants:</b> ${featureData.cnt}</p></div>`;

        layer.bindTooltip(toolTipContent, {
          direction: "right",
          sticky: true,
        });
      },
      dynamicOptions: function (record) {
        //console.log(record);

        //let lineColor = record.cnt > 10 ? "#FF0000" : "#000";
        let lineColor = getMapColor(record.cnt);

        return {
          layerOptions: {
            fill: false,
            color: lineColor,
            opacity: 1,
            weight: 5,
            fillOpacity: 1,
            distanceToHeight: new L.LinearFunction([0, 20], [1000, 300]),
            markers: {
              end: false,
            },

            // Use Q for quadratic and C for cubic
            mode: "C",
          },
        };
      },

      // legendOptions: {
      //   width: 200,
      //   numSegments: 5,
      //   className: "legend-line",
      // },
      // tooltipOptions: {
      //   iconSize: new L.Point(200, 65),
      //   iconAnchor: new L.Point(-5, 65),
      //   className: "leaflet-div-icon line-legend",
      // },
      /*displayOptions: {
        cnt: {
          //weight: new L.LinearFunction([0, 1], [maxCount, 14]),
          //weight: new L.LinearFunction([0, 1], [100, 3]),

          // color: new L.HSLHueFunction([0, 200], [maxCount, 330], {
          //   outputLuminosity: "60%",
          // }),
          weight: 3,
          color: "#000",
          //displayName: "Number of Migrants",
        },
      }, */
      // onEachRecord: function (layer, record) {
      //   layer.bindPopup(L.HTMLUtils.buildTable(record));
      // },
    };

    var allLayer = new L.Graph(flights, options);
    //console.log(allLayer);
    map.addLayer(allLayer);

    var airportsLayer = new L.MarkerDataLayer(airportsLookup, {
      recordsField: null,
      locationMode: L.LocationModes.LATLNG,
      latitudeField: "lat",
      longitudeField: "lon",
      displayOptions: {
        direct_flights: {
          color: new L.HSLHueFunction([0, 200], [maxCount, 330], {
            outputLuminosity: "60%",
          }),
        },
        code: {
          title: function (value) {
            return value;
          },
        },
      },
      layerOptions: {
        fill: false,
        stroke: false,
        weight: 1,
        color: "#000",
      },
      filter: function (record) {
        return Number(record.carriers) > 0;
      },
      setIcon: function (record, options) {
        /*var html =
          '<div><i class="icon-plane"></i><span class="code">' +
          record.code +
          "</span></div>"; */ // fas fa-plane-arrival // fas fa-arrow-down // fas fa-chevron-down

        var html = '<div><span class="code">' + record.code + "</span></div>";

        var $html = $(html);
        //var $i = $html.find("i");

        //L.StyleConverter.applySVGStyle($i.get(0), options);

        var directFlights = L.Util.getFieldValue(record, "direct_flights");
        var size = sizeFunction.evaluate(directFlights);

        // $i.width(size);
        // $i.height(size);
        // $i.css("font-size", size + "px");
        // $i.css("line-height", size + "px");

        var $code = $html.find(".code");

        $code.width(150);
        $code.height(50);
        $code.css("line-height", 20 + "px");
        $code.css("font-size", 10 + "px");
        $code.css("margin-top", 5 + "px");
        $code.css("color", "#000");

        var icon = new L.DivIcon({
          iconSize: new L.Point(size, size),
          iconAnchor: new L.Point(size / 2, size / 2),
          className: "airport-icon",
          html: $html.wrap("<div/>").parent().html(),
        });

        return icon;
      },
      onEachRecord: function (layer, record) {
        // layer.on('click', function () {
        //     $info.empty();
        //     $info.append($(L.HTMLUtils.buildTable(record)).wrap('<div/>').parent().html());
        //     allLayer.options.includeLayer = function (newRecord) {
        //         return newRecord.airport1 === record.code || newRecord.airport2 === record.code;
        //     };
        //     allLayer.reloadData();
        // });
      },
    });

    //map.addLayer(airportsLayer);
  };

  function MapReferenceMarker() {
    const map = useMap();
    //LeafletDVF();
    //console.log("Map Marker Ref:", map);

    setCurrentMapReference(map);
    //MigrantLayer(map);
    //AnimatedMigrantLayer(map);
    return null;
  }

  const getMapColor = (value) => {
    //console.log(value);

    let returnColor = "#8d8a82";
    let lowScale = [0, 11, 51];
    let highScale = [10, 50, 1000];
    let colorScale = ["#67cb60", "#1d6996", "#ff8080"];

    if (value !== undefined && value !== -1) {
      value = Number(value);
      if (value > highScale[highScale.length - 1]) {
        returnColor = colorScale[colorScale.length - 1];
      } else {
        for (var i = 0; i < lowScale.length; i++) {
          if (value >= lowScale[i] && value <= highScale[i]) {
            returnColor = colorScale[i];
            break;
          }
          if (value < lowScale[i]) {
            returnColor = colorScale[i];
            break;
          }
        }
      }
    }
    return returnColor;
  };
  let mapGeoJsonStyle = (feature) => {
    //console.log(feature);
    //console.log(mapIndicatorData);

    // let mapIndicatorData = [];
    // mapIndicatorData["I9jfaLculAp"] = 8;
    // mapIndicatorData["l9eB9W7EOPo"] = 49;
    // mapIndicatorData["ZyweqRVeQFD"] = 236;

    let featureValue = mapIndicatorData[feature.properties[shapeLabel]];

    return {
      //fillColor: getMapColor(featureValue),
      fillColor: getMapColor(featureValue),
      fillOpacity: 0.7,
      weight: 1,
      opacity: 1,
      color: "#FFF",
      //dashArray: "3",
    };
  };

  const onEachFeature = (feature, layer) => {
    //console.log(feature);
    //console.log(layer);

    if (feature.properties && feature.properties[shapeLabel]) {
      //layer.bindPopup(feature.properties.name);

      // let mapIndicatorData = [];
      // mapIndicatorData["I9jfaLculAp"] = 8;
      // mapIndicatorData["l9eB9W7EOPo"] = 49;
      // mapIndicatorData["ZyweqRVeQFD"] = 236;

      let toolTipContent = `<b>Total Registered in ${
        feature.properties[shapeLabel]
      }: ${
        mapIndicatorData[feature.properties[shapeLabel]] !== undefined
          ? Number(mapIndicatorData[feature.properties[shapeLabel]])
          : "N/A"
      }</b>`;

      layer.bindTooltip(toolTipContent, {
        direction: "auto",
        sticky: true,
      });

      layer.on({
        mouseover: (e) => {
          let thisLayer = e.target;
          thisLayer.setStyle({
            fillOpacity: 0.9,
            weight: 2,
            opacity: 1,
            color: "#FFF",
            //dashArray: '',
          });
        },
        mouseout: (e) => {
          let thisLayer = e.target;

          thisLayer.setStyle({
            fillOpacity: 0.7,
            weight: 1,
            opacity: 1,
            color: "#FFF",
            //dashArray: '',
          });
          //info.update();
        },
        click: function (e) {
          //console.log(e.target.feature.properties);
          let location = e.target.feature.properties.NAME_0;
          let province = e.target.feature.properties.NAME_1;
          console.log(location);
          console.log(province);

          if (province === "Kabul" || province === "Kandahar") {
            //setGeoJsonData(AFGDistrictShape);
            setShapeFileName("AfghanistanDistrict");
            setMapIndicatorData(AFGDistrictData);
            setShapeLabel("NAME_2");
            setMapZoom(mapDefaultZoom);
            setMapCenter([33.93911, 67.709953]);
            //setCurrentMapKey(currentMapKey + 1);
          } else if (province === "Tehran" || province === "Fars") {
            //setGeoJsonData(IRNDistrictShape);
            setShapeFileName("IranDistrict");
            setMapIndicatorData(IRNDistrictData);
            setShapeLabel("NAME_2");
            setMapZoom(mapDefaultZoom - 1);
            setMapCenter([32.42791, 53.688046]);
            //setCurrentMapKey(currentMapKey + 1);
          } else if (province === "Sind" || province === "Punjab") {
            //setGeoJsonData(PAKDistrictShape);
            setShapeFileName("PakistanDistrict");
            setMapIndicatorData(PAKDistrictData);
            setShapeLabel("NAME_2");
            setMapZoom(mapDefaultZoom - 1);
            setMapCenter([30.37532, 69.345116]);
            //setCurrentMapKey(currentMapKey + 1);
          } else if (location === "Afghanistan") {
            //console.log(location);
            //setGeoJsonData(AFGShape);
            setShapeFileName("AFG");
            setMapIndicatorData(AFGData);
            setShapeLabel("NAME_1");
            setMapZoom(mapDefaultZoom);
            setMapCenter([33.93911, 67.709953]);
            //setCurrentMapKey(currentMapKey + 1);
          } else if (location === "Iran") {
            //console.log(location);
            //setGeoJsonData(IRNShape);
            setShapeFileName("IRN");
            setMapIndicatorData(IRNData);
            setShapeLabel("NAME_1");
            setMapZoom(mapDefaultZoom - 1);
            setMapCenter([32.42791, 53.688046]);
            //setCurrentMapKey(currentMapKey + 1);
          } else if (location === "Pakistan") {
            //console.log(location);
            //setGeoJsonData(PAKShape);
            setShapeFileName("PAK");
            setMapIndicatorData(PAKData);
            setShapeLabel("NAME_1");
            setMapZoom(mapDefaultZoom - 1);
            setMapCenter([30.37532, 69.345116]);
            //setCurrentMapKey(currentMapKey + 1);
          }

          //mapDrilldown(e);
        },
        dblclick: function (e) {
          //console.log('dbl click');
        },
      });
    }
  };

  function LegendControl() {
    //const parentMap = useMap();

    let rangeScalesLow = [0, 11, 51];
    let rangeScalesHigh = [10, 50, 1000];
    let colorScales = ["#67cb60", "#1d6996", "#ff8080"];

    // Memoize the legend so it's not affected by position changes
    const legend = useMemo(
      () => (
        <div className="maplegend">
          <ListGroup horizontal>
            {rangeScalesHigh.length > 0
              ? colorScales.map((colorScale, index) => {
                  //console.log(colorScale);
                  return (
                    <ListGroup.Item key={index}>
                      <i
                        className="fa fa-circle fs-12px mr-2"
                        style={{ color: colorScale }}
                      ></i>
                      {`${rangeScalesLow[index]} ${
                        rangeScalesHigh[index] === undefined
                          ? "& Above"
                          : ` - ` + rangeScalesHigh[index]
                      }`}
                    </ListGroup.Item>
                  );
                })
              : ""}
            <ListGroup.Item>
              <i
                className="fa fa-circle fs-12px mr-2"
                style={{ color: "#8d8a82" }}
              ></i>
              N/A
            </ListGroup.Item>

            {/* <ListGroup.Item>
              <i class="fa fa-circle fs-12px mr-2"></i>Medium
            </ListGroup.Item>
            <ListGroup.Item>
              <i class="fa fa-circle fs-12px mr-2"></i>High
            </ListGroup.Item>
            <ListGroup.Item>
              <i class="fa fa-circle fs-12px mr-2"></i>Very High
            </ListGroup.Item> */}
          </ListGroup>
        </div>
      ),
      []
    );

    return (
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control leaflet-bar">{legend}</div>
      </div>
    );
  }

  const AnimatedMigrantLayer = (mapRef) => {
    let migrantData = [
      {
        from: [69.207489, 34.555347],
        to: [51.388973, 35.689198],
        labels: ["KABUL", "TEHRAN"],
        color: "#1d6996",
        value: 15,
      },
      {
        from: [69.207489, 34.555347],
        to: [69.805069, 30.43935],
        labels: ["KABUL", "MULTAN"],
        color: "#ff8080",
        value: 15,
      },
      {
        from: [74.358749, 31.52037],
        to: [65.712219, 31.612181],
        labels: ["LAHORE", "KANDAHAR"],
        color: "#67cb60",
        value: 15,
      },
      {
        from: [69.207489, 34.555347],
        to: [67.049561, 24.975769],
        labels: ["KABUL", "KARACHI"],
        color: "#ff8080",
        value: 15,
      },
      {
        from: [69.805069, 30.43935],
        to: [52.583698, 29.591768],
        labels: ["MULTAN", "SHIRAZ"],
        color: "#67cb60",
        value: 15,
      },
    ];

    if (migrantLayer === null) {
      let migrationLayer = new L.migrationLayer({
        map: mapRef,
        data: migrantData,
        pulseRadius: 30,
        pulseBorderWidth: 3,
        arcWidth: 1,
        arcLabel: false, //true
        arcLabelFont: "10px sans-serif",
        maxWidth: 10,
      });
      migrationLayer.addTo(mapRef);

      setMigrantLayer(migrationLayer);

      //console.log(migrationLayer);
    }
  };

  async function getShapeFile() {
    setLoadingMap(true);
    try {
      const res = await axios.get(
        `https://undp.imonitorplus.com/dashboarduat/shapeFile/${shapeFileName}.json`
      );
      console.log(res.data);
      setGeoJsonData(res.data);
      setCurrentMapKey(currentMapKey + 1);
      setShowMap(true);
      setLoadingMap(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getShapeFile();
  }, [shapeFileName]);
  //console.log(geoJsonData);
  return (
    <>
      <Loader isLoading={loadingMap} />
      {showMap === true ? (
        <MapContainer
          //refs={mapRef}
          key={currentMapKey}
          style={{ height: mapHeight + "rem" }}
          //style={mapStyle}
          center={mapCenter}
          zoom={mapZoom}
          //bounds={L.geoJson(geoJsonData).getBounds()}
          scrollWheelZoom={false}
        >
          <TileLayer
            //attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            //url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          />
          <GeoJSON
            key={currentMapKey}
            data={geoJsonData}
            style={mapGeoJsonStyle}
            onEachFeature={onEachFeature}
          ></GeoJSON>
          <MapReferenceMarker />
          <LegendControl />

          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Default View">
              <TileLayer
                attribution=""
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                attribution=""
                url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <div className="leaflet-top leaflet-right" style={{ right: "255px" }}>
            <div className="leaflet-control leaflet-bar">
              <div
                className="resetButton"
                onClick={() => updateGeoJson("world")}
              >
                Region
              </div>
            </div>
          </div>

          <div className="leaflet-top leaflet-right" style={{ right: "175px" }}>
            <div className="leaflet-control leaflet-bar">
              <div className="resetButton" onClick={() => updateGeoJson("AFG")}>
                Afghanistan
              </div>
            </div>
          </div>
          <div className="leaflet-top leaflet-right" style={{ right: "138px" }}>
            <div className="leaflet-control leaflet-bar">
              <div className="resetButton" onClick={() => updateGeoJson("IRN")}>
                Iran
              </div>
            </div>
          </div>
          <div className="leaflet-top leaflet-right" style={{ right: "75px" }}>
            <div className="leaflet-control leaflet-bar">
              <div className="resetButton" onClick={() => updateGeoJson("PAK")}>
                Pakistan
              </div>
            </div>
          </div>

          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
              <div className="resetButton" onClick={() => resetMap()}>
                Reset Map
              </div>
            </div>
          </div>
        </MapContainer>
      ) : (
        ""
      )}
    </>
  );
};

export default RegionalMap;
