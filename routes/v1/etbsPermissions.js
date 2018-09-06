var express = require('express');
var database = require('./database');
var router = express.Router();

// http://programmerblog.net/nodejs-mysql-pagination-example-beginners/
// https://github.com/knopsod/paginationapp
var totalRec = 0,
  pageSize = 2,
  pageCount = 0;
var start = 0;
var currentPage = 1;

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  currentPage = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;

  var conn = database.getConnection();

  if (conn) {
    var sql = `SELECT COUNT(1) AS cnt FROM permissions`;

    conn.query(sql, function (err, resultCnt) {

      totalRec = resultCnt.length ? resultCnt[0].cnt : 0;
      pageCount = Math.ceil(totalRec / pageSize);
      
      var sql = 
        `SELECT permission, profileid, perm_type, is_active 
        FROM permissions
        LIMIT ` + pageSize + ' OFFSET ' + (currentPage - 1)*pageSize;
  
      conn.query(sql, function (err, result) {
        res.render('v1/etbsPermissions', 
          {
            permissions: result,
            pageSize: pageSize,
            pageCount: pageCount,
            currentPage: currentPage
          }
        );
        
        conn.end();
      });
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
  var is_active = req.body.is_active;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'INSERT INTO permissions SET ?';
    var perm = {
      permission: permission,
      profileid: profileid,
      perm_type: perm_type,
      is_active: is_active
    };

    conn.query(sql, perm, function (err, result) {
      res.redirect('/etbs-permissions');
      conn.end();
    });
  }
});

router.get('/edit/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;

  var is_active = '';

  var rolename = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT is_active FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var conditions = [permission, profileid, perm_type];

    conn.query(sql, conditions, function (err, fieldResult) {
      is_active = fieldResult.length ? fieldResult[0].is_active : '';

      var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
      var conditions = [profileid];
  
      conn.query(sql, conditions, function (err, result) {
        rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';
  
        res.render('v1/etbsPermissionsForm', {
          action: '/etbs-permissions/update',
          permission: permission,
          profileid: profileid,
          perm_type: perm_type,
          is_active: is_active,
          rolename: rolename
        });
  
        conn.end();
      });
    });
  }
});

router.post('/update', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;
  var is_active = req.body.is_active;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var setditions = [
      {
        permission: permission,
        profileid: profileid,
        perm_type: perm_type,
        is_active: is_active
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

  var is_active = '';

  var rolename = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT is_active FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var conditions = [permission, profileid, perm_type];

    conn.query(sql, conditions, function (err, fieldResult) {
      is_active = fieldResult.length ? fieldResult[0].is_active : '';

      var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
      var conditions = [profileid];
  
      conn.query(sql, conditions, function (err, result) {
        rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';
  
        res.render('v1/etbsPermissionsForm', {
          action: '/etbs-permissions/delete',
          permission: permission,
          profileid: profileid,
          perm_type: perm_type,
          is_active: is_active,
          rolename: rolename
        });
  
        conn.end();
      });
    });
  }
});

router.post('/delete', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'DELETE FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var conditions = [originPermission, originProfileid, originPerm_type];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-permissions');
      conn.end();
    });
  }
});

router.get('/roles/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;
  var rolename = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
    var conditions = [profileid];

    conn.query(sql, conditions, function (err, result) {
      
      if (result) {
        rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';
        
        var sql = 'SELECT rolename, profileid FROM roles';
        
        conn.query(sql, function (err, roleResult) {
          res.render('v1/etbsPermissionRoles', 
            {
              permission: permission,
              profileid: profileid,
              perm_type: perm_type,
              rolename: rolename,
              roles: roleResult
            }
          );
          conn.end();
        });
      }
    });
  }
});

router.post('/roles/update', function(req, res, next) {
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;
  var roleProfileid = req.body.roleProfileid;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var setditions = [
      { profileid: roleProfileid },
      permission,
      profileid,
      perm_type
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-permissions/roles/' + permission + '/' + roleProfileid + '/' + perm_type);
      conn.end();
    });
  }
});

router.get('/get', function(req, res, next) {
  var filter = req.query.filter;
  var sort = req.query.sort;
  
  var conn = database.getConnection();

  if (conn) {
    var sql = `SELECT permission, profileid, perm_type, is_active 
    FROM permissions
    WHERE 1`;

    sql += filter ? ' AND permission LIKE ?' : '';

    sql += sort ? ' ORDER BY permission' : '';

    conn.query(sql, '%' + filter + '%', function (err, result) {
      res.render('v1/etbsPermissions', { permissions: result, sort: sort, filter: filter });
      conn.end();
    });
  }
});

module.exports = router;
