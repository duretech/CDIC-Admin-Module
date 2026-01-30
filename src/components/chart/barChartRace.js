import React from "react";
import * as d3 from "d3";
import $ from 'jquery';
const barChartRace = (chartId, color, expandedFlag, width, Chartheight, stopId, dateId, extendedSettings, chartdata) => {
    // console.log(chartdata)
    //console.log(Chartheight)
    const barColor = color
    const chartSettings = {
        width: width, // $('.modal.fade.show.fullscreen-modal').offsetWidth - 20
        height: Chartheight,
        padding: 10,
        titlePadding: 5,
        columnPadding: 0.4,
        ticksInXAxis: 8,
        duration: 3000,
        ...extendedSettings
    };

    chartSettings.innerWidth = chartSettings.width - chartSettings.padding * 2;
    chartSettings.innerHeight = chartSettings.height - chartSettings.padding * 2;

    chartSettings.innerHeightXaxis = chartSettings.width - 35

    const chartDataSets = [];
    let chartTransition;
    let timerStart, timerEnd;
    let currentDataSetIndex = 0;
    let elapsedTime = chartSettings.duration;

    const chartContainer = d3.select(`#${chartId} .chart-container`);
    const xAxisContainer = d3.select(`#${chartId} .x-axis`);
    const yAxisContainer = d3.select(`#${chartId} .y-axis`);

    const xAxisScale = d3.scaleLinear().range([0, chartSettings.innerHeightXaxis]);

    const yAxisScale = d3
        .scaleBand()
        .padding(chartSettings.columnPadding);

    const chartWH = d3.select(`#${chartId}`)
        .attr("width", chartSettings.width)


    chartContainer.attr(
        "transform",
        `translate(0 10)`
    );


    function numberWithCommas(number) {
        var returnValue;

        var isDecimal = (number - Math.floor(number)) !== 0;

        if (number == -1 || number == -999 || number == null || number == 'N/A' || number == undefined) { // If data is not available

            returnValue = 'N/A';

        } else if (isDecimal) { // If decimal then handle it

            if (number < 1) {
                if (number == 0) {
                    returnValue = number;
                } else {
                    returnValue = number.toFixed(2);
                }

            } else {

                if (number > 100) {

                    if (number > 1000) {
                        returnValue = Math.round(number);

                        returnValue = returnValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else {
                        returnValue = Math.round(number);
                    }
                } else {

                    if (typeof number == "string") {

                        returnValue = Number(number).toFixed(1);
                    } else {
                        returnValue = number.toFixed(1);
                    }

                    //returnValue = number;
                }

                //returnValue = number;
            }

        } else { // If big number then add comma as thousand separator.
            if (number != undefined && $.isNumeric(number)) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else { // If not a number send as it is.
                return number;
            }
        }

        return returnValue;
    }
    function getTextWidth(stringText) {

        var text = document.createElement("text");
        document.body.appendChild(text);

        text.style.font = "times new roman";
        text.style.fontSize = 12 + "px";
        text.style.height = 'auto';
        text.style.width = 'auto';
        text.style.position = 'absolute';
        text.style.whiteSpace = 'no-wrap';
        text.innerHTML = stringText  + '&nbsp';

        var width = Math.ceil(text.clientWidth);
        var formattedWidth = width + 5;

        // document.querySelector('.output').textContent 
        //         = formattedWidth; 
        document.body.removeChild(text);

        return formattedWidth
    }
    function setColor(name) {
        var color = barColor
        if (name.trim() == 'Afghanistan')
            color = '#0191d8'
        if (name.trim() == 'Pakistan')
            color = '#ff8080'
        if (name.trim() == 'Iran')
            color = '#67cb60'
        // console.log(name.trim(), color, "check me")
        return color
    }
    function draw({
        dataSet,
        date: currentDate
    }, transition) {
        const {
            innerHeight,
            ticksInXAxis,
            titlePadding
        } = chartSettings;
        // console.log(chartSettings, innerHeight)
        const dataSetDescendingOrder = dataSet.sort(
            ({
                value: firstValue
            }, {
                value: secondValue
            }) =>
                secondValue - firstValue
        );

        d3.select(`.${dateId}`).text(currentDate);

        if (dataSet.length > 4) {
            yAxisScale.range([0, (30 * dataSet.length) + 5])
        } else {
            yAxisScale.range([0, (30 * dataSet.length) + 10])
        }

        let raceChartHeight = chartSettings.height

        if (dataSet.length > 16) {
            raceChartHeight = (dataSet.length * 30) + 25;
        }

        chartWH.attr("height", raceChartHeight);

        xAxisScale.domain([0, dataSetDescendingOrder[0].value]);
        yAxisScale.domain(dataSetDescendingOrder.map(({
            name
        }) => name));

        xAxisContainer.transition(transition).call(
            d3
                .axisTop(xAxisScale)
                .ticks(ticksInXAxis)
                .tickSize(-innerHeight)
        );

        yAxisContainer
            .transition(transition)
            .call(d3.axisLeft(yAxisScale).tickSize(0));

        // The general update Pattern in d3.js

        // Data Binding
        const barGroups = chartContainer
            .select(".columns")
            .selectAll("g.column-container")
            .data(dataSetDescendingOrder, ({
                name
            }) => name);

        // Enter selection
        const barGroupsEnter = barGroups
            .enter()
            .append("g")
            .attr("class", "column-container")
            .attr("transform", `translate(0,0)`);
        barGroupsEnter
            .append("rect")
            .attr("class", "column-rect")
            .attr("width", 0)
            .attr("height", 28); //yAxisScale.step() * (1 - chartSettings.columnPadding) //

        barGroupsEnter
            .append("text")
            .attr("class", "column-title")
            .attr("y", 14) //(yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2
            .attr("x", 0) //-titlePadding
            .text(({
                name
            }) => name);

        barGroupsEnter
            .append("text")
            .attr("class", "column-value")
            .attr("y", 14) //(yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2 // 16
            .attr("x", ({
                name
            }) => getTextWidth(name)) //titlePadding
            .text(' (' + 0 + '}');


        // Update selection
        const barUpdate = barGroupsEnter.merge(barGroups);
        // console.log(name)
        barUpdate
            .transition(transition)
            .attr("transform", ({
                name
            }) => `translate(0,${yAxisScale(name)})`)
            .attr("fill", ({
                name
            }) => setColor(name))
        // .attr("fill", barColor);

        barUpdate
            .select(".column-rect")
            .transition(transition)
            .attr("width", ({
                value
            }) => xAxisScale(value));

        barUpdate
            .select(".column-title")
            .transition(transition)
            .attr("x", ({
                value
            }) => 5);
        // .attr("x", ({
        //     value
        // }) => xAxisScale(value) - titlePadding);

        barUpdate
            .select(".column-value")
            .transition(transition)
            .attr("x", ({
                name
            }) => getTextWidth(name)) //xAxisScale(0) + titlePadding
            .tween("text", function ({
                value
            }) {
                const interpolateStartValue =
                    elapsedTime === chartSettings.duration ?
                        this.currentValue || 0 :
                        +this.innerHTML;

                const interpolate = d3.interpolate(interpolateStartValue, value);
                this.currentValue = value;

                return function (t) {
                    // console.log(Math.ceil(interpolate(t)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    d3.select(this).text('(' + Math.ceil(interpolate(t)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ')');
                };
            });

        // Exit selection
        const bodyExit = barGroups.exit();

        bodyExit
            .transition(transition)
            .attr("transform", `translate(0, -30)`)
            .on("end", function () {
                d3.select(this).attr("fill", "none");
            });

        bodyExit
            .select(".column-title")
            .transition(transition)
            .attr("x", 0);

        bodyExit
            .select(".column-rect")
            .transition(transition)
            .attr("width", 0);

        bodyExit
            .select(".column-value")
            .transition(transition)
            .attr("x", 0)
            .tween("text", function () {
                const interpolate = d3.interpolate(this.currentValue, 0);
                this.currentValue = 0;

                return function (t) {
                    d3.select(this).text(Math.ceil(interpolate(t)));
                };
            });

        return this;
    }

    function addDataset(dataSet) {
        chartDataSets.push(dataSet);

        return this;
    }

    function addDatasets(dataSets) {
        chartDataSets.push.apply(chartDataSets, dataSets);

        return this;
    }

    function setTitle(title) {
        d3.select(".chart-title")
            .attr("x", chartSettings.width / 2)
            .attr("y", -chartSettings.padding / 2)
            .text(title);

        return this;
    }

    /* async function render() {
      for (const chartDataSet of chartDataSets) {
        chartTransition = chartContainer
          .transition()
          .duration(chartSettings.duration)
          .ease(d3.easeLinear);

        draw(chartDataSet, chartTransition);

        await chartTransition.end();
      }
    } */

    async function render(index = 0) {
        currentDataSetIndex = index;
        timerStart = d3.now();

        chartTransition = chartContainer
            .transition()
            .duration(elapsedTime)
            .ease(d3.easeLinear)
            .on("end", () => {
                if (index < chartDataSets.length) {
                    elapsedTime = chartSettings.duration;
                    render(index + 1);
                } else {
                    d3.select(`.${stopId}`).text("Play");
                }
            })
            .on("interrupt", () => {
                timerEnd = d3.now();
            });

        if (index < chartDataSets.length) {
            draw(chartDataSets[index], chartTransition);
        }

        return this;
    }

    function stop() {
        d3.select(`#${chartId}`)
            .selectAll("*")
            .interrupt();

        return this;
    }

    function start() {
        elapsedTime -= timerEnd - timerStart;

        render(currentDataSetIndex);

        return this;
    }

    return {
        addDataset,
        addDatasets,
        render,
        setTitle,
        start,
        stop
    };
}

export default barChartRace;