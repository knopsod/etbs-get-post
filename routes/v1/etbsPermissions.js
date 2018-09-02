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

router.get('/form', function(req, res, next) {
  res.render('v1/etbsPermissionsForm');
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

router.get('/:id', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.post('/update', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.get('/:id/remove', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.post('/delete', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.get('/:id/roles', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.post('/:id/roles/:rolename/insert', function(req, res, next) {
  res.send('respond etbs-permissions');
});

router.post('/:id/roles/:rolename/delete', function(req, res, next) {
  res.send('respond etbs-permissions');
});

module.exports = router;
