import React, { useState, useMemo, useEffect } from "react";
//import { render } from "react-dom";
import _ from "underscore";
import axios from "axios";
//import ScriptTag from "react-script-tag";
import $ from "jquery";
import L from "leaflet";
import html2canvas from "html2canvas";
import {
  MapContainer,
  GeoJSON,
  TileLayer,
  Circle,
  Popup,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet-dvf";
import "leaflet-geometryutil";
//import "leaflet.migration";
//import "leaflet.migration/dist/index.js";
// import "leaflet.migration/dist/index";
// import "leaflet-basemaps/L.Control.Basemaps";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import {
  mapDefaultCenter,
  mapDefaultZoom,
  circleMarkerDataAll,
  circleMarkerDataAFG,
  circleMarkerDataIRN,
  circleMarkerDataPAK,
} from "../../config/appConfig";
import { ListGroup } from "react-bootstrap";
import Loader from "../loaders/loader";

require("leaflet-dvf/dist/css/dvf.css");
// require("leaflet-basemaps/L.Control.Basemaps.css");

//const worldShape = require("../../assets/shapeFile/AFG_IRN_PAK.json");

let worldData = [];
worldData["Afghanistan"] = 8;
worldData["Iran"] = 49;
worldData["Pakistan"] = 236;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const HotspotMap = ({ mapKey, mapHeight }) => {
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
  const [mapView, setMapView] = useState("choropleth");
  const [circleMarkerData, setCircleMarkerData] = useState(circleMarkerDataAll);

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

    setGeoJsonData(geoJsonData);
    setMapIndicatorData(worldData);
    setShapeLabel("NAME_0");
    setMapZoom(mapDefaultZoom - 1);
    setMapCenter([32.094645767953665, 59.55465316772462]);
    setCircleMarkerData(circleMarkerDataAll);
    setCurrentMapKey(currentMapKey + 1);
    //currentMapReference.setView(mapDefaultCenter);
  };

  const exportMap = (e) => {
    e.preventDefault();
    console.log("Export Map");

    let downloadURI = function (uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
    };

    html2canvas(document.getElementById("migrantMap3"), {
      allowTaint: true,
      useCORS: true,
    }).then(function (canvas) {
      var myImage = canvas.toDataURL("image/png");
      downloadURI("data:" + myImage, "Map.png");
    });
  };

  const updateGeoJson = (location) => {
    console.log(location);
    //console.log(currentMapKey);
    //console.log(currentMapReference);
    if (location === "world") {
      setMapView("choropleth");
      setGeoJsonData(geoJsonData);
      setMapIndicatorData(worldData);
      setShapeLabel("NAME_0");
      setMapZoom(mapDefaultZoom - 1);
      setMapCenter([32.094645767953665, 59.55465316772462]);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "AFG") {
      //console.log(location);
      setMapView("hotspot");
      setMapZoom(mapDefaultZoom);
      setMapCenter([33.93911, 67.709953]);
      setCircleMarkerData(circleMarkerDataAFG);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "IRN") {
      //console.log(location);
      setMapView("hotspot");
      setMapZoom(mapDefaultZoom);
      setMapCenter([32.42791, 53.688046]);
      setCircleMarkerData(circleMarkerDataIRN);
      setCurrentMapKey(currentMapKey + 1);
    } else if (location === "PAK") {
      //console.log(location);
      setMapView("hotspot");
      setMapZoom(mapDefaultZoom);
      setMapCenter([30.37532, 69.345116]);
      setCircleMarkerData(circleMarkerDataPAK);
      setCurrentMapKey(currentMapKey + 1);
    }
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
      fillColor: getMapColor(featureValue),
      fillOpacity: 0,
      weight: 0.7,
      opacity: 1,
      color: "#000",
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
            fillOpacity: 0,
            weight: 0.7,
            opacity: 1,
            color: "#000",
            //dashArray: '',
          });
        },
        mouseout: (e) => {
          let thisLayer = e.target;

          thisLayer.setStyle({
            fillOpacity: 0,
            weight: 0.7,
            opacity: 1,
            color: "#000",
            //dashArray: '',
          });
          //info.update();
        },
        click: function (e) {
          //console.log(e.target.feature.properties);
          console.log(e.target.feature.properties.NAME_0);
          //console.log(e.target.feature.properties.NAME_1);
          let location = e.target.feature.properties.NAME_0;
          //let province = e.target.feature.properties.NAME_1;

          if (location === "Afghanistan") {
            //console.log(location);
            setMapView("hotspot");
            setMapZoom(mapDefaultZoom);
            setMapCenter([33.93911, 67.709953]);
            setCircleMarkerData(circleMarkerDataAFG);
            setCurrentMapKey(currentMapKey + 1);
          } else if (location === "Iran") {
            //console.log(location);
            setMapView("hotspot");
            setMapZoom(mapDefaultZoom);
            setMapCenter([32.42791, 53.688046]);
            setCircleMarkerData(circleMarkerDataIRN);
            setCurrentMapKey(currentMapKey + 1);
          } else if (location === "Pakistan") {
            //console.log(location);
            setMapView("hotspot");
            setMapZoom(mapDefaultZoom);
            setMapCenter([30.37532, 69.345116]);
            setCircleMarkerData(circleMarkerDataPAK);
            setCurrentMapKey(currentMapKey + 1);
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

  async function getShapeFile() {
    setLoadingMap(true);
    try {
      const res = await axios.get(
        "https://undp.imonitorplus.com/dashboarduat/shapeFile/AFG_IRN_PAK.json"
      );
      console.log(res.data);
      setGeoJsonData(res.data);
      setShowMap(true);
      setLoadingMap(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getShapeFile();
  }, []);

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
          id="migrantMap3"
        >
          {/* <TileLayer
          //attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          //url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        /> */}
          <MapReferenceMarker />
          {/* {mapView === "choropleth" ? ( */}
          <>
            <GeoJSON
              key={currentMapKey}
              data={geoJsonData}
              style={mapGeoJsonStyle}
              onEachFeature={onEachFeature}
            ></GeoJSON>

            {/* <LegendControl /> */}
          </>
          {/* ) : ( */}

          {circleMarkerData.map((el, index) => {
            //console.log(el);
            //console.log(index);
            return (
              <Circle
                key={index}
                pathOptions={{
                  //color: "#CB181D",
                  fillColor: "#CB181D",
                  fillOpacity: "0.9",
                }}
                center={el.latlon}
                radius={7000}
                stroke={false}
              >
                <Popup>{el.name}</Popup>
              </Circle>
            );
          })}
          {/* )} */}

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

          {/* <div className="leaflet-top leaflet-right" style={{ right: "255px" }}>
          <div className="leaflet-control leaflet-bar">
            <div className="resetButton" onClick={() => updateGeoJson("world")}>
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
        </div> */}

          <div className="leaflet-top leaflet-right" style={{ right: "75px" }}>
            <div className="leaflet-control leaflet-bar">
              <div className="resetButton" onClick={(e) => exportMap(e)}>
                Export Map
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

export default HotspotMap;
