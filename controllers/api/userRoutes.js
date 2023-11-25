const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { username: req.body.username }
    });

    if (existingUser) {
      // User already exists, send a conflict response
      return res.status(409).json({ message: 'User already exists.' });
    }

    // If user does not exist, create a new user
    const userData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // Redirect to the profile page
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password must be atleast 8 characters.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      // res.json({ user: userData, message: 'You are now logged in!' });
      res.redirect('/');

    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
