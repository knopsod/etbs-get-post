var express = require('express');
var passport = require('passport');
var database = require('./database');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view organizations', function (req) {

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
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view organizations')], function (req, res, next) {

    //console.log(req.user);
    res.render('v1/organizations', {
        title: 'eTBS | Groups',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
    });
});

router.get('/all', function (req, res, next) {

    if (!req.query.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }

    var conn = database.getConnection();

    if (conn) {

        var sql = 'SELECT '
            + 'clientid '
            + 'FROM ?? WHERE username = ? ';
        var values = [
            'users',
            req.query.user
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result) {
            //console.log(result[0].clientid);
            if (result) {
                var sql = 'SELECT '
                    + 'a.orgid, a.org_name, a.parent_orgid, '
                    + '(SELECT COUNT(*) FROM ?? WHERE parent_orgid = a.orgid) AS has_child '
                    + 'FROM ?? a WHERE a.clientid = ? AND a.parent_orgid IS NULL '
                    + 'ORDER BY a.org_name';
                var values = [
                    'organizations',
                    'organizations',
                    result[0].clientid
                ];

                conn.query({
                    sql: sql,
                    values: values
                }, function (err, result2) {
                    if (result2) {
                        //console.log(result2);
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

router.get('/all/:orgid', function (req, res, next) {

    if (!req.params.orgid.trim() && !req.query.user.trim()) {
        res.status(500).send('OrgId and User can not empty');
        return;
    }

    var conn = database.getConnection();

    if (conn) {

        var sql = 'SELECT '
            + 'clientid '
            + 'FROM ?? WHERE username = ? ';
        var values = [
            'users',
            req.query.user
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result) {
            //console.log(result[0].clientid);
            if (result) {
                var sql = 'SELECT '
                    + 'a.orgid, a.org_name, a.parent_orgid, '
                    + '(SELECT COUNT(*) FROM ?? WHERE parent_orgid = a.orgid) AS has_child, '
                    + '(SELECT org_name FROM ?? WHERE orgid = a.parent_orgid) AS parent_name, '
                    + '(SELECT parent_orgid FROM ?? WHERE orgid = a.parent_orgid) AS pop '
                    + 'FROM ?? a WHERE a.clientid = ? AND a.parent_orgid = ? '
                    + 'ORDER BY org_name';
                var values = [
                    'organizations',
                    'organizations',
                    'organizations',
                    'organizations',
                    result[0].clientid,
                    req.params.orgid
                ];

                conn.query({
                    sql: sql,
                    values: values
                }, function (err, result2) {
                    if (result2) {
                        //console.log(result2);
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

router.get('/parent/:orgid', function (req, res, next) {

    if (!req.params.orgid.trim() && !req.query.user.trim()) {
        res.status(500).send('OrgId and User can not empty');
        return;
    }

    var conn = database.getConnection();

    if (conn) {

        var sql = 'SELECT '
            + 'clientid '
            + 'FROM ?? WHERE username = ? ';
        var values = [
            'users',
            req.query.user
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result) {
            //console.log(result[0].clientid);
            if (result) {
                var sql = 'SELECT '
                    + 'a.orgid, a.org_name, a.parent_orgid, '
                    + '(SELECT org_name FROM ?? WHERE orgid = a.parent_orgid) AS parent_name '
                    + 'FROM ?? a WHERE a.clientid = ? AND a.orgid = ? '
                    + '';
                var values = [
                    'organizations',
                    'organizations',
                    result[0].clientid,
                    req.params.orgid
                ];

                conn.query({
                    sql: sql,
                    values: values
                }, function (err, result2) {
                    if (result2) {
                        //console.log(result2);
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
