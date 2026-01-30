export const columnConfig = (
  charttype,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
  
) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: charttype,
      animation: {
        duration: 1000
      },
      height: "350",
      //width: "",
    },
    title: {
      text: "",
      //widthAdjust:-50,
      style: {
        color: "#000",
      },
    },

    xAxis: {
      categories: xaxis,
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: yaxis,
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      enabled: true,
    },
    
    tooltip: {

      useHTML: true,
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, "#FFFFFF"],
          [1, "#E0E0E0"],
        ],
      },
      borderWidth: 1,
      borderColor: "#AAA",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        //   format: '{point.name}',
        // style: {
        //     textOutline: false, // disable text outline
        //     fontWeight: 'normal', // normal font weight
        // },
        // padding: 5 // Add padding between data labels

        },
      },
      column: {
        animation: {
          duration: 2000
        },
        borderWidth: 0,
        //pointPadding: 0.2,
      },
      series: {
        animation: {
          duration: 2000
        }
        //pointWidth: 3,
      },
    },
    exporting: {
      enabled: false
    },
    colors: [
      "#002060",
      "#ff779e",
      "#00acb1",
      "#004f88",
      "#71baf3",
    ],
    series: seriesdata,
  };
};

export const BarConfig = (
  charttype,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
  
  
) => {
  console.log("inchart",charttype,seriesdata,xaxis)
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: charttype,
      animation: {
        duration: 1000
      },
      height: "350",
      // width: "420",
    },
    title: {
      text: "",
      //widthAdjust:-50,
      style: {
        color: "#000",
      },
    },

    xAxis: {
      visible: false,
      // categories: ['Below 5','5 to 12','13 to 19','Above 19'],
      // gridLineWidth: 0,
      // scalable: true,
      // scrollbar: {
      //   enabled: true,
      // },
    },
    yAxis: {
      min: 0,
      title: {
        text: yaxis,
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      enabled: true,
      layout: "vertical", // Set legend layout to vertical
      align: "left",
      verticalAlign: "middle",
      itemMarginBottom: 15, // Add bottom spacing of 10px
      itemMarginTop: 15 // Add top spacing of 10px
    },

    
    tooltip: {

      useHTML: true,
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, "#FFFFFF"],
          [1, "#E0E0E0"],
        ],
      },
      borderWidth: 1,
      borderColor: "#AAA",
      formatter: function() {
        return '<span style="font-size: 10px">' + this.series.name + '</span><br>' +
          ' <b>' + this.point.y + '</b>';
      }
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
      },
      column: {
        animation: {
          duration: 2000
        },
        borderWidth: 0,
        //pointPadding: 0.2,
      },
      bar: {
        // borderRadius: '2%',
        dataLabels: {
            enabled: false
        },
        // groupPadding: 0.1
    },
      series: {
        animation: {
          duration: 2000
        }
        //pointWidth: 3,
      },
      
    },
    exporting: {
      enabled: false
    },
    colors: [
      "#002060",
      "#ff779e",
      "#00acb1",
      "#004f88",
      "#71baf3",
    ],
    series: seriesdata,
  };
};

export const TreeConfig = (
  charttype,
  seriesdata,
  xaxis,
) => {
  return{
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      // type: charttype,
      animation: {
        duration: 1000
      },
      height: "350px",
      // width: "200",
    },
    legend: {
      enabled: true,
    },
    // "#002060",
    //   "#ff779e",
    //   "#00acb1",
    //   "#004f88",
    //   "#71baf3",
    colorAxis: {
      minColor: '#71baf3',
      maxColor: '#00acb1'
  },credits: {
    enabled: false,
  },
  tooltip: {

    useHTML: true,
    backgroundColor: {
      linearGradient: [0, 0, 0, 60],
      stops: [
        [0, "#FFFFFF"],
        [1, "#E0E0E0"],
      ],
    },
    borderWidth: 1,
    borderColor: "#AAA",
  },
  title: {
    text: "",
  },

  series: [{
      type: 'treemap',
      layoutAlgorithm: 'squarified',
      clip: false,
      data: seriesdata,
      dataLabels: {
        enabled: true,
        format: '{point.name}',
        style: {
          textOutline: false, // disable text outline
          fontWeight: 'normal', // normal font weight
        },
        // align: 'right',
        verticalAlign: 'middle',
        x: 35, // Adjust the horizontal position to move the data labels more to the right
        y: 0 // Keep the vertical position unchanged

      },
    }],
    exporting: {
      enabled: false
    }



  


  }
}

export const stackConfig = (
  charttype,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: charttype,
      height: (9 / 12) * 100 + "%",
    },
    title: {
      text: charttitle,
      //widthAdjust:-50,
      style: {
        color: "#ffc107",
      },
    },
    xAxis: {
      categories: xaxis,
    },
    yAxis: {
      title: {
        text: yaxis,
      },
    },
    tooltip: {
      enabled: true,
      // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.count}</b> ({point.y:.2f}%)</b> of total: {point.total}<br/>',
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
      shared: true,
      /* formatter: function(e){
                return this.x +" : <b>"+this.y.toFixed(0)+"</b>";
            } */
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        stacking: "normal",
        dataLabels: {
          enabled: true,
          format: "{point.y}</b> ({point.percentage:.0f}%)",
        },
      },
    },
    series: seriesdata,
  };
};

export const pieConf = (p_data, p_text) => {
  //console.log(p_data);
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "",
    },
    // tooltip: {
    //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    // },
    tooltip: {
      //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //pointFormat:'<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      //footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, "#FFFFFF"],
          [1, "#E0E0E0"],
        ],
      },
      borderWidth: 1,
      borderColor: "#AAA",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    credits: {
      enabled: false,
    },
    colors: [
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
    ],
    exporting: {
      // menuItemDefinitions: {
      //   // Custom definition
      //   label: {
      //     onclick: function () {
      //       this.renderer
      //         .label("You just clicked a custom menu item", 100, 100)
      //         .attr({
      //           fill: "#a4edba",
      //           r: 5,
      //           padding: 10,
      //           zIndex: 10,
      //         })
      //         .css({
      //           fontSize: "1.5em",
      //         })
      //         .add();
      //     },
      //     text: "Show label",
      //   },
      // },
      buttons: {
        contextButton: {
          //menuItems: ["downloadPNG", "downloadSVG", "separator", "label"],
          menuItems: [
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
          ],
        },
      },
    },
    series: [
      {
        name: "",
        colorByPoint: true,
        data: p_data,
      },
    ],
  };
};

export const lineConfig = (seriesdata, xaxis, charttitle, yaxis = "") => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: "line",
      height: "280px",
    },
    title: {
      text: charttitle,
      widthAdjust: -50,
      style: {
        color: "#ffc107",
      },
    },
    xAxis: {
      categories: xaxis,
    },
    yAxis: {
      title: {
        text: yaxis,
      },
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.count}</b> ({point.y:.2f}%)</b> of total: {point.total}<br/>',
      formatter: function (e) {
        return this.x + " : <b>" + this.y.toFixed(0) + "</b>";
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
      },
      column: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.count} ({point.percent:.1f}%)",
        },
      },
    },
    series: seriesdata,
  };
};

export const parlimentConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie', // Changed type to 'pie' for pie chart
      height: '350'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '' // Use the provided chart title
    },
    legend: {
      enabled: true,
    },
    
    colors: [
      "#002060",
      "#ff779e",
      "#00acb1",
      "#004f88",
      "#71baf3",
    ],
    tooltip: {
      headerFormat: '<span style="font-size:10px">{series.name}</span><table>',
      pointFormat: '<tr><td style="padding:0">{point.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          // color: "black",
          enabled: false,
          // distance: 10, // Adjust this value to control the distance of labels from the pie chart
          // connectorPadding: 5,
          // format: '({point.percentage:.1f}%){point.y}'
        },
       
       showInLegend: true,   
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
      }
  },
    series: [{
      name: 'Count', // Name for the series
      innerSize: '30%',
      data: seriesdata,
    }],
    exporting: {
      enabled: false
    }
  };
};


export const SemidonutConfig = (

) => {
  return{
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: 0,
      plotShadow: false
  },
  title: {
      text: '',
      
  },
  credits: {
    enabled: false,
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                  fontWeight: 'bold',
                  color: 'white'
              }
          },
          startAngle: -80,
          endAngle: 80,
          center: ['50%', '75%'],
          size: '110%'
      }
  },
  series: [{
      type: 'pie',
      name: 'Browser share',
      innerSize: '50%',
      data: [
          ['Chrome', 73.86],
          ['Edge', 11.97],
          ['Firefox', 5.52],
          ['Safari', 2.98],
          ['Internet Explorer', 1.90],
          ['Other', 3.77]
      ]
  }]
  }
}
export const ageConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      type: 'column',
      plotShadow: false,
      height: '350'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
      categories: [
        '0-9',
        '10-19',
        '20-29',
        '30-39',
        '40-49',
        '50-59',
        '60-69',
        '70-79',
        '80-89',
        '90-100'
      ],
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    plotOptions: {
      column: {
        // pointPadding: 0.2,
        borderWidth: 0,

        showInLegend: true
      },
      series: {
        pointWidth: 20
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    series: [{
      name: 'Age Distribution',
      data: seriesdata

    }]
  };
};
export const genderConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      type: 'column',
      height: '350'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: ''
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    xAxis: {

      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
      categories: [
        '0-9',
        '10-19',
        '20-29',
        '30-39',
        '40-49',
        '50-59',
        '60-69',
        '70-79',
        '80-89',
        '90-100'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      },
      series: {
        pointWidth: 20
      }
    },
    series: [{
      name: '',
      data: [10, 34, 83, 97, 41, 37, 11, 5, 2]

    }]
  };
};
export const migrConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      height: '350'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    xAxis: {
      categories: ['Total documented migrant ', 'Total non-documented migrant ', 'Total refugees ', 'Total Returnees ', 'Total IDPs '],
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        pointWidth: 25,
        stacking: 'normal',
        animation: {
          duration: 2000
        }
      }
    },
    series: [{
      name: 'TB',
      data: [5, 3, 4, 7, 2]
    }, {
      name: 'LTBI',
      data: [2, 2, 3, 2, 1]
    }]
  };
};
export const genderPieConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '350'
    },
    title: {
      text: '',
      align: 'center',
      verticalAlign: 'middle',
      y: 60
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '110%',
        showInLegend: true,
        borderWidth: 0,
      }
    },
    legend: {
      enabled: true
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    tooltip: {

      headerFormat: '<span style="font-size:10px">{series.name}</span><table>',
      pointFormat: '<tr><td style="padding:0">{point.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    series: [{
      type: 'pie',
      name: 'Gender',
      innerSize: '70%',
      data: seriesdata,

    }]
  };
};
export const drillDownConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      type: 'column',
      height: '350'
    },
    title: {
      text: ''
    },
    lang: {
      drillUpText: '< Back'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: '{point.y:.1f}%'
        },
        pointWidth: 10,
      }
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    series: [
      {
        name: "Registration",
        colorByPoint: true,
        showInLegend: false,
        data: [
          {
            name: "Afghanistan",
            y: 222,
            drilldown: "Afghanistan"
          },
          {
            name: "Pakistan",
            y: 65,
            drilldown: "Pakistan"
          },
          {
            name: "Iran",
            y: 38,
            drilldown: "Iran"
          }
        ],
        pointWidth: 35
      }
    ],
    drilldown: {
      series: [
        {
          name: "Afghanistan",
          id: "Afghanistan",
          data: [
            [
              "Badakhshan",
              97
            ],
            [
              "Badghis",
              27
            ],
            [
              "Baghlan",
              13
            ],
            [
              "Balkh",
              61
            ],
            [
              "Bamyan",
              24
            ],
            [
              "Dykundi",
              0.56
            ],
            [
              "Farah",
              0.45
            ],
            [
              "Faryab",
              0.49
            ],
            [
              "Ghazni",
              0.32
            ],
            [
              "Ghor",
              0.29
            ],
            [
              "Helmand",
              0.79
            ],
            [
              "Hirat",
              0.18
            ],
            [
              "Jawzjan",
              0.13
            ],
            [
              "Kabul",
              2.16
            ],
            [
              "Kandahar",
              0.13
            ],
            [
              "Kapisa",
              0.11
            ],
            [
              "Khost",
              0.17
            ],
            [
              "Kunar",
              0.26
            ],
            [
              "Kunduz",
              0.26
            ],
            [
              "Laghman",
              0.26
            ],
            [
              "Logar",
              0.26
            ],
            [
              "Nangarhar",
              0.26
            ],
            [
              "Nimroz",
              0.26
            ],
            [
              "Nooristan",
              0.26
            ],
            [
              "Paktika",
              0.26
            ],
            [
              "Paktya",
              0.26
            ],
            [
              "Panjsher",
              0.26
            ],
            [
              "Parwan",
              0.26
            ],
            [
              "Samangan",
              0.26
            ],
            [
              "Sar-e-Pul",
              0.26
            ],
            [
              "Takhar",
              0.26
            ],
            [
              "Urozgan",
              0.26
            ],
            [
              "Wardak",
              0.26
            ],
            [
              "Zabul",
              0.26
            ]
          ]
        },
        {
          name: "Pakistan",
          id: "Pakistan",
          data: [
            [
              "KP",
              34
            ],
            [
              "Balochistan",
              31
            ]
          ]
        },
        {
          name: "Iran",
          id: "Iran",
          data: [
            [
              "Kerman",
              21
            ],
            [
              "Khorasan Razavi",
              17
            ],
            [
              "Yazd",
              null

            ],
            [
              "Tehran",
              null

            ],
            [
              "Sistan & Baluchestan",
              null

            ],
            [
              "Qom",
              null

            ]
          ]
        }
      ]
    }
  };
};
export const epiConfig = (
  data,
  seriesdata,
  xaxis,
  charttitle,
  yaxis = ""
) => {
  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      height: '350'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    xAxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        pointWidth: 20,
        stacking: 'normal',
        borderWidth: 0,
      }
    },
    series: [{ "name": "Total registered", "data": [0, 0, 3, 5, 6, 7, 7, 10, 9, 11, 10, 12, 13, 15, 17, 20, 21, 21, 22, 21, 22, 23, 23, 23, 18, 15, 15, 13, 9, 11] }, { "name": "Total screened", "data": [0, 0, 2, 3, 4, 4, 5, 7, 8, 10, 9, 10, 10, 12, 13, 17, 20, 19, 19, 16, 20, 23, 21, 19, 18, 14, 15, 13, 8, 11] }, { "name": "TB positive", "data": [0, 0, 0, 0, 3, 3, 3, 4, 4, 6, 5, 5, 3, 4, 4, 5, 4, 3, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 2, 1] }, { "name": "LTBI positive", "data": [0, 0, 3, 3, 3, 3, 3, 3, 4, 4, 2, 2, 4, 4, 3, 3, 4, 4, 2, 3, 4, 3, 2, 2, 1, 3, 2, 0, 0, 0] }, { "name": "Transferred in", "data": [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 1, 1, 0, 6, 1, 0, 0, 0, 0, 1, 2, 0, 0, 4, 0, 0, 0, 3] }, { "name": "Transferred out", "data": [0, 2, 0, 0, 6, 0, 1, 1, 1, 1, 4, 0, 3, 1, 1, 1, 3, 3, 3, 3, 3, 7, 4, 0, 2, 1, 2, 0, 3, 3] }, { "name": "Deaths", "data": [0, 0, 1, 1, 2, 1, 0, 0, 2, 0, 2, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 2, 0, 1, 1] }, { "name": "Recovered", "data": [0, 0, 2, 1, 3, 2, 2, 4, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 4, 3, 3] }]
  };
};
export const chart1 = (data) => {
  return {
    "chart": {
      "type": "column",
      height: "275"
    },
    "title": {
      "text": ""
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    "xAxis": {
      "categories": [
        "Apr"
      ]
    },
    "subtitle": {
      "text": ""
    },
    "yAxis": {
      "min": 0,
      "title": {
        "text": "No of Patients"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    "credits": {
      "enabled": false
    },
    "legend": {},
    "plotOptions": {
      "column": {
        "stacking": "normal",
        borderWidth: 0
      }
    },
    "series": [
      {
        "name": "Patinet on Treatment",
        "data": [
          4
        ]
      },
      {
        "name": "Patients in crisis(missed min 3 doses)",
        "data": [
          0
        ]
      },
      {
        "name": "Patient Following Regime",
        "data": [
          4
        ]
      }
    ]
  }
};
export const pie1 = (data) => {
  return {
    chart: {
      type: 'item',
      height: "275"
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    credits: {
      enabled: false
    },

    legend: {
      labelFormat: '{name}: <span style="opacity: 1">{y}%</span>'
    },

    series: [{
      name: '',
      keys: ['name', 'y', 'color', 'label'],
      data: [
        [
          "% of people completely adhering",
          60,
        ],
        [
          "% of people defaulting for 1-3 days",
          25,
        ],
        [
          "%of people Defaulting for 4-10 days",
          10,
        ]
        ,
        [
          "% of lost to follow up cases beyond 10 days",
          5,
        ]
      ],
      dataLabels: {
        enabled: false,
        format: '{point.label}'
      },

      // Circular options
      center: ['50%', '78%'],
      size: '120%',
      startAngle: -100,
      endAngle: 100
    }]
  }
};
export const pie2 = (data) => {
  return {
    chart: {
      type: 'item',
      height: "275"
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      //shared: true,
      useHTML: true,
      // backgroundColor: {
      //   linearGradient: [0, 0, 0, 60],
      //   stops: [
      //     [0, "#FFFFFF"],
      //     [1, "#E0E0E0"],
      //   ],
      // },
      // borderWidth: 1,
      // borderColor: "#AAA",
    },
    credits: {
      enabled: false
    },

    legend: {
      labelFormat: '{name}: <span style="opacity: 1">{y}%</span>'
    },

    series: [{
      name: '',
      keys: ['name', 'y', 'color', 'label'],
      data: [
        [
          "Below 40 years",
          60,
        ],
        [
          "40 - 60 years",
          25,
        ],
        [
          "Above 60 years",
          15,
        ]
      ],
      dataLabels: {
        enabled: false,
        format: '{point.label}'
      },

      // Circular options
      center: ['50%', '78%'],
      size: '120%',
      startAngle: -100,
      endAngle: 100
    }]
  }
};
export const migrantChart = (data, seriesData, stacking, oCatArr) => {
  // console.log(seriesData, stacking, oCatArr)
  var point = ''
  if (stacking != 'normal') {
    point = '{point.percentage:.0f}%'
  } else {
    point = '{point.y}'
  }
  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      // height: '350', 
      animation: {
        duration: 1000
      }
    },
    credits: {
      enabled: false,
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>(' + point + ')</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    xAxis: {
      categories: oCatArr ? oCatArr : ['Screened', 'Tested', 'Tested positive', 'Initiated on treatment', 'Recovered'],
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        pointWidth: 30,
        stacking: 'normal',
        borderWidth: 0,
        animation: {
          duration: 2000
        }
      },
      column: {
        stacking: stacking
      }
    },
    series: seriesData,
    exporting: {
      enabled: false
    }
    
  }
}
export const countryTransfer = (data) => {
  // console.log(data)
  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      height: '350'
    },
    credits: {
      enabled: false,
    },
    lang: {
      drillUpText: '< Back'
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
    ],
    xAxis: {
      type: 'category',
      // categories: ['Afghanistan',
      // 'Iran','Pakistan'],
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        pointWidth: 10,
        borderWidth: 0,
      }
    },
    series: [
      {
        name: "Transfer In",
        colorByPoint: false,
        showInLegend: true,
        data: [
          {
            name: "Afghanistan",
            y: 40,
            drilldown: "Afghanistan"
          },
          {
            name: "Pakistan",
            y: 21,
            drilldown: "Pakistan"
          },
          {
            name: "Iran",
            y: 37,
            drilldown: "Iran"
          }
        ],
        pointWidth: 35
      },
      {
        name: "Transfer Out",
        colorByPoint: false,
        showInLegend: true,
        data: [
          {
            name: "Afghanistan",
            y: 38,
            drilldown: "Afghanistan"
          },
          {
            name: "Pakistan",
            y: 19,
            drilldown: "Pakistan"
          },
          {
            name: "Iran",
            y: 30,
            drilldown: "Iran"
          }
        ],
        pointWidth: 35
      }
      // {
      //   "name": "Transfer In",
      //   "data": [40, 21, 37]
      // },
      // {
      //   "name": "Transfer Out",
      //   "data": [38, 19, 30]
      // }
    ],
    drilldown: {
      series: [
        {
          name: "Afghanistan",
          id: "Afghanistan",
          data: [
            [
              "Badakhshan",
              97
            ],
            [
              "Badghis",
              27
            ],
            [
              "Baghlan",
              13
            ],
            [
              "Balkh",
              61
            ],
            [
              "Bamyan",
              24
            ],
            [
              "Dykundi",
              0.56
            ],
            [
              "Farah",
              0.45
            ],
            [
              "Faryab",
              0.49
            ],
            [
              "Ghazni",
              0.32
            ],
            [
              "Ghor",
              0.29
            ],
            [
              "Helmand",
              0.79
            ],
            [
              "Hirat",
              0.18
            ],
            [
              "Jawzjan",
              0.13
            ],
            [
              "Kabul",
              2.16
            ],
            [
              "Kandahar",
              0.13
            ],
            [
              "Kapisa",
              0.11
            ],
            [
              "Khost",
              0.17
            ],
            [
              "Kunar",
              0.26
            ],
            [
              "Kunduz",
              0.26
            ],
            [
              "Laghman",
              0.26
            ],
            [
              "Logar",
              0.26
            ],
            [
              "Nangarhar",
              0.26
            ],
            [
              "Nimroz",
              0.26
            ],
            [
              "Nooristan",
              0.26
            ],
            [
              "Paktika",
              0.26
            ],
            [
              "Paktya",
              0.26
            ],
            [
              "Panjsher",
              0.26
            ],
            [
              "Parwan",
              0.26
            ],
            [
              "Samangan",
              0.26
            ],
            [
              "Sar-e-Pul",
              0.26
            ],
            [
              "Takhar",
              0.26
            ],
            [
              "Urozgan",
              0.26
            ],
            [
              "Wardak",
              0.26
            ],
            [
              "Zabul",
              0.26
            ]
          ]
        },
        {
          name: "Pakistan",
          id: "Pakistan",
          data: [
            [
              "KP",
              34
            ],
            [
              "Balochistan",
              31
            ]
          ]
        },
        {
          name: "Iran",
          id: "Iran",
          data: [
            [
              "Kerman",
              21
            ],
            [
              "Khorasan Razavi",
              17
            ],
            [
              "Yazd",
              null

            ],
            [
              "Tehran",
              null

            ],
            [
              "Sistan & Baluchestan",
              null

            ],
            [
              "Qom",
              null

            ]
          ]
        }
      ]
    }
  }
}
export const migrantRegisterPieChart = (data, seriesData) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      height: '350'
    },
    colors: [
      '#002060',
      '#ff779e',
      '#00acb1',
      '#ffd966',
      '#71baf3',
      '#cbd196'
      // "#1d6996",
      // "#ff8080",
      // "#67cb60",
      // "#8866a5",
      // "#09a799",
      // "#f5d63d",
      // "#79ff4d",
      // "#f35b5a",
      // "#79c267",
      // "#bf62a6",
      // "#c5d647",
      // "#6cc9dd",
      // "#e868a2",
      // "#fb5e19",
      // "#66ffff",
      // "#ff1a8c",
      // "#cccc00",
      // "#000080",
    ],
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        dataLabels: {
          // color: "black",
          enabled: false,
          // distance: 0, // Adjust this value to control the distance of labels from the pie chart
          // connectorPadding: -15,
          // format: '({point.percentage:.1f}%) {point.y}',


        },
      },
      series: {
        pointWidth: 20
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name} </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    credits: {
      enabled: false
    },

    legend: {
      labelFormat: '{name}: <span style="opacity: 1">{y}</span>'
    },

    series: [{
      showInLegend: true,
      name: '',
      keys: ['name', 'y', 'color', 'label'],
      data: seriesData,
    }],
    exporting: {
      enabled: false
    }
  }
}

export const countryCaseType = (data) => {
  // console.log(data)
  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      height: '350'
    },
    credits: {
      enabled: false,
    },
    lang: {
      drillUpText: '< Back'
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      useHTML: true,
    },
    colors: [
      '#a51c30C',
      '#334B48',
      '#96B1AD',
      '#88A6E0',
      '#5273A9',
    ],
    xAxis: {
      type: 'category',
      // categories: [
      //   'Afghanistan',
      //   'Iran',
      //   'Pakistan'
      // ],
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
      gridLineWidth: 0,
      scalable: true,
      scrollbar: {
        enabled: true,
      },
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        pointWidth: 10,
        borderWidth: 0,
        pointPadding: 0.0,
      }
    },
    series: [
      {
        name: "Indigenous",
        colorByPoint: false,
        showInLegend: true,
        data: [
          {
            name: "Afghanistan",
            y: 76,
            drilldown: "Afghanistan"
          },
          {
            name: "Pakistan",
            y: 34,
            drilldown: "Pakistan"
          },
          {
            name: "Iran",
            y: 22,
            drilldown: "Iran"
          }
        ],
        pointWidth: 35
      },
      {
        name: "Import",
        colorByPoint: false,
        showInLegend: true,
        data: [
          {
            name: "Afghanistan",
            y: 46,
            drilldown: "Afghanistan"
          },
          {
            name: "Pakistan",
            y: 31,
            drilldown: "Pakistan"
          },
          {
            name: "Iran",
            y: 16,
            drilldown: "Iran"
          }
        ],
        pointWidth: 35
      },
      // {
      //   "name": "Indigenous",
      //   "data": [
      //     {name: "Afghanistan",
      //     y: 76,
      //     drilldown: "Afghanistan"},
      //     34,
      //     22],
      // },
      // {
      //   "name": "Import",
      //   "data": [46, 31, 16]
      // }
    ],
    drilldown: {
      series: [
        {
          name: "Afghanistan",
          id: "Afghanistan",
          data: [
            [
              "Badakhshan",
              97
            ],
            [
              "Badghis",
              27
            ],
            [
              "Baghlan",
              13
            ],
            [
              "Balkh",
              61
            ],
            [
              "Bamyan",
              24
            ],
            [
              "Dykundi",
              0.56
            ],
            [
              "Farah",
              0.45
            ],
            [
              "Faryab",
              0.49
            ],
            [
              "Ghazni",
              0.32
            ],
            [
              "Ghor",
              0.29
            ],
            [
              "Helmand",
              0.79
            ],
            [
              "Hirat",
              0.18
            ],
            [
              "Jawzjan",
              0.13
            ],
            [
              "Kabul",
              2.16
            ],
            [
              "Kandahar",
              0.13
            ],
            [
              "Kapisa",
              0.11
            ],
            [
              "Khost",
              0.17
            ],
            [
              "Kunar",
              0.26
            ],
            [
              "Kunduz",
              0.26
            ],
            [
              "Laghman",
              0.26
            ],
            [
              "Logar",
              0.26
            ],
            [
              "Nangarhar",
              0.26
            ],
            [
              "Nimroz",
              0.26
            ],
            [
              "Nooristan",
              0.26
            ],
            [
              "Paktika",
              0.26
            ],
            [
              "Paktya",
              0.26
            ],
            [
              "Panjsher",
              0.26
            ],
            [
              "Parwan",
              0.26
            ],
            [
              "Samangan",
              0.26
            ],
            [
              "Sar-e-Pul",
              0.26
            ],
            [
              "Takhar",
              0.26
            ],
            [
              "Urozgan",
              0.26
            ],
            [
              "Wardak",
              0.26
            ],
            [
              "Zabul",
              0.26
            ]
          ]
        },
        {
          name: "Pakistan",
          id: "Pakistan",
          data: [
            [
              "KP",
              34
            ],
            [
              "Balochistan",
              31
            ]
          ]
        },
        {
          name: "Iran",
          id: "Iran",
          data: [
            [
              "Kerman",
              21
            ],
            [
              "Khorasan Razavi",
              17
            ],
            [
              "Yazd",
              null

            ],
            [
              "Tehran",
              null

            ],
            [
              "Sistan & Baluchestan",
              null

            ],
            [
              "Qom",
              null

            ]
          ]
        }
      ]
    }
  }
}