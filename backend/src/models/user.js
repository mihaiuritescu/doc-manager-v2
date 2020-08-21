const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));

async function hashPassword(user) {
  const SALT_FACTOR = 8;

  if (!user.changed('password')) {
    return
  }
  const salt = bcrypt.genSaltSync(SALT_FACTOR);
  const hash = bcrypt.hashSync(user.password, salt);
  user.setDataValue('password', hash);
  return hash;
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    postalcode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, 
  {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  }

  // User.associate = function (models) {
  // }

  return User;
}