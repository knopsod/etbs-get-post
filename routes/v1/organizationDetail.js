var express = require('express');
var passport = require('passport');
var database = require('./database');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view organize info', function (req) {

    // allow for user role
    if (req.user.role === 'user') {
        return true;
    }
})

//admin users can access all pages
roles.use(function (req) {
    if (req.user.role === 'admin') {
        return true;
    }
});

/* GET home page. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view organize info')], function (req, res, next) {

    console.log(req.cookies);
    res.render('v1/organizationDetail', {
        title: 'eTBS | Organization Info',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
        orgid: req.query.g
    });
});

router.get('/:group', function (req, res, next) {

    if (!req.params.group.trim() && !req.query.user.trim()) {
        res.status(500).send('User and Organize can not empty');
        return;
    }

    var conn = database.getConnection();

    if (conn) {

        var sql = 'SELECT '
            + 'clientid, company, logo '
            + 'FROM ?? WHERE username = ? ';
        var values = [
            'users',
            req.query.user
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result) {
            console.log(result);
            if (result) {
                var sql = 'SELECT '
                    + 'a.*, '
                    + 'b.org_name as pon '
                    + 'FROM ?? a '
                    + 'LEFT JOIN ?? b ON a.parent_orgid=b.orgid '
                    + 'WHERE a.clientid = ? AND a.orgid = ? ';
                var values = [
                    'organizations',
                    'organizations',
                    result[0].clientid,
                    req.params.group
                ];

                conn.query({
                    sql: sql,
                    values: values
                }, function (err, result2) {
                    if (result2) {
                        //console.log(result2);
                        result2[0].company = result[0].company;
                        result2[0].logo = result[0].logo;
                        res.send(JSON.stringify(result2));
                    } else {
                        if (err)
                            res.status(500).send(err);
                    }
                });
            } else {
                if (err)
                    res.status(500).send(err);
            }
            conn.end();
        });
    } else {
        res.status(500).send('Can not connect to database');
    }
});

module.exports = router;
