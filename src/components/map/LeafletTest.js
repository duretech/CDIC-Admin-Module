import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { mapDefaultCenter, mapDefaultZoom } from "../../config/appConfig";

import L, { marker } from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import MarkerClusterGroup from "./react-leaflet-markercluster";

require("react-leaflet-markercluster/dist/styles.min.css");


let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;


const LeafletTest = ({ mapKey, mapHeight, markerData }) => {
  // console.log(markerData);
  const [mapZoom, setMapZoom] = useState(mapDefaultZoom);
  const [mapCenter, setMapCenter] = useState(mapDefaultCenter);
  const [currentMapReference, setCurrentMapReference] = useState();
  const mapRef = useRef();
  const [map, setMap] = useState();
  useEffect(() => {
  }, [markerData]);
  const getBounds = useMemo(() => {
    let arr = []
    markerData?.map((marker, id) => (
      marker.coordinates  ?
      arr.push([marker.coordinates[1], marker.coordinates[0]]) : null
    ))
    if (arr.length > 0 && currentMapReference != null){
      mapRef.fitBounds(arr)
    }
    console.log(map,"mapRef")

    return arr
  })
  console.log(getBounds,"getBounds")
  return (
    <>
      <MapContainer
        refs={mapRef}
        bounds={getBounds}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        whenCreated={setMap}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        {/* <HeatmapLayer  points={getBounds}/> */}
        <MarkerClusterGroup>
          {markerData
            ? markerData.map((marker, id) => (
              marker.coordinates ?
                <Marker
                  key={`marker-${id}`}
                  position={[marker.coordinates[1], marker.coordinates[0]]}
                >
                  <Popup>
                    <p>
                      <b>UIC:</b> {marker['Unique ID']}
                    </p>
                    <p>
                      <b>First Name:</b> {marker['Patient Name']}
                    </p>
                    <p>
                      <b>Gender:</b> {marker['Gender_UAT']}
                    </p>
                    <p>
                      <b>Age:</b> {marker['Age']}
                    </p>
                  </Popup>
                </Marker> : ""
            ))
            : ""}
        </MarkerClusterGroup>;
      </MapContainer>
    </>
  )
};
export default LeafletTest;