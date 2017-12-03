var dashboard3 = (function () {

    "use strict";

    // Currently selected dashboard values
    var chart1,
        chart2,
        chart3,
        chart4,
        selectedday = 1611,
        selectedGoal = "Travel More",
        selectedMetricType = "Metric1";

    /* Functions to create the individual charts involved in the dashboard */

    function createSummaryChart(selector, dataset) {

        var data = {
                "xScale": "ordinal",
                "yScale": "linear",
                "main": dataset
            },

            options = {
                "axisPaddingLeft": 0,
                "paddingLeft": 20,
                "paddingRight": 0,
                "axisPaddingRight": 0,
                "axisPaddingTop": 5,
                "yMin": 9,
                "yMax": 40,
                "interpolation": "linear",
                "click": daySelectionHandler
            },

            legend = d3.select(selector).append("svg")
                .attr("class", "legend")
                .selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (64 + (i * 84)) + ", 0)";
                });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("class", function (d, i) {
                return 'color' + i;
            });

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d, i) {
                return dataset[i].Goal;
            });

        return new xChart('line-dotted', data, selector + " .graph", options);
    }

    function createGoalBreakdownChart(selector, dataset) {

        var data = {
                "xScale": "ordinal",
                "yScale": "linear",
                "type": "bar",
                "main": dataset
            },

            options = {
                "axisPaddingLeft": 0,
                "axisPaddingTop": 5,
                "paddingLeft": 20,
                "yMin": 8,
                "yMax": 40,
                "click": GoalSelectionHandler
            };

        return new xChart('bar', data, selector + " .graph", options);

    }


    function createMetricBreakdownChart(selector, dataset) {
        var width = 490,
            height = 260,
            radius = Math.min(width, height) / 2,

            color = d3.scale.category10(),

            pie = d3.layout.pie()
                .value(function (d) {
                    return d.total;
                })
                .sort(null),

            arc = d3.svg.arc()
                .innerRadius(radius - 80)
                .outerRadius(radius - 20),

            svg = d3.select(selector + " .graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),

            path = svg.datum(dataset).selectAll("path")
                .data(pie)
                .enter().append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arc)
                .each(function (d) {
                    this._selected = d;
                })  // store the initial angles
                .on("click", MetricTypeSelectionHandler),

            legend = d3.select(selector).append("svg")
                .attr("class", "legend")
                .attr("width", radius * 2)
                .attr("height", radius * 2)
                .selectAll("g")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (120 + i * 100) + ", 0)";
                });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d) {
                return dataset[d].type + ' (' + dataset[d].total + ')';
            });

        function change(dataset) {
            svg.datum(dataset);
            path = path.data(pie); // compute the new angles
            path.transition().duration(500).attrTween("d", arcTween); // redraw the arcs
            legend.select('text').text(function (d) {
                return dataset[d].type + ' (' + dataset[d].total + ')';
            });
        }

        function arcTween(a) {
            var i = d3.interpolate(this._selected, a);
            this._selected = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

        return {
            change: change
        };

    }

    function createGoalBreakdownForMetricTypeChart(selector, dataset) {

        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": dataset
        };

        var options = {
            "axisPaddingLeft": 0,
            "axisPaddingTop": 5,
            "paddingLeft": 20,
            "yMin": 0,
            "yMax": 20
        };

        return new xChart('bar', data, selector + " .graph", options);

    }

    /* Data selection handlers */

    function daySelectionHandler(d, i) {
        selectedday = d.x;
        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": getGoalBreakdownForday(selectedday)
        };
        $('#chart2>.title').html('Total Metrics by Goal in ' + selectedday);
        chart2.setData(data);
    }

    function GoalSelectionHandler(d, i) {
        selectedGoal = d.x;
        $('#chart3>.title').html(selectedGoal + ' Metrics in ' + selectedday);
        chart3.change(getMetricsForGoal(selectedGoal));
    }

    function MetricTypeSelectionHandler(d) {
        selectedMetricType = d.data.type;
        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": getGoalBreakdownForMetricType(selectedMetricType, selectedday)
        };
        $('#chart4>.title').html(selectedMetricType + ' Metrics in ' + selectedday);
        chart4.setData(data);
    }

    /* Functions to transform/format the data as required by specific charts */

    function getGoalBreakdownForday(day) {
        var result = [];
        for (var i = 0; i < results[day].length; i++) {
            result.push({x: results[day][i].Goal, y: results[day][i].Total});
        }
        return [
            {
                "className": ".Metrics",
                "data": result
            }
        ]
    }

    function getGoalBreakdownForMetricType(MetricType, day) {
        var result = [];
        for (var i = 0; i < results[day].length; i++) {
            result.push({x: results[day][i].Goal, y: results[day][i][MetricType]});
        }
        return [
            {
                "className": ".Metrics",
                "data": result
            }
        ]
    }

    function getMetricsForGoal(Goal) {
        var countries = results[selectedday];
        for (var i = 0; i < countries.length; i++) {
            if (countries[i].Goal === Goal) {
                return [
                    {"type": "Metric1", "total": countries[i].Metric1 },
                    {"type": "Metric2", "total": countries[i].Metric2 },
                    {"type": "Metric3", "total": countries[i].Metric3 }
                ];
            }
        }
    }

    /* Render the dashboard */

    function render() {

        var html =
            '<div id="chart1" class="chart">' +
                '<div class="title">Top 5 Goals by Progress</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart2" class="chart">' +
                '<div class="title">Total Metrics by Goal Today</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart3" class="chart">' +
                '<div class="title">Travel More Metrics Today</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart4" class="chart">' +
                '<div class="title">Metric1 Metrics Today</div>' +
                '<div class="graph"></div>' +
                '</div>';

        $("#content").html(html);

        chart1 = createSummaryChart('#chart1', summary);
        chart2 = createGoalBreakdownChart('#chart2', getGoalBreakdownForday(selectedday));
        chart3 = createMetricBreakdownChart('#chart3', getMetricsForGoal(selectedGoal));
        chart4 = createGoalBreakdownForMetricTypeChart('#chart4', getGoalBreakdownForMetricType(selectedMetricType, selectedday));
    }

    return {
        render: render
    }

}());