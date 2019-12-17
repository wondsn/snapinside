module.exports = (app, Account) => {
  // app.get('/', (req, res) => {
  //   res.render("index.html");
  // });

  app.post('/signup', (req, res) => {
    let usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.userid)) {
      return res.status(400).json({
        error: "BAD USERNAME",
        code: 1
      });
    }

    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
      return res.status(400).json({
        error: "BAD PASSWORD",
        code: 2
      });
    }

    Account.findOne({ userid: req.body.userid }, (err, exists) => {
      if (err) throw err;
      if (exists) {
        return res.status(409).json({
          error: "USERNAME EXISTS",
          code: 3
        });
      }

      let account = new Account({
        userid: req.body.userid,
        password: req.body.password,
        nickname: req.body.nickname
      });

      account.password = account.generateHash(account.password);

      account.save( err => {
        if (err) throw err;
        return res.json({ success: true });
      });
    })
  });

  app.post('/signin', (req, res) => {
    if (typeof req.body.password !== "string") {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    Account.findOne( { userid: req.body.userid }, (err, account) => {
      if (err) throw err;

      if (!account) {
        return res.status(401).json({
          error: "LOGIN FAILED",
          code: 1
        });
      }

      if (!account.validateHash(req.body.password)) {
        return res.status(401).json({
          error: "LOGIN FAILED",
          code: 1
        });
      }

      var session = req.session;
      session.loginInfo = {
        _id: account._id,
        userid: account.userid,
        nickname: account.nickname
      }

      return res.json({
        success: true
      });
    })
  });

  app.post('/logout', (req, res) => {
    sess = req.session;
    if (sess.userid) {
      req.session.destroy(err => {
        if (err) throw err;
      });
      return res.json({ success: true});
    }
  });

  // app.delete('/deleteUser/:username', (req, res) => {
  //   var result = {};
  //   var username = req.params.username;
  //   // 이 부분 다 DB로 대체할 예정. 예제용으로 작성
  //   fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
  //     var users = JSON.parse(data);
  //     if (!users[username]) {
  //       result["success"] = 0;
  //       result["error"] = "not found";
  //       res.json(result);
  //       return;
  //     }

  //     delete users[username];
  //     fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
  //       result["success"] = 1;
  //       res.json(result);
  //     });
  //   });
  // });

  app.get('/userlist', (req, res) => {
    Account.find((err, account) => {
      res.json(account)
    })
  })
}