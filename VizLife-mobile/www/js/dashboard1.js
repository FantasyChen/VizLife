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

    /* json files/obj goes here */
    var activity = {
                     "working out": {
                       "running": 200,
                       "sitting": 500,
                       "sleeping": 800,
                       "reading": 240
                     },
                     "dining habit": {
                        "green tea": 200,
                        "brown rice": 500,
                        "fruit": 800,
                        "whole weat bread": 700,
                        "beef": 300,
                        "chicken": 500,
                        "sea food": 430
                     },
                     "whatever": {
                         "showing": 10,
                         "drink": 20
                      }
                   };
    var chartNums = Object.keys(activity).length;

    /* colors:  hardcode, assuming there are at most 10 colors/labels in a chart*/
    var colorSet = ['rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(103,80,85, 1)',
                    'rgba(59,144,107,1)',
                    'rgba(206,187,110,1)',
                    'rgba(161,159,151)'
                    ];

    /* create metricIdx-th chart*/
    function createChart(metricIdx) {
       if(metricIdx >= chartNums) {
            return null;
       }
       var ctx = document.getElementById("myChart" + metricIdx.toString());
       var metricName = Object.keys(activity)[metricIdx];//string
       var curMetric = Object.values(activity)[metricIdx];
       var labels = Object.keys(curMetric);
       var data = Object.values(curMetric);
       var backgroundColor = [];
       var i;
       for (i = 0; i < labels.length; i++) {
           backgroundColor.push(colorSet[i]);
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
                                               options: {}

                                       });

        return chartOfMetric;
    }

    /* get html */
    function generateHtml() {
        var html = '';
        var chartIdx = 0;
        var chartName;
        for(chartIdx = 0; chartIdx < chartNums; chartIdx++) {
            chartName = Object.keys(activity)[chartIdx];
            html = html +
                              '<div id="chart' +
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
    function render() {
        var html = generateHtml();
        $("#content").html(html);

        /* end loop for charts*/
        chart0 = createChart(0);
        chart1 = createChart(1);
        chart2 = createChart(2);
        chart3 = createChart(3);
        chart4 = createChart(4);
        chart5 = createChart(5);
        chart6 = createChart(6);
        chart7 = createChart(7);
        chart8 = createChart(8);
        chart9 = createChart(9);
    }

    return {
        render: render
    }

}());