var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  var conn = database.getConnection();

  if (conn) {
    var sql = "SELECT rolename, profileid FROM roles";

    conn.query(sql,
    function (err, result) {
      res.render('v1/etbsRoles', { roles: result });

      conn.end();
    });
  }

});

router.get('/form', function(req, res, next) {
  res.render('v1/etbsRolesForm', {
    action: '/etbs-roles/insert'
  });
});

router.post('/insert', function(req, res, next) {
  var rolename = req.body.rolename;
  var profileid = req.body.profileid;
  
  var conn = database.getConnection();
  
  if (conn) {
    
    var sql = "INSERT INTO roles SET ?";
    var role = {
      rolename: rolename,
      profileid: profileid
    };

    conn.query(sql, role, function (err, result) {
      res.redirect('/etbs-roles');
      conn.end();
    });
  }
});

router.get('/:rolename/:profileid', function(req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;

  var conn = database.getConnection();

  if (conn) {
    var sql = "SELECT COUNT(1) AS cnt FROM users WHERE rolename = ?";
    var conditions = [rolename];

    conn.query(sql, conditions, function (err, result) {
      var cnt = result.length ? result[0].cnt : 0;

      res.render('v1/etbsRolesForm', {
        action: '/etbs-roles/update',
        rolename: rolename,
        profileid: profileid,
        cnt: cnt
      });

      conn.end();
    });
  }

});

router.post('/update', function(req, res, next) {
  var originRolename = req.body.originRolename;
  var originProfileid = req.body.originProfileid;
  var rolename = req.body.rolename;
  var profileid = req.body.profileid;

  var conn = database.getConnection();

  if (conn) {

    var sql = "UPDATE roles SET ? "
      + "WHERE rolename = '" + originRolename + "' AND profileid = '" + originProfileid + "' ";
    var role = {
      rolename: rolename,
      profileid: profileid
    };

    conn.query(sql, role, function (err, result) {
      res.redirect('/etbs-roles');
      conn.end();
    });

  }
});

router.get('/:rolename/:profileid/:remove', function(req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;
  var remove = req.params.remove;
  res.render('v1/etbsRolesForm', {
    action: '/etbs-roles/delete',
    rolename: rolename,
    profileid: profileid,
    remove: remove
  });
});

router.post('/delete', function(req, res, next) {
  var originRolename = req.body.originRolename;
  var originProfileid = req.body.originProfileid;

  var conn = database.getConnection();

  if (conn) {

    var sql = "DELETE FROM roles "
      + "WHERE rolename = ? AND profileid = ? ";
    var conditions = [originRolename, originProfileid];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-roles');
      conn.end();
    });

  }
});

router.get('/:rolename/users', function(req, res, next) {
  console.log(req.params.rolename);
  res.redirect('/etbs-roles');
});

router.post('/:rolename/users/insert', function(req, res, next) {
  res.send('respond etbs-roles');
});

router.post('/:rolename/users/delete', function(req, res, next) {
  res.send('respond etbs-roles');
});

module.exports = router;
