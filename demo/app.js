require.config({
    paths: {
        iwc: '/bower_components/iwcjs/dist/iwc',
        handlebars: '/bower_components/handlebars/handlebars.amd',
        jquery: '/bower_components/jquery/dist/jquery'
    }
});

var slider = function(action) {
    var cmp = $('#cmp')[0];
    window.components.iwc['interval-slider'](cmp, action);
};

require(['../dist/iwc-interval-slider', 'jquery'], function () {

    // On change event
    slider(function(r) {
        r.view.onchange = function (r) {
            $('#value').text(r.value);
        }
    });

    // Prev / next bindings
    $('#next').bind('touchstart click', function(e) {
        e.preventDefault();
       slider(function(r) {
           r.api.next(r);
       });
    });
    $('#prev').bind('touchstart click', function(e) {
        e.preventDefault();
        slider(function(r) {
            r.api.prev(r);
        });
    });
});
