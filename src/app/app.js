
define(function (require) {

    var app = require('instances/app'),
        processingSketch = require('views/processing-sketch');

    app.ui.processingSketch = '#lines-sketch';

    app.inits.add(function () {
        var el = this.ui.processingSketch[0];
        this.sketch = new Processing(el, processingSketch);
    });

    return app;

});
