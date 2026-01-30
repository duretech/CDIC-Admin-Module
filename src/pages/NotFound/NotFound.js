import React from "react";
import { connect } from "react-redux";

const NotFound = ({ props }) => {
  return (
    <div className="mainContainer">
      <div className="container-fluid pt-64 pl-1 pr-1">Not Found</div>
      <footer className="footer">
        <p>Powered By</p>
        <img
          src={require("../../assets/images/durelogowhite.png")}
          alt="gallary"
          className="ml-2"
        />
      </footer>
    </div>
  );
};
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(NotFound);
