define(['iwc', 'handlebars', 'jquery'], function (iwc, handlebars, $) {
    iwc.component({

        // The name of this component
        name: 'hello-button',

        // The markup template is compiled as a handlebars template
        template: handlebars.default.compile(data.markup),

        // Stylesheet
        styles: data.styles,

        // This is the model template for the component
        model: {
            value: 0,
            clicks: []
        },

        // This is the view template for the component
        view: {
            target: '.target',
            'data-loaded': null
        },

        // Find all the nodes in the DOM to apply this to
        targets: function () {
            return $('.component--hello-button');
        },

        // Return an array to detect state changes on the component
        state: function (ref) {
            return [ref.model.value]
        },

        // Update the component from the model
        update: function (ref) {
            var view = ref.view;
            var model = ref.model;
            view.target.html(model.value);
        },

        // Invoke this setup on each component instance
        instance: function (ref) {
            var root = ref.root;
            var model = ref.model;
            var view = ref.view;

            // Populate view
            view.target = $(root).find('.target');

            // Update on click events
            $(root).find('button').click(function (e) {
                console.log(model);
                model.value += 1;
                for (var i = 0; i < model.clicks.length; ++i) {
                    model.clicks[i](e, root, model, view);
                }
                ref.update();
            });

            // Run custom init script when loaded
            if (view['data-loaded']) {
                eval(view['data-loaded']);
            }
        }
    });
});