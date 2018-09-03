var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  var conn = database.getConnection();

  if (conn) {
    var sql = "SELECT username, rolename FROM users";

    conn.query(sql,
    function (err, result) {
      res.render('v1/etbsUsers', { users: result });
      conn.end();
    });
  }
});

router.get('/add', function(req, res, next) {
  res.render('v1/etbsUsersForm', {
    action: '/etbs-users/insert'
  });
});

router.post('/insert', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'INSERT INTO users SET ?';
    var user = {
      username: username,
      rolename: rolename
    };

    conn.query(sql, user, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/edit/:username', function(req, res, next) {
  var username = req.params.username;
  var rolename = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT rolename FROM users WHERE username = ?';
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      rolename = result.length ? result[0].rolename : '';

      var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
      var conditions = [username];

      conn.query(sql, conditions, function (err, resultCnt) {
        var cnt = resultCnt.length ? resultCnt[0].cnt : 0;

        res.render('v1/etbsUsersForm', {
          action: '/etbs-users/update',
          username: username,
          rolename: rolename,
          cnt: cnt
        });

        conn.end();
      });
    });
  }
});

router.post('/update', function(req, res, next) {
  var originUsername = req.body.originUsername;
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE users SET ? WHERE username = ?';
    var setditions = [
      {
        username: username,
        rolename: rolename
      },
      originUsername
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/remove/:username', function(req, res, next) {
  var username = req.params.username;
  var rolename = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT rolename FROM users WHERE username = ?';
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      rolename = result.length ? result[0].rolename : '';

      var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
      var conditions = [username];

      conn.query(sql, conditions, function (err, resultCnt) {
        var cnt = resultCnt.length ? resultCnt[0].cnt : 0;

        res.render('v1/etbsUsersForm', {
          action: '/etbs-users/delete',
          username: username,
          rolename: rolename,
          cnt: cnt
        });

        conn.end();
      });
    });
  }
});

router.post('/delete', function(req, res, next) {
  var originUsername = req.body.originUsername;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'DELETE FROM users WHERE username = ?';
    var conditions = [originUsername];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/user-group/:username', function(req, res, next) {
  var username = req.params.username;

  var groups = {};

  var conn = database.getConnection();

  if (conn) {
    var sql = `SELECT username, user_group.group_id, group_name 
      FROM user_group 
        LEFT JOIN groups ON user_group.group_id = groups.group_id
      WHERE username = ?`;
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      
      if (result) {
        groups = result.length ? result : [];

        var sql = `SELECT group_id, group_name
          FROM groups
          WHERE NOT EXISTS (
            SELECT 1 FROM user_group
              WHERE user_group.group_id = groups.group_id
                AND username = ?
          )`;
        var conditions = [username];

        conn.query(sql, conditions, function (err, unGroupsResult) {
          res.render('v1/etbsUserGroups', 
            {
              username: username,
              groups: groups,
              unGroups: unGroupsResult
            }
          );
          conn.end();
        });
      };
    });
  }
});

router.post('/user-group/insert', function(req, res, next) {
  var username = req.body.preUsername;
  var group_id = req.body.unGroupId;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'INSERT INTO user_group SET ?';
    var user_group = {
      username: username,
      group_id: group_id
    };

    conn.query(sql, user_group, function (err, result) {
      res.redirect('/etbs-users/user-group/' + username);
      conn.end();
    });

  }
});

router.post('/user-group/delete', function(req, res, next) {
  var username = req.body.username;
  var group_id = req.body.groupId;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'DELETE FROM user_group WHERE username = ? AND group_id = ?';
    var conditions = [
      username,
      group_id
    ];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-users/user-group/' + username);
      conn.end();
    });

  }
});

module.exports = router;
