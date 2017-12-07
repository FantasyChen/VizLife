(function () {

    "use strict";

    document.addEventListener("deviceready", function () {
        FastClick.attach(document.body);
        StatusBar.overlaysWebView(false);
    }, false);


    // Show/hide menu toggle
    $('#btn-menu').click(function () {
        if ($('#container').hasClass('offset')) {
            $('#container').removeClass('offset');
        } else {
            $('#container').addClass('offset');
        }
        return false;
    });

    // Basic view routing
    $(window).on('hashchange', route);

    var inputData = {
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
    function route() {
        var hash = window.location.hash;
        if (hash === "#dashboard/1") {
            dashboard1.render(inputData);
        } else if (hash === "#dashboard/2") {
            dashboard2.render(inputData);
        } else if (hash === "#dashboard/3") {
            dashboard3.render(inputData);
        }
    }

    dashboard1.render(inputData);

}());