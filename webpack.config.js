'use strict';

module.exports = {
    entry: './src/scripts/main.js',
    resolve: {
        alias: {
            jquery: 'admin-lte/plugins/jQuery/jQuery-2.2.0.min.js',
            createjs: 'PreloadJS/lib/preloadjs-0.6.2.combined.js',
            bootstrap: 'admin-lte/bootstrap/js/bootstrap.min.js',
            select2: 'ui-select/dist/select.js'
}
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'ng-annotate' },
            { test: /\.json$/, loader: 'json' },
            { test: /.*gsap.*/, loader: 'imports?gs=>window.GreenSockGlobals={}!exports?gs' },
            { test: /.*PreloadJS.*/, loader: 'imports?this=>global!exports?window.createjs' }
        ]
    }
};
