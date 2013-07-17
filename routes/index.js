'use strict';


function addGetDefault(app, name, altPath) {
    if ( ! altPath) altPath = '/' + name;
    console.log('addGetDefault ' + name + ' at ' + altPath);
    var handler = require('./' + name).default;
    app.get(altPath, function (req, res) {
        req.renderVars = {
            session: req.session
        };
        handler(req, res);
    });
}

function setRoutes(app) {
    addGetDefault(app, 'about-us');
    addGetDefault(app, 'home', '/');
    addGetDefault(app, 'faq');
}


exports.setRoutes = setRoutes;
