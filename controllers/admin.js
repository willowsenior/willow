module.exports = function(app) {
    app.get('/admin/facilities', function(req, res) {
        res.render('admin/facilities')
    })
}