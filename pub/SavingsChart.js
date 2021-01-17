"use strict";
var canvas = document.getElementById('chart');
var ctx = canvas.getContext('2d');
var chart = null;
function createOrUpdateChart(chartLabels, savedWithYield, savedNoYield, difference) {
    var datasets = createDatasets(savedWithYield, savedNoYield, difference);
    if (chart === null) {
        chart = createChart(chartLabels, datasets);
    }
    else {
        updateChart(chartLabels, datasets);
    }
}
function updateChart(chartLabels, datasets) {
    if (chart == undefined) {
        console.error("Chart is undefined. Use createOrUpdateChart() instead.");
    }
    else {
        chart.data.labels = chartLabels;
        chart.data.datasets = datasets;
        chart.update();
    }
}
function createDatasets(savedWithYield, savedNoYield, difference) {
    return [{
            data: savedWithYield,
            label: "Sparat med avkastning",
            borderColor: "#3e95cd",
            fill: false
        },
        {
            data: savedNoYield,
            label: "Sparat utan avkastning",
            borderColor: "#8e5ea2",
            fill: false
        },
        {
            data: difference,
            label: "Skillnad",
            borderColor: "#3cba9f",
            fill: false
        }];
}
function createChart(chartLabels, datasets) {
    /* Convert 1300000 => 1.3M, 20000 => 20K */
    var yAxisFormatter = function (value, index, values) {
        return Math.abs(Number(value)) >= 1.0e+6
            ? Math.abs(Number(value)) / 1.0e+6 + "M"
            : Math.abs(Number(value)) >= 1.0e+3
                ? Math.abs(Number(value)) / 1.0e+3 + "K"
                : Math.abs(Number(value));
    };
    /* Convert 100000 => 1 000 000 */
    var labelFormatter = function (tooltipItem, data) {
        if (tooltipItem.value !== undefined) {
            return tooltipItem.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " kr";
        }
        return "";
    };
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: "Resultat"
            },
            scales: {
                yAxes: [{
                        type: "linear",
                        ticks: {
                            callback: yAxisFormatter
                        }
                    }]
            },
            tooltips: {
                callbacks: {
                    label: labelFormatter
                }
            }
        }
    });
}