var dashboard1 = (function () {

    "use strict";
    var chart1,
        chart2;
    /* json files */
    var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
    var request = new XMLHttpRequest();
    var superHeroes;
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      superHeroes = request.response;
      populateHeader(superHeroes);
      showHeroes(superHeroes);
    }

//    var data_json = [{
//                        "name": "Harry",
//                        "age": "32"
//                    }];
      //var data_json = $.getJSON("data.json");
      //console.log(data_json);

//    function loadJSON(callback) {
//        var xobj = new XMLHttpRequest();
//            xobj.overrideMimeType("application/json");
//            xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
//            xobj.onreadystatechange = function () {
//              if (xobj.readyState == 4 && xobj.status == "200") {
//                // Required use of an anonymous callback as
//                // .open will NOT return a value but simply returns undefined in asynchronous mode
//                callback(xobj.responseText);
//              }
//        };
//        xobj.send(null);
//     }

//     function init() {
//      loadJSON(function(response) {
//       // Parse JSON string into object
//         data_json = JSON.parse(response);
//      });
//     }

//     init();

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
    function createChart1() {
        var ctx = document.getElementById("myChart1");
        var data = [10, 20, 30, 40, 50, 60, 10, 20, 30];
        var labels = ['running', 'sitting', 'sleeping'];
        var backgroundColor = [
                                colorSet[0],
                                colorSet[1],
                                colorSet[2],
                                colorSet[3],
                                colorSet[4],
                                colorSet[5],
                                colorSet[6],
                                colorSet[7],
                                colorSet[8]
                                ];

         var myChart1 = new Chart(ctx, {
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
            return myChart1;
    }

    function createChart2() {
        var ctx = document.getElementById("myChart2");
                        var myChart1 = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                                datasets: [{
                                    label: '# of Votes',
                                    data: [12, 19, 3, 5, 2, 3],
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderColor: [
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                               scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero:true
                                        }
                                    }],
                        }
                    }
                    });
                    return myChart2;
    }


    /* Render the dashboard */

    function render() {

        var html =
                '<div id="chart1" class="chart chart2">' +
                '<div class="title">Peformance by Goal</div>' +
                '</div>' +
                '<canvas id="myChart1" width="300" height="300"></canvas>'+

                '<div id="chart2" class="chart chart2">' +
                '<div class="title">Total Metrics by Goal Today</div>' +
                '</div>'+
                '<canvas id="myChart2" width="300" height="300"></canvas>';

        $("#content").html(html);
        chart1 = createChart1();
        chart2 = createChart2();
    }

    return {
        render: render
    }

}());