module.exports = (app, Account) => {
  app.get('/', (req, res) => {
    res.redirect('login');
  });

  app.post('/signup', async (req, res) => {
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

    try {
      const exists = await Account.findOne({userid: req.body.userid});
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
      await account.save();
      res.redirect('login');
    } catch (error) {
      throw error;
    }
  });

  app.get('/welcome', (req, res) => {
    if (!req.session.name) {
      return res.redirect('/login');
    } else {
      res.render('welcome', {name: req.session.name});
    }
  });

  app.get('/login', (req, res) => {
    if (!req.session.name) {
      res.render('login', {message: 'input your id and password'});
    } else {
      res.redirect('/welcome');
    }
  });

  app.post('/login', async (req, res) => {
    if (typeof req.body.password !== "string") {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    try {
      const account = await Account.findOne({userid: req.body.username});
      if (!account) {
        return res.status(401).json({
          error: "LOGIN FAILED",
          code: 1
        });
      }
      if (account.validateHash(req.body.password)) {
        req.session._id = account._id;
        req.session.userid = account.userid;
        req.session.name = account.nickname;
        await req.session.save();
        res.redirect('welcome');
      } else {
        res.render('login', {message: "please check your password"});
      }
    } catch (error) {
      throw error;
    }
  });

  app.post('/logout', (req, res) => {
    var sess = req.session;
    if (typeof sess.loginInfo !== "undefined") {
      req.session.destroy(err => {
        if (err) throw err;
      });
      return res.json({ success: true});
    }
  });

  app.get('/getInfo', (req, res) => {
    if (typeof req.session.loginInfo === "undefined") {
      return res.status(401).json({ error: 1});
    }
    res.json({ info: req.session.loginInfo });
  });

  app.delete('/signout', (req, res) => {
    var sess = req.session;
    if (!sess.userid) {
      return res.status(402).json({
        error: "NO SESSION",
        code: 1
      });
    }

    Book.remove({ _id: sess.loginInfo._id }, (err, output) => {
      if (err) {
        return res.status(500).json({
          error: "DATABASE ERROR",
          code: 1
        });
      }

      if (!output.result.n) {
        return res.status(404).json({
          error: "LOGININFO NOT FOUND",
          code: 1
        });
      }

      res.json({ message: "USER INFO DELETED"});
    });

    req.session.destroy(err => {
      if (err) {
        throw err;
      } else {
        res.redirect('/');
      }
    })
  });

  app.get('/userlist', (req, res) => {
    Account.find((err, account) => {
      res.json(account)
    });
  });
}