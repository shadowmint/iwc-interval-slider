require.config({
    paths: {
        iwc: '/bower_components/iwcjs/dist/iwc',
        handlebars: '/bower_components/handlebars/handlebars.amd',
        jquery: '/bower_components/jquery/dist/jquery'
    }
});

require(['../dist/hello-button', '../dist/hello-label'], function () {
    console.log('loaded all components');
});
