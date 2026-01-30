import * as echarts from 'echarts';


export const barConfig = (category, seriesData) => {
  // console.log(seriesData)
  return {
    color: [
      '#a51c30C',
      '#334B48',
      '#96B1AD',
      '#88A6E0',
      '#5273A9',
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: category
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        barWidth:30,
        data: seriesData.length > 0 ? seriesData[0].data : [],
        type: 'bar'
      }
    ]
  }
}

export const pieConfig = (seriesData) => {
  // console.log(seriesData)
  return {
    color: [
      '#a51c30C',
      '#334B48',
      '#96B1AD',
      '#88A6E0',
      '#5273A9',
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    itemStyle: {
      borderRadius:5,
      borderColor: '#fff',
      borderWidth: 2
    },
    series: [
      {

        data: seriesData.length > 0 ? seriesData : [],
        type: 'pie',
        radius: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

export const stackColumnConfig = (seriesData) => {
  // console.log(seriesData)
  return {
    color: [
      '#a51c30C',
      '#334B48',
      '#96B1AD',
      '#88A6E0',
      '#5273A9',
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    tooltip: {
      trigger: 'item'
    },

    xAxis: [
      {
        type: 'category',
        data: [
          "Screend",
          "Tested",
          "Tested positive",
          "Treatment Initiated",
          "Recovered"
        ]
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        barWidth:30,
        name: 'Male',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        barWidth:30,
        name: 'Female',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        barWidth:30,
        name: 'Transgender',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ]
  }
}

export const parlimentConfig = (data) => {
  const radius = ['50%', '80%'];
  const defaultPalette =  [
    '#a51c30C',
    '#334B48',
    '#96B1AD',
    '#88A6E0',
    '#5273A9',
  ];
  let sum = data.reduce(function (sum, cur) {
    return sum + cur.value;
  }, 0);
  let angles = [];
  let startAngle = -Math.PI / 2;
  let curAngle = startAngle;
  data.forEach(function (item) {
    angles.push(curAngle);
    curAngle += (item.value / sum) * Math.PI * 2;
  });
  angles.push(startAngle + Math.PI * 2);
  function parliamentLayout(startAngle, endAngle, totalAngle, r0, r1, size) {
    let rowsCount = Math.ceil((r1 - r0) / size);
    let points = [];
    let r = r0;
    for (let i = 0; i < rowsCount; i++) {
      // Recalculate size
      let totalRingSeatsNumber = Math.round((totalAngle * r) / size);
      let newSize = (totalAngle * r) / totalRingSeatsNumber;
      for (
        let k = Math.floor((startAngle * r) / newSize) * newSize;
        k < Math.floor((endAngle * r) / newSize) * newSize - 1e-6;
        k += newSize
      ) {
        let angle = k / r;
        let x = Math.cos(angle) * r;
        let y = Math.sin(angle) * r;
        points.push([x, y]);
      }
      r += size;
    }
    return points;
  }
  return {
    series: {
      type: 'custom',
      id: 'distribution',
      data: data,
      coordinateSystem: undefined,
      universalTransition: true,
      animationDurationUpdate: 1000,
      renderItem: function (params, api) {
        var idx = params.dataIndex;
        var viewSize = Math.min(api.getWidth(), api.getHeight());
        var r0 = ((parseFloat(radius[0]) / 100) * viewSize) / 2;
        var r1 = ((parseFloat(radius[1]) / 100) * viewSize) / 2;
        var cx = api.getWidth() * 0.5;
        var cy = api.getHeight() * 0.5;
        var size = viewSize / 50;
        var points = parliamentLayout(
          angles[idx],
          angles[idx + 1],
          Math.PI * 2,
          r0,
          r1,
          size + 3
        );
        return {
          type: 'group',
          children: points.map(function (pt) {
            return {
              type: 'circle',
              autoBatch: true,
              shape: {
                cx: cx + pt[0],
                cy: cy + pt[1],
                r: size / 2
              },
              style: {
                fill: defaultPalette[idx % defaultPalette.length]
              }
            };
          })
        };
      }
    }
  };
}