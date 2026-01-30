import React from "react";
import { useState, useEffect, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { chart } from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import drilldown from "highcharts/modules/drilldown.js";
import ItemSeries from 'highcharts/modules/item-series';
import HC_more from "highcharts/highcharts-more";
import highchartsDumbbell from "highcharts/modules/dumbbell";
import highchartsLollipop from "highcharts/modules/lollipop";
import treemap from 'highcharts/modules/treemap';

treemap(Highcharts);
HC_more(Highcharts);
Highcharts3d(Highcharts);
ItemSeries(Highcharts)
drilldown(Highcharts);
highchartsDumbbell(Highcharts);
highchartsLollipop(Highcharts);

require("highcharts/modules/exporting")(Highcharts);
require('highcharts/modules/map')(Highcharts);


const ChartComponent = ({ options, styleObj }) => {
  //console.log(styleObj);
  // console.log(options);
  const chartComponent = useRef(null);
  useEffect(() => {
    const chart = chartComponent;
  }, []);
  const fullScreen = () => {
    console.log(chart)
    // Highcharts.FullScreen(chart.container);
    // chart.fullscreen = new Highcharts.FullScreen(chart.container)
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <HighchartsReact
        highcharts={Highcharts}
        allowChartUpdate={true}
        options={options}
        ref={chartComponent}
        //style={{ overflow: "scroll" }}
      />
      {/* <button onClick={(e) =>fullScreen()}>full</button> */}
    </div>
  );
};

export default ChartComponent;
