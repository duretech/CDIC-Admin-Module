import React, { Component } from 'react';
const data = {
    "dashboardItems": [
      {
        "id": "cSMgx6PiQlZ",
        "type": "CHART",
        "x": 45,
        "w": 13,
        "y": 0,
        "h": 7,
        "chart": {
          "id": "ocntNdfqNjZ",
          "description": "Enrolled",
          "name": "Enrolled",
          "type": "SINGLE_VALUE"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "G3dsDPILsnw",
        "type": "CHART",
        "x": 23,
        "w": 19,
        "y": 7,
        "h": 20,
        "chart": {
          "id": "czH4CGQLMV7",
          "description": "Cascade By symptoms",
          "name": "Cascade By symptoms",
          "type": "COLUMN"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "FoXJmNCSO55",
        "type": "CHART",
        "x": 0,
        "w": 22,
        "y": 7,
        "h": 20,
        "chart": {
          "id": "wqN3owD4KM2",
          "description": "Cascade chart",
          "name": "Cascade chart",
          "type": "COLUMN"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "gKvieyUxjIN",
        "type": "CHART",
        "x": 33,
        "w": 12,
        "y": 0,
        "h": 7,
        "chart": {
          "id": "G6yLktdqpPi",
          "description": "Positive",
          "name": "Positive",
          "type": "SINGLE_VALUE"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "Hk0PrarXhBp",
        "type": "CHART",
        "x": 22,
        "w": 11,
        "y": 0,
        "h": 7,
        "chart": {
          "id": "hKm9iggvyxE",
          "description": "Number Of Clients Tested",
          "name": "Tested",
          "type": "SINGLE_VALUE"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "eCJIIH34LQF",
        "type": "CHART",
        "x": 11,
        "w": 11,
        "y": 0,
        "h": 7,
        "chart": {
          "id": "BWQKT8uv7PD",
          "description": "Number of clients Referred",
          "name": "Referred",
          "type": "SINGLE_VALUE"
        },
        "reports": [],
        "resources": [],
        "users": []
      },
      {
        "id": "r76QSypMuP6",
        "type": "CHART",
        "x": 0,
        "w": 11,
        "y": 0,
        "h": 7,
        "chart": {
          "id": "rXrysWwRksy",
          "description": "Number Of Patients Registered",
          "name": "Registered",
          "type": "SINGLE_VALUE"
        },
        "reports": [],
        "resources": [],
        "users": []
      }
    ]
  }
const listItems = data.dashboardItems.map((number) =>
<div key={number.id.toString()} className="peopleserveddiv">
        <p className="title mb-0">{number.chart.name}</p>
<p className="digit color-white font-weight-bold mb-0">{number.id}</p>
</div>
);
class KeyNumber extends Component {
    render() {
      return (
        <div className="col-md-2 pl-0 pr-0 resultssidemenucontainer leftshadow keystatssidebar">
        <div className="card sidemenucard">
            <div className="card-header brandon-grotesque-medium color-white   border-bottom-0" >
                Indicators
            </div>
            <div className="card-body p-0 resultssidemenubody casescardbody">
                {/* {listItems} */}
                <div v-if="totalRegister != 'N/A'" className="peopleserveddiv">
                    <p className="title mb-0">Index Registered</p>
                    <p className="digit color-white font-weight-bold mb-0">{this.props.indexRegister}</p>
                </div>
                <div v-if="qualifyInvestig != 'N/A'" className="peoplereacheddiv">
                    <p className="title mb-0">Contact registered</p>
                    <p className="digit color-white font-weight-bold mb-0">{this.props.contactRegister}</p>
                </div>
                <div v-if="suspected != 'N/A'" className="suspecteddiv">
                    <p className="title mb-0">Referred to Investigation - TB</p>
                    <p className="digit color-white font-weight-bold mb-0">{this.props.referedTB}</p>
                </div>
                <div v-if="probable != 'N/A'" className="probablediv">
                    <p className="title mb-0">Referred to Investigation - LTBI</p>
                    <p className="digit color-white font-weight-bold mb-0">{this.props.referedLTBI}</p>
                   
                </div>
            </div>
        </div>
    </div>
      );
    }
  }
  
  export default KeyNumber;