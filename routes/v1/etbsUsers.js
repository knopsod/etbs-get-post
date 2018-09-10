var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  currentPage = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;

  var conn = database.getConnection();

  if (conn) {
    var sql = 
      `SELECT username, clientid, rolename, extension, name, 
        logo, company, email, mobile, fax, is_active 
      FROM users`;

    conn.query(sql, function (err, result) {
      res.render('v1/etbsUsers', 
        {
          users: result
        }
      );
      
      conn.end();
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.get('/add', function(req, res, next) {
  res.render('v1/etbsUsersForm', {
    action: '/etbs-users/insert'
  });
});

router.post('/insert', function(req, res, next) {
  var username  = req.body.username;
  var clientid  = req.body.clientid;
  var extension = req.body.extension;
  var name      = req.body.name;
  var logo      = req.body.logo;
  var company   = req.body.company;
  var email     = req.body.email;
  var mobile    = req.body.mobile;
  var fax       = req.body.fax;
  var is_active = req.body.is_active;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'INSERT INTO users SET ?';
    var user = {
      username  : username,
      clientid  : clientid,
      extension : extension,
      name      : name,
      logo      : logo,
      company   : company,
      email     : email,
      mobile    : mobile,
      fax       : fax,
      is_active : is_active
    };

    conn.query(sql, user, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.get('/edit/:username', function(req, res, next) {
  var username = req.params.username;

  var clientid  = '';
  var extension = '';
  var name      = '';
  var logo      = '';
  var company   = '';
  var email     = '';
  var mobile    = '';
  var fax       = '';
  var is_active = '';
  
  var rolename  = '';
  var cnt       = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = `SELECT clientid, extension, name, logo, company, 
      email, mobile, fax, is_active, rolename 
    FROM users WHERE username = ? LIMIT 1 OFFSET 0`;
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      clientid  = result.length ? result[0].clientid  : '';
      extension = result.length ? result[0].extension : '';
      name      = result.length ? result[0].name      : '';
      logo      = result.length ? result[0].logo      : '';
      company   = result.length ? result[0].company   : '';
      email     = result.length ? result[0].email     : '';
      mobile    = result.length ? result[0].mobile    : '';
      fax       = result.length ? result[0].fax       : '';
      is_active = result.length ? result[0].is_active : '';
      
      if (result.length) {
        rolename  = result[0].rolename ? result[0].rolename : '';
      }

      var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
      var conditions = [username];

      conn.query(sql, conditions, function (err, resultCnt) {
        cnt = resultCnt.length ? resultCnt[0].cnt : 0;

        res.render('v1/etbsUsersForm', {
          action    : '/etbs-users/update',
          username  : username,
          clientid  : clientid,
          extension : extension,
          name      : name,
          logo      : logo,
          company   : company,
          email     : email,
          mobile    : mobile,
          fax       : fax,
          is_active : is_active,
          rolename  : rolename,
          cnt       : cnt
        });

        conn.end();
      });
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.post('/update', function(req, res, next) {
  var originUsername = req.body.originUsername;

  var username  = req.body.username;
  var clientid  = req.body.clientid;
  var extension = req.body.extension;
  var name      = req.body.name;
  var logo      = req.body.logo;
  var company   = req.body.company;
  var email     = req.body.email;
  var mobile    = req.body.mobile;
  var fax       = req.body.fax;
  var is_active = req.body.is_active;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE users SET ? WHERE username = ?';
    var setditions = [
      {
        username  : username,
        clientid  : clientid,
        extension : extension,
        name      : name,
        logo      : logo,
        company   : company,
        email     : email,
        mobile    : mobile,
        fax       : fax,
        is_active : is_active
      },
      originUsername
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.get('/remove/:username', function(req, res, next) {
  var username = req.params.username;

  var clientid  = '';
  var extension = '';
  var name      = '';
  var logo      = '';
  var company   = '';
  var email     = '';
  var mobile    = '';
  var fax       = '';
  var is_active = '';
  
  var rolename  = '';
  var cnt       = '';

  var conn = database.getConnection();

  if (conn) {
    var sql = `SELECT clientid, extension, name, logo, company, 
      email, mobile, fax, is_active, rolename 
    FROM users WHERE username = ? LIMIT 1 OFFSET 0`;
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      clientid  = result.length ? result[0].clientid  : '';
      extension = result.length ? result[0].extension : '';
      name      = result.length ? result[0].name      : '';
      logo      = result.length ? result[0].logo      : '';
      company   = result.length ? result[0].company   : '';
      email     = result.length ? result[0].email     : '';
      mobile    = result.length ? result[0].mobile    : '';
      fax       = result.length ? result[0].fax       : '';
      is_active = result.length ? result[0].is_active : '';
      
      if (result.length) {
        rolename  = result[0].rolename ? result[0].rolename : '';
      }

      var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
      var conditions = [username];

      conn.query(sql, conditions, function (err, resultCnt) {
        cnt = resultCnt.length ? resultCnt[0].cnt : 0;

        res.render('v1/etbsUsersForm', {
          action    : '/etbs-users/delete',
          username  : username,
          clientid  : clientid,
          extension : extension,
          name      : name,
          logo      : logo,
          company   : company,
          email     : email,
          mobile    : mobile,
          fax       : fax,
          is_active : is_active,
          rolename  : rolename,
          cnt       : cnt
        });

        conn.end();
      });
    });
  } else {
    res.status(500).send('Can not connect to database');
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
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.get('/user-group/:username', function(req, res, next) {
  var username = req.params.username;

  var groups = {};

  var conn = database.getConnection();

  if (conn) {
    var sql = 
      `SELECT username, user_group.group_id, group_name 
      FROM user_group 
        LEFT JOIN groups ON user_group.group_id = groups.group_id
      WHERE username = ?`;
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      
      if (result) {
        groups = result.length ? result : [];

        var sql = 
          `SELECT group_id, group_name
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
  } else {
    res.status(500).send('Can not connect to database');
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
  } else {
    res.status(500).send('Can not connect to database');
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
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.get('/roles/:username', function(req, res, next) {
  var username = req.params.username;

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT rolename FROM users WHERE username = ? LIMIT 1 OFFSET 0';
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      
      if (result) {
        rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';
        
        var sql = 'SELECT rolename, profileid FROM roles';
        
        conn.query(sql, function (err, roleResult) {
          res.render('v1/etbsUserRoles', 
            {
              username: username,
              rolename: rolename,
              roles: roleResult
            }
          );
          conn.end();
        });
      }
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

router.post('/roles/update', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE users SET ? WHERE username = ?';
    var setditions = [
      { rolename: rolename },
      username
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-users/roles/' + username);
      conn.end();
    });
  } else {
    res.status(500).send('Can not connect to database');
  }
});

module.exports = router;
