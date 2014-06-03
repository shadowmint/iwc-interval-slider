define(['iwc', 'handlebars', 'jquery'], function (iwc, handlebars, $) {
    iwc.component({
        name: 'iwc-clock',
        template: handlebars.default.compile(data.markup),
        styles: data.styles,
        model: {
            value: 'Value goes here'
        },
        view: {
            target: '.target'
        },
        targets: function () {
            return $('.component--iwc-clock');
        },
        state: function (ref) {
        },
        update: function (ref) {
        },
        instance: function (ref) {
        }
    });
});
//# sourceMappingURL=script.js.map
