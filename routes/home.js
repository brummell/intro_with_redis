module.exports.default = function (req, res) {
    req.renderVars.stuff = 'Apples, Oranges, and Pears';
    res.render('home', req.renderVars);
};
