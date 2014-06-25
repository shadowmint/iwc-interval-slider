require.config({
    paths: {
        iwc: '/bower_components/iwcjs/dist/iwc',
        handlebars: '/bower_components/handlebars/handlebars.amd',
        jquery: '/bower_components/jquery/dist/jquery'
    }
});

require(['../dist/iwc-interval-slider', 'jquery'], function () {
    var cmp = $('#cmp')[0];
    window.components.iwc['interval-slider'](cmp, function (r) {
        r.view.onchange = function (r) {
            $('#value').text(r.value);
        }
    });
});
