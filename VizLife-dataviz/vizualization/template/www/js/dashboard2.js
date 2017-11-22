var dashboard2 = (function () {

    "use strict";

    // Currently selected dashboard values
    var chart1,
        chart2,
        selectedDay = 1611;

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
                "click": DaySelectionHandler
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

        var width = 490,
            height = 450,
            radius = Math.min(width, height) / 2,

            color = d3.scale.category10(),

            pie = d3.layout.pie()
                .value(function (d) {
                    return d.Total;
                })
                .sort(null),

            arc = d3.svg.arc()
                .innerRadius(radius - 120)
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
                }),  // store the initial angles

            legend = d3.select(selector).append("svg")
                .attr("class", "vertical-legend")
                .attr("width", 400)
                .attr("height", 100)
                .selectAll("g")
                .data(color.domain().slice())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(80, " + i * 30 + ")";
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
                return dataset[d].Goal + ' (' + dataset[d].Total + ')';
            });

        function change(dataset) {
            svg.datum(dataset);
            path = path.data(pie); // compute the new angles
            path.transition().duration(500).attrTween("d", arcTween); // redraw the arcs
            legend.select('text').text(function (d) {
                return dataset[d].Goal + ' (' + dataset[d].Total + ')';
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

    /* Data selection handlers */

    function DaySelectionHandler(d, i) {
        selectedDay = d.x;
        $('#chart2>.title').html('Total Medals by Goal in ' + selectedDay);
        chart2.change(results[selectedDay]);
    }

    /* Render the dashboard */

    function render() {

        var html =
            '<div id="chart1" class="chart chart2">' +
                '<div class="title">Peformance by Goal</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart2" class="chart chart2">' +
                '<div class="title">Goal Breakdown</div>' +
                '<div class="graph"></div>' +
                '</div>';

        $("#content").html(html);

        chart1 = createSummaryChart('#chart1', summary);
        chart2 = createGoalBreakdownChart('#chart2', results[selectedDay]);
    }

    return {
        render: render
    }

}());