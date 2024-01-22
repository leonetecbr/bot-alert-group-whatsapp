const {Model, DataTypes} = require('sequelize')

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return Model
 * */
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
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    privateAlerts: DataTypes.BOOLEAN,
    state: {
      type: DataTypes.ENUM,
      values: [
        'ac', 'al', 'ap', 'am', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mt', 'ms', 'mg', 'pa',
        'pb', 'pr', 'pe', 'pi', 'rj', 'rn', 'rs', 'ro', 'rr', 'sc', 'sp', 'se', 'to'
      ],
    },
    capital: DataTypes.BOOLEAN,
  }, {
    sequelize,
    createdAt: false,
    modelName: 'User',
  })

  return User
}