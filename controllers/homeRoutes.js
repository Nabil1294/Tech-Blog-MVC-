const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [{
        model: Comment,
        include: [{ model: User, attributes: ['username'] }]
      }, {
        model: User,
        attributes: ['username']
      }]
    });

    const blogs = blogData.map((blog) => blog.get({
      plain: true
    }));

    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: [User]
        }
      ]
    });

    if (blogData) {
      const blog = blogData.get({ plain: true });
      res.render('blog-details', {
        blog,
        logged_in: req.session.logged_in
      });
    } else {
      res.status(404).send('Blog post not found');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Blog,
        include: [{
          model: Comment,
          include: [{ model: User, attributes: ['username'] }]
        }]
      }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/signUp', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signUp');
});

router.get('/create-blog/:id?', withAuth, async (req, res) => {
  try {
    let blog = null;
    if (req.params.id) {
      // Fetch the blog data for editing
      const blogData = await Blog.findByPk(req.params.id, {
        include: [User]
      });

      blog = blogData ? blogData.get({ plain: true }) : null;
    }

    res.render('blog', {
      blog,
      editing: !!req.params.id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



module.exports = router;
