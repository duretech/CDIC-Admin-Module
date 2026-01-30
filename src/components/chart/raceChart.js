import React from "react";
import { select as d3Select } from "d3";
import barChartRace from "./barChartRace";
const RaceChart = ({
  raceChartData,
  activeIndi,
  raceChartId,
  expanded,
  stopbutton,
  dateButton,
}) => {
  var width = 495;
  var height = 505;
  // if (this.raceChartData.length > 16) {
  //     $('.raceChartContainers').css({ 'max-height': '505px', 'overflow-y': 'scroll' })
  // }
  var color = "#0191d8";
  const myChart = barChartRace(
    raceChartId,
    color,
    expanded,
    width,
    height,
    stopbutton,
    dateButton,
    raceChartData
  );
  //console.log(raceChartId, color, expanded, width, height, stopbutton, dateButton, raceChartData, "raceChart")
  myChart
    // .setTitle("Bar Chart Race Title")
    .addDatasets(raceChartData)
    .render(raceChartData.length - 1);

  d3Select("." + stopbutton).on("click", function () {
    // console.log("click");
    if (this.innerHTML === "Stop") {
      this.innerHTML = "Resume";
      myChart.stop();
    } else if (this.innerHTML === "Resume") {
      this.innerHTML = "Stop";
      myChart.start();
    } else {
      this.innerHTML = "Stop";
      myChart.render();
    }
  });
  return (
    <div>
      <button id={stopbutton} class="btn btn-sm btn-grey mr-1">
        Stop
      </button>
      <button
        id="racechartBtnDate"
        class={dateButton + "btn btn-sm btn-grey mr-1"}
      ></button>
      <svg id={raceChartId}>
        <g class="chart-container">
          <text class="chart-title"></text>
          <g class="x-axis"></g>
          <g class="y-axis"></g>
          <g class="columns"></g>
        </g>
      </svg>
    </div>
  );
};

export default RaceChart;
