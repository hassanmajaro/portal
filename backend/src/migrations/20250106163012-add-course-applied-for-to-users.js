'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'course_applied_for', {
            type: Sequelize.ENUM('PGD', 'Masters', 'PhD'),
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'course_applied_for');
    }
};
