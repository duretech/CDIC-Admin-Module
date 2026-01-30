export const barchart = (data, title, categories) => {
  return {
    chart: {
      type: "bar",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      animation: {
        duration: 1000,
      },
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "People per Country",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
      gridLineWidth: 0,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.key}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    //   tooltip: {
    //     valueSuffix: " millions",
    //   },
    plotOptions: {
      bar: {
        borderRadius: "2%",
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.0,
      },
    },
    colors: ["#d50032", "#0076af"],
    legend: {
      enabled: true,
      // labelFormat: '{name}: <span style="opacity: 1">{y}</span>'
    },
    credits: {
      enabled: false,
    },
    series: data,
  };
};

export const stagchart = (data, title, categories) => {
  return {
    chart: {
      type: "column",
    },
    title: {
      text: "",
      // align: "left",
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      stackLabels: {
        enabled: true,
      },
    },
    colors: [
      // "#ae324f",
      "#d50032",
      // "#c06076",
      "#0076af",
      // "#c9768a",
      // "#d28d9d",
      // "#dba4b1",
      "#e4bac4",
      "#edd1d8",
      "#f6e8eb",
    ],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    plotOptions: {
      series: {
        pointWidth: 50,
        dataLabels: {
          align: "center",
          enabled: true,
        },
      },
      column: {
        maxWidth: 10,
        stacking: "normal",
        dataLabels: {
          enabled: true,
          align: "center",
        },
      },
    },
    series: data,
  };
};

export const LineTarget = (data, title, xcatergories) => {
  return {
    chart: {
      zoomType: "xy",
    },
    title: {
      text: "",
    },
    colors: ["#d50032", "#0076af", "#d91946", "#edd1d8", "#f6e8eb"],
    xAxis: [
      {
        categories: xcatergories,
        labels: {
          enabled: true,
        },
        crosshair: false,
      },
    ],
    yAxis: [
      {},
      {
        opposite: true,
      },
      
      
    ],
    credits: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    plotOptions: {
      column: {
        maxWidth: 10,
        stacking: "normal",
        dataLabels: {
          enabled: true,
          align: "center",
        },
      },
      series: {
        pointWidth: 50,
        // dataLabels
      },
    },

    // colors: ["#a51c30C", "#334B48", "#96B1AD", "#88A6E0", "#5273A9"],
    legend: {
      enabled: false,
      // align: "left",
      // x: 80,
      // verticalAlign: "top",
      // y: 60,
      // floating: true,
      // backgroundColor:
      //     Highcharts.defaultOptions.legend.backgroundColor || // theme
      //     'rgba(255,255,255,0.25)'
    },
    series: [
      {
        name: "Count",
        type: "column",
        yAxis: 1,
        data: data,
        /* tooltip: {
            valueSuffix: ' mm'
        } */
      },
      // {
      //   name: "Threshold",
      //   type: "spline",
      //   data: title == "HTN /CVD Chart" ? [10,10,10,10] : [10,10,10,10,10,10,10,10,10,10],
      // },
    ],
  };
};

export const lineBMIChart = (data, title, categories) => {
  return {
    title: {
      text: "",
      align: "left",
    },

    subtitle: {
      text: "",
      align: "left",
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    yAxis: {
      title: {
        text: "Diabetic Children & Adolescents",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2010 to 2013",
      },
    },

    colors: ["#d50032", "#0076af", "#ffc40c", "#228b22"],

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2018,
      },
    },

    series: data,
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 300,
          },
          chartOptions: {
            // legend: {
            //   layout: "horizontal",
            //   align: "center",
            //   verticalAlign: "bottom",
            // },
          },
        },
      ],
    },
  };
};

export const pieChart = (data = [], title) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data format. Expected an array.");
    return {};
  }

  const total = data.reduce((sum, item) => sum + item.y, 0);

  const seriesData = data.map((item) => ({
    name: `${item.name}: ${((item.y / total) * 100).toFixed(2)}%`,
    y: item.y,
    color: item.color,
    label: item.label,
  }));

  return {
    chart: {
      type: "pie",
      height: "350",
      // width: "100%"
    },
    dataLabels:{
      enabled: true,
      connectorPadding: 20, // Adjust this value as needed
      softConnector: true
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
      },
      column: {
        // pointPadding: 0.2,
        borderWidth: 0,
        showInLegend: true,
      },
      series: {
        pointWidth: 20,
      },
    },
    tooltip: {
      enabled: false,
      // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      // pointFormat: '<tr><td style="padding:0">{series.name} </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      // footerFormat: "</table>",
      // useHTML: true,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
      // layout: 'vertical',
      // maxWidth: 250,
    },
    colors: [
      "#a51c30",
      "#ae3244",
      "#e4bac0",
      "#edd1d5",
      "#b74959",
      "#c0606e",

      "#f6e8ea",
    ],
    series: [
      {
        showInLegend: true,
        name: "",
        keys: ["name", "y", "color", "label"],
        data: seriesData,
        dataLabels: {
          padding: 0,
          style: {
            fontSize: "9px",
          },
          enabled: true,
          format: "<b>{point.name}</b>",
        },
      },
    ],
  };
};

export const HardcodePieChart = (data,title) => {
  return{
    chart: {
      type: "pie",
      height: "350",
      // width: "100%"
    },
    dataLabels:{
      enabled: true,
      connectorPadding: 20, // Adjust this value as needed
      softConnector: true
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
      },
      // column: {
      //   // pointPadding: 0.2,
      //   borderWidth: 0,
      //   showInLegend: true,
      // },
      // series: {
      //   pointWidth: 20,
      // },
    },
    tooltip: {
      enabled: false,
      // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      // pointFormat: '<tr><td style="padding:0">{series.name} </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      // footerFormat: "</table>",
      // useHTML: true,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
      // layout: 'vertical',
      // maxWidth: 250,
    },
    colors: [
      "#a51c30",
      "#ae3244",
      "#e4bac0",
      "#edd1d5",
      "#b74959",
      "#c0606e",

      "#f6e8ea",
    ],
  series: [
      {
          name: 'Percentage',
          colorByPoint: true,
          data: [
              {
                  name: 'No co-morbidity reported',
                  y: 25
              },
              {
                  name: 'Mental Health',
                  // sliced: true,
                  // selected: true,
                  y: 25
              },
              {
                  name: 'caliac Diseases',
                  y: 30
              },
              {
                  name: 'others',
                  y: 20
              }
          ],
          dataLabels: {
            padding: 0,
            style: {
              fontSize: "9px",
            },
            enabled: true,
            format: "<b>{point.name}: {point.y}%</b>",
          },
      }
  ]
  }
}

export const highlightTableConfig = (data, title, yAxiscategories) => {
  return {
    chart: {
      type: "heatmap",
      marginTop: 40,
      marginBottom: 20,
      plotBorderWidth: 1,
    },

    title: {
      text: "",
    },

    xAxis: {
      categories: [""],
    },

    yAxis: {
      categories: yAxiscategories,
      title: null,
      reversed: true,
    },

    accessibility: {
      point: {
        descriptionFormat:
          "{(add index 1)}. " +
          "{series.xAxis.categories.(x)} sales " +
          "{series.yAxis.categories.(y)}, {value}.",
      },
    },

    colorAxis: {
      min: 0,
      minColor: "#FFFFFF",
      maxColor: "#ae324f",
      // maxColor: Highcharts.getOptions().colors[0]
    },
    credits: {
      enabled: false,
    },

    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "top",
      y: 25,
      symbolHeight: 280,
    },
    // tooltip: {
    //   // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //   format:
    //     "<b>{series.xAxis.categories.(point.x)}</b> sold<br>" +
    //     "<b>{point.value}</b> items on <br>" +
    //     "<b>{series.yAxis.categories.(point.y)}</b>",
    //   // footerFormat: "</table>",
    //   useHTML: true,
    // },
    // tooltip: {
    //   // headerFormat: '<span style="font-size:10px">{point.value}</span>',
    //   // pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
    //   // footerFormat: "</table>",
    //   // useHTML: true,

    series: [
      {
        name: title,
        borderWidth: 1,
        data: data,
        dataLabels: {
          enabled: true,
          color: "#000000",
        },
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              // labels: {
              //   format: "{substr value 0 1}",
              // },
            },
          },
        },
      ],
    },
  };
};
