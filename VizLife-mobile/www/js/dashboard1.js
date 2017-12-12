var dashboard1 = (function () {

    "use strict";
    /* hardcode, assuming there are at most 10 metrics selected*/
    var chart0,
        chart1,
        chart2,
        chart3,
        chart4,
        chart5,
        chart6,
        chart7,
        chart8,
        chart9;
    var charts = [];
    /* colors:  hardcode, assuming there are at most 10 colors/labels in a chart*/
    var colorSetAct = ['rgba(255, 159, 64, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(238,146,106, 0.5)',
                        'rgba(249,199,190,0.5)',
                        'rgba(201,100,100,0.5)',
                        'rgba(255,221,139,0.5)'
                        ];
    var colorSetComp = ['rgba(113,118,116, 1)',
                       'rgba(114,165,125, 1)',
                       'rgba(114,164,165, 1)',
                       'rgba(114,130,165, 1)',
                       'rgba(144,165,114, 1)',
                       'rgba(14,63,107, 1)'
                       ];
    /* json files/obj goes here */
    //var activity;
    var inputDataAct;
    var inputDataComp;
    var chartNums;

    /* read in json files and gross process*/
    function init(data1, data2) {
        //activity = inputData;
        inputDataAct = data1;
        inputDataComp = data2;
        chartNums = Object.keys(inputDataAct).length;
    }

    /* create metricIdx-th chart*/
    function createChart(metricIdx) {
       if(metricIdx >= chartNums) {
            return null;
       }
       var ctx = document.getElementById("myChart" + metricIdx.toString());
       //var metricName = Object.keys(activity)[metricIdx];//string
       var curMetricAct = inputDataAct[metricIdx];
       var curMetricComp = inputDataComp[metricIdx];
       var labelsAct = Object.keys(curMetricAct);
       var labelsComp = Object.keys(curMetricComp);
       var dataAct = Object.values(curMetricAct);
       var dataComp = Object.values(curMetricComp);
       var backgroundColor = [];
       var labels = [];
       var data = [];
       var i;
       for (i = 0; i < labelsAct.length; i++) {
           if(labelsAct[i] == "name"){
             continue;
           }
           backgroundColor.push(colorSetAct[i]);
           labels.push(labelsAct[i]);
           data.push(dataAct[i]);
       }
       for (i = 0; i < labelsComp.length; i++) {
            backgroundColor.push(colorSetComp[i]);
            labels.push(labelsComp[i]);
            data.push(dataComp[i]);
       }

       var chartOfMetric = new Chart(ctx, {
                                     type: 'doughnut',
                                     data: {
                                                   datasets: [{
                                                       data,
                                                       backgroundColor
                                                   }],
                                                   // These labels appear in the legend and in the tooltips when hovering different arcs
                                                   labels,

                                               },
                                               options: {
                                                   animation: {
                                                     duration: 2000,
                                                     animateRotate: true
                                                   }
                                               }

                                       });

        return chartOfMetric;
    }

    /* get html */
    function generateHtml() {
        var html = '';
        var chartIdx = 0;
        var chartName;
        for(chartIdx = 0; chartIdx < chartNums; chartIdx++) {
            //console.log(inputDataAct);
            chartName = inputDataAct[chartIdx].name;
            html = html +
                              '<div id="c' +
                              chartIdx.toString() +
                              '" class="chart chart2">' +
                              '<div class="title">'+
                              chartName +
                              '</div>' +
                              '</div>' +
                              '<canvas id="myChart' +
                              chartIdx.toString() +
                              '" width="300" height="300"></canvas>';
        }
        return html;
    }

    /* Render the dashboard */
    function render(data1, data2) {
        init(data1, data2);

        var html = generateHtml();
        $("#content").html(html);
        for(var i = 0; i < charts.length; i++){
                    charts[i].destroy();
        }

        for(var i = 0; i < chartNums; i++) {
            charts.push(createChart(i));
        }

    }

    return {
        render: render
    }

}());
