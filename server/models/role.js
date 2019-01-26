'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationInWeeks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Role.associate = function(models) {
    Role.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      onDelete: 'CASCADE'
    });
  };
  return Role;
};