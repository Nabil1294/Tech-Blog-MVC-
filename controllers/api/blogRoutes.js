const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'An error occurred while creating the post.' });
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedBlog = await Blog.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (updatedBlog[0] === 0) {
      res.status(404).json({ message: 'No blog found with this id or you are not the owner' });
      return;
    }

    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: '404 Blog ID not found' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
