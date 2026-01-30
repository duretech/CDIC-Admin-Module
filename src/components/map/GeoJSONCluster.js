import L, { Icon } from "leaflet";
import { MapLayer, PropTypes as ReactLeafletPropTypes } from "react-leaflet";
import PropTypes from "prop-types";
import "leaflet.markercluster";
//import markerIcon from "../public/images/markers/marker.png";

export default class GeoJSONCluster extends MapLayer {
  static contextTypes = {
    ...ReactLeafletPropTypes,
  };

  createLeafletElement = () => {};

  componentWillMount() {
    super.componentWillMount();
    this.leafletElement = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      maxClusterRadius: 15,
    });
  }

  componentDidMount() {
    super.componentDidMount();
    const geoJSON = L.geoJson(this.props.data, {
      pointToLayer(feature, latlng) {
        const icon = new Icon({
          //iconUrl: markerIcon,
          //iconSize: [41, 41]
        });
        return L.marker(latlng, { icon }).bindPopup(
          `<strong>I'm a beautiful pop-up</strong>`
        );
      },
    });

    this.leafletElement.addLayer(geoJSON);
  }
}
