require.config({
    paths: {
        iwc: '/bower_components/iwcjs/dist/iwc',
        jquery: '/bower_components/jquery/dist/jquery'
    }
});

require(['iwc', '../dist/iwc-interval-slider', 'jquery'], function (iwc) {

    // Prev / next bindings
    $('#next').bind('touchstart click', function(e) {
        e.preventDefault();
        iwc.components.query($('#cmp')).next();
    });
    $('#prev').bind('touchstart click', function(e) {
        e.preventDefault();
        iwc.components.query($('#cmp')).prev();
    });

    // On change event
    iwc.load(document.body, function() {
        $('#value').html(iwc.components.query($('#cmp')).value);
        iwc.components.query($('#cmp')).change(function() {
            $('#value').html(this.value);
        });
    });
});
