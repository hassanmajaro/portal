const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false //Disable logging if you don't need it
});

// Import the models (No need to call them as functions)
const User = require('./user');
const Payment = require('./payments');
const Courses = require('./courses');
const Notification = require('./notifications');
const Application = require('./applications');
const academicRecord = require('./academicRecord');

// Export models
module.exports = {
    User,
    Payment,
    Courses,
    Notification,
    Application,
    academicRecord,
    sequelize
};