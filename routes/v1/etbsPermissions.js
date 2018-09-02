var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  var conn = database.getConnection();

  if (conn) {
    var sql = "SELECT permission, profileid, perm_type FROM permissions";

    conn.query(sql,
    function (err, result) {
      res.render('v1/etbsPermissions', { permissions: result });
      conn.end();
    });
  }
});

router.get('/add', function(req, res, next) {
  res.render('v1/etbsPermissionsForm', {
    action: '/etbs-permissions/insert'
  });
});

router.post('/insert', function(req, res, next) {
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;

  var conn = database.getConnection();

  if (conn) {

    var sql = "INSERT INTO permissions (permission, profileid, perm_type) "
      + "VALUES ('" + permission + "', '" + profileid + "', '" + perm_type + "')";

    conn.query(sql,
    function (err, result) {
      res.redirect('/etbs-permissions');
      conn.end();
    });

  }
});

router.get('/edit/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;

  res.render('v1/etbsPermissionsForm', {
    action: '/etbs-permissions/update',
    permission: permission,
    profileid: profileid,
    perm_type: perm_type
  });
});

router.post('/update', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;

  var conn = database.getConnection();

  if (conn) {

    var sql = "UPDATE permissions SET ? "
      + "WHERE permission = ? AND profileid = ? AND perm_type = ? ";
    var setditions = [
      {
        permission: permission,
        profileid: profileid,
        perm_type: perm_type
      },
      originPermission,
      originProfileid,
      originPerm_type
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-permissions');
      conn.end();
    });

  }
});

router.get('/remove/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;

  res.render('v1/etbsPermissionsForm', {
    action: '/etbs-permissions/delete',
    permission: permission,
    profileid: profileid,
    perm_type: perm_type
  });
});

router.post('/delete', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;

  var conn = database.getConnection();

  if (conn) {

    var sql = "DELETE FROM permissions "
      + "WHERE permission = ? AND profileid = ? AND perm_type = ? ";
    var conditions = [originPermission, originProfileid, originPerm_type];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-permissions');
      conn.end();
    });

  }
});

router.get('/roles/:permission/:profileid/:perm_type', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.post('/roles/update', function(req, res, next) {
  res.send('respond etbs-permissions');
});

module.exports = router;
