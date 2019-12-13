module.exports = (app, fs) => {
  app.get('/', (req, res) => {
    res.render("index.html");
  });

  app.get('/login/:username/:password', (req, res) => {
    var sess = req.session;

    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
      var users = JSON.parse(data);
      var username = req.params.username;
      var password = req.params.password;
      var result = {};
      if (!users[username]) {
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }

      if (users[username]["password"] == password) {
        result["success"] = 1;
        sess.username = username;
        sess.name = users[username]["name"];
        res.json(result);
      } else {
        result["success"] = 0;
        result["error"] = "incorrect";
        res.json(result);
        return;
      }
    });
  });

  app.get('/logout', (req, res) => {
    sess = req.session;
    if (sess.username) {
      req.session.destroy(err => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  })

  app.get('/list', (req, res) => {
    // 유저 리스트, 어드민에서 쓰기에 좋을 듯.
    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
      console.log(data);
      res.send(data);
    });
  });

  app.get('/getUser/:username', (req, res) => {
    // 유저 조회, 어드민에서 쓰기 좋을 듯.
    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
      var users = JSON.parse(data);
      res.json(users[req.params.username]);
    });
  });

  app.post('/addUser/:username', (req, res) => {
    var result = {};
    var username = req.params.username;

    if (!req.body["password"] || !req.body["name"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }
    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
      var users = JSON.parse(data);
      if (users[username]) {
        result["success"] = 0;
        result["error"] = "duplicate";
        res.json(result);
        return;
      }

      users[username] = req.body;

      fs.writeFile(__dirname + "/../data/user.json",
        JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
        result["success"] = 1;
        res.json(result);
      });
    });
  });

  app.put('/updateUser/:username', (req, res) => {
    var result = {};
    var username = req.params.username;

    if (!req.body["password"] || !req.body["name"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }
    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
      var users = JSON.parse(data);
      if (!users[username]) {
        result["success"] = 0;
        result["error"] = "no user";
        res.json(result);
        return;
      }

      users[username] = req.body;

      fs.writeFile(__dirname + "/../data/user.json",
        JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
          result["success"] = 1;
          res.json(result);
      });
    });
  });

  app.delete('/deleteUser/:username', (req, res) => {
    var result = {};
    var username = req.params.username;
    // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
    fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
      var users = JSON.parse(data);
      if (!users[username]) {
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }

      delete users[username];
      fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
        result["success"] = 1;
        res.json(result);
      });
    });
  });
}