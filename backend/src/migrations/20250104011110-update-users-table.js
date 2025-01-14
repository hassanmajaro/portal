'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');
    
    // Add columns only if they don't exist
    if (!table.surname) {
      await queryInterface.addColumn('users', 'surname', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    
    if (!table.first_name) {
      await queryInterface.addColumn('users', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    
    if (!table.middle_name) {
      await queryInterface.addColumn('users', 'middle_name', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (!table.gender) {
      await queryInterface.addColumn('users', 'gender', {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false,
      });
    }
    
    if (!table.email) {
      await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
    }
    
    if (!table.password) {
      await queryInterface.addColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    
    if (!table.verification_code) {
      await queryInterface.addColumn('users', 'verification_code', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    
    if (!table.is_verified) {
      await queryInterface.addColumn('users', 'is_verified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
    
    if (!table.role) {
      await queryInterface.addColumn('users', 'role', {
        type: Sequelize.ENUM('Applicant', 'Admin'),
        defaultValue: 'Applicant',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'surname');
    await queryInterface.removeColumn('users', 'first_name');
    await queryInterface.removeColumn('users', 'middle_name');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'password');
    await queryInterface.removeColumn('users', 'verification_code');
    await queryInterface.removeColumn('users', 'is_verified');
    await queryInterface.removeColumn('users', 'role');
  }
};
