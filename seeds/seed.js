const sequelize = require('../config/connection');
const { User, Blog, Comment} = require('../models');

const blogData = require('./blogData.json');
const commentData = require('./commentData.json');
const userData = require('./userData.json');


const seedUsers = async (transaction) => {
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
    transaction,
  });
  console.log('Users seeded!');
};

const seedBlogs = async (transaction) => {
  await Blog.bulkCreate(blogData, {
    returning: true,
    transaction,
  });
  console.log('Blogs seeded!');
};

const seedComments = async (transaction) => {
  await Comment.bulkCreate(commentData, {
    returning: true,
    transaction,
  });
  console.log('Comments seeded!');
};


const seedDatabase = async () => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    await seedUsers(transaction);
    await seedBlogs(transaction);
    await seedComments(transaction);

    await transaction.commit();
    console.log('All seeds planted!');
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to seed database:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();