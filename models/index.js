const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');

// User to Blog (One-to-Many)
User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// Blog to User (Many-to-One)
Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

// Blog to Comment (One-to-Many)
Blog.hasMany(Comment, {
  foreignKey: 'blog_id',
  onDelete: 'CASCADE'
});

// Comment to User (Many-to-One)
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

// Comment to Blog (Many-to-One)
Comment.belongsTo(Blog, {
  foreignKey: 'blog_id'
});

module.exports = { User, Blog, Comment };
