var dashboard1 = (function () {

    "use strict";
    var chart0,
        chart1;

    /* json files */
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
                     }
                   };
    /* colors */
    var colorSet = ['rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(103,80,85, 1)',
                    'rgba(59,144,107,1)',
                    'rgba(206,187,110,1)'
                    ];
    /* create two charts*/
    function createChart(metricIdx) {
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
        var x;
        for(x in activity) {
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
            chartIdx = chartIdx + 1;
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
    }

    return {
        render: render
    }

}());