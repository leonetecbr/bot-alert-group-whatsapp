const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Alert, {
        through: models.UserAlert,
        foreignKey: 'UserId',
        as: 'alerts',
      })
    }
  }

  User.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    privateAlerts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    state: {
      type: DataTypes.ENUM,
      values: [
        'ac', 'al', 'ap', 'am', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mt', 'ms', 'mg', 'pa',
        'pb', 'pr', 'pe', 'pi', 'rj', 'rn', 'rs', 'ro', 'rr', 'sc', 'sp', 'se', 'to'
      ],
      allowNull: true,
      defaultValue: null,
    },
    capital: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    createdAt: false,
    modelName: 'User',
  });

  return User;
};